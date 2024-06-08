const pool = require('../../models/database');
const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');

const get_user_id_by_username = async (username) => {
    let get_user_id = `SELECT user_id FROM user WHERE username = ?`
    let user_id = await pool.execute(get_user_id, [username])
    user_id = user_id[0][0].user_id
    return user_id
}

module.exports = async (req, res) =>{
    try {

        // await pool.query('SET NAMES utf8mb4');
        // console.log("set utf8 ละ")

        // await pool.query('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');

        let username = req.session.user
        

        if (username === undefined) {
            const responseData = {
                EbookTitle: ["bra bra bra title"],
                image: ["asdasd"],
                genre_2d_array:[["asdsadsad"]],
                sum_view_array:[0],
                author_name_array:["name"],
                publisher_name_array:["name"]
            }
            console.log("Misha คั่นหน้า array watch list basic_info")
    
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.json(responseData)
        }
        else {
            const user_id = await get_user_id_by_username(username)
            console.log(username, user_id)
            
            let get_image_and_title = `SELECT DISTINCT title, ebook_image FROM ebook WHERE ebook_id IN (
                SELECT ebook_id FROM read_list WHERE user_id = ?
            )`
            // await pool.query('SET NAMES utf8mb4');
            const image_and_title = await pool.execute(get_image_and_title,[user_id])
            console.log("คั่น1-------------------------------------")
            console.log("Retrieved titles:", image_and_title);
            console.log("คั่น2-------------------------------------")
            // console.log("Retrieved titles:", JSON.stringify(image_and_title));
    
            let get_first_ebook_id = `SELECT ebook_id FROM ebook WHERE title = ? LIMIT 1`
            let get_genre = `SELECT genre_name FROM genre WHERE genre_id IN (
                SELECT genre_id FROM ebook_genre WHERE ebook_id = ?
            )`
    
            let get_sum_view = `SELECT sum_view FROM ebook WHERE title = ? LIMIT 1`
            
            let get_author_id = `SELECT author_id FROM ebook WHERE title = ? LIMIT 1`

            let get_publisher_id = `SELECT publisher_id FROM ebook WHERE title = ? LIMIT 1`

            let get_author = `SELECT author_name FROM author WHERE author_id = ? LIMIT 1`
            let get_publisher = `SELECT publisher_name FROM publisher WHERE publisher_id = ? LIMIT 1`
    
            
    
    
            console.log("ตรงนี้")
            console.log(image_and_title)
    
            let title_array = []
            let imageBase64_array = []
            let genre_2d_array = [] //array 2 มิติ
            let sum_view_array = []
            let author_name_array = []
            let publisher_name_array = []
    
    
    
            for (let i = 0; i < image_and_title[0].length; i++){
                title_array.push(image_and_title[0][i].title)
                const first_ebook_id = await pool.execute(get_first_ebook_id, [image_and_title[0][i].title])
                // console.log(first_anime_id[0][0].anime_id)
                const genre = await pool.execute(get_genre, [first_ebook_id[0][0].ebook_id])
                genre_2d_array.push(genre[0].map(element => element.genre_name))
    
                const sum_view = await pool.execute(get_sum_view, [image_and_title[0][i].title])
                sum_view_array.push(sum_view[0][0].sum_view)
    
                let imageData = image_and_title[0][i].ebook_image
                imageBase64_array.push(Buffer.from(imageData).toString('base64'))
                
                const author_id = await pool.execute(get_author_id, [image_and_title[0][i].title])
                const publisher_id = await pool.execute(get_publisher_id, [image_and_title[0][i].title])

                let author_name = await pool.execute(get_author, [author_id[0][0].author_id])
                author_name_array.push(author_name[0][0].author_name)
    
                let publisher_name = await pool.execute(get_publisher, [publisher_id[0][0].publisher_id])
                publisher_name_array.push(publisher_name[0][0].publisher_name)
                
    
            }
            console.log("ออก loop แล้ว")
            console.log(genre_2d_array)
    
            // console.log(title_array)
            // console.log(imageBase64_array)
    
            const responseData = {
                EbookTitle: title_array,
                image: imageBase64_array,
                genre_2d_array:genre_2d_array,
                sum_view_array:sum_view_array,
                author_name_array:author_name_array,
                publisher_name_array:publisher_name_array
            }
    
            console.log("Misha คั่นหน้า array watch list basic_info")
            // console.log(responseData)
            console.log(title_array)
    
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.json(responseData)
        }

        
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}