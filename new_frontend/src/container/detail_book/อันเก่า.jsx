import React from 'react'
import { useState, useEffect} from 'react';
import { useParams, useNavigate, Link} from 'react-router-dom';

import logout from "../../../api/other/logout";
import axios from "axios";
import Nav from "../../components/navbar";
import SessionNav from "../../components/navbar/NavbarSession";
import fetchUserInfo from "../../../api/fetch/fetchUserInfo"
import fetchSelectBasicInfo from '../../../api/fetch/fetchSelectBasicInfo';

function DetailEbook() {


    const [user_data, setUser_data] = useState({})

    // const [array_basic_data, setArray_basic_data] = useState({
    //     EbookTitle: ["ebook_title1"],
    //     image:["base64Image bra bra bra ant mai oak"],
    //     genre_2d_array:[["dasdsad"]],
    //     sum_view_array:[0],
    //     author_name_array:["name"],
    //     publisher_name_array:["name"],
    //     big_image:"base64",
    //     big_title:" ",
    //     big_genre_1d_array:[" "],
    //     big_description:" ",
    //     big_rating:0
    // });

    //คือดึงมาแค่เล่มเดียวจากเดิมที่เป็น array
    const [select_basic_data, setSelect_basic_data] = useState({
        EbookTitle: "ebook_title1",
        image:"base64Image bra bra bra ant mai oak",
        genre_1d_array:["dasdsad"],
        sum_view:0,
        author_name:"name",
        publisher_name:"name",
    });

    const { ebook_title } = useParams();

    

    const [f, forceUpdate] = useState();

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;


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
            // fetchArrayBasicInfo()
            // .then(ebook =>{
            //     console.log(ebook)
            //     console.log("wtf")
            //     setArray_basic_data(ebook)
            // })
            //เปลี่ยนเป็น fetch มาแค่เล่มเดียวไม่เอา array

            //แทนด้วย
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
      }, [f]);


    return (
    <>
        {user_data.username !== "Guest login" ? <SessionNav Logout={handleLogout} User_image={`data:image/jpeg;base64,${user_data.image}`} /> : <Nav/>}
        <img
            src={`data:image/jpeg;base64,${select_basic_data.image}`}
            alt="Book"
            className="h-full object-cover mb-2 border-2 border-black"
        />
        <button
          className='bg-gray-300 mt-10'
          onClick={() => handle_navigate_to_read(select_basic_data.EbookTitle)}
        >
            read book
        </button>
    </>
    )
    }

export default DetailEbook
