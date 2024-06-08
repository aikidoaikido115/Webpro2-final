const pool = require('../../models/database');
const crypto = require('crypto');
const fs = require('fs');
// const axios = require('axios');


//เหมือนกันกับ imageDescriptionController แต่ได้ข้อมูลทั้ง sql

//เป็น controller ที่ส่งข้อมูลไปให้ AI API predict อีกที

module.exports = async (req, res) =>{

    
    try {

        let title = req.query.title

        console.log("title มาไหม",title)

        let get_info = `SELECT DISTINCT ebook_image, title, description, average_rating, publisher_id, author_id, sum_view, release_date FROM ebook WHERE ebook_image IS NOT NULL AND title = ?`

        let get_first_ebook_id = `SELECT ebook_id FROM ebook WHERE ebook_image IS NOT NULL AND title = ? LIMIT 1`
        let get_genre = `SELECT genre_name FROM genre WHERE genre_id IN (
            SELECT genre_id FROM ebook_genre WHERE ebook_id = ?
        )`

        let get_author_name = `SELECT author_name FROM author WHERE author_id = ? LIMIT 1`

        let get_publisher_name = `SELECT publisher_name FROM publisher WHERE publisher_id = ? LIMIT 1`


        console.log("ตรงนี้")
        // console.log(image_and_title)

        // const randomIndex = crypto.randomInt(0, image_and_title[0].length);
        // const randomTitle = image_and_title[0][randomIndex];

        //แทนที่ฟังก์ชั่นสุ่มธรรมดาด้วย AI
        let username = req.session.user
        if (username === undefined){
            username = "Guest login"
        }

        // let big_title = randomTitle.title

        let info = await pool.execute(get_info, [title])
        console.log(info)
        // let info = await pool.execute(get_info, ["Date A Live ss1"])
        let ImageBase64 = Buffer.from(info[0][0].ebook_image).toString('base64')
        // console.log('ผ่าน1')
        const first_ebook_id = await pool.execute(get_first_ebook_id, [title])
        // console.log('ผ่าน2')
        const genre = await pool.execute(get_genre, [first_ebook_id[0][0].ebook_id])
        // console.log('ผ่าน3')
        let genre_1d_array = genre[0].map(element => element.genre_name)
        // genre_1d_array.push(genre[0].map(element => element.genre_name))

        let sum_view = info[0][0].sum_view
        // console.log('ก่อน error')
        let author_name = await pool.execute(get_author_name, [info[0][0].author_id])
        // console.log('ผ่าน4')
        author_name = author_name[0][0].author_name

        let publisher_name = await pool.execute(get_publisher_name, [info[0][0].publisher_id])
        publisher_name = publisher_name[0][0].publisher_name

        let rating = info[0][0].average_rating

        let description = info[0][0].description

        let release_date = info[0][0].release_date

        // console.log(title_array)
        // console.log(imageBase64_array)

        const responseData = {
            EbookTitle: title,
            image: ImageBase64,
            genre_1d_array:genre_1d_array,
            sum_view:sum_view,
            author_name:author_name,
            publisher_name:publisher_name,
            rating:rating,
            description:description,
            release_date:release_date
        }

        console.log("Misha คั่นหน้า select basic_info")
        // console.log(responseData)

        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}