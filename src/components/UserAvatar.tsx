"use client";

import styles from "../app/admin/admin.module.css";

interface UserAvatarProps {
    image?: string | null;
    name?: string | null;
    email?: string | null;
    lastLoginAt?: Date | string | null;
    size?: number;
    showStatus?: boolean;
}

export default function UserAvatar({
    image,
    name,
    email,
    lastLoginAt,
    size = 32,
    showStatus = true
}: UserAvatarProps) {
    // Consideramos "Online" si ha tenido actividad en los últimos 5 minutos
    const isOnline = lastLoginAt && (new Date().getTime() - new Date(lastLoginAt).getTime() < 5 * 60 * 1000);

    const initials = (name || email || "?")[0].toUpperCase();

    return (
        <div className={styles.avatarWrapper} style={{ width: size, height: size }}>
            {image ? (
                <img
                    src={image}
                    alt={name || ""}
                    className={styles.avatarImg}
                    style={{ width: size, height: size }}
                />
            ) : (
                <div
                    className={styles.avatarPlaceholder}
                    style={{ width: size, height: size, fontSize: size * 0.4 }}
                >
                    {initials}
                </div>
            )}

            {showStatus && (
                <div
                    className={`${styles.statusDot} ${isOnline ? styles.onlineDot : styles.offlineDot}`}
                    title={isOnline ? "Online" : "Offline"}
                    style={{
                        width: Math.max(8, size * 0.3),
                        height: Math.max(8, size * 0.3),
                        bottom: -1,
                        right: -1
                    }}
                />
            )}
        </div>
    );
}
