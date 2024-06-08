/* eslint-disable react/jsx-key */
import React from 'react'
import { useState, useEffect} from 'react';
import { useParams, useNavigate, Link} from 'react-router-dom';

import logout from "../../../api/other/logout";
import axios from "axios";
import Comments from "../../components/comment/Comments";
import Nav from "../../components/navbar";
import SessionNav from "../../components/navbar/NavbarSession";
import Notification from "../../components/popup/Notification";

import add_library from "../../../api/other/add_library";
import fetchUserInfo from "../../../api/fetch/fetchUserInfo"
import fetchSelectBasicInfo from '../../../api/fetch/fetchSelectBasicInfo';
import fetchArrayBasicInfo from '../../../api/fetch/fetchArrayBasicInfo';
import { FaBookReader } from "react-icons/fa";
import Footer from "../../components/footer";


import {
    BookOutlined,
    ReadOutlined,
    CommentOutlined,
    HeartOutlined, 
  } from '@ant-design/icons';

import Cover from "../../../public/study.jpg";
import Cover2 from "../../../public/happy.jpg";




const DetailEbook = () => {

    const [user_data, setUser_data] = useState({})

    const [select_basic_data, setSelect_basic_data] = useState({
        EbookTitle: "ebook_title1",
        image:"base64Image bra bra bra ant mai oak",
        genre_1d_array:["dasdsad"],
        sum_view:0,
        author_name:"name",
        publisher_name:"name",
        rating:0.0,
        description:"asdsadsadwsa",
        release_date:"1024-05-18T32:13:26.000Z"
    });

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

    const { ebook_title } = useParams();

    const [isOpenWatch, setIsOpenWatch] = useState(false)
    const [isOpenWarning, setIsOpenWarning] = useState(false)

    const [f, forceUpdate] = useState();

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleWatchList = async (title) => {
        // alert("คลิ้กติด")
        if (user_data.username !== "Guest login") {
            const obj = {
                title:title,
                username:user_data.username
            }
            const result = await add_library(obj)
            console.log(result)
            if (result !== "this anime already in watch list") {
                setIsOpenWatch(true)
            }
            else {
                setIsOpenWarning(true)
            }
            
        }
        else {
            navigate("/login")
        }
      }
      const handleWatchListOK = () => {
        setIsOpenWatch(false)
      }
      const handleWatchListWarning = () => {
        setIsOpenWarning(false)
      }


    function formatDate(dateString) {
        const [datePart, timePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-');
        console.log(year, month, day)
        // const [hours, minutes, seconds] = timePart.split(/:|\./);
        let [hours, minutes, seconds] = timePart.split(':')
        seconds = seconds.split('.')[0]

        // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        return `${datePart}`
    }

    // const handle_navigate_to_detail = async (title) => {
    //     navigate(`/detail/${encodeURIComponent(title)}`)
    //     forceUpdate(Math.random())
    // }
    
    const handleLogout = () => {
        logout()
        forceUpdate(Math.random());
    }

    const handle_navigate_to_read = async (title) => {
        navigate(`/read/${encodeURIComponent(title)}`)
    }

    useEffect(() => {
        let isMount = true;
        if (isMount) {
    
            
            axios.get(`http://localhost:8000/`).then((response) => {
            console.log(response.data);
            if (response.data.username) {
    
                
                fetchUserInfo(response.data.username)
                .then(user_specific_info =>{
                    console.log(user_specific_info)
                    setUser_data(user_specific_info.data);
                })


            }
            else {
                setUser_data({ username: "Guest login" });

            }
            fetchArrayBasicInfo()
            .then(ebook =>{
                console.log(ebook)
                console.log("wtf")
                setArray_basic_data(ebook)
            })



            fetchSelectBasicInfo(ebook_title)
            .then(ebook =>{
                console.log(ebook)
                console.log("wtf")
                setSelect_basic_data(ebook)
            })
            
            });      
        }
        return () => {
          isMount = false;
        };
      }, [f,ebook_title]);


    return (
    <>
        {user_data.username !== "Guest login" ? <SessionNav Logout={handleLogout} User_image={`data:image/jpeg;base64,${user_data.image}`} /> : <Nav/>}
        {isOpenWatch && (
            <Notification
                message={`ทำการเพิ่ม ${ebook_title} เข้าคลังสมุดเรียบร้อย`}
                onOk={handleWatchListOK}
                color_button={'bg-blue-500'}
                color_hover_button={'bg-blue-600'}
            />
        )}

        {isOpenWarning && (
            <Notification
                message={`ไม่สามารถเพิ่มเข้าคลังหนังสือได้ เนื่องจากคุณได้เพิ่มหนังสือเล่มนี้เข้าไปก่อนหน้านี้แล้ว`}
                onOk={handleWatchListWarning}
                color_button={'bg-red-500'}
                color_hover_button={'bg-red-600'}
            />
        )}
        {/* ใส่เพื่อรีเซ็ต scroll mouse */}
        {select_basic_data.image !== "base64Image bra bra bra ant mai oak" &&(
            <div className="mx-auto p-4 bg-gradient-to-b from-slate-200 to-slate-400">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className='flex justify-center'>

                        <div className='border-2 border-slate-700'>
                            <img
                            src={`data:image/jpeg;base64,${select_basic_data.image}`}
                            alt="Book Cover"
                            className="h-96"
                            />
                        </div>
                    </div>
                
                    <div className="flex flex-col gap-2 mt-8">
                        <div>
                            <h1 className="flex text-2xl font-semibold text-black">{select_basic_data.EbookTitle}</h1>
                            <p className="text-black font-semibold mt-2">ผู้เขียน:  <span className='text-slate-500'>{select_basic_data.author_name}</span> </p>
                            <p className="text-black font-semibold mt-2">สำนักพิมพ์:  <span className='text-slate-500'>{select_basic_data.publisher_name}</span> </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-black font-semibold">เรทติ้ง:</span>
                                <span className="text-red-500 font-bold">{select_basic_data.rating}</span>
                            </div>
                            <p className="text-black font-semibold mt-2">ประเภทไฟล์: PDF</p>
                            <p className="text-black font-semibold mt-2">วันที่เผยแพร่:  <span className='text-slate-500'>
                                    {formatDate(select_basic_data.release_date)}
                                </span>
                            </p>
                        </div>

                        <div className="flex gap-4">

                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex gap-4">
                            <a href={`/read/${select_basic_data.EbookTitle}` } target='_blank'>
                                <button
                                className="text-center bg-green-500 text-white font-bold px-6 py-3 rounded-md anihover2"
                                >
                                    [<ReadOutlined />] อ่าน
                                </button>
                            </a>
                            <button
                              className="bg-black hover:bg-black text-white font-bold py-2 px-4 rounded-md anihover2"
                              onClick={() => handleWatchList(ebook_title)}
                            >
                                [<HeartOutlined />] เพิ่มในรายการโปรดของคุณ
                            </button>
                        </div>

                        </div>
                    </div>
                </div>

                <div className="bg-gray-200 p-8 rounded-lg mt-16 mb-4">
                    <div className="flex mb-4 gap-3">

                    {select_basic_data.genre_1d_array.map((element, i) => (
                        <div className="bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs">{element}</div>
                    ))}

                        {/* <button className="bg-slate-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs">Horror</button>

                        <button className="bg-slate-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs ml-2">Action</button>

                        <button className="bg-slate-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs ml-2">Fantasy</button>

                        <button className="bg-slate-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs ml-2">Manga</button>

                        <button className="bg-slate-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-xs ml-2">Yuri</button> */}

                    </div>
                    <h1 className='text-black font-bold'>[ รายละเอียด/เรื่องย่อ ]</h1>
                    <p className="text-gray-600 mt-2">
                        {select_basic_data.description}
                    </p>
                </div>

                

                <div className="flex-1 bg-white text-black p-8 rounded-lg">
                    <h1 className='text-2xl font-bold mb-4 mt-2 text-black'>[<CommentOutlined />] รีวิว</h1>
                    <Comments
                                user_data = {user_data}
                                ebook_title = {ebook_title}
                            />

                    <h2 className="text-2xl font-bold mb-4 mt-8 text-black"> [<BookOutlined />] หนังสือใหม่</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {array_basic_data.EbookTitle.map( (title, index) =>( (index < 6) ?
                            <div>
                                <div className="bg-gray-300 rounded-lg shadow-lg p-8 anihover">
                                    <div className="w-full h-72 object-cover mb-2 relative">
                                        <div className="absolute inset-x-0 -top-3">
                                            <div className="flex justify-center items-center">
                                                <p
                                                className="text-black text-center text-xs font-bold bg-green-400 p-1 rounded-2xl w-auto border-2 border-black"
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
                                        
                                        {/* เปลี่ยนมาใช้ a บังคับโหลดใหม่ทั้งหน้า */}
                                        <a href={`/detail/${array_basic_data.EbookTitle[array_basic_data.EbookTitle.length - 1 - index]}`}>
                                            <button
                                            className="text-center bg-green-500 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg mt-4 items-center"
                                            >
                                            <ReadOutlined />
                                            </button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            :
                            <div key={index}></div>
                        ))}
                    </div>
                </div>
            </div>
            
        )}
        <Footer/>
    </>

    );
};

export default DetailEbook;