import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "http://localhost:5173",
    },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
    const userExist = onlineUser.find(user => user.userId === userId);
    if(!userExist) {
        onlineUser.push({ userId, socketId });
    }
}

io.on("connection", (socket) => {
    socket.on("newUser", (user) => {
        addUser
    });
});

io.listen(4000);