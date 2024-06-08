const pool = require('../../models/database');
const fs = require('fs');

//เหมือนกันกับ allBasicInfoController แต่ fetch มาแค่เรื่องเดียว
module.exports = async (req, res) =>{
    try {


        const title = req.query.title

        if (title != "ebook_title1") {
            let other_data_query_except_genre = `
            SELECT author_name, average_rating, publisher_name, description FROM ebook
            JOIN author
            USING(author_id)
            JOIN publisher
            USING(publisher_id)
            WHERE title = ?
            LIMIT 1
            `

            let other_data_genre = `
            SELECT genre_name FROM ebook
            JOIN genre
            USING(genre_id)
            WHERE title = ?
            `
            const [data] = await pool.execute(other_data_query_except_genre, [title])


            const [genre_data] = await pool.execute(other_data_genre, [title])

            console.log(genre_data)

            let array_genre_data = []
            for (let i = 0; i < genre_data.length; i++){
                array_genre_data.push(genre_data[i].genre_name)
            }

            const responseData = {
                author_name:data[0].author_name,
                plot:data[0].description,
                publisher:data[0].publisher_name,
                rating:parseFloat(data[0].average_rating),
                genre_data:array_genre_data
            }

            res.json(responseData)
        }
        else{
            res.json("ยังเป็น ebook_title1 อยู่รอแปปเดี๋ยวก็เปลี่ยนแล้ว")
        }

        console.log("Misha คั่นหน้า other_data")

        
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}