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
    isActive: boolean;
    createdAt: string;
    lastLogin: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface ResponseLogin {
    user: UserResponse;
    tokens: TokenPair;
}
