"use server";

import prisma from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { TicketPriority, TicketStatus } from "@prisma/client";

export async function createTicket(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    const subject = formData.get("subject") as string;
    const priority = formData.get("priority") as TicketPriority;
    const department = formData.get("department") as any; // TicketDepartment
    const content = formData.get("content") as string;

    if (!subject || !content) throw new Error("Asunto y descripción son obligatorios");
    if (content.length > 4000) throw new Error("La descripción no puede superar los 4000 caracteres");

    // TODO: Manejo de archivos adjuntos (simulado por ahora o implementado si hay storage)
    // Para este MVP local, guardaremos la info del archivo si viene en el form
    const files = formData.getAll("attachments") as File[];

    const ticket = await (prisma as any).ticket.create({
        data: {
            subject,
            priority,
            department: department || "GENERAL",
            userId: session.user.id,
            messages: {
                create: {
                    content,
                    userId: session.user.id,
                    isAdmin: false,
                }
            }
        },
        include: {
            messages: {
                include: {
                    attachments: true
                }
            }
        }
    });

    // Procesar adjuntos si existen (simulación de guardado en path local)
    for (const file of files) {
        if (file.size > 0) {
            if (file.size > 15 * 1024 * 1024) throw new Error("Archivo demasiado grande (máx 15MB)");

            // En un entorno real subiríamos a S3/Cloudinary. Aquí simulamos el registro.
            await (prisma as any).attachment.create({
                data: {
                    ticketMessageId: ticket.messages[0].id,
                    fileName: file.name,
                    fileSize: file.size,
                    fileType: file.type,
                    fileUrl: `/uploads/${file.name}`, // Simulado
                }
            });
        }
    }

    revalidatePath("/dashboard/tickets");
    revalidatePath("/admin/tickets");
    return { success: true, ticketId: ticket.id };
}

export async function replyToTicket(ticketId: string, content: string, isAdmin: boolean = false) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    if (content.length > 4000) throw new Error("El mensaje no puede superar los 4000 caracteres");

    const message = await (prisma as any).ticketMessage.create({
        data: {
            ticketId,
            content,
            userId: session.user.id,
            isAdmin,
        }
    });

    // Si responde un admin o soporte, marcamos como IN_PROGRESS si estaba OPEN
    if (isAdmin) {
        await (prisma as any).ticket.update({
            where: { id: ticketId },
            data: { status: "IN_PROGRESS" }
        });
    }

    revalidatePath(`/dashboard/tickets/${ticketId}`);
    revalidatePath(`/admin/tickets/${ticketId}`);
    return { success: true };
}

export async function updateTicketMetadata(ticketId: string, data: { status?: any, priority?: any, department?: any }) {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "SUPPORT" && role !== "SUPERADMIN") {
        throw new Error("No autorizado");
    }

    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.priority) updateData.priority = data.priority;
    if (data.department) updateData.department = data.department;

    await (prisma as any).ticket.update({
        where: { id: ticketId },
        data: updateData
    });

    revalidatePath(`/dashboard/tickets/${ticketId}`);
    revalidatePath(`/admin/tickets/${ticketId}`);
    revalidatePath("/admin/tickets");
    return { success: true };
}

export async function getUserTickets() {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await (prisma as any).ticket.findMany({
        where: { userId: session.user.id },
        include: {
            user: { select: { name: true, email: true, image: true, lastLoginAt: true } },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1
            }
        },
        orderBy: { updatedAt: "desc" }
    });
}

export async function getAllTickets() {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "SUPPORT" && role !== "SUPERADMIN") {
        throw new Error("No autorizado");
    }

    return await (prisma as any).ticket.findMany({
        include: {
            user: { select: { name: true, email: true, image: true, lastLoginAt: true } },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1
            }
        },
        orderBy: { createdAt: "desc" }
    });
}


export async function getTicketDetails(ticketId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("No autorizado");

    const ticket = await (prisma as any).ticket.findUnique({
        where: { id: ticketId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    createdAt: true,
                    lastLoginAt: true,
                }
            },
            messages: {
                include: {
                    user: { select: { name: true, image: true, lastLoginAt: true } },
                    attachments: true
                },
                orderBy: { createdAt: "asc" }
            }
        }
    });


    if (!ticket) throw new Error("Ticket no encontrado");

    // Verificar acceso (Admin/Soporte o el propio usuario)
    const role = (session.user as any).role;
    if (role === "USER" && ticket.userId !== session.user.id) {
        throw new Error("No tienes permiso para ver este ticket");
    }

    return ticket;
}

export async function deleteTicket(ticketId: string) {
    const session = await auth();
    const role = (session?.user as any)?.role;

    // Solo ADMIN puede eliminar tickets (Soporte no)
    if (role !== "ADMIN") {
        throw new Error("No tienes permisos suficientes para eliminar tickets");
    }

    try {
        await (prisma as any).ticket.delete({
            where: { id: ticketId }
        });

        revalidatePath("/admin/tickets");
        return { success: true };
    } catch (error) {
        console.error("Error al eliminar ticket:", error);
        throw new Error("Error al eliminar el ticket");
    }
}
