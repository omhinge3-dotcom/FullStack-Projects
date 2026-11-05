import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "./AccountMenu.scss";

const AccountMenu = () => {
    const { user, handleLogout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const navigate = useNavigate();

    const username = user?.username || user?.name || "User";
    const email = user?.email || "";
    const initial = username.charAt(0).toUpperCase();

    const handleProfile = () => {
        setIsOpen(false);
        navigate("/profile");
    };

    const handleLogoutClick = async () => {
        setLoggingOut(true);

        try {
            await handleLogout();
            navigate("/login", { replace: true });
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div className="account-menu">
            <button
                className="account-menu__trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="account-menu__avatar">{initial}</span>
                <span className="account-menu__username">{username}</span>
                <span className="account-menu__arrow">
                    {isOpen ? "▲" : "▼"}
                </span>
            </button>

            {isOpen && (
                <div className="account-menu__dropdown">
                    <div className="account-menu__details">
                        <strong>{username}</strong>
                        <span>{email}</span>
                    </div>

                    <button onClick={handleProfile}>
                        <span>👤</span>
                        Your Profile
                    </button>

                    <button
                        className="account-menu__logout"
                        onClick={handleLogoutClick}
                        disabled={loggingOut}
                    >
                        <span>↪</span>
                        {loggingOut ? "Logging out..." : "Log Out"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AccountMenu;