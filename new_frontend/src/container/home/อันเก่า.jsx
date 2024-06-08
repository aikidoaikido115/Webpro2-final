import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import fetchArrayBasicInfo from "../../../api/fetch/fetchArrayBasicInfo";

function Home() {

    //user data
    const [user_data, setUser_data] = useState({});

    const [url_default, setUrl_default] = useState("https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg")

    const [array_basic_data, setArray_basic_data] = useState({
        EbookTitle: ["ebook_title1"],
        image:["base64Image bra bra bra ant mai oak"],
        genre_2d_array:[["dasdsad"]],
        sum_view_array:[0],
        author_name_array:["name"]
    });
  
    //บังคับให้มัน rerender เพื่อให้ navigate มันยอมเปลี่ยน navbar
    const [f, forceUpdate] = useState();

    axios.defaults.withCredentials = true;
    useEffect(() => {
        let isMount = true;
        if (isMount) {
          //ไม่ใช่ await แต่ใช้ then แทนเพราะมัน error กับ useEffect
          //และการเช็ค user ว่า login หรือป่าวจะไม่เขียนแยกด้วยเพราะ สุดท้ายตอน then ก็ต้องเขียน logic ตรงนี้อยู่ดี
          axios.get(`http://localhost:8000/`).then((response) => {
            console.log(response.data);
            if (response.data.username) {
    
              //ที่นี้อยากจะ fetch อะไรเพิ่มเติมเกี่ยวกับ username นั้นๆ ก็ไปเพิ่มโค้ด SQL ที่ backend ชิวๆละ
              axios.get(`http://localhost:8000/api/user_specific_info/?username=${response.data.username}`)
                .then(user_specific_info =>{
                  console.log(user_specific_info)
                  setUser_data(user_specific_info.data);
                })
              
            } else {
              setUser_data({ username: "Guest login" });
            }
          });
    
        //   fetchBasicInfo()
        //   .then(data =>{
        //     setBasic_data(data)
        //   })
        fetchArrayBasicInfo()
        .then(ebook =>{
            console.log(ebook)
            console.log("wtf")
            setArray_basic_data(ebook)
        })

        }
        return () => {
          isMount = false;
        };
      }, [f]);

    return (
        <>
            <h1 className="text-5xl mb-7">Home for {user_data.username}</h1>
            <img src={user_data.username === "Guest login" ? url_default : `data:image/jpeg;base64,${user_data.image}`} width={350}/>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {array_basic_data.EbookTitle.map( (title, index) =>(index >= 0 ?
                <div className="grid-item rounded-lg shadow-lg p-8" key={index}>
                    <div onClick={() => handle_navigate_and_view_count(array_basic_data.EbookTitle[array_basic_data.EbookTitle.length - 1 - index])} className="cursor-pointer">
                    <div className="w-full h-80 object-cover mb-2">
                            <img
                            src={`data:image/jpeg;base64,${array_basic_data.image[array_basic_data.EbookTitle.length - 1 - index]}`}
                            alt="Movie"
                            className="w-full h-full object-cover border-2 border-red-700 rounded-3xl"
                            />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold">{array_basic_data.EbookTitle[array_basic_data.EbookTitle.length - 1 - index]}</h3>
                    <p className="text-sm">{array_basic_data.sum_view_array[array_basic_data.EbookTitle.length - 1 - index]} View</p>
                    <p className="text-sm truncate">Genre: <span className="text-amber-500">{array_basic_data.genre_2d_array[array_basic_data.EbookTitle.length - 1 - index].map((element, i) => i < array_basic_data.genre_2d_array[array_basic_data.EbookTitle.length - 1 - index].length - 1 ? element + ", " : element)}</span></p>
                    <p className="text-sm truncate">Author: <span className="text-amber-500">{array_basic_data.author_name_array[array_basic_data.EbookTitle.length - 1 - index]}</span></p>
                </div>
                :
                <div key={index} className="grid-item"></div>
            ))}
            </div>
            {/* <div>
                <img src={`data:image/jpeg;base64,${array_basic_data.image[0]}`}/>
            </div> */}
        </>
    );
}

export default Home;
