import axios from "axios";

const fetchComment = async (title) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/comment/?title=${title}`


    let response = await axios.get(API_URL + END_POINT, {
      crossdomain: true,
    });
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
  }

export default fetchComment;