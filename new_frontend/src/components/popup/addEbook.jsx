import React, { useEffect, useState } from "react";

const PopupAddEbook = ({ onSubmit, genre }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [ebookName, setEbookName] = useState("");


    const [checkedValue, setCheckedValue] = useState([]);


    const [selectedRadioPremium, setSelectedRadioPremium] = useState("true");
    const [selectedRadioEnd, setSelectedRadioEnd] = useState("true")

    const [authorName, setAuthorName] = useState("");
    const [publisher, setPublisher] = useState("");
    const [plot, setPlot] = useState("");
    // const [plot, setPlot] = useState("");
    const [ebookImage, setEbookImage] = useState([]);
    // const [bigImage, setBigImage] = useState([]);

    const [rating, setRating] = useState(0);


    const [episodeNumber, setEpisodeNumber] = useState(0);

    const [ebookFile, setEbookFile] = useState([]);



    const [f, forceUpdate] = useState();

    

    const togglePopup = () => {
        setIsOpen(!isOpen);
        setEbookName("");
        setCheckedValue([])
        // setSelectedRadioPremium("true")
        // setSelectedRadioEnd("true")
        setAuthorName("")
        setPublisher("")
        setPlot("")
        // setPlot("")
        setEbookImage([])
        // setBigImage([])
        setRating(0)
        setEbookFile([])
        // setEpisodeName("")
    };

    const handleSubmit = (e) => {
        e.preventDefault();



        const array_of_genre = [...checkedValue]

       

        const mass_of_ebook_data = 
        {
            title:ebookName,
            genre:array_of_genre,
            // isPremium:premium_boolean,
            // isEnded:isEnded,
            author:authorName,
            publisher:publisher,
            plot:plot,
            ebookImage:ebookImage,
            // bigImage:bigImage,
            rating:rating,
            ebookFile:ebookFile,
            // episodeNameList:episodeNameList,
            // episodeNumberList:episodeNumberList
        }


        // console.log(formData)
        onSubmit(mass_of_ebook_data)
            .then(result =>{
                setEbookName("");
                setIsOpen(false); // Close the popup after successful submission
                setCheckedValue([]);
                // setSelectedRadioPremium("true")
                // setSelectedRadioEnd("true")
                setAuthorName("")
                setPlot("")
                setPublisher("")
                setEbookImage([])
                // setBigImage([])
                setRating(0)
                setEbookFile([])
                // setEpisodeName("")
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



    const handleChangeVideo = (event) => {
        const files = event.target.files;

        // Check if any files were selected
        if (!files.length) return;


        setEbookFile(files)
    }

      useEffect(() =>{
        console.log("re render")
    },[f])

    return (
        <div>
        <button
            onClick={togglePopup}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 anihover"
        >
            เพิ่ม e-Book
        </button>
        {isOpen && (
            <div className="fixed z-50 inset-0 flex items-center justify-center backdrop-filter backdrop-blur-lg">
            <div className="absolute inset-0 bg-black opacity-25"></div>
            <div className="z-50 relative bg-white p-8 rounded-lg shadow-lg">
            <button
            onClick={togglePopup} 
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
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="overflow-y-auto max-h-96 max-w-2xl w-[1250px]">
                <label>
                    <span className="text-base text-blue-500">ชื่อหนังสือ</span>
                    <input
                        className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                        type="text"
                        value={ebookName}
                        onChange={(e) => setEbookName(e.target.value)}
                        placeholder="book name"
                        required
                        />
                </label>
                <div>
                    <h1 className="text-base text-blue-500">เลือกแนว</h1>
                    {genre.EbookGenre.map((item) => (
                    <label key={item} className="flex items-center mb-1">
                        <input
                        type="checkbox"
                        value={item}
                        onChange={handelChange}
                        className="form-checkbox h-4 w-4 text-green-400"
                        />
                        <span className="ml-2 text-base text-gray-700">{item}</span>
                    </label>
                    ))}
                    {/* <h3>test {checkedValue}</h3> */}
                </div>
                

                <label>
                    <span className="text-base text-blue-500">ชื่อ/นามปากกาผู้เขียนหนังสือ</span>
                    <input
                        className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="author"
                        required
                        />
                </label>
                <label>
                    <span className="text-base text-blue-500">สำนักพิมพ์</span>
                    <input
                        className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                        type="text"
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                        placeholder="Ex.ศุนย์หนังสือจุฬา"
                        required
                        />
                </label> 
                <label>
                    <span className="text-base text-blue-500">รายละเอียดหนังสือ/เรื่องย่อ</span>
                    <textarea
                    className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                    value={plot}
                    onChange={(e) => setPlot(e.target.value)}
                    required
                    placeholder="Ex.หนังสือเล่มนี้รวบรวมนิทานอีสปมากกว่า 10 เรื่อง"
                    />
                </label>
                <label className="flex flex-col mb-5 gap-1">
                    <span className="text-base text-blue-500">อัปโหลดรูปปกหนังสือ</span>
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleChangeImage}
                    required
                    />
                </label>
                <label>
                    <span className="text-base text-blue-500">เรทติ้ง</span>
                    <input
                        className="w-full text-black border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:border-blue-500"
                        type="number"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        placeholder="input only decimal"
                        required
                        />
                </label>

                <label className="flex flex-col gap-1">
                    <div className="flex flex-col mb-5 gap-1">
                        <span className="text-base text-blue-500">อัปโหลดไฟล์หนังสือ</span>
                        <div className="flex flex-col items-start gap-4">
                            <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleChangeVideo}
                            multiple
                            required
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
                        เพิ่ม
                    </button>
                    
                </div>
                </form>
            </div>
            </div>
        )}
        </div>
    );
    };

export default PopupAddEbook;
