enum UserRole {
    User = "USER", Admin = "ADMIN", Developer = "DEVELOPER"
}

class User {
    id?: number;
    name?: string;
    description: string = "";
    password?: string;
    email?: string;
    role?: UserRole;
    walletUSD: number = 0;
}

export { User, UserRole };