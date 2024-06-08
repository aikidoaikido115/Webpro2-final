import axios from "axios";

const fetchSelectBasicInfo = async (title) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/select_basic_info/?title=${title}`


    let response = await axios.get(API_URL + END_POINT, {
      crossdomain: true,
    });
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
  }

export default fetchSelectBasicInfo;