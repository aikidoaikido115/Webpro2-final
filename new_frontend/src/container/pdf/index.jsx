import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link} from 'react-router-dom';
// import { Document, Page } from 'react-pdf';

import fetchArrayBasicInfo from "../../../api/fetch/fetchArrayBasicInfo";
import fetchPdf from "../../../api/fetch/fetchPdf";

import AntButton from '../../components/ant_btn/index';

import Footer from "../../components/footer";

function Pdf() {

    //user data
    const [user_data, setUser_data] = useState({});

    const [url_default, setUrl_default] = useState("https://i.pinimg.com/564x/7e/77/03/7e7703a354fb19582c5ae29224206957.jpg")

    const [array_basic_data, setArray_basic_data] = useState({
        EbookTitle: ["ebook_title1"],
        image:["base64Image bra bra bra ant mai oak"],
        genre_2d_array:[["dasdsad"]],
        sum_view_array:[0],
        author_name_array:["name"]
    });

    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfData, setPdfData] = useState(null);

    const { ebook_title } = useParams();


    const [f, forceUpdate] = useState();

    const navigate = useNavigate();


    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };


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


        fetchPdf(ebook_title)
            .then(pdf => {
                setPdfData(pdf)
            })
        }
        return () => {
          isMount = false;
        };
      }, [f]);

    return (
        <>
            {/* <div className="flex justify-start w-screen h-screen">
                <div className="w-1/5 flex justify-center">
                    <AntButton
                    label="ย้อนกลับ" 
                    onClick={() => navigate(`/detail/${ebook_title}`)} 
                    type="default"
                    size="middle"
                    />
                </div>

                <div className="w-4/5">
                    <iframe src={pdfData} className="h-screen w-full" onLoadSuccess={onDocumentLoadSuccess}/>
                </div>
            </div> */}

            <iframe src={pdfData} className="h-screen w-full" onLoadSuccess={onDocumentLoadSuccess}/>
        </>
    );
}

export default Pdf;
