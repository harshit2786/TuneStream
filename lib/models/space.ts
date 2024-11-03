import { Streams } from "./stream";

export type SpaceType = "Public" | "Private" ;
type Provider = "Google";
export interface Space {
    id: string;
    creator : string;
    name : string;
    type : SpaceType,
    timestamp : string,
    streams : number,
    users : number
}


export interface User {
    id : string,
    email : string,
    username : string,
    Provider : Provider
}
export interface SpaceDetail {
    id: string;
    creator : User;
    name : string;
    type : SpaceType,
    timestamp : string,
    streams : Streams[],
    users : number
}