// custom hook: Ham bat dau bang tu khoa use
// - Duoc phep su dung cac hook khac ben trong no
// - Duoc phep su dung cac custom hook khac
// - Khong return jsx

import { create } from "zustand";

const parseStoredAuth = () => {
    if (typeof localStorage === "undefined") return null;
    try {
        const raw = localStorage.getItem("auth");
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        console.error("Failed to parse auth cache", error);
        return null;
    }
};

const cacheAuth = (auth) => {
    if (typeof localStorage === "undefined") return;
    if (!auth) {
        localStorage.removeItem("auth");
        return;
    }
    localStorage.setItem("auth", JSON.stringify(auth));
};

const cached = parseStoredAuth();

export const useAuth = create((set) => ({
    user: cached?.user || null,
    accessToken: cached?.accessToken || null,
    refreshToken: cached?.refreshToken || null,
    isAuthenticated: Boolean(cached?.accessToken),
    todoList: [],
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const loginRes = await fetch("https://api.escuelajs.co/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!loginRes.ok) {
                const detail = await loginRes.json().catch(() => ({}));
                throw new Error(detail?.message || "Invalid email or password");
            }

            const { access_token: accessToken, refresh_token: refreshToken } = await loginRes.json();

            const profileRes = await fetch("https://api.escuelajs.co/api/v1/auth/profile", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!profileRes.ok) {
                throw new Error("Unable to fetch profile");
            }

            const profile = await profileRes.json();
            const authData = { user: profile, accessToken, refreshToken };
            cacheAuth(authData);

            set({
                user: profile,
                accessToken,
                refreshToken,
                isAuthenticated: true,
                loading: false,
                error: null,
            });

            return authData;
        } catch (error) {
            cacheAuth(null);
            set({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
                loading: false,
                error: error.message || "Login failed",
            });
            throw error;
        }
    },

    logOut: () => {
        cacheAuth(null);
        set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            loading: false,
            error: null,
        });
    },
}));