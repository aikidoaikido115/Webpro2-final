import React, { useState, useEffect } from 'react';
import Circle from '../../components/profile_fit_circle';

import axios from "axios";
import { useNavigate } from "react-router-dom";

// import default_logo from "../../../public/animeHub V2.png";
// import premium_logo from "../../../public/animeHub_premium.png";
import logout from "../../../api/other/logout";
// import fetchPremiumStatus from "../../../api/fetch/fetchPremiumStatus";
import Nav from "../../components/navbar";
import SessionNav from "../../components/navbar/NavbarSession";
import Footer from "../../components/footer";
import updateUserProfile from '../../../api/other/updateUserProfile';
import Notification from "../../components/popup/Notification";

const UserProfile = () => {
    const [userInput, setUserInput] = useState({
    image: [],
    email: '',
    password: '',
    confirm_password: ''
    });

    const [tempUser_data, setTempUser_data] = useState({})

    const [user_data, setUser_data] = useState({});

    const [isOpen, setIsOpen] = useState(false);

    const [email, setEmail] = useState({})

    const [save, setSave] = useState(false)


    const [logo, setLogo] = useState(false)

    const [f, forceUpdate] = useState();

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleOk = () => {
        setIsOpen(false);
        setSave(false)


      };

    const handleLogout = () => {

    logout()
    forceUpdate(Math.random());


    }

    const handleChange = (e) => {
    if (e.target.name === 'image') {
        const file = e.target.files[0];
        console.log("ดู",file)
        console.log(e.target.files)
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            // preview
            const base64Image = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');
            setUserInput({
                ...userInput,
                image: e.target.files, 
            });
            setTempUser_data({
                ...user_data,
                image:base64Image
            })
        };
        reader.onerror = (error) => {
            console.error('Error occurred while reading the file:', error);
          };
    } else {
        setUserInput({
        ...userInput,
        [e.target.name]: e.target.value,
        });
    }


    };

    const handleSubmit = async(e) => {
    e.preventDefault();

    if (userInput.password !== userInput.confirm_password) {
        setIsOpen(true)
    }
    else{
        await updateUserProfile(userInput)
        setUserInput({
            image: '',
            email: '',
            password: '',
            confirm_password: ''
        })
        forceUpdate(Math.random());
        setSave(true)
    }
    
    };

    const handleCancel = () => {
        setUserInput({
            image: '',
            email: '',
            password: '',
            confirm_password: ''
        })
        setTempUser_data({})
        navigate("/")
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
                  setTempUser_data(user_specific_info.data)


                  axios.get(`http://localhost:8000/api/email/?username=${response.data.username}`)
                    .then(info => {
                        console.log("Dsadsadsad",info.data)
                        setEmail(info.data)
                    })

                  fetchPremiumStatus("just give me only user status")
                    .then(status_obj => {
                        if (status_obj.user_premium_status === true) {
                            setLogo(true)
                            console.log(logo,"เป็นค่าไร")
                        }
                    })
                })
              
            } else {
              setUser_data({ username: "Guest login" });
              setLogo(false)
              console.log(logo,"เป็นค่าไร")
              navigate("/")
            }
          });


        }

        return () => {
          isMount = false;
        };
      }, [f]);

    return (
    <>
        {isOpen && (
            <Notification
                message={`The password and confirm password must match.`}
                onOk={handleOk}
                color_button={'bg-red-500'}
                color_hover_button={'bg-red-600'}
            />
        )}
        {save && (
            <Notification
                message={`Update successfully.`}
                onOk={handleOk}
                color_button={'bg-blue-500'}
                color_hover_button={'bg-blue-600'}
            />
        )}
        <div className="h-auto">
            <div className="h-auto bg-gradient-to-b from-slate-200 to-slate-400">
            {user_data.username !== "Guest login" ? <SessionNav Logout={handleLogout} User_image={`data:image/jpeg;base64,${user_data.image}`} /> : <Nav/>}
                <div className='bg-gradient-to-b from-slate-200 to-slate-400 h-screen flex items-center justify-center'>
                    <div className="w-1/4 p-6 bg-slate-200 rounded-lg shadow-md">
                    <h2
                        className="text-5xl font-bold mb-6 text-center text-slate-700"
                    >
                        {user_data.username}
                    </h2>
                    
                        <Circle src={`data:image/jpeg;base64,${tempUser_data.image}`}/>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4 text-slate-700">
                                <label htmlFor="image" className="block text-slate-700 font-bold mb-2">
                                    <p>Avatar</p>
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor="image"
                                    className="cursor-pointer w-full px-3 py-2 border border-slate-700 rounded-md"
                                >
                                    {/* ตรงนี้แก้เป็น preview รูปในกรอบวงกลม ก่อนจากนั้นค่อยกดเซฟถึงลง sql */}
                                    Choose an image
                                </label>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-slate-700 font-bold mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Email"
                                    defaultValue={email.email}
                                    // value={userInput.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-slate-700 font-bold mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Password"
                                    value={userInput.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-slate-700 font-bold mb-2">
                                Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirm_password"
                                    name="confirm_password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Password"
                                    value={userInput.confirm_password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                  type="submit"
                                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
                                >
                                Save
                                </button>
                                <button
                                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
                                  onClick={handleCancel}
                                >
                                cancel
                                </button>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
    };

export default UserProfile;