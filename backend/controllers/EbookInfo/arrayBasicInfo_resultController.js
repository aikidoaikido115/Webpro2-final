//ชื่อไฟล์ปนกันแปลกๆ ทำเพราะให้อ่านง่ายเฉยๆ

const pool = require('../../models/database');
// const crypto = require('crypto');
const fs = require('fs');
// const axios = require('axios');

module.exports = async (req, res) =>{
    try {

        let title = req.query.q

        title = `%${title}%`


        let get_image_and_title = `SELECT DISTINCT title, ebook_image FROM ebook WHERE title LIKE ?`
        const image_and_title = await pool.execute(get_image_and_title, [title])


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

        // const imageData = data[0][0].anime_image
        // const imageBase64 = Buffer.from(imageData).toString('base64');

        let title_array = []
        let imageBase64_array = []
        let genre_2d_array = [] //array 2 มิติ
        let sum_view_array = []
        let author_name_array = []
        let publisher_name_array = []

  

        console.log("ก่อนเข้า loop")
        for (let i = 0; i < image_and_title[0].length; i++){
            title_array.push(image_and_title[0][i].title)
            // console.log("ผิดปกติไหม",title_array)
            const first_ebook_id = await pool.execute(get_first_ebook_id, [image_and_title[0][i].title])
            // console.log(first_anime_id[0][0].anime_id)
            const genre = await pool.execute(get_genre, [first_ebook_id[0][0].ebook_id])
            genre_2d_array.push(genre[0].map(element => element.genre_name))

            const sum_view = await pool.execute(get_sum_view, [image_and_title[0][i].title])
            sum_view_array.push(sum_view[0][0].sum_view)

            const author_id = await pool.execute(get_author_id, [image_and_title[0][i].title])
            const publisher_id = await pool.execute(get_publisher_id, [image_and_title[0][i].title])
            

            let author_name = await pool.execute(get_author, [author_id[0][0].author_id])
            author_name_array.push(author_name[0][0].author_name)

            let publisher_name = await pool.execute(get_publisher, [publisher_id[0][0].publisher_id])
            publisher_name_array.push(publisher_name[0][0].publisher_name)

            let imageData = image_and_title[0][i].ebook_image
            imageBase64_array.push(Buffer.from(imageData).toString('base64'))

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

            // big_image:bigImageBase64,
            // big_title:big_info[0][0].title,
            // big_genre_1d_array:big_genre_1d_array,
            // big_description:big_info[0][0].description,
            // big_rating:big_info[0][0].average_rating,
            // big_premium_status:big_info[0][0].premium_status
        }

        console.log("Misha คั่นหน้า search_result")
        // console.log(responseData)

        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}