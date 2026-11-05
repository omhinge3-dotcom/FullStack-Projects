import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import AccountMenu from "../components/AccountMenu";
import "./Profile.scss";

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const username = user?.username || user?.name || "User";

    return (
        <div className="profile-page">

            <header className="profile-page__header">
                <h2>AI Interview Platform</h2>
                <AccountMenu />
            </header>

            <main className="profile-card">

                <div className="profile-card__avatar">
                    {username.charAt(0).toUpperCase()}
                </div>

                <h1>Your Profile</h1>
                <p className="profile-card__subtitle">
                    Manage and view your account information.
                </p>

                <div className="profile-card__details">

                    <div className="profile-card__field">
                        <label>Username</label>
                        <p>{username}</p>
                    </div>

                    <div className="profile-card__field">
                        <label>Email Address</label>
                        <p>{user?.email || "Not available"}</p>
                    </div>

                    <div className="profile-card__field">
                        <label>Account ID</label>
                        <p>{user?._id || user?.id || "Not available"}</p>
                    </div>

                </div>

                <button
                    className="profile-card__back"
                    onClick={() => navigate("/")}
                >
                    Back to Dashboard
                </button>

            </main>
        </div>
    );
};

export default Profile;