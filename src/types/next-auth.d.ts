import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

interface SessionUser {
	id: string;
	fullname: string;
	email: string;
	cpf: string;
	isActive: boolean;
	createdAt: string;
	lastLogin: string;
	groups: string[];
}

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: SessionUser;
		accessToken: string;
		refreshToken: string;
	}

	interface User extends SessionUser {
		accessToken: string;
		refreshToken: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		user: SessionUser;
		accessToken: string;
		refreshToken: string;
	}
}
