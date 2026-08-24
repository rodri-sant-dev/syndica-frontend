export interface LoginInterface{
    email: string
    password: string
    remember: boolean;
}

export interface ResponseLogin{
    user: {
        id: string
        fullname: string
        email: string
        cpf: string
        isActive: boolean
        createdAt: string
        lastLogin: string
    },
    tokens: {
        accessToken: string
        refreshToken: string
    }
  }
