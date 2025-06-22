import { v4 as uuidv4 } from "uuid"
import { getVerificationTokenByEmail } from "@/actions/auth.actions"
import { connectToDB } from "@/lib/db";

let dbConnection: any;
let database: any;

const init = async () => {
    try {
        const connection = await connectToDB();
        dbConnection = connection;
        database = dbConnection.db("td_holdings_db"); // Fixed: removed await
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
}

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    try {
        if (!dbConnection) await init();

        const collection = database.collection("verification");
        if (!collection || !database) {
            return { error: "Failed to connect to collection!!" };
        }

        const existingToken = await getVerificationTokenByEmail(email);
        
        // Delete existing token if it exists
        if (existingToken && !existingToken.error) {
            await collection.deleteOne({ _id: existingToken._id });
        }

        // Insert new verification token
        const result = await collection.insertOne({
            email,
            token,
            expires
        });

        return {
            success: true,
            token,
            expires,
            id: result.insertedId
        };

    } catch (error: any) {
        console.error("Error generating verification token:", error.message);
        return { error: error.message };
    }
}