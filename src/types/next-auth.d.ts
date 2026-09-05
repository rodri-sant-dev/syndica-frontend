export {};

interface SessionUser {
    id: string;
    themePreference: string;
    fullname: string;
    email: string;
    cpf: string;
    roles: string[];
    imageURI: string | null;
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
        themePreference: string;
        roles: string[];
        imageURI: string | null;
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
