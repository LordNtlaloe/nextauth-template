import NextAuth, { DefaultSession } from "next-auth"
import "next-auth/jwt"
import Credentials from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "./lib/database";
import { LoginSchema } from "@/schemas"
import { getUserByEmail, getUserById } from "@/actions/user.actions"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"
import { connectToDB } from "@/lib/db"

declare module "@auth/core" {
  interface Session {
    user: {
      role: "Cashier" | "Manager" | "Admin"
    } & DefaultSession["user"]
  }
}

let dbConnection: any;
let database: any;

const init = async () => {
  try {
    const connection = await connectToDB();
    dbConnection = connection;
    database = await dbConnection?.db("td_holdings_db");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await getUserByEmail(email)

          // Check if user exists and doesn't have an error
          if (!user || user.error) {
            return null
          }

          // Verify password
          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) {
            // Return user object (without password)
            return {
              id: user._id.toString(),
              email: user.email,
              name: `${user.first_name} ${user.last_name}`,
              role: user.role,
              firstName: user.first_name,
              lastName: user.last_name,
              phoneNumber: user.phone_number,
            }
          }
        }

        return null
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
    error: "/auth/error"
  },
  events: {
    async linkAccount({ user }) {
      if (!dbConnection) await init();
      const collection = database.collection("users")
      await collection.updateOne(
        { id: user.id },
        { $set: { emailVerified: new Date() } }
      )
    }
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) {
        return token
      }
      const existingUser = await getUserById(token.sub)
      if (!existingUser) {
        return token
      }
      token.role = existingUser.role;
      return token;
    },
    async session({ session, token }) {
      console.log({ sessionToken: token })
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  }
})

declare module "next-auth" {
  interface Session {
    accessToken?: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
