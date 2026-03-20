export class User {
    id: string;
    email: string;
    password: string;

    firstName: string;
    lastName: string;
    phone?: string;
    bio?: string;

    isActive: boolean;
    createdAt: Date;
}