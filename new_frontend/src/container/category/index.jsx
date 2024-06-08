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

import {
    BookOutlined,
    ReadOutlined,
    WarningOutlined,
    FileSearchOutlined, 
  } from '@ant-design/icons';

import { Link, useNavigate, useLocation } from "react-router-dom";

import fetchArrayBasicInfo from "../../../api/fetch/fetchArrayBasicInfo";
import fetchArrayGenre from "../../../api/fetch/fetchArrayGenre";
import fetchArrayAuthor from "../../../api/fetch/fetchArrayAuthor";
import fetchArrayFilterInfo from "../../../api/fetch/fetchArrayFilterInfo";
import fetchArrayBasicInfo_result from "../../../api/fetch/fetchArrayBasicInfo_result";

import logout from "../../../api/other/logout";

function Category() {

    //user data
    const [user_data, setUser_data] = useState({});

    const [toggleMoreInfo, setToggleMoreInfo] = useState(false)

    const [selectedValue_Sort, setSelectedValue_Sort] = useState("newest");
    const [selectedValue_Category, setSelectedValue_Category] = useState("all");
    const [selectedValue_Status, setSelectedValue_Status] = useState("all");

    const [array_genre, setArray_genre] = useState({
        EbookGenre: ["genre_name bra bra bra"]
    });

    const [array_author, setArray_author] = useState({
        author_name: ["author_name bra bra bra"]
    });

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search);

    const navigate = useNavigate();

    const [url_default, setUrl_default] = useState("https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg")

    const [array_basic_data, setArray_basic_data] = useState({
        EbookTitle: ["ebook_title1"],
        image:["base64Image bra bra bra ant mai oak"],
        genre_2d_array:[["dasdsad"]],
        sum_view_array:[0],
        author_name_array:["name"],
        publisher_name_array:["name"]
    });
  
    //บังคับให้มัน rerender เพื่อให้ navigate มันยอมเปลี่ยน navbar
    const [f, forceUpdate] = useState();

    const handleLogout = () => {
        
        logout()
        console.log("logout แล้ว")
        forceUpdate(Math.random())
    }

    const handleMoreInfo = () => {
        setToggleMoreInfo(!toggleMoreInfo)
    }

    axios.defaults.withCredentials = true;
    const handleSelectChange_Sort = (event) => {
        
        let sort = event.target.value
        setSelectedValue_Sort(sort)

        navigate(`/category/?sort=${sort}&category=${selectedValue_Category}&status=${selectedValue_Status}`)
        forceUpdate(Math.random());
    };


    const handleSelectChange_Category = (event) => {

        let category = event.target.value
        setSelectedValue_Category(category)

        navigate(`/category/?sort=${selectedValue_Sort}&category=${category}&status=${selectedValue_Status}`)
        forceUpdate(Math.random());
    };

    const handleSelectChange_Status = (event) => {

        let status = event.target.value
        setSelectedValue_Status(status)

        navigate(`/category/?sort=${selectedValue_Sort}&category=${selectedValue_Category}&status=${status}`)
        forceUpdate(Math.random());
    };

    const handle_navigate_to_detail = async (title) => {
        navigate(`/detail/${encodeURIComponent(title)}`)
    }
    
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

        fetchArrayGenre()
            .then(genre => {
                setArray_genre(genre)
                // console.log("here")
                // console.log(array_genre)
                

            })
        
        fetchArrayAuthor()
            .then(author => {
                console.log("author",author)
                setArray_author(author)
            })
    
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

        fetchArrayFilterInfo(queryParams.get('sort'), queryParams.get('category'), queryParams.get('status'))
            .then(anime =>{
                console.log(anime)
                console.log("wtf")
                setArray_basic_data(anime)
            })

        // fetchArrayBasicInfo_result(queryParams.get('q'))
        //     .then(anime =>{
        //         console.log(anime)
        //         console.log("wtf")
        //         setArray_basic_data(anime)
                
        //     })

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
            {/* Grid Layout */}
            <div className="flex-1 bg-gradient-to-b from-slate-200 to-slate-400 text-black p-8">
                
                <div className="bg-gray-300 text-white mt-1 p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-center">
                        <h2 className="text-black text-lg font-semibold">
                            <label htmlFor="category" className="mr-2">เรียงโดย: </label>
                            <select
                                name="feature"
                                id="feature"
                                className="px-2 py-1 bg-slate-700 text-white rounded mr-6"
                                onChange={handleSelectChange_Sort}
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </h2>
                        <h2 className="text-black text-lg font-semibold">
                            <label htmlFor="category" className="mr-2">หมวดหมู่: </label>
                            <select
                                name="category"
                                id="category"
                                className="px-2 py-1 bg-slate-700 text-white rounded mr-6"
                                onChange={handleSelectChange_Category}
                                >
                                <option value="all">All</option>
                                {array_genre.EbookGenre.map(element => (
                                    <option value={element}>{element}</option>
                                ))}
                                {/* <option value="all">All</option>
                                <option value="action">Action</option>
                                <option value="romantic">Romantic</option>
                                <option value="ecchi">Ecchi</option> */}
                            </select>
                        </h2>
                        <h2 className="text-black text-lg font-semibold">
                            <label htmlFor="status" className="mr-2">ผู้เขียน: </label>
                            <select
                                name="status"
                                id="status"
                                className="px-2 py-1 bg-slate-700 text-white rounded mr-6"
                                onChange={handleSelectChange_Status}
                                >
                                <option value="all">All</option>
                                {array_author.author_name.map(element => (
                                    <option value={element}>{element}</option>
                                ))}
                            </select>
                        </h2>
                    </div>
                </div>

                {/* <p className="text-black">{array_author.author_name}</p> */}

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
                <div className="col-span-full flex justify-center">
                    <div className="text-center">
                        <img src={not_found} className="mx-auto mb-4 w-96 h-96 object-cover"/>
                        <p className="text-lg text-black"><WarningOutlined/> ไม่พบหนังสือตามการกรองของคุณ</p>
                    </div>
                </div> 
                }
                </div>
            </div>
        </div>
    </>

    );
}

export default Category;