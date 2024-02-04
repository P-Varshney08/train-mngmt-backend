import Ticket from "../models/Ticket.js";

export const getTicket = async(req, res) => {
    const {id} = req.params;
    if(!id){
        return res.status(400).json({error: 'Missing ticket id'});
    }
    try {
        const isTicketExist = await Ticket.findOne({_id: id});
        if(!isTicketExist) {
            return res.status(404).json({ error : 'No ticket with given ID exist'});
        }
        return res.status(200).json(isTicketExist);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}