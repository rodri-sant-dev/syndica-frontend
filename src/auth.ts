import NextAuth, { type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";

import { getTokens, refreshTokens } from "@/services/login-service";
import { LoginInterface } from "@/types/login";

interface AccessTokenPayload {
	sub: string;
	roles: string[];
	iat: number;
	exp: number;
}

function decodeAccessToken(accessToken: string): AccessTokenPayload {
	const payload = accessToken.split(".")[1];
	if (!payload) {
		throw new Error("Invalid access token");
	}

	const json = Buffer.from(payload, "base64url").toString("utf-8");
	return JSON.parse(json);
}

async function refreshAccessToken(token: JWT) {
	try {
		const tokens = await refreshTokens(token.refreshToken);
		const { roles } = decodeAccessToken(tokens.accessToken);

		return {
			...token,
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			user: {
				...token.user,
				roles,
			},
			error: undefined,
		};
	} catch (error) {
		console.error("Failed to refresh access token", error);
		return {
			...token,
			error: "RefreshAccessTokenError" as const,
		};
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				email: {},
				password: {},
				remember: {},
			},
			async authorize(credentials) {
				const { email, password, remember } = credentials as unknown as LoginInterface;

				const { user, tokens } = await getTokens({ email, password, remember });
				const { roles } = decodeAccessToken(tokens.accessToken);

				return {
					id: user.id,
					fullname: user.fullname,
					email: user.email,
					cpf: user.cpf,
					isActive: user.isActive,
					createdAt: user.createdAt,
					lastLogin: user.lastLogin,
					roles,
					accessToken: tokens.accessToken,
					refreshToken: tokens.refreshToken,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				const authUser = user as User;
				token.user = {
					id: authUser.id,
					fullname: authUser.fullname,
					email: authUser.email,
					cpf: authUser.cpf,
					isActive: authUser.isActive,
					createdAt: authUser.createdAt,
					lastLogin: authUser.lastLogin,
					roles: authUser.roles,
				};
				token.accessToken = authUser.accessToken;
				token.refreshToken = authUser.refreshToken;
				return token;
			}

			if (token.error === "RefreshAccessTokenError") {
				return token;
			}

			const accessToken = token.accessToken as string | undefined;
			const refreshToken = token.refreshToken as string | undefined;

			if (!accessToken || !refreshToken) {
				return {
					...token,
					error: "RefreshAccessTokenError" as const,
				};
			}

			try {
				const { exp } = decodeAccessToken(accessToken);
				const secondsRemaining = exp - Math.floor(Date.now() / 1000);

				if (secondsRemaining <= 30) {
					return refreshAccessToken({
						...token,
						accessToken,
						refreshToken,
					});
				}
			} catch (error) {
				console.error("Failed to validate access token expiration", error);
				return {
					...token,
					error: "RefreshAccessTokenError" as const,
				};
			}
			return token;
		},
		async session({ session, token }) {
			session.user = token.user as typeof session.user;
			session.accessToken = token.accessToken as string;
			session.refreshToken = token.refreshToken as string;
			session.error = token.error as "RefreshAccessTokenError" | undefined;
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
	session: {
		strategy: "jwt",
	},
});
