import Train from "../models/Train.js";

export const addTrain = async (req, res) => {
    const {
        trainName,
        trainID,
        origin,
        destination,
        schedules,
        capacity,
        availableSeats,
        fare,
        duration,
        distance,
    } = req.body;
    if (
        !trainName ||
        !trainID ||
        !origin ||
        !destination ||
        !schedules ||
        !fare ||
        !duration ||
        !distance
    ) {
        return res.status(400).json({ message: "Enter valid details" });
    }
    const isTrainExist = await Train.findOne({
        $or: [{ trainID }, { trainName }],
    });
    if (isTrainExist) {
        return res.status(400).json({ message: "Train already exist" });
    }
    try {
        // console.log('isAdmin check hone k baad aage aa gya')
        const newTrain = await new Train({
            trainName,
            trainID,
            origin,
            destination,
            schedules,
            capacity,
            availableSeats,
            fare,
            duration,
            distance,
        });
        const savedTrain = await newTrain.save();
        return res.status(200).json({
            message: `Train added successfully`,
            data: savedTrain,

        });
    } catch (error) {
        console.log(`Error in adding a train ${error}`);
    }
};
export const getTrain = async (req, res) => {
    const {trainID} = req.params;
    console.log("Inside Get Train", trainID);
    if (!trainID) {
        return res.status(400).send({
            success: false,
            error: "Please provide an ID.",
        });
    }
    const trainDetails = await Train.findOne({_id: trainId});
    if(!trainDetails){
        return res.status(404).json({message:"No such train exists."})
    }
    res.status(200).json({
        success: true,
        data: trainDetails,
    })
};
export const deleteTrain = async (req, res) => {
    const {trainID} = req.params;
    console.log("Inside Delete Train", trainID);
    try {
        if(!trainID) {
            return res.status(400).json({ message: "id not found" });
        }
        const trainDetails = await Train.findOne({ _id: trainId });
        if (!trainDetails) {
            return res.status(400).json({ message: "Train does not exist"});
        }
        await trainDetails.removeOne();
        res.json({
            message: 'Deleted Successfully',
            data: null,
        })
    } catch (error) {
        console.log(error);
    }
};
export const getTrains = async (req, res) => {
    try {
        const allTrains = await Train.find().sort({'schedules.date': -1});
        if(allTrains){
            return res.status(200).json({
                allTrains,
            });
        }
    } catch (error) {
        console.log(error.message);
    }
};
