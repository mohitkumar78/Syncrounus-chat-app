import userdata from "../Model/User.model.js"; // Ensure correct import path
import Message from "../Model/Message.model.js";
import mongoose from "mongoose";
export const Contact = async (req, res) => {
    try {
        const { searchTerm } = req.body;

        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is missing" });
        }

        // Ensure req.user exists and has an ID
        const userId = req.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        // Sanitize search term
        const sanitizedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        const regex = new RegExp(sanitizedSearchTerm, "i");

        // Search for contacts, excluding the current user and selecting only necessary fields
        const contacts = await userdata.find(
            {
                _id: { $ne: userId }, // Exclude the requesting user
                $or: [
                    { firstname: regex },
                    { lastname: regex },
                    { email: regex }
                ]
            }
        ).select("firstname lastname email image"); // Exclude sensitive fields

        // Check if contacts exist
        if (contacts.length === 0) {
            return res.status(404).json({ message: "No contacts found" });
        }

        return res.status(200).json({ contacts });

    } catch (error) {
        console.error("Error fetching contacts:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


// Ensure correct import path


export const getContactForDmList = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.id)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        let userId = new mongoose.Types.ObjectId(req.id);

        // ✅ Fetch messages first (DEBUG STEP)


        // ✅ Aggregation pipeline to group contacts
        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" }
                }
            },
            {
                $lookup: {
                    from: "userdatas",  // ✅ Changed from "userdata" to "userdatas"
                    localField: "_id",
                    foreignField: "_id",
                    as: "ContactInfo"
                }
            },
            {
                $unwind: { path: "$ContactInfo", preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$ContactInfo.email",
                    firstname: "$ContactInfo.firstname",
                    lastname: "$ContactInfo.lastname",
                    image: "$ContactInfo.image",
                    color: "$ContactInfo.color"
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]).exec();



        return res.status(200).json({ contacts });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



export const getAllContact = async (req, res) => {
    try {
        if (!req.id) {
            return res.status(400).json({ message: "User ID not provided", success: false });
        }

        const users = await userdata.find({ _id: { $ne: req.id } }, "firstname lastname _id email");

        const contacts = users.map((user) => ({
            label: user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : user?.email,
            value: user._id, // Adding _id for better identification
        }));

        return res.status(200).json({
            contacts,
            success: true,
        });
    } catch (error) {
        console.error("Error occurred in getAllContact:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
