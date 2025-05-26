import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookingById } from '../services/booking';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingById(id);
        setBooking(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooking();
  }, [id]);

  if (!booking) return <p>Loading...</p>;

  const { event, tickets, createdAt } = booking;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
      <p><strong>Event:</strong> {event.name}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Tickets:</strong> {tickets}</p>
      <p><strong>Total:</strong> ${event.price * tickets}</p>
      <p><strong>Booked on:</strong> {new Date(createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default BookingDetailsPage;
