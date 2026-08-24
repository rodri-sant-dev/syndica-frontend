import NextAuth, { type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getTokens } from "@/services/login-service";
import { LoginInterface } from "@/types/login";

interface AccessTokenPayload {
	user_id: string;
	email: string;
	groups: string[];
	exp: number;
	iat: number;
}

function decodeAccessToken(accessToken: string): AccessTokenPayload {
	const payload = accessToken.split(".")[1];
	const json = Buffer.from(payload, "base64").toString("utf-8");
	return JSON.parse(json);
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
				const { groups } = decodeAccessToken(tokens.accessToken);

				return {
					id: user.id,
					fullname: user.fullname,
					email: user.email,
					cpf: user.cpf,
					isActive: user.isActive,
					createdAt: user.createdAt,
					lastLogin: user.lastLogin,
					groups,
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
					groups: authUser.groups,
				};
				token.accessToken = authUser.accessToken;
				token.refreshToken = authUser.refreshToken;
			}
			return token;
		},
		async session({ session, token }) {
			session.user = token.user;
			session.accessToken = token.accessToken;
			session.refreshToken = token.refreshToken;
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
