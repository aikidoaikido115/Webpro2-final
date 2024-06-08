const pool = require('../../models/database');
const bcrypt = require('bcrypt')

const fs = require('fs');


const salt = 10

module.exports = async (req, res) =>{

    //get user_info from frontend
    const UserInfo = req.body
    // console.log(UserInfo.password)

    try {
        //เช็คว่า username ซ้ำไหม ถ้าซ้ำ return ออก
        let isUserExistSQL = 'SELECT * FROM user WHERE username = ?'
        const check_user = await pool.execute(isUserExistSQL, [UserInfo.username])

        if (Boolean(check_user[0][0])) {
            console.log("user ซ้ำ")
            res.send("User Already exists")
            return
        }

        //hash password
        UserInfo.password = await new Promise((resolve, reject) =>{
            bcrypt.hash(UserInfo.password, salt, (err, hash) =>{
                if(err) {
                    reject(err)
                }
                else {
                    resolve(hash)
                }
            })
        })
    } catch (error) {
        console.error(error);
        // Handle the error and send an appropriate response
        res.status(500).send('Internal Server Error');
    }
    // console.log(UserInfo)


    const userImage = fs.readFileSync('./DefaultProfile/ธรรมะ.jpg')

    //แปลง object ให้เป็น array เพื่อเอาไป insert MySQL (รับเป็น array เลยต้องแปลง)
    UserInfo_array = []
    for (const [key, value] of Object.entries(UserInfo)) {
        UserInfo_array.push(value)
      }

    console.log(UserInfo_array)

    UserInfo_array.push(userImage)
    console.log(UserInfo_array)


    //save into database
    let sql =`INSERT INTO user (username, email, password, image, create_date)
    VALUES (?, ?, ?, ?, NOW())`

    try {
        //ลองเปลี่ยน เป็น pool.execute() แทน pool.query()
        const result = await pool.execute(sql, UserInfo_array)

        console.log(result)
        
        console.log("Register Success in console")
        //ถ้าไม่ res.send จะทำให้ frontend navigate ไม่ได้
        res.send("Register Success in api ใส่ไว้เพื่อให้ไม่ค้างตอนยิง req")
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}