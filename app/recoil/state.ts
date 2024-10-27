import { Space } from '@/lib/models/space';
import { selector } from 'recoil';
export const spaceState = selector<Space[]>({
    key: 'spaceState', // unique ID (with respect to other atoms/selectors)
    get: async () => {
        try {
            const resp = await fetch("/api/space", { method: "GET" });
            if (!resp.ok) {
                throw new Error(`Error: ${resp.status} ${resp.statusText}`);
            }
            const data = await resp.json();
            return data.data;
        }
        catch (e) {
            console.log(e);
        }
    }
});