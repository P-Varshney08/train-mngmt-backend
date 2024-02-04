import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    departureTime: {
        type: String,
        required: true,
    },
    arrivalTime: {
        type: String,
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

}, { timestamps: true });

const trainSchema = new mongoose.Schema(
    {
        trainName: {
            type: String,
            required: true,
        },
        trainID: {
            type: Number,
            unique: true,
            required: true,
        },
        origin: {
            type: String,
            required: true,
            maxlength: 100,
        },
        destination: {
            type: String,
            required: true,
            maxlength: 100,
        },
        schedules: [scheduleSchema],
        capacity: {
            type: Number,
            required: true,
        },
        fare: {
            type: Number,
            required: true,
        },
        duration: {
            type: String,
            required: true,
        },
        distance: {
            type: String,
            required: true,
        },
        bookedSeats: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                ticketId: { 
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Ticket",
                },
                seatNo: {
                    type: Number,
                    required: true,
                },
                date: {
                    type: Date,
                    required: true,
                },
            }
        ],
        availableSeatsAfterCancellation: {
            type: [Number],
            default: [],
        },
    },
    { timestamps: true }
);

const Train = mongoose.model("Train", trainSchema);

export default Train;





// {
//     "trainName": "Express 123",
//     "trainID": 1,
//     "origin": "Station A",
//     "destination": "Station B",
//     "schedules": [
//       {
//         "date": "2024-01-23T08:00:00.000Z",
//         "departureTime": "08:00 AM",
//         "arrivalTime": "12:00 PM",
//         "sourceStation": "Station A",
//         "destinationStation": "Station B"
//       },
//       {
//         "date": "2024-01-24T08:00:00.000Z",
//         "departureTime": "08:00 AM",
//         "arrivalTime": "12:00 PM",
//         "sourceStation": "Station A",
//         "destinationStation": "Station B"
//       }
//     ],
//     "capacity": 50,
//     "bookedSeats": [
//       {
//         "userId": "user_id_1",
//         "seatNo": 1,
//         "date": "2024-01-23T10:15:00.000Z"
//       },
//       {
//         "userId": "user_id_2",
//         "seatNo": 2,
//         "date": "2024-01-24T11:30:00.000Z"
//       }
//     ],
//     "fare": 20.5,
//     "duration": "4 hours"
//   }
  