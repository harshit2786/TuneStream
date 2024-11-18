import WebSocket from 'ws';

class WebSocketBroadcaster {
    private static instance: WebSocketBroadcaster;
    private ws: WebSocket | null = null;
    private spaceId: string = '';
    private readonly serverUrl: string;

    private constructor(serverUrl: string, spaceId: string) {
        this.serverUrl = serverUrl;
        this.spaceId = spaceId;
        this.connect()
    }

    public static getInstance(serverUrl: string, spaceId: string): WebSocketBroadcaster {
        if (!WebSocketBroadcaster.instance) {
            WebSocketBroadcaster.instance = new WebSocketBroadcaster(serverUrl, spaceId);
        }
        return WebSocketBroadcaster.instance;
    }

    private connect(): void {
        if (this.ws) {
            this.ws.close();
        }


        this.ws = new WebSocket(`${this.serverUrl}/${this.spaceId}`);

        this.ws.on('open', () => {
            console.log(`Connected to WebSocket server for spaceId: ${this.spaceId}`);
        });

        this.ws.on('message', (data) => {
            console.log(`Received message: ${data}`);
        });

        this.ws.on('close', () => {
            console.log(`Disconnected from WebSocket server for spaceId: ${this.spaceId}`);
            this.ws = null;
        });

        this.ws.on('error', (error) => {
            console.error(`WebSocket error: ${error}`);
        });
    }

    public broadcast(): void {
        console.log(this.ws);
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send("broadcast");
        } else {
            this.ws = new WebSocket(`${this.serverUrl}/${this.spaceId}`);
            this.ws.on('open', () => {
                this.ws?.send("broadcast");
            });
        }
    }
}

export default WebSocketBroadcaster;
