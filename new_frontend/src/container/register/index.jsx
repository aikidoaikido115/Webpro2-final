import React, { useState, useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BiUser } from "react-icons/bi"
import { AiOutlineUnlock, AiOutlineMail } from "react-icons/ai"
import axios from 'axios';

const Register = () => {
    
    
    // State to store input values
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    axios.defaults.withCredentials = true
    useEffect(() => {
    let isMount = true;
    if (isMount) {


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
        // Handle registration logic here
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);

        const obj_send_to_backend = {
        username: username,
        email: email,
        password: password
    }


    try{
        const response = await axios.post("http://localhost:8000/api/user/register", obj_send_to_backend)
        
        if (response.data === "User Already exists"){
          alert("username ซ้ำกรุณากรอกใหม่")
        }
        else{
          navigate('/')
        }
      }
      catch (err) {
        console.error("Error: ", err)
      }
      
    };

    return (
        <div className='text-white h-[100vh] flex justify-center items-center bg-cover' style={{"backgroundImage":"url('../public/bg1.png')"}}>
            <div>
                <div className="bg-slate-200 border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative">
                    <h1 className="text-4xl text-white font-bold text-center mb-6">สมัครสมาชิก</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="relative my-4">
                            <input
                            id="username"
                            name="username"
                            type="text"
                            className="block w-72 py-2.5 px-0 text-lg text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-red-500 peer"
                            placeholder=""
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            />
                            <label htmlFor="username" className="absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-red-500 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">ชื่อผู้ใช้</label>
                            <BiUser className="absolute top-4 right-4"/>
                        </div>

                        <div className="relative my-4">
                            <input
                            id="email"
                            name="email"
                            type="email"
                            className="block w-72 py-2.5 px-0 text-lg text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-red-500 peer"
                            placeholder=""
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                            
                            <label htmlFor="email" className="absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-red-500 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">อีเมล</label>
                            <AiOutlineMail className="absolute top-4 right-4"/>
                        </div>

                        <div className="relative my-4">
                            <input
                            id="password"
                            name="password"
                            type="password"
                            className="block w-72 py-2.5 px-0 text-lg text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-red-500 peer"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=""
                            />
                            <label htmlFor="password" className="absolute text-base text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-red-500 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">รหัสผ่าน</label>
                            <AiOutlineUnlock className="absolute top-4 right-4"/>
                        </div>
                        <button
                        type="submit"
                        className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white py-2 transition-colors duration-300"
                        >
                            สร้างบัญชี
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;