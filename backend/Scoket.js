import { Server as SocketIoServer } from "socket.io";
import Message from "./Model/Message.model.js";
import Channel from "./Model/CreateChannel.model.js";

const socketSetup = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const userSocketMap = new Map(); // Stores userId -> socketId mapping

    const handleChannelMessage = async (message) => {
        try {
            const { sender, content, messageType, fileUrl, channelId } = message;

            // 1️⃣ Create a new message
            const createMessage = await Message.create({
                sender,
                recipient: null,
                messageType,
                fileUrl,
                content,
                timestamp: Date.now(),
            });

            // 2️⃣ Update the channel by pushing the message ID
            await Channel.findByIdAndUpdate(channelId, {
                $push: { messages: createMessage._id },
            });

            // 3️⃣ Retrieve the full message details after creation
            const messageData = await Message.findById(createMessage._id)
                .populate("sender", "id firstname lastname email image color")
                .exec();

            // 4️⃣ Get the channel details with members and admin populated
            const channel = await Channel.findById(channelId)
                .populate("members", "_id")
                .populate("admin", "_id");

            if (!channel) {
                console.error(`Channel with ID ${channelId} not found.`);
                return;
            }

            const finalData = { ...messageData._doc, channelId: channel._id };

            // 5️⃣ Send message to all channel members
            if (channel.members) {
                channel.members.forEach((member) => {
                    const memberSocketId = userSocketMap.get(member._id.toString());
                    if (memberSocketId) {
                        io.to(memberSocketId).emit("recive-channel-msg", finalData);
                    }
                });

                // 6️⃣ Send message to admin (if exists)
                if (channel.admin && channel.admin._id) {
                    const adminSocketId = userSocketMap.get(channel.admin._id.toString());
                    if (adminSocketId) {
                        io.to(adminSocketId).emit("recive-channel-msg", finalData);
                    }
                }
            }
        } catch (error) {
            console.error("Error handling channel message:", error.message);
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id); // Store latest socket ID for the user
            console.log(`✅ User ${userId} connected with socket ID ${socket.id}`);
        } else {
            console.log("❌ User ID not provided in handshake.");
        }

        // Listener for personal messages
        socket.on("sendMessage", async (message) => {
            try {


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

        // Listener for channel messages moved outside sendMessage
        socket.on("send-channel-message", handleChannelMessage);

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`⚠️ User ${userId} disconnected.`);
            userSocketMap.delete(userId); // Remove the user from the map
        });
    });
};

export default socketSetup;
