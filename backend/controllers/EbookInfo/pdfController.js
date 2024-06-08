const pool = require('../../models/database');
const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');



module.exports = async (req, res) =>{
    try {
        let title = req.query.ebook_title

        let get_pdf = `SELECT ebook_file FROM ebook WHERE title = ?`
        let pdf = await pool.execute(get_pdf, [title])
        pdf = pdf[0][0].ebook_file


        console.log("Misha คั่นหน้า test pdf")
        // console.log(responseData)

        res.setHeader('Content-Type', 'application/pdf');
        //ใช้ send แทน
        // res.json(responseData)
        res.send(pdf)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}