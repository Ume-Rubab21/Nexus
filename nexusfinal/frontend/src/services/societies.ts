import api from "./api";

// export const getSocieties = () => {
//   return api.get("/societies");
// };

export interface ISociety {
  _id: string;
  name: string;
  description: string;
  president: string;
  createdAt: string;
  updatedAt: string;
}

export const getSocieties = async (): Promise<ISociety[]> => {
  const res = await api.get<ISociety[]>("/societies");
  return res.data;
};

export const getSocietyById = (id: string) => {
  return api.get(`/societies/${id}`);
};

export const createSociety = (data: {
  name: string;
  description: string;
  president: string;
}) => {
  return api.post("/societies", data);
};

export const updateSociety = (
  id: string,
  data: {
    name?: string;
    description?: string;
    president?: string;
  }
) => {
  return api.put(`/societies/${id}`, data);
};

export const deleteSociety = (id: string) => {
  return api.delete(`/societies/${id}`);
};
