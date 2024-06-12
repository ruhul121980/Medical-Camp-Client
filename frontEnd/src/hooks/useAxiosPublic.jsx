
import axios from "axios";
const axiosPublic = axios.create({
    baseURL: 'https://medicamp-eight.vercel.app',

  });

export default function useAxiosPublic() {
  return axiosPublic
    
  
}
