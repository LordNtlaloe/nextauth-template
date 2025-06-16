import NextAuth from "next-auth"
import "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import client from "./lib/db"
import { MongoDBAdapter } from "@auth/mongodb-adapter"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(client),
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "johndoe@gmail.com",
                },
                password: {
                    type: "password",
                    label: "Password",
                    placeholder: "*****",
                },
            },
            async authorize(credentials) {
                // Add your authentication logic here
                // This is just an example - replace with your actual auth logic
                if (credentials?.email === "user@example.com" && credentials?.password === "password") {
                    return {
                        id: "1",
                        email: credentials.email,
                        name: "John Doe",
                    }
                }
                return null
            },
        })
    ],
    session: { strategy: "jwt" },
    callbacks: {
        jwt({ token, trigger, session, account }) {
            if (trigger === "update") token.name = session.user.name
            if (account?.access_token) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) {
            if (token?.accessToken) session.accessToken = token.accessToken
            return session
        },
    },
})

declare module "next-auth" {
    interface Session {
        accessToken?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string
    }
}