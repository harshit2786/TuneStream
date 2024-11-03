type StreamType = "Youtube" | "Spotify" ;

export interface Streams {
    id: string;
    type: StreamType;
    url: string;
    timeStamp: string;
    extractId: string;
    active: boolean;
    userId: string;
    spaceId: string;
    upvotes : string[]
}

export interface YtDetails {
    title : string,
    thumbnail : string
}