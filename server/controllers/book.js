import Ticket from "../models/Ticket.js";
import Train from "../models/Train.js";
import User from "../models/User.js";
import nodemailer from 'nodemailer';

export const bookTicket = async (req, res) => {
    const { trainID, userId, date } = req.body;

    if (!trainID || !userId || !date) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields" });
    }
    try {
        const isTrainExist = await Train.findOne({ trainID: trainID });
        if (!isTrainExist) {
            return res.status(400).json({ message: "No such train exists" });
        }

        const isUserExist = await User.findOne({ _id: userId });
        if (!isUserExist) {
            return res.status(401).json({ message: "User not found" });
        }

        const targetDate = new Date(date);
        const trainHai = isTrainExist.schedules.some(
            (schedule) =>
                new Date(schedule.date.toISOString()).toDateString() ===
                targetDate.toDateString()
        );

        if (!trainHai) {
            return res
                .status(409)
                .json({ message: `The train does not run on ${targetDate}` });
        }

        const bookedSeatsOnDate = isTrainExist.bookedSeats.filter(
            (seat) =>
                new Date(seat.date.toISOString()).toDateString() ===
                targetDate.toDateString()
        );

        const availableSeats = isTrainExist.capacity - bookedSeatsOnDate.length;

        if (availableSeats <= 0) {
            return res
                .status(403)
                .json({ message: "Sorry! All seats are booked" });
        }

        // Using a transaction for data consistency
        const session = await Train.startSession();
        session.startTransaction();

        try {
            const newTicket = {
                userId: isUserExist._id,
                seatNo: bookedSeatsOnDate.length + 1,
                date: targetDate,
            };
            const seat = newTicket.seatNo;

            const ticket = new Ticket({
                trainID: isTrainExist.trainID,
                sourceStation: isTrainExist.origin,
                destinationStation: isTrainExist.destination,
                bookingDate: new Date(),
                journeyDate: targetDate,
                totalFare: isTrainExist.fare,
                userId: isUserExist._id,
                status: "Confirm",
                totalDistance: isTrainExist.distance,
            });

            await ticket.save();
            console.log("Ticket booked successfully");

            const ticketId = ticket._id;

            if (!ticketId) {
                throw new Error("Error saving ticket");
            }

            isTrainExist.bookedSeats.push({
                userId: isUserExist._id,
                ticketId: ticketId,
                seatNo: newTicket.seatNo,
                date: newTicket.date,
            });
            await isTrainExist.save();
            console.log(`train k db m bookedseats array m aai h ${isTrainExist.bookedSeats}`)
            await isUserExist.bookings.push(ticketId);
            await isUserExist.save();


            // sending notification to users email ID
            const fromMail = 'priyavarshney081003@gmail.com';
            const toMail = isUserExist.email;
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'priyavarshney081003@gmail.com',
                    pass: 'ggxg khrv jsdl eodg'
                }
            });
            const targetDt = new Date(isTrainExist.schedules[0].date); // Change this to the appropriate date you want to match

            const matchingSchedule = isTrainExist.schedules.find(schedule =>
            new Date(schedule.date).toDateString() === targetDt.toDateString()
            );

            console.log(`Matching schedule is: ${matchingSchedule}`)

            const text = `
                Dear ${isUserExist.username},

                Thank you for choosing our Train Service. Your booking has been confirmed for the following details:

                - Train Name: ${isTrainExist.trainName}
                - Train ID: ${isTrainExist.trainID}
                - Source Station: ${isTrainExist.origin}
                - Destination Station: ${isTrainExist.destination}
                - Departure Time: ${matchingSchedule.departureTime}
                - Arrival Time: ${matchingSchedule.arrivalTime} 
                - Date of Journey: ${matchingSchedule.date} 
                - Seat Number: ${seat}
                - Total Fare: ${isTrainExist.fare}

                Please make sure to arrive at the station on time and have a safe and pleasant journey.

            `

            const mailOptions = {
                from: fromMail, 
                to: toMail, 
                subject: `Your Ticket has been Booked`,
                text: text,
            }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    res.status(500).json({ msg: 'Error sending email' });
                } else {
                    console.log(`Email sent: ${info.response}`);
                    res.status(200).send('Email sent successfully');
                }
            })


            if (!isUserExist.bookings.includes(ticketId)) {
                throw new Error("Error updating user bookings");
            }

            await session.commitTransaction();
            session.endSession();

            res.status(201).json({
                message: "Booked Train successfully",
                ticket: newTicket,
            });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const cancelBooking = async (req, res) => {
    const { ticketID } = req.params;
    console.log(`ticketID = ${ticketID}`);
    if( !ticketID ){
        return res.status(400).send({message : 'Invalid Ticket'});
    }
    try {
        const validTicket = await Ticket.findById(ticketID);
        if(!validTicket){
            return  res.status(404).send('No such Ticket exists');
        }
        const { trainId, userId, journeyDate } = validTicket;
        const user = await User.findOne({ _id: userId });
        if(!user) {
            return res.status(404).json({message: 'The user who booked this ticket does not exist'});
        }
        const train = await Train.findOne({ trainId: trainId});
        if( !train ){
            return res.status(404).json({message:'Train Not Found!'})
        }
        // Checks whether the current date is after or equal to the departure date of the train
        const currentDate = new Date();
        const trainDepartureTime = new Date(journeyDate);
        if(currentDate >= trainDepartureTime) {     //ticket past ki h
            return res.status(403).json({ message: 'Cannot cancel booking after or on the journey date' });
        }

        const session = await Ticket.startSession();
        session.startTransaction();
        try {
            user.bookings.pull(ticketID);
            await user.save();
            await Ticket.deleteOne({_id: ticketID}, {session: session});

            const bookedSeats = train.bookedSeats;

            if (Array.isArray(bookedSeats) && bookedSeats.length > 0) {
                const idx = bookedSeats.findIndex(seat => seat.ticketId===ticketID);

                if (idx !== -1) {
                    const seatNo = bookedSeats[idx].seatNo;
                    console.log(`Seat Number ${seatNo} is cancelled for train ${train.trainName}`);
                    train.availableSeatsAfterCancellation.push(seatNo);
                    bookedSeats.splice(idx, 1);
                }
            } else {
                console.log('No booked seats found.');
            }
            await train.save();

            // sending notificcation to users email ID
            const fromMail = 'priyavarshney081003@gmail.com';
            const toMail = user.email;
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'priyavarshney081003@gmail.com',
                    pass: 'ggxg khrv jsdl eodg'
                }
            });

            const targetDt = new Date(train.schedules[0].date); // Change this to the appropriate date you want to match

            const matchingSchedule = train.schedules.find(schedule =>
                new Date(schedule.date).toDateString() === targetDt.toDateString()
                );
    
                console.log(`Matching schedule is: ${matchingSchedule}`)

            const text = `
                Dear ${user.username},

                We hope this message finds you well. We regret to inform you that your booking for the following ticket has been canceled:

                - Train Name: ${train.trainName}
                - Train ID: ${train.trainID}
                - Source Station: ${train.origin}
                - Destination Station: ${train.destination}
                - Departure Time: ${matchingSchedule.departureTime}
                - Arrival Time: ${matchingSchedule.arrivalTime} 
                - Date of Journey: ${matchingSchedule.date} 
                - Total Fare: ${train.fare}

                The cancellation was successful, and any payment made for this ticket has been refunded to your account.

                If you have any questions or concerns regarding the cancellation, please contact our customer support at ${fromMail}.

            `

            const mailOptions = {
                from: fromMail, 
                to: toMail, 
                subject: `Your Ticket has been Cancelled`,
                text: text,
            }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    res.status(500).json({ msg: 'Error sending email' });
                } else {
                    console.log(`Email sent: ${info.response}`);
                    res.status(200).send('Email sent successfully');
                }
            })

            // await validTicket.remove();
            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({msg: 'Booking cancelled successfully'});

        } catch (error) {
            console.log(error);
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({msg: 'Internal Server Error'});
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
