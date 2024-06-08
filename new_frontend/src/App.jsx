import { useEffect, useState } from "react";



import Home from './container/home/index.jsx'
import Login from './container/login/index.jsx'
import Register from './container/register/index.jsx'
import Admin from './container/admin/index.jsx'
import ReadEbook from "./container/pdf/index.jsx";
import SearchResult from "./container/search-result/index.jsx";
import Library from "./container/library/index.jsx";
import Category from "./container/category/index.jsx";
import UserProfile from "./container/user-profile/index.jsx";
import DetailEbook from "./container/detail_book/index.jsx";
// import Test from "./container/detail_book/test.jsx";


import {createBrowserRouter,
  RouterProvider,
  Route,
  Navigate
} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path: '/search_result',
    element: <SearchResult/>
  },
  {
    path: '/library',
    element: <Library/>
  },
  {
    path: '/category',
    element: <Category/>
  },
  {
    path:'/detail/:ebook_title', 
    element: <DetailEbook/>
  },
  {
    path:'/user_profile', 
    element: <UserProfile/>
  },
  {
    path: '/read/:ebook_title',
    element: <ReadEbook/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path:'/admin',
    element:<Admin/>
  }

])

function App() {


  return (
    <RouterProvider router={router} />
  );
}

export default App;
