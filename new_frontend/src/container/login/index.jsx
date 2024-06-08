import React, { useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {BiUser} from "react-icons/bi"
import {AiOutlineUnlock} from "react-icons/ai"
import axios from 'axios';

function Login() {
    // State to store input values
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    axios.defaults.withCredentials = true
    useEffect(() => {
        let isMount = true;
        if (isMount) {

        //ไม่ใช่ await แต่ใช้ then แทนเพราะมัน error กับ useEffect
        axios.get('http://localhost:8000/')
        .then(response => {
            console.log(response)
            if(response.data.username){
            navigate('/')
            }
            
        })
        }
        return () => {
        isMount = false;
        };
    }, []);

    // Function to handle form submission
    const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Email:', username);
    console.log('Password:', password);

    const obj_send_to_backend = {
        username: username,
        password: password
    }

    //นี่ก็เหมือนกันจะไม่เขียนแยกเพราะสุดท้ายก็มี logic ตรงนี้อยู่ดี
    const response = await axios.post("http://localhost:8000/api/user/login", obj_send_to_backend)

    //เช็ค if else จาก response backend
    console.log(response.data.message)

    if(response.data.message === "you are in"){

        console.log("ได้ session แล้ววววว แต่เป็น session ที่มาจาก method POST นะ "+ response.data.session)
        navigate('/')
    }
    else if (response.data.message === "dead wrong"){
        alert("รหัสผิด")
    }
    else if (response.data.message === "do not have this username") {
        alert("ไม่มี username นี้")
    }

    };

    return (
        <div className='text-white h-[100vh] flex justify-center items-center bg-cover' style={{"backgroundImage":"url('../public/bg1.png')"}}>
            <div>
                <div className="bg-slate-200 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative">
                    <h1 className="text-4xl text-white font-bold text-center mb-6">เข้าสู่ระบบ</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="relative my-4">
                            <input
                              id="username"
                              name="username"
                              type="text"
                              required
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="block w-72 py-2.5 px-0 text-lg text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-red-500 peer"
                              placeholder=""/>
                            <label htmlFor="" className="absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-red-500 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">ชื่อผู้ใช้</label>
                            <BiUser className="absolute top-4 right-4"/>
                        </div>
                            <div className="relative my-4">
                            <input
                              id="password"
                              name="password"
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="block w-72 py-2.5 px-0 text-lg text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-red-500 peer"
                              placeholder=""/>
                            <label htmlFor="" className="absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-red-500 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">รหัสผ่าน</label>
                            <AiOutlineUnlock className="absolute top-4 right-4"/>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <input type="checkbox" />
                                <label htmlFor="Remember Me">จำฉัน</label>
                            </div>
                            <Link to="" className="text-red-500">ลืมรหัสผ่าน</Link>
                        </div>
                        <button
                          type="submit"
                          className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-red-500 hover:bg-red-600 hover:text-white py-2 transition-colors duration-300">เข้าสู่ระบบ</button>
                        <div>
                            <span className="m-4">
                                ไม่เคยเป็นสมาชิก? <Link className="text-red-500" to="/register">สมัครสมาชิกตอนนี้ !!</Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      
    );
  }
  
  export default Login;