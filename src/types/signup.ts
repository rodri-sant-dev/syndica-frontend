import { isValidCPF } from "@/utils";
import { z } from "zod";

export interface SignUpRegisterForm {
    perfilPhoto?: File;
    fullname: string;
    cpf: string;
    email: string;
    password: string;
}

export const signUpSchema = z.object({
    fullname: z.string().min(3, "Full name must be at least 3 characters"),
    cpf: z
        .string()
        .regex(
            /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
            "CPF must contain 11 digits",
        )
        .refine((cpf) => isValidCPF(cpf.replace(/\D/g, "")), "Invalid CPF"),
    email: z.string().email("Invalid email"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    perfilPhoto: z
        .instanceof(File)
        .optional()
        .refine(
            (file) => !file || file.size <= 5 * 1024 * 1024,
            "Image must be at most 5MB",
        )
        .refine(
            (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
            "Only JPEG or PNG are allowed",
        ),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
