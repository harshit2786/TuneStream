
import { useEffect, useState } from "react"



export const useWebHook = (spaceId: string | null) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        if (spaceId !== null) {
            const ws = new WebSocket(`${process.env.NEXT_WEBSOCKET_ENDPOINT}/${spaceId}`);
            ws.onopen = () => {
                console.log("Connected");
                setSocket(ws);
            }
            ws.onclose = () => {
                console.log("Disconnected");
                setSocket(null);
            }
            return () => {
                ws.close();
            }
        }
    }, [spaceId]);
    return socket;
}

