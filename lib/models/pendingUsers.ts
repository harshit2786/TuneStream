import { User } from "./space";

export interface PendingUser {
    id : string,
    name : string,
    pendingUsers : User[]
}

export interface ParsedPendingUser {
    spaceId : string,
    spaceName : string,
    userId : string,
    userName : string,
    userEmail : string
}