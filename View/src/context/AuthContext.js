// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState({
        loggedIn: false,
        userId: null,
        role: null,
        nickname: null,
        point: 0,
        loading: true,
    });

    useEffect(() => {
        checkSession();
    }, []);

    async function checkSession() {
        try {
            const res = await axiosClient.get("/api/auth/me");

            setAuth({
                loggedIn: true,
                userId: res.data.id,
                nickname: res.data.nickname ?? res.data.id,
                role: res.data.role,
                point: res.data.point ?? 0,
                loading: false,
            });
        } catch (err) {
            setAuth({
                loggedIn: false,
                userId: null,
                role: null,
                nickname: null,
                point: 0,
                loading: false,
            });
        }
    }
    const login = ({ id, nickname }) => {
        setAuth(prev => ({
            ...prev,
            loggedIn: true,
            userId: id,
            nickname: nickname ?? id,
            loading: true,
        }));
        checkSession();
    };

    const logout = async () => {
        try {
            await axiosClient.post("/auth/logout");
        } finally {
            setAuth({
                loggedIn: false,
                userId: null,
                role: null,
                nickname: null,
                point: 0,
                loading: false,
            });
        }
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
