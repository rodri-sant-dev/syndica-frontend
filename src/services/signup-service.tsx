"use server";

import { SignUpRegisterForm } from "@/types/signup";
import { baseApi } from "./base-api";

export async function createUser(user: SignUpRegisterForm) {
    const formUser = new FormData();
    if (user.perfilPhoto) {
        formUser.append("perfilPhoto", user.perfilPhoto);
    }

    formUser.append(
        "userForCreateDTO",
        new Blob(
            [
                JSON.stringify({
                    fullname: user.fullname,
                    cpf: user.cpf,
                    email: user.email,
                    password: user.password,
                }),
            ],
            { type: "application/json" },
        ),
    );

    const response = await baseApi.post("/token/create-user", formUser);
    console.log(response.data);

    return { status: response.status };
}
