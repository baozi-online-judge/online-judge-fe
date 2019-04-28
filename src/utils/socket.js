import io from 'socket.io-client';

let socket = null;

export default function getSocket() {
  if (socket) {
    return socket;
  }
  socket = io('http://localhost:7001');
  return socket;
}
