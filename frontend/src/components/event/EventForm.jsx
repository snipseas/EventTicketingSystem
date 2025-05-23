import React, { useState } from 'react';

const EventForm = ({ initialData = {}, onSubmit }) => {
  const [form, setForm] = useState({
    title: initialData.title || '',
    date: initialData.date || '',
    location: initialData.location || '',
    description: initialData.description || '',
    ...initialData,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <input name="date" type="date" value={form.date} onChange={handleChange} required />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <button type="submit">Save</button>
    </form>
  );
};

export default EventForm;