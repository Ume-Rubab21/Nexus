// src/types/Event.ts
export interface IEvent {
  _id: string;          // MongoDB document ID
  title: string;
  description?: string; // optional, in case you extend later
  date: string;         // ISO date string
  venue: string;
  society: string;
  createdAt?: string;   // optional, from mongoose timestamps
  updatedAt?: string;   // optional, from mongoose timestamps
}
