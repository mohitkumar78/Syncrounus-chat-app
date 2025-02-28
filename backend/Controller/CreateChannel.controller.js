import userdata from "../Model/User.model.js";
import Channel from "../Model/CreateChannel.model.js";
import mongoose from "mongoose";
export const createChannel = async (req, res) => {


    try {
        const { name, members } = req.body;
        const userId = req.id;

        const admin = await userdata.findById(userId);

        if (!admin) {
            return res.status(404).send("Admin user not Found")
        }

        const validmembers = await userdata.find({ _id: { $in: members } });

        if (validmembers.length !== members.length) {
            return res.status(404).send("some user is not a valid user")
        }

        const newChannel = new Channel({
            name,
            members,
            admin
        })
        await newChannel.save()

        return res.status(201).json({
            Channel: newChannel
        })
    } catch (error) {
        console.log("Error is Occur in create Channel controller", error)
        return res.status(501).json({
            message: "Internal server error"
        })
    }

}

export const getAllUserChannel = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.id)

        const Channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }]
        }).sort({ updatedAt: -1 })

        if (!Channels) {
            return res.status(400).send("No any Channel is found");
        }

        return res.status(201).json({
            message: "All user Channel are fetched sucesfully",
            Channels
        })
    } catch (error) {
        console.log("error is Occur while geting All user channel", error)
        return res(500).send("Internal server Error")
    }

}
export const getChannelMessage = async (req, res) => {
    try {
        const { channelId } = req.body;
        const channel = await Channel.findById(channelId).populate({
            path: "messages", populate: {
                path: "sender", select: "firstname lastname email image color _id"
            }
        })
        if (!channel) {
            return res.send("channel is not found")
        }
        const message = channel.messages
        return res.status(201).json({ message })
    } catch (error) {
        console.log("Error is Occur in getting channel messages")
    }

}