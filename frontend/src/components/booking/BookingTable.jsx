import React from 'react';

const BookingTable = ({ bookings, onCancel }) => (
  <table className="w-full mt-4 border">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-2 border">Event</th>
        <th className="p-2 border">Date</th>
        <th className="p-2 border">Tickets</th>
        <th className="p-2 border">Total</th>
        <th className="p-2 border">Action</th>
      </tr>
    </thead>
    <tbody>
      {bookings.map(booking => (
        <tr key={booking._id}>
          <td className="p-2 border">{booking.event.name}</td>
          <td className="p-2 border">{new Date(booking.event.date).toLocaleDateString()}</td>
          <td className="p-2 border">{booking.tickets}</td>
          <td className="p-2 border">${booking.tickets * booking.event.price}</td>
          <td className="p-2 border">
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => onCancel(booking._id)}
            >
              Cancel
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default BookingTable;
