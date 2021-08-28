import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.boardroom.info/v1",
});

export default axiosInstance;
