// src/services/events.ts
import api from "./api";
import { IEvent } from "../types/Events";

// Fetch all events
export const getEvents = async (): Promise<IEvent[]> => {
  const res = await api.get<IEvent[]>("/events"); // tell Axios the expected type
  return res.data;
};

// Optional: fetch single event by ID
export const getEventById = (id: string) => {
  return api.get<IEvent>(`/events/${id}`);
};

// Optional: create a new event
export const createEvent = (data: {
  title: string;
  description: string;
  date: string;
  venue: string;
  society: string;
}) => {
  return api.post("/events", data);
};

// Optional: update an event
export const updateEvent = (
  id: string,
  data: {
    title?: string;
    description?: string;
    date?: string;
    venue?: string;
    society?: string;
  }
) => {
  return api.put(`/events/${id}`, data);
};

// Optional: delete an event
export const deleteEvent = (id: string) => {
  return api.delete(`/events/${id}`);
};
