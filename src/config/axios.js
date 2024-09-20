import axios from "axios";

const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    /* "Content-Type": "multipart/form-data", */
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

export default clienteAxios;
