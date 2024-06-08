const pool = require('../../models/database');

module.exports = async (req, res) =>{


    const Comment = req.body
    console.log(Comment)

    try {

        let user_id = await pool.execute('SELECT user_id FROM user WHERE username = ?', [Comment.username])
        user_id = user_id[0][0].user_id
        console.log("username ผ่าน")

        let ebook_id = await pool.execute('SELECT ebook_id FROM ebook WHERE title = ? LIMIT 1', [Comment.ebook_title])
        ebook_id = ebook_id[0][0].ebook_id

        console.log("ebook_id ผ่าน")

        // let get_episode_id = 'SELECT episode_id FROM episode WHERE anime_id = ? AND episode_number = ?'

        // let episode_id = await pool.execute(get_episode_id, [anime_id, Comment.episode_number])
        // episode_id = episode_id[0][0].episode_id

        // console.log("episode_id ผ่าน")


        //ปล่อย reply_count like_ เป็น null ไปเลยไม่น่าได้ทำ
        let insert_comment =
        `INSERT INTO comment (user_id, ebook_id, text, comment_date)
        VALUES (?, ?, ?, ?)`

        let data = [user_id, ebook_id, Comment.text, Comment.date]
        console.log("นี่ data",data)
        let result = await pool.execute(insert_comment, data)
        console.log(result)

    }
    catch (error) {
        console.log("Error: ",error)
    }

    console.log("Misha คั่นหน้า comment")
    res.send("comment เรียบร้อย")

}