"use server";
import * as z from "zod";
import { LoginSchema, SignUpSchema } from "@/schemas";
import { connectToDB } from "@/lib/db"
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/actions/user.actions";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";

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

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid Fields" }
    }

    const { email, password } = validatedFields.data;
    const existingUser = await getUserByEmail(email)
    if(!existingUser || existingUser.email || existingUser.password){
        return {error: "Email Does Not Exists"}
    }

    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email);
        return {success: "Confirmation Email Sent"}
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        })
    }
    catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid Credentials" }
                default:
                    return { error: "Something Went Wrong" }
            }
        }
        throw error;
    }

    return { success: "Login Successful" }
}


export const signup = async (values: z.infer<typeof SignUpSchema>) => {
    console.log("Signup values:", values)

    const validateFields = SignUpSchema.safeParse(values);
    if (!validateFields.success) {
        console.log("Validation errors:", validateFields.error.errors);
        return { error: "Invalid Fields" }
    }

    const { first_name, last_name, phone_number, email, password, role } = validateFields.data;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (!dbConnection) await init();

        const collection = database.collection("users");
        if (!collection || !database) {
            return { error: "Failed to connect to collection!!" };
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return { error: "User Already Exists" }
        }

        // Create new user
        const result = await collection.insertOne({
            first_name,
            last_name,
            phone_number,
            email,
            password: hashedPassword,
            role,
            createdAt: new Date()
        });

        console.log("User created successfully:", result.insertedId);

    } catch (error: any) {
        console.error("An error occurred saving new user:", error.message);
        return { error: error.message }
    }

    // TODO: Send verification Email
    const verificationToken = generateVerificationToken(email)
    return { success: "Verification Email Has Been Sent" }
}

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        if (!dbConnection) await init();

        const collection = database.collection("verification");
        if (!collection || !database) {
            return { error: "Failed to connect to collection!!" };
        }

        // Fixed: Use findOne instead of distinct
        const verificationToken = await collection.findOne({ email });
        return verificationToken;

    } catch (error: any) {
        console.error("An error occurred getting verification token:", error.message);
        return { error: error.message }
    }
}

export const getVerificationTokenByToken = async (token: string) => {
    try {
        if (!dbConnection) await init();

        const collection = database.collection("verification");
        if (!collection || !database) {
            return { error: "Failed to connect to collection!!" };
        }

        // Fixed: Use findOne instead of distinct
        const verificationToken = await collection.findOne({ token });
        return verificationToken;

    } catch (error: any) {
        console.error("An error occurred getting verification token:", error.message);
        return { error: error.message }
    }
}