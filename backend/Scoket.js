import { Server as SocketIoServer } from "socket.io";
import Message from "./Model/Message.model.js";

const socketSetup = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const userSocketMap = new Map(); // Stores userId -> socketId mapping

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id); // Store latest socket ID for the user
            console.log(`✅ User ${userId} connected with socket ID ${socket.id}`);
        } else {
            console.log("❌ User ID not provided in handshake.");
        }

        // Handle message sending
        socket.on("sendMessage", async (message) => {
            try {
                console.log("📩 Received message:", message);

                const createMessage = await Message.create(message);

                const messageData = await Message.findById(createMessage._id)
                    .populate("sender", "_id email firstname lastname image color")
                    .populate("recipient", "_id email firstname lastname image color");

                const recipientSocketId = userSocketMap.get(message.recipient); // Get recipient's socket
                const senderSocketId = userSocketMap.get(message.sender); // Get sender's socket

                // Send the message to the recipient
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit("receiveMessage", messageData);
                } else {
                    console.log(`⚠️ Recipient ${message.recipient} is offline.`);
                }

                // Send the message back to the sender (so it updates in their chat UI too)
                if (senderSocketId) {
                    io.to(senderSocketId).emit("receiveMessage", messageData);
                }
            } catch (error) {
                console.error("❌ Error sending message:", error);
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`⚠️ User ${userId} disconnected.`);
            userSocketMap.delete(userId); // Remove the user from the map
        });
    });
};

export default socketSetup;
