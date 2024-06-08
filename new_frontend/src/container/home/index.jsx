/* eslint-disable react/jsx-key */
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Cover from "../../../public/study.jpg";
import Cover2 from "../../../public/happy.jpg";
import { FaBookReader } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import Nav from "../../components/navbar";
import SessionNav from "../../components/navbar/NavbarSession";
import Footer from "../../components/footer";
import { Divider } from 'antd';

import {
    BookOutlined,
    ReadOutlined, 
  } from '@ant-design/icons';


import fetchArrayBasicInfo from "../../../api/fetch/fetchArrayBasicInfo";
import logout from "../../../api/other/logout";



function Layout() {

    //user data
    const [user_data, setUser_data] = useState({});

    const [toggleMoreInfo, setToggleMoreInfo] = useState(false)

    const [url_default, setUrl_default] = useState("https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg")

    const [array_basic_data, setArray_basic_data] = useState({
        EbookTitle: ["ebook_title1"],
        image:["base64Image bra bra bra ant mai oak"],
        genre_2d_array:[["dasdsad"]],
        sum_view_array:[0],
        author_name_array:["name"],
        publisher_name_array:["name"],
        big_image:"base64",
        big_title:" ",
        big_genre_1d_array:[" "],
        big_description:" ",
        big_rating:0
    });
  
    //บังคับให้มัน rerender เพื่อให้ navigate มันยอมเปลี่ยน navbar
    const [f, forceUpdate] = useState();

    const navigate = useNavigate();

    const handleLogout = () => {
        
        logout()
        console.log("logout แล้ว")
        forceUpdate(Math.random())
    }

    const handleMoreInfo = () => {
        setToggleMoreInfo(!toggleMoreInfo)
    }

    const handle_navigate_to_detail = async (title) => {
        navigate(`/detail/${encodeURIComponent(title)}`)
        forceUpdate(Math.random())
    }

    axios.defaults.withCredentials = true;
    useEffect(() => {
        let isMount = true;
        if (isMount) {
          axios.get(`http://localhost:8000/`).then((response) => {
            console.log(response.data);
            if (response.data.username) {
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
        {user_data.username !== "Guest login" ? <SessionNav Logout={handleLogout} User_image={`data:image/jpeg;base64,${user_data.image}`} /> : <Nav/>}
        <div className="bg-black min-h-screen flex flex-col">
        {/* Book Showcase Billboard */}
        <div className="h-[450px] relative">
            <img src={`data:image/jpeg;base64,${array_basic_data.big_image}`} alt="Background" className="absolute inset object-cover w-full h-full blur-lg" />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-row justify-center gap-8 p-8">
            <div className="flex flex-col justify-center w-1/3">
                <h1 className="text-white text-4xl font-bold mb-4">
                {array_basic_data.big_title}
                </h1>

                <p className="text-white text-lg mb-4">
                {array_basic_data.big_genre_1d_array.map((element, i) => i < array_basic_data.big_genre_1d_array.length - 1 ? element + ", " : element)}
                </p>
                {toggleMoreInfo && (
                    <div>
                        <div className="text-white text-lg mb-4 max-h-48 overflow-auto"><span className="font-bold">รายละเอียด/เรื่องย่อ: </span>{array_basic_data.big_description}</div>
                        <div className="text-white text-lg mb-4"><span className="font-bold">เรทติ้ง: </span>{array_basic_data.big_rating}</div>
                    </div>
                )}
                <div className="flex items-center">
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-semibold px-6 py-4 rounded-lg mr-4 anihover"
                  onClick={() => handle_navigate_to_detail(array_basic_data.big_title)}
                >
                    <ReadOutlined />
                </button>
                <button
                  className="bg-black hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-lg anihover"
                  onClick={handleMoreInfo}
                  >
                    ข้อมูลเพิ่มเติม
                </button>
                </div>
            </div>
            <div className="flex items-center">
                <div className="w-full h-80 object-cover">
                    <img
                      src={`data:image/jpeg;base64,${array_basic_data.big_image}`} alt=""
                      className="w-full h-full object-cover" />
                </div>
            </div>
            </div>
        </div>


            {/* Grid Layout */}
            <div className="flex-1 bg-gradient-to-b from-slate-200 to-slate-400 text-black p-8">

            <h2 className="text-2xl font-bold mt-12 mb-4"> [<BookOutlined />] หนังสือที่เพิ่มมาเมื่อเร็วๆนี้</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 blockappear border-8 p-4 border-white bg-white rounded-xl shadow-md shadow-gray-200/90">
            {array_basic_data.EbookTitle.map( (title, index) =>(index < 6 ?
                <div className="bg-gray-300 rounded-lg shadow-lg p-8 anihover border-2 border-black">
                    <div className="w-full h-80 object-cover mb-2 relative">
                        <div className="absolute inset-x-0 -top-3">
                        <div className="flex justify-center items-center">
                        <p
                              className="text-white text-center text-xs font-bold bg-slate-800 p-1 rounded-2xl w-auto border-2 border-black"
                            >
                                {array_basic_data.publisher_name_array[array_basic_data.EbookTitle.length - 1 - index]}
                            </p>
                        </div>
                        </div>
                        <img
                        src={`data:image/jpeg;base64,${array_basic_data.image[array_basic_data.EbookTitle.length - 1 - index]}`}
                        alt="Book"
                        className="w-full h-full object-cover mb-2 border-2 border-black" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg truncate font-semibold">{array_basic_data.EbookTitle[array_basic_data.EbookTitle.length - 1 - index]}</h3>

                        <p className="text-sm truncate">{array_basic_data.genre_2d_array[array_basic_data.EbookTitle.length - 1 - index].map((element, i) => i < array_basic_data.genre_2d_array[array_basic_data.EbookTitle.length - 1 - index].length - 1 ? element + ", " : element)}</p>
                        <button
                          className="text-center bg-green-500 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg mt-4 items-center"
                          onClick={() => handle_navigate_to_detail(array_basic_data.EbookTitle[array_basic_data.EbookTitle.length - 1 - index])}
                        >
                        <ReadOutlined />
                        </button>
                    </div>
                </div>
                :
                <div key={index}></div>
            ))}
            </div>

            {/* Divider */}
            <div className="my-12 border-2 border-slate-500"></div>

            <h2 className="text-2xl font-bold mt-16 mb-4">[<BookOutlined />] รวมหนังสือทั้งหมด</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 blockappear border-8 p-4 border-white bg-white mb-12 rounded-xl shadow-md shadow-gray-200/90">
            {array_basic_data.EbookTitle.map( (title, index) =>(index >= 6 ?
                <div className="bg-gray-300 rounded-lg shadow-lg p-8 anihover border-2 border-black">
                    <div className="w-full h-80 object-cover mb-2 relative">
                        <div className="absolute inset-x-0 -top-3">
                        <div className="flex justify-center items-center">
                            <p
                              className="text-white text-center text-xs font-bold bg-slate-800 p-1 rounded-2xl w-auto border-2 border-black"
                            >
                                {array_basic_data.publisher_name_array[array_basic_data.EbookTitle.length - 1 - index]}
                            </p>
                        </div>
                        </div>
                        <img
                        src={`data:image/jpeg;base64,${array_basic_data.image[array_basic_data.EbookTitle.length - 1 - index]}`}
                        alt="Book"
                        className="w-full h-full object-cover mb-2 border-2 border-black" />
        
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg truncate font-semibold">{array_basic_data.EbookTitle[array_basic_data.EbookTitle.length - 1 - index]}</h3>

                        <p className="text-sm truncate">{array_basic_data.genre_2d_array[array_basic_data.EbookTitle.length - 1 - index].map((element, i) => i < array_basic_data.genre_2d_array[array_basic_data.EbookTitle.length - 1 - index].length - 1 ? element + ", " : element)}</p>
                        <button
                          className="text-center bg-green-500 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg mt-4 items-center"
                          onClick={() => handle_navigate_to_detail(array_basic_data.EbookTitle[array_basic_data.EbookTitle.length - 1 - index])}
                        >
                        <ReadOutlined />
                        </button>
                    </div>
                </div>
                :
                <div key={index}></div>
            ))}
            </div>
            
                
            
            </div>
        </div>
         <Footer/>
    </>

    );
}

export default Layout;