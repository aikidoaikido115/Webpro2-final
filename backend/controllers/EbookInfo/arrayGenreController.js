const pool = require('../../models/database');
const fs = require('fs');


module.exports = async (req, res) =>{
    try {

        let sql = `SELECT genre_name FROM genre`
        const data = await pool.query(sql)
        console.log(data)


        // const imageData = data[0][0].anime_image
        // const imageBase64 = Buffer.from(imageData).toString('base64');

        let genre_array = []


        for (let i = 0; i < data[0].length; i++){
            genre_array.push(data[0][i].genre_name)

        }

        // console.log(title_array)
        // console.log(imageBase64_array)

        const responseData = {
            EbookGenre: genre_array
        }

        console.log("Misha คั่นหน้า array genre")
        console.log(responseData)

        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}