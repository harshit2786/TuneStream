export type SpaceType = "Public" | "Private" ;

export interface Space {
    id: string;
    creator : string;
    name : string;
    type : SpaceType,
    timestamp : number,
    streams : number,
    users : number
}