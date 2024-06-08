import axios from "axios";


const deleteEbook = async (title, force_re_render) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/admin/deleteEbook/:${title}`

    //คือข้อมูลอนิเมะ(ที่ไม่ใช่ไฟล์ mp4)
    let response = await axios.delete(API_URL + END_POINT, {
      crossdomain: true,
    });
    
    console.log(response.data)
    // console.log(data.anime_file)

    return response.data
}

export default deleteEbook;