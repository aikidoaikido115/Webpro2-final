//ชื่อไฟล์ปนกันแปลกๆ ทำเพราะให้อ่านง่ายเฉยๆ

const pool = require('../../models/database');
// const crypto = require('crypto');
const fs = require('fs');
// const axios = require('axios');

module.exports = async (req, res) =>{
    try {

        let {sort, category, status} = req.query
        // console.log(sort, category, status)

        let image_and_title

        let get_image_and_title


        switch (sort) {
            case "newest":
                console.log("ตกเงื่อนไข new")
                if (status === "all") {
                    get_image_and_title =
                    `
                    SELECT title, ebook_image, release_date
                    FROM (
                        SELECT DISTINCT title, ebook_image, release_date
                        FROM ebook
                    ) AS subquery
                    ORDER BY release_date
                    `
                    image_and_title = await pool.execute(get_image_and_title)
                }
                else {
                    let get_author_id = `SELECT author_id FROM author WHERE author_name = ?`
                    let author_id = await pool.execute(get_author_id, [status])
                    author_id = author_id[0][0].author_id
        
                    get_image_and_title =
                    `
                    SELECT title, ebook_image, release_date, author_id
                    FROM (
                        SELECT DISTINCT title, ebook_image, release_date, author_id
                        FROM ebook
                    ) AS subquery
                    WHERE author_id = ?
                    ORDER BY release_date
                    `
        
                    image_and_title = await pool.execute(get_image_and_title, [author_id])
                }
                break;
            case "oldest":
                console.log("ตกเงื่อนไข old")
                if (status === "all") {
                    get_image_and_title =
                    `
                    SELECT title, ebook_image, release_date
                    FROM (
                        SELECT DISTINCT title, ebook_image, release_date
                        FROM ebook
                    ) AS subquery
                    ORDER BY release_date DESC
                    `
                    image_and_title = await pool.execute(get_image_and_title)
                }
                else {
                    let get_author_id = `SELECT author_id FROM author WHERE author_name = ?`
                    let author_id = await pool.execute(get_author_id, [status])
                    author_id = author_id[0][0].author_id
        
                    get_image_and_title =
                    `
                    SELECT title, ebook_image, release_date, author_id
                    FROM (
                        SELECT DISTINCT title, ebook_image, release_date, author_id
                        FROM ebook
                    ) AS subquery
                    WHERE author_id = ?
                    ORDER BY release_date DESC
                    `
        
                    image_and_title = await pool.execute(get_image_and_title, [author_id])
                }
                break;
            default:
                console.log("query param ผิด")

        }


        let get_first_ebook_id = `SELECT ebook_id FROM ebook WHERE title = ? LIMIT 1`
        let get_genre = `SELECT genre_name FROM genre WHERE genre_id IN (
            SELECT genre_id FROM ebook_genre WHERE ebook_id = ?
        )`

        let get_sum_view = `SELECT sum_view FROM ebook WHERE title = ? LIMIT 1`

        let get_author =
        `
        SELECT author_name FROM ebook
        JOIN author
        USING (author_id)
        WHERE title = ?
        LIMIT 1
        `

        let get_publisher =
        `
        SELECT publisher_name FROM ebook
        JOIN publisher
        USING (publisher_id)
        WHERE title = ?
        LIMIT 1
        `

        console.log("ตรงนี้")
        console.log(image_and_title)

        let title_array = []
        let imageBase64_array = []
        let genre_2d_array = []
        let sum_view_array = []
        let author_name_array = []
        let publisher_name_array = []
        
        for (let i = 0; i < image_and_title[0].length; i++){
            
            // console.log("ผิดปกติไหม",title_array)
            const first_ebook_id = await pool.execute(get_first_ebook_id, [image_and_title[0][i].title])
            // console.log(first_anime_id[0][0].anime_id)
            const genre = await pool.execute(get_genre, [first_ebook_id[0][0].ebook_id])
            const sum_view = await pool.execute(get_sum_view, [image_and_title[0][i].title])
            const author = await pool.execute(get_author, [image_and_title[0][i].title])
            const publisher = await pool.execute(get_publisher, [image_and_title[0][i].title])

            //ถ้ามี genre ใด genre นึงใน array ให้ push ไป filter
            //ไม่ใช่ใช่ all ให้กรอง genre
            if (category !== "all"){
                if (genre[0].map(element => element.genre_name).includes(category.charAt(0).toUpperCase() + category.slice(1))){
                    title_array.push(image_and_title[0][i].title)
                    genre_2d_array.push(genre[0].map(element => element.genre_name))
                    sum_view_array.push(sum_view[0][0].sum_view)
                    let imageData = image_and_title[0][i].ebook_image
                    imageBase64_array.push(Buffer.from(imageData).toString('base64'))
                    author_name_array.push(author[0][0].author_name)
                    publisher_name_array.push(publisher[0][0].publisher_name)
                
                }
                else {
                    console.log("ข้ามเรื่องที่ genre ไม่อยู่ใน query param", image_and_title[0][i].title)
                }
                
            }
            else {
                title_array.push(image_and_title[0][i].title)
                genre_2d_array.push(genre[0].map(element => element.genre_name))
                sum_view_array.push(sum_view[0][0].sum_view)
                let imageData = image_and_title[0][i].ebook_image
                imageBase64_array.push(Buffer.from(imageData).toString('base64'))
                author_name_array.push(author[0][0].author_name)
                publisher_name_array.push(publisher[0][0].publisher_name)
                //ดูจำนวนเรื่องว่าตรงกันกับ query param ไหม
                // console.log(i)
            }
        }
        console.log("ออก loop แล้ว")
        console.log(genre_2d_array)

        const responseData = {
            EbookTitle: title_array,
            image: imageBase64_array,
            genre_2d_array:genre_2d_array,
            sum_view_array:sum_view_array,
            author_name_array:author_name_array,
            publisher_name_array:publisher_name_array
        }

        // console.log(responseData)
        console.log("Misha คั่นหน้า category")

        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}