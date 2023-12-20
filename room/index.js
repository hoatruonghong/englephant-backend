import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

var rooms = {};

export const roomHandler = (socket) => {
    const createRoom = () => {
        const roomId = uuidv4();
        rooms[roomId] = [];
        socket.emit('room-created', { roomId })
        console.log("create room", roomId);
    }

    const joinRoom = ({roomId, peerId}) => {
        if (rooms[roomId]){
            console.log("user join room", roomId, peerId);
            rooms[roomId].push(peerId);
            socket.join(roomId);

            socket.to(roomId).emit('user-joined', {peerId});

            socket.emit('get-users', {
                roomId,
                participants: rooms[roomId],
            })
        }

        socket.on("disconnect", ()=> {
            console.log("user left the room", peerId);
            leaveRoom({roomId, peerId});
        });
    }

    const leaveRoom = ({peerId, roomId}) => {
        rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId);
        socket.to(roomId).emit("user-disconnected", peerId );
    }

    socket.on('create-room', createRoom);
    socket.on('join-room', joinRoom);
}