export interface LoginInterface {
    email: string;
    password: string;
    remember: boolean;
}

export interface UserResponse {
    id: string;
    fullname: string;
    email: string;
    cpf: string;
    themePreference: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface ResponseLogin {
    imageURI: string | null;
    user: UserResponse;
    tokens: TokenPair;
}
