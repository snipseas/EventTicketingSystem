import React from 'react';

const BookingCard = ({ booking, onCancel }) => {
  const { _id, event, tickets, createdAt } = booking;

  return (
    <div className="border p-4 rounded shadow bg-white">
      <h2 className="text-xl font-bold">{event.name}</h2>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Tickets:</strong> {tickets}</p>
      <p><strong>Total:</strong> ${event.price * tickets}</p>
      <p><strong>Booked on:</strong> {new Date(createdAt).toLocaleDateString()}</p>
      <button
        className="mt-3 bg-red-500 text-white px-4 py-1 rounded"
        onClick={() => onCancel(_id)}
      >
        Cancel Booking
      </button>
    </div>
  );
};

export default BookingCard;
