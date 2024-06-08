import { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import axios, { spread } from "axios";

import {
    PushpinTwoTone,
    ReadOutlined, 
  } from '@ant-design/icons';

import { useNavigate } from "react-router-dom";

import deleteComment from "../../../api/other/deleteComment";
import createComment from "../../../api/other/createComment"
import fetchComment from "../../../api/fetch/fetchComment";




const titleColor = 'text-white dark:text-white';

const Comments = ({ user_data, ebook_title}) => {

    const [real_comment, setReal_comment] = useState({
        user_imagebase64_array:["user_image"],
        username_array:["username"],
        text_array:["hello world"],
        date_array:["1024-05-18T32:13:26.000Z"],
        comment_id_array:[0]
    });

    const [f, forceUpdate] = useState();

    

    function getCurrentDateTime() {
        const date = new Date();
      
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
      
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // add a new comment
    const addComment = (text) => {
        if (user_data.username === "Guest login"){
            navigate("/login")
        }
        else {
            const obj = {
                username:user_data.username,
                ebook_title:ebook_title,
                text:text,
                date:getCurrentDateTime()
            }
            createComment(obj)
                .then(result => {
                    forceUpdate(Math.random());
                })
        }
    };
    const handleDelete = async (comment_id) => {

        await deleteComment(comment_id)
        forceUpdate(Math.random());
    }

    const navigate = useNavigate()

    useEffect(() => {

        fetchComment(ebook_title)
            .then(data => {
                setReal_comment(data)
                console.log("อะไรเนี่ยทำไมผิดอันวะ",data)
            })
    }, [f]);

    return (
        <div className="mt-2"> 
        <CommentForm submitLabel="ส่งรีวิว" handleSubmit={addComment} />
        <div className="mt-10"> 
            {/* {backendComments.map((comment) => (
                <>
                    <Comment
                        key={comment.id}
                        comment={comment}
                        activeComment={activeComment}
                        setActiveComment={setActiveComment}
                        addComment={addComment}
                        deleteComment={deleteComment}
                        updateComment={updateComment}
                        currentUserId={currentUserId}
                    />
                    <p className="text-white">{real_comment.text_array}</p>
                </>
            ))} */}

            {/* พอเป็น Guest login ก็จะไม่เท่าไปเองโดยอัตโนมัติ*/}
            {real_comment.text_array.map((comment, index) => ( real_comment.username_array[real_comment.text_array.length - 1 - index] === user_data.username ?
                <div key={index}>
                    <Comment 
                        image={real_comment.user_imagebase64_array[real_comment.text_array.length - 1 - index]}
                        text={real_comment.text_array[real_comment.text_array.length - 1 - index]}
                        username={real_comment.username_array[real_comment.text_array.length - 1 - index]}
                        date={real_comment.date_array[real_comment.text_array.length - 1 - index]}
                        user_data={user_data}
                        handleDelete={() => handleDelete(real_comment.comment_id_array[real_comment.text_array.length - 1 - index])}
                        color={`text-green-500`}
                    />
                    {/* <p className="text-white">{real_comment.comment_id_array[index]}</p> */}
                </div>
                :
                <div key={index}></div>
            ))}
        
            {real_comment.text_array.map((comment, index) => ( real_comment.username_array[real_comment.text_array.length - 1 - index] !== user_data.username ?
                <div key={index}>
                    <Comment
                        image={real_comment.user_imagebase64_array[real_comment.text_array.length - 1 - index]}
                        text={real_comment.text_array[real_comment.text_array.length - 1 - index]}
                        username={real_comment.username_array[real_comment.text_array.length - 1 - index]}
                        date={real_comment.date_array[real_comment.text_array.length - 1 - index]}
                        user_data={user_data}
                        handleDelete={() => handleDelete(real_comment.comment_id_array[real_comment.text_array.length - 1 - index])}
                        color={`text-black`}
                    />
                    {/* <p className="text-white">{real_comment.comment_id_array[index]}</p> <PushpinTwoTone /> */}
                </div>
                :
                <div key={index}></div>
            ))}
        </div>
        </div>
    );
};

export default Comments;