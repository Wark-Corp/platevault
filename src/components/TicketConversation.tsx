"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Shield, Paperclip, Loader2 } from "lucide-react";
import { replyToTicket } from "@/actions/tickets";
import { TicketStatus } from "@prisma/client";

interface TicketConversationProps {
    ticket: any;
    currentUserId: string;
    isAdminView?: boolean;
}

export default function TicketConversation({ ticket, currentUserId, isAdminView = false }: TicketConversationProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [ticket.messages]);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await replyToTicket(ticket.id, content, isAdminView);
            setContent("");
            window.location.reload();
        } catch (error) {
            alert("Error al enviar el mensaje");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '700px',
            background: 'var(--surface)',
            borderRadius: '24px',
            border: '1px solid var(--surface-border)',
            overflow: 'hidden'
        }}>
            {/* Messages Area */}
            <div
                style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                ref={scrollRef}
            >
                {ticket.messages.map((msg: any) => {
                    const isOwn = msg.userId === currentUserId;
                    return (
                        <div
                            key={msg.id}
                            style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}
                        >
                            <div style={{
                                maxWidth: '85%',
                                display: 'flex',
                                gap: '1rem',
                                flexDirection: isOwn ? 'row-reverse' : 'row'
                            }}>
                                <div style={{
                                    flexShrink: 0,
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: msg.isAdmin ? 'rgba(230, 57, 70, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                    color: msg.isAdmin ? 'var(--accent)' : 'white',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    {msg.isAdmin ? <Shield size={16} /> : <User size={16} />}
                                </div>

                                <div style={{ textAlign: isOwn ? 'right' : 'left' }}>
                                    <div style={{
                                        padding: '1rem 1.25rem',
                                        borderRadius: '16px',
                                        background: isOwn ? 'var(--accent)' : 'rgba(255,255,255,0.03)',
                                        border: isOwn ? 'none' : '1px solid var(--surface-border)',
                                        color: isOwn ? 'white' : 'inherit',
                                        borderTopRightRadius: isOwn ? '4px' : '16px',
                                        borderTopLeftRadius: isOwn ? '16px' : '4px'
                                    }}>
                                        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                                        {msg.attachments?.length > 0 && (
                                            <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                {msg.attachments.map((at: any) => (
                                                    <div key={at.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.8 }}>
                                                        <Paperclip size={12} /> {at.fileName} ({Math.round(at.fileSize / 1024)} KB)
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '0.65rem', marginTop: '0.4rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                        {msg.user?.name || 'Usuario'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>


            {/* Input Area */}
            <div style={{ padding: '1.5rem 2rem', background: 'var(--surface)', borderTop: '1px solid var(--surface-border)' }}>
                <form onSubmit={handleReply} style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Escribe tu mensaje aquí..."
                            rows={1}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = target.scrollHeight + 'px';
                            }}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--surface-border)',
                                borderRadius: '16px',
                                padding: '1rem 1.5rem',
                                paddingRight: '3rem',
                                color: 'white',
                                outline: 'none',
                                resize: 'none',
                                maxHeight: '150px',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!content.trim() || isSubmitting}
                        style={{
                            padding: '1rem',
                            background: 'var(--accent)',
                            color: 'white',
                            borderRadius: '16px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'var(--transition-fast)',
                            opacity: (!content.trim() || isSubmitting) ? 0.5 : 1
                        }}
                    >
                        {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                    </button>
                </form>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', padding: '0 0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
                        Max 4000 caracteres
                    </span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
                        Formatos: PDF, JPG, PNG
                    </span>
                </div>
            </div>
        </div>
    );
}
