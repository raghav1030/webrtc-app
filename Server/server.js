
const app = require('express')();
const bodyParser = require('body-parser');
const {Server} = require('socket.io');

const io = new Server({
    cors: true
});

app.listen(4000, ()=>{
    console.log("HTTP server up & running at port 8000");
});

io.listen(8000, ()=>{
    console.log("Socket server up & running at port 8000");
})

app.use(bodyParser.json());
const emailToSocketId = new Map();
const SocketIdToEmail = new Map();

io.on('connection', (socket)=>{
    console.log("Signalling initialized");
    socket.on('join-room', (data) => {
        const {roomId , userId} = data;
        socket.join(roomId);
        socket.emit('joined-room' , {userId})
        console.log(userId , "joined room" , roomId);
        socket.broadcast.to(roomId).emit('user-connected', {userId , roomId});
        emailToSocketId.set(userId , socket.id);
        SocketIdToEmail.set(socket.id , userId)
    })

    socket.on('signal-user' , (data)=>{
        const {userId , offer} = data
        const socketId = emailToSocketId.get(userId);
        const from = SocketIdToEmail.get(socket.id);
        socket.to(socketId).emit('incoming-signal' , {from , offer});
    })

    socket.on('signal-answer' , (data)=>{
        const {acceptedId , answer} = data;
        const socketId = emailToSocketId.get(acceptedId);
        console.log("Answering to " , acceptedId , " with answer " , answer)
        socket.to(socketId).emit('signal-reply' , {answer});
    })

})