import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true }, // keep as string for simplicity
  time: { type: String, required: true },
  location: { type: String, required: true },
  ticketQuantity: { type: Number, required: true },
  availableTickets: { type: Number, required: true }
});

// Transform _id → id for frontend
eventSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Event", eventSchema);
