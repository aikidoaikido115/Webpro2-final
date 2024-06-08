const pool = require('../../models/database');

module.exports = async (req, res) =>{
    try {

        // เวลา ดึง req.params จะมี : ลบออก
        const title = req.params.title.replace(":","")
        // console.log(title)

        //ต้องลบ ให้หมดทุก table ไม่ว่า row นั้นจะมีหรือไม่มี data ใน table นั้นๆก็ตาม

        let delete_read_list = `
        DELETE FROM read_list
        WHERE ebook_id IN (
            SELECT ebook_id FROM ebook
            WHERE title = ?
        )
        `
        let delete_history = `
        DELETE FROM history
        WHERE ebook_id IN (
            SELECT ebook_id FROM ebook
            WHERE title = ?
        )
        `

        let delete_ebook_genre = `
        DELETE FROM ebook_genre
        WHERE ebook_id IN (
            SELECT ebook_id FROM ebook
            WHERE title = ?
        )`

        let delete_comment_reply = `
        DELETE FROM comment_reply
        WHERE comment_id IN (
            SELECT comment_id FROM comment
            WHERE ebook_id IN (
                SELECT ebook_id FROM ebook
                WHERE ebook_id IN (
                    SELECT ebook_id FROM ebook
                    WHERE title = ?
                )
            )
        )`

        let delete_comment = `
        DELETE FROM comment
        WHERE ebook_id IN (
            SELECT ebook_id FROM ebook
            WHERE ebook_id IN (
                SELECT ebook_id FROM ebook
                WHERE title = ?
            )
        )`


        let delete_ebook = `DELETE FROM ebook WHERE title = ?`

        //delete

        let delete_array =
            [
                delete_read_list,
                delete_history,
                delete_ebook_genre,
                delete_comment_reply,
                delete_comment,
                delete_ebook
            ]
        for (let i of delete_array){
            await pool.execute(i, [title])
        }


        console.log("Misha คั่นหน้า Delete")
        res.send(`Delete ${title} successfully!!`)

    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}