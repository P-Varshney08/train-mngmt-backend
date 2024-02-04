import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    trainID: {
      type: String,
      // ref: "Train",
      required: true,
    },
    sourceStation: {
      type: String,
      required: true,
    },
    destinationStation: {
      type: String,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    journeyDate: {
      type: Date,
      required: true,
    },
    totalFare: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "Confirm",
      enum: ["Confirm", "Cancelled", "Waiting"],
    },
    totalDistance: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
