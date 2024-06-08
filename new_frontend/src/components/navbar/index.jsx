import React, {useState} from "react";
import logo from "../../../public/ACEDlogo.png";

import { Button} from 'antd';

import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");


  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Search value:", searchValue);
    navigate(`/search_result?q=${searchValue}`)
  };

  return (
    <nav className="bg-slate-700 p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center">
      <a href="/" className="flex items-center anihover">
          <img src={logo} alt="Logo" className="ml-4 cursor-pointer w-16" />
        </a>
        <ul className="ml-10 flex space-x-6 text-white">
          <li className="flex items-center mr-4 cursor-pointer anihover">
            <a href="/category/?sort=newest&category=all&status=all" className="flex items-center ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                stroke="currentColor" className="w-8 h-8 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"/>
              </svg>
              หมวดหมู่
            </a>
          </li>
          <Link to={"/library"}>
            <li className="flex items-center mr-4 cursor-pointer anihover">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                    stroke="currentColor" className="w-8 h-8 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                คลังหนังสือ
            </li>
          </Link>
        </ul>
      </div>
      <div className="flex items-center">
        
      <form onSubmit={handleSubmit} className="flex items-center mr-6 ">
          <div className="relative">
          <input
              type="text"
              value={searchValue}
              onChange={handleInputChange}
              placeholder="ค้นหาหนังสือ. . ."
              className="pl-5 px-12 py-3 rounded-lg border border-white text-black hover:ring-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 px-4 py-1 border border-white bg-red-700 rounded-lg text-white font-semibold anihover"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
              </svg>
            </button>
          </div>
        </form>

        <Link to={"/login"}>
            <button className="flex items-center mr-4 bg-red-600 px-4 py-2 rounded-lg text-white font-semibold anihover">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                stroke="currentColor" className="w-8 h-8 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            เข้าสู่ระบบ
            </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;