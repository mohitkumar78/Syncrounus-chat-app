import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
    name: {
        type: String, // Fixed: Removed quotes
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userdata",
        required: true
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userdata",
        required: true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update 'updatedAt' before saving
ChannelSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

// Middleware to update 'updatedAt' before updating
ChannelSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Fixed: mongoose.model instead of mongoose.Model
const Channel = mongoose.model("Channels", ChannelSchema);

export default Channel;
