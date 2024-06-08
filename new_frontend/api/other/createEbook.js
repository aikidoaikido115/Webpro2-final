import axios from "axios";


const createEbook = async (obj_send_to_backend) => {

    const API_URL = import.meta.env.VITE_API_URL
    const END_POINT = `/api/admin/createEbook`

    const formData = new FormData();
    for (const [key, value] of Object.entries(obj_send_to_backend)) {
        // console.log(`${key}: ${value}`)
        if (value instanceof FileList) {
            // Handle FileList object
            for (let i = 0; i < value.length; i++) {
                console.log(`${key} - File ${i + 1}: ${value[i].name}`);
                formData.append(key, value[i]);
            }
        } else {
            formData.append(key, value);
        }
    }

    console.log(formData)
    console.log("ebookName:", formData.get("title"));
    console.log("ebookImage:", formData.get("ebookImage"));
    // console.log("bigImage:", formData.get("bigImage"));
    console.log("ebookFile:", formData.get("ebookFile"));

    const option = {
        onUploadProgress: (ProgressEvent) => {
            const {loaded, total} = ProgressEvent
            let percent = (Math.floor(loaded * 100) / total)
            console.log(`loaded ${loaded}kb of ${total}kb | ${percent}%`)


            const progressBar = document.getElementById("progress-bar");
            const progressValue = progressBar.querySelector("progress");
            const progressText = progressBar.querySelector("#progress-text");

            progressBar.classList.remove("hidden")
            progressValue.value = percent;
            progressText.textContent = ` ${percent.toFixed(2)} %`;

            if (percent == 100){
                //ทศนิยม 2 ตำแหน่ง
                const progress = document.getElementById("progressPercent")
                progress.innerHTML = `กำลังบันทึกลงฐานข้อมูล กรุณารอสักครู่...`
            }
            
        }
    }

    //คือข้อมูลอนิเมะ(ที่ไม่ใช่ไฟล์ mp4)
    console.log("รันตรง axios นะ")
    let response = await axios.post(API_URL + END_POINT, formData, {

        ...option,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    
    console.log(response.data)

    return response.data
}

export default createEbook;