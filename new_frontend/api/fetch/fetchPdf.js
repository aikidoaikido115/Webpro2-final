import axios from "axios";

const fetchTestPdf = async (ebook_title) => {
    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/test_pdf/?ebook_title=${ebook_title}`

    //คือข้อมูลอนิเมะ(ที่ไม่ใช่ไฟล์ mp4)
    let response = await axios.get(API_URL + END_POINT, {
        responseType: 'arraybuffer',
        crossdomain: true,
    });
    
    const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    return pdfUrl
  }

export default fetchTestPdf;