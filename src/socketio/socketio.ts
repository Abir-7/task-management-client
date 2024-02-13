import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL: string = 'https://socket-server-my-organigation-07.koyeb.app';

export const socket = io(URL);