import React, { useEffect, useState } from "react";
import fetchOtherData from "../../../api/fetch/fetchOtherData";



const PopupUpdateEbook = ({ onSubmit, genre, title}) => {

    const [progress_bar, setProgress_bar] = useState(
        {
            percentage:0
        })

    const [other_data, setOther_data] = useState({
        author_name:"test",
        publisher:"test",
        plot:"test",
        rating: 3.14,
        genre_data:"test"
    })


    const [isOpen, setIsOpen] = useState(false);
    const [ebookName, setEbookName] = useState("");

    const [checkedValue, setCheckedValue] = useState([]);


    const [authorName, setAuthorName] = useState("");
    const [publisher, setPublisher] = useState("");
    const [plot, setPlot] = useState("");
    const [ebookImage, setEbookImage] = useState([]);

    const [rating, setRating] = useState(1.1);


    const [ebookFile, setEbookFile] = useState([]);


    const [f, forceUpdate] = useState()

    const togglePopup = () => {
        setIsOpen(!isOpen);
        setEbookName("");
        setCheckedValue([])
        setAuthorName("")
        setPublisher("")
        setPlot("")
        setEbookImage([])
        setRating(1.1)
        setEbookFile([])

        forceUpdate(Math.random());
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const array_of_genre = [...checkedValue]

        const mass_of_ebook_data = 
        {
            title:ebookName,
            genre:array_of_genre,
            author:authorName,
            publisher:publisher,
            plot:plot,
            ebookImage:ebookImage,
            rating:rating,
            ebookFile:ebookFile,
            old_title:title,
            old_genre:other_data.genre_data
        }


        // console.log(formData)
        onSubmit(mass_of_ebook_data)
            .then(result =>{
                setEbookName("");
                setIsOpen(false);
                setCheckedValue([]); 
                setAuthorName("")
                setPublisher("")
                setPlot("")
                setEbookImage([])
                setRating(1.1)
                setEbookFile([]) //
                forceUpdate(Math.random());
                console.log("อซิงโคนัสสำเร็จ ", result)
                // console.log("อ่าว รันได้แต่ ไม่รีอะ งง")
            })


    };
    const handelChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
        setCheckedValue((pre) => [...pre, value]);
        }
        if (!checked) {
        setCheckedValue((pre) => [...pre.filter((item) => item != value)]);
        }
    };
    const handleChangeImage = (event) =>{
        const files = event.target.files

        if (!files.length) return;

        setEbookImage(files);

      }

    const handleChangeFile = (event) => {
        const files = event.target.files;

        // Check if any files were selected
        if (!files.length) return;


        setEbookFile(files)
    }

      useEffect(() =>{
        //เดี๋ยวมาทำ version ของเว็บโปร

        fetchOtherData(title)
            .then(other => {
                setOther_data(other)
                console.log("นี่คือ other")
                console.log(other)
                console.log("นี่คือ other_data")
                console.log(other_data)
                setEbookName(title)
                setCheckedValue(other_data.genre_data)
                setAuthorName(other_data.author_name)
                setPublisher(other_data.publisher)
                setPlot(other_data.plot)
                setRating(other_data.rating)
            })
    },[f,title])

    return (
        <div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 anihover"
        onClick={togglePopup}
        >แก้ไข
        </button>
        {isOpen && (
            <div className="fixed z-50 inset-0 flex items-center justify-center backdrop-filter backdrop-blur-lg">
            <div className="absolute inset-0 bg-black opacity-25"></div>
            <div className="z-50 relative bg-white p-8 rounded-lg shadow-lg">
            <button
            onClick={togglePopup} // Add click handler to toggle popup
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                >
                <path
                    fillRule="evenodd"
                    d="M13.414 10l3.293 3.293a1 1 0 01-1.414 1.414L12 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414L12 8.586l3.293-3.293a1 1 0 111.414 1.414L13.414 10z"
                    clipRule="evenodd"
                />
                </svg>
            </button>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="overflow-y-auto max-h-96 overflow-x-hidden max-w-2xl w-[1250px]">
                    <div className="">
                        <h1 className="text-3xl text-center mb-10 truncate">Update <span className="text-amber-500">{title}</span></h1>
                    </div>
                <label>
                    <span className="text-base text-blue-500">แก้ไขชื่อเรื่อง</span>
                    <input
                        className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                        type="text"
                        defaultValue={title}
                        onChange={(e) => setEbookName(e.target.value)}
                        />
                </label>
                <div>
                    <h1 className="text-base text-blue-500">แก้ไขแนว</h1>
                    {genre.EbookGenre.map((item) => (
                    <label key={item} className="flex items-center mb-1">
                        <input
                        type="checkbox"
                        value={item}
                        defaultChecked={other_data.genre_data.some((element) => element === item)}
                        // checked={other_data.genre_data.some((element) => element === item)}
                        onChange={handelChange}
                        className="form-checkbox h-4 w-4 text-green-400"
                        />
                        <span className="ml-2 text-base text-gray-700">{item}</span>
                    </label>
                    ))}
                    {/* <h3>test {checkedValue}</h3> */}
                </div>
                {/* <p>Selected option: {selectedRadioPremium}</p> */}
                <label>
                    <span className="text-base text-blue-500">แก้ไขชื่อ ผู้เขียน</span>
                    <input
                        className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                        type="text"
                        defaultValue={other_data.author_name}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="author"
                        />
                </label>
                <label>
                    <span className="text-base text-blue-500">แก้ไขสำนักพิมพ์</span>
                    <input
                        className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                        type="text"
                        defaultValue={other_data.publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                        placeholder="ชื่อสำนักพิมพ์"
                        />
                </label> 
                <label>
                    <span className="text-base text-blue-500">แก้ไข รายละเอียดหนังสือ/เรื่องย่อ</span>
                    <textarea
                    className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                    defaultValue={other_data.plot}
                    onChange={(e) => setPlot(e.target.value)}
                    placeholder="Ex.หนังสือเล่มนี้รวบรวมนิทานอีสปมากกว่า 10 เรื่อง"
                    />
                </label>
                <label className="flex flex-col mb-5 gap-1">
                    <span className="text-base text-blue-500">แก้ไขรูปปกหนังสือ<span className="text-red-500">(ใส่หรือไม่ก็ได้ ถ้าไม่ใส่ระบบจะใช้รูปเดิม)</span></span>
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleChangeImage}
                    />
                </label>
                <label>
                    <span className="text-base text-blue-500">แก้ไขเรทติ้ง</span>
                    <input
                        className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                        type="number"
                        step="0.1"
                        defaultValue={other_data.rating}
                        onChange={(e) => setRating(e.target.value)}
                        placeholder="input only decimal"
                        required
                        />
                </label>

                <label className="flex flex-col gap-1">
                    <div className="flex flex-col mb-5 gap-1">
                        <span className="text-base text-blue-500">แก้ไขไฟล์หนังสือ <span className="text-red-500">(ใส่หรือไม่ก็ได้ ถ้าไม่ใส่ระบบจะใช้ไฟล์เดิม)</span></span>
                        <div className="flex flex-col items-start gap-4">
                            <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleChangeFile}
                            multiple
                            />
                            {/* <button
                            type="button"
                            onClick={handleAddVideoInput}
                            className="ml-0 bg-green-500 text-white font-semibold py-1 px-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                            เพิ่มตอนอีก
                            </button> */}
                        </div>
                    </div>
                </label>
                <div id="progress-bar" className="hidden">
                    <progress value="0" max="100"></progress>
                    <span id="progress-text">0%</span>
                </div>

                <div id="progressPercent" className="text-base text-green-600 mb-7"></div>


                <div className="flex justify-between">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline anihover"
                        onClick={togglePopup}
                    >
                        ยกเลิก
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline anihover mr-4"
                        type="submit"
                    >
                        อัพเดต
                    </button>
                    
                </div>
                </form>
            </div>
            </div>
        )}
        </div>
    );
    };

export default PopupUpdateEbook;
