/* eslint-disable react/jsx-key */
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Cover from "../../../public/study.jpg";
import Cover2 from "../../../public/happy.jpg";
import not_found from "../../../public/not found.webp";
import { FaBookReader } from "react-icons/fa";

import Nav from "../../components/navbar";
import SessionNav from "../../components/navbar/NavbarSession";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    BookOutlined,
    ReadOutlined,
    FileSearchOutlined,
    WarningOutlined, 
  } from '@ant-design/icons';

import fetchArrayBasicInfo from "../../../api/fetch/fetchArrayBasicInfo";
import fetchArrayBasicInfo_result from "../../../api/fetch/fetchArrayBasicInfo_result";

import logout from "../../../api/other/logout";

function SearchResult() {

    //user data
    const [user_data, setUser_data] = useState({});

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);

    const [toggleMoreInfo, setToggleMoreInfo] = useState(false)

    const [url_default, setUrl_default] = useState("https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg")

    const [array_basic_data, setArray_basic_data] = useState({
        EbookTitle: ["ebook_title1"],
        image:["base64Image bra bra bra ant mai oak"],
        genre_2d_array:[["dasdsad"]],
        sum_view_array:[0],
        author_name_array:["name"],
        publisher_name_array:["name"]
    });
  

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
        // fetchArrayBasicInfo()
        // .then(ebook =>{
        //     console.log(ebook)
        //     console.log("wtf")
        //     setArray_basic_data(ebook)
        // })

        fetchArrayBasicInfo_result(queryParams.get('q'))
            .then(anime =>{
                console.log(anime)
                console.log("wtf")
                setArray_basic_data(anime)
                
            })

        }
        return () => {
          isMount = false;
        };
      }, [f, queryParams.get('q')]);

    return (

    <>
        {user_data.username !== "Guest login" ? <SessionNav Logout={handleLogout} User_image={`data:image/jpeg;base64,${user_data.image}`} /> : <Nav/>}
        <div className="bg-black min-h-screen flex flex-col">
            {/* Book Showcase Billboard */}
            {/* Grid Layout */}
            <div className="flex-1 bg-gradient-to-b from-slate-200 to-slate-400 text-black p-8">


                <h2 className="text-2xl font-bold mt-7 mb-4">[<FileSearchOutlined />] ผลลัพธ์การค้นหา</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {/* {array_basic_data.AnimeTitle.length > 0 ? */}
                {array_basic_data.EbookTitle.length > 0 ?
                array_basic_data.EbookTitle.map( (title, index) =>(
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
                ))
                :
                <div className="min-h-px flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <img src={not_found} className="mx-auto mb-4 w-96 h-96 object-cover"/>
                            <p className="text-lg text-black"><WarningOutlined /> ไม่พบหนังสือตามชื่อที่คุณได้ค้นหามา </p>
                        </div>
                    </div>
                </div>
                }
                </div>
            </div>
        </div>
    </>

    );
}

export default SearchResult;