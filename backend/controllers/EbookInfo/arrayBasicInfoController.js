const pool = require('../../models/database');
const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');



module.exports = async (req, res) =>{
    try {

        let get_image_and_title = `SELECT DISTINCT title, ebook_image FROM ebook`
        const image_and_title = await pool.query(get_image_and_title)

        //โซนเต็มจอ
        let get_big_info = `SELECT DISTINCT ebook_image, title, description, average_rating FROM ebook WHERE ebook_image IS NOT NULL AND title = ?`

        let get_big_first_ebook_id = `SELECT ebook_id FROM ebook WHERE ebook_image IS NOT NULL AND title = ? LIMIT 1`
        let get_big_genre = `SELECT genre_name FROM genre WHERE genre_id IN (
            SELECT genre_id FROM ebook_genre WHERE ebook_id = ?
        )`
        //สิ้นสุดโซนเต็มจอ


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
        // let big_genre_1d_array = []

        const randomIndex = crypto.randomInt(0, image_and_title[0].length); // Generate a random index within the range
        const randomTitle = image_and_title[0][randomIndex]; // Get the title at the random index

        //แทนที่ฟังก์ชั่นสุ่มธรรมดาด้วย AI
        let username = req.session.user
        if (username === undefined){
            username = "Guest login"
        }

        let big_title = randomTitle.title

        let big_info = await pool.execute(get_big_info, [big_title])
        // let big_info = await pool.execute(get_big_info, ["Date A Live ss1"])
        let bigImageBase64 = Buffer.from(big_info[0][0].ebook_image).toString('base64')

        const big_first_ebook_id = await pool.execute(get_big_first_ebook_id, [big_title])
        const big_genre = await pool.execute(get_big_genre, [big_first_ebook_id[0][0].ebook_id])
        let big_genre_1d_array = big_genre[0].map(element => element.genre_name)
        // big_genre_1d_array.push(big_genre[0].map(element => element.genre_name))


        for (let i = 0; i < image_and_title[0].length; i++){
            title_array.push(image_and_title[0][i].title)
            const first_ebook_id = await pool.execute(get_first_ebook_id, [image_and_title[0][i].title])
            // console.log(first_ebook_id[0][0].ebook_id)
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
            publisher_name_array:publisher_name_array,
            big_image:bigImageBase64,
            big_title:big_info[0][0].title,
            big_genre_1d_array:big_genre_1d_array,
            big_description:big_info[0][0].description,
            big_rating:big_info[0][0].average_rating
        }

        console.log("Misha คั่นหน้า array basic_info")
        // console.log(responseData)

        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}