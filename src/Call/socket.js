// socket.js
import { io } from 'socket.io-client';

const socket = io('https://empolyee-backedn.onrender.com//'); // or your deployed backend URL

export default socket;
