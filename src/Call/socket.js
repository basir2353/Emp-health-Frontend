// socket.js
import { io } from 'socket.io-client';

const socket = io('https://e-health-backend-production.up.railway.app/'); // or your deployed backend URL

export default socket;
