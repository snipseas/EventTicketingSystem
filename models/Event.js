const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    totalTickets: { type: Number, required: true },
    availableTickets: { type: Number, required: true },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'declined'],
        default: 'pending'
    }
}, { timestamps: true });
eventSchema.virtual('ticketsSoldPercent').get(function() {
    return (this.ticketsSold / this.ticketsAvailable) * 100;
  });

module.exports = mongoose.model('Event', eventSchema);
