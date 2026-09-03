export {};

interface SessionUser {
    id: string;
    fullname: string;
    email: string;
    cpf: string;
    isActive: boolean;
    createdAt: string;
    lastLogin: string;
    roles: string[];
}

declare module "next-auth" {
    interface Session {
        user: SessionUser;
        accessToken: string;
        refreshToken: string;
        error?: "RefreshAccessTokenError";
    }

    interface User {
        id: string;
        fullname: string;
        email: string;
        cpf: string;
        isActive: boolean;
        createdAt: string;
        lastLogin: string;
        roles: string[];
        accessToken: string;
        refreshToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: SessionUser;
        accessToken: string;
        refreshToken: string;
        error?: "RefreshAccessTokenError";
    }
}
