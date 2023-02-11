import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verify } from "argon2";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "./prisma";
import { loginSchema } from "./validation/auth";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      name: "email",
      server: {
        secure: process.env.MAIL_SECURE === "true",
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      from: process.env.MAIL_EMAIL,
      maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          return null;

          // deactivated
          /*
          const { email, password } = await loginSchema.parseAsync(credentials);

          const result = await prisma.user.findFirst({
            where: { email },
          });

          if (!result) return null;

          const isValidPassword = await verify(result.password, password);

          if (!isValidPassword) return null;

          return { id: result.id, email, name: result.name };
          */
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.userId = token.userId;
        session.user.email = token.email;
        session.user.name = token.name;
      }

      return session;
    },
  },
  jwt: {
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  pages: {
    signIn: "/",
    newUser: "/sign-up",
    verifyRequest: "/verify-request",
  },
  secret: process.env["AUTH_JWT_SECRET"],
};
