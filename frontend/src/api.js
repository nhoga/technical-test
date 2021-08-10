import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/search?query=&limit=30&offset=0",
});

export default api;
