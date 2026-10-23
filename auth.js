import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { compare } from "bcryptjs";

const client = await clientPromise;

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          return null;
        }

        const db = client.db();
        const email = credentials.email.trim().toLowerCase();

        const user = await db.collection("users").findOne({ email });

        if (!user?.password) {
          return null;
        }

        const validPassword = await compare(
          credentials.password,
          user.password,
        );

        if (!validPassword) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
