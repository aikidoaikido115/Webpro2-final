import axios from "axios";

const fetchOtherData = async (title) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/other_data/?title=${title}`

    //คือข้อมูลอนิเมะ(ที่ไม่ใช่ไฟล์ mp4)
    let response = await axios.get(API_URL + END_POINT, {
      crossdomain: true,
    });
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
  }

export default fetchOtherData;