"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import * as z from "zod";
import { LoginSchema, SignUpSchema } from "@/schemas";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    console.log(values);
    const validateFields = LoginSchema.safeParse(values);
    if (!validateFields.success) {
        return { error: "Invalid  Feilds" }
    }
    return { success: "Login Successful"}
}


export const signup = async (values: z.infer<typeof SignUpSchema>) => {
    console.log(values)
    const validateFields = SignUpSchema.safeParse(values);
    if (!validateFields.success) {
        return { error: "Invalid Feilds" }

    }
    return {sucess: "Vefirication Email Has Been Sent"}
}