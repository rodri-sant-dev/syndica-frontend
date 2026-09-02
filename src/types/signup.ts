import { isValidCPF } from "@/utils";
import { z } from "zod";

export interface SignUpRegisterForm{
    perfilPhoto?: File
    fullname: string
    cpf: string
    email: string
    password: string
}

export const signUpSchema = z.object({
  fullname: z.string().min(3, "Nome muito curto"),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve conter 11 dígitos")
    .refine(isValidCPF, "CPF inválido"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha precisa ter no mínimo 8 caracteres"),
  perfilPhoto: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "A imagem deve ter no máximo 5MB"
    )
    .refine(
      (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
      "Apenas JPEG ou PNG são permitidos"
    ),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;