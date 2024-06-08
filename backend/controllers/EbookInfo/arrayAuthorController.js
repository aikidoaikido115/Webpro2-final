const pool = require('../../models/database');
const fs = require('fs');


module.exports = async (req, res) =>{
    try {

        let sql = `SELECT author_name FROM author`
        const data = await pool.query(sql)
        console.log(data)


        // const imageData = data[0][0].anime_image
        // const imageBase64 = Buffer.from(imageData).toString('base64');

        let author_array = []


        for (let i = 0; i < data[0].length; i++){
            author_array.push(data[0][i].author_name)

        }

        // console.log(title_array)
        // console.log(imageBase64_array)

        const responseData = {
            author_name: author_array
        }

        console.log("Misha คั่นหน้า array author")
        console.log(responseData)

        res.json(responseData)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}