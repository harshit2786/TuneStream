import { User } from "./space";

export interface PendingUser {
    id : string,
    pendingUsers : User[]
}