const pool = require('../../models/database');
const fs = require('fs');

//set ไว้ 1GB
pool.execute('SET global max_allowed_packet = 1073741824')
  .then(() => {
    console.log('max_allowed_packet set successfully now you can upload file 1GB per row');
  })
  .catch(err => {
    console.error('Error setting max_allowed_packet: ' + err.stack);
  });

module.exports = async (req, res) =>{
    try {
        const NewEbook = req.body
        const ebookImage = req.files['ebookImage'][0];
        // const bigImage = req.files['bigImage'][0];
        const ebookFiles = req.files['ebookFile'];

        console.log(NewEbook)
        // console.log(bigImage)


        // ผลลัพธ์คือ list ของ genre_id ใน MySQL ต้อง for loop เพิ่มเข้าไปทีละ genre
        const genre_array = NewEbook.genre.split(",")
        let genre_array_length = genre_array.length
        let dynamic_query_param = ``
        for(let i = 0; i < genre_array_length; i++){
            if(i == genre_array_length-1)
            {
                dynamic_query_param += `${'?'}`
            }
            else
            {
                dynamic_query_param += `${'?'},`
            }
        }
        console.log("ไหนดูดิ้ว่ามีกี่อัน",dynamic_query_param)
        let get_genre_id = `SELECT genre_id FROM genre WHERE genre_name IN (${dynamic_query_param})`
        // console.log("รันตรงนี้ได้ก่อน error ", NewEbook.genre)
        const [raw_genre_id] = await pool.execute(get_genre_id, genre_array)
        const genre_id = raw_genre_id.map(element => element.genre_id)

        //แสดงตาราง ลองดู
        console.table(genre_id)


        let author_id;
        try {
            let get_author_id = 'SELECT author_id FROM author WHERE author_name = ?'
            const [raw_author_id] = await pool.execute(get_author_id, [NewEbook.author])
            author_id = raw_author_id[0].author_id
            // console.log(author_id)
        } catch (error) {
            console.log("error ตรง try catch ว่ะ: ",error)
            console.log("ไม่แก้ แต่จะให้สร้าง row ใหม่ใน sql แทนเพราะมันไม่เคยมี author")
            let create_author = `INSERT INTO author (author_name) VALUES (?)`
            const result = await pool.execute(create_author, [NewEbook.author])

            //หลังจากเพิ่มเข้าไปแล้วก็ ดึง id มา
            let get_author_id = 'SELECT author_id FROM author WHERE author_name = ?'
            const [raw_author_id] = await pool.execute(get_author_id, [NewEbook.author])
            author_id = raw_author_id[0].author_id
            // console.log(author_id)
        }


        let publisher_id;
        try {
            let get_publisher_id = 'SELECT publisher_id FROM publisher WHERE publisher_name = ?'
            const [raw_publisher_id] = await pool.execute(get_publisher_id, [NewEbook.publisher])
            publisher_id = raw_publisher_id[0].publisher_id
            // console.log(publisher_id)
        } catch (error) {
            console.log("error ตรง try catch: ",error)
            console.log("ให้สร้าง row ใหม่ใน sql แทนเพราะมันไม่เคยมี publisher")
            let create_publisher = `INSERT INTO publisher (publisher_name) VALUES (?)`
            const result = await pool.execute(create_publisher, [NewEbook.publisher])

            //หลังจากเพิ่มเข้าไปแล้วก็ ดึง id มา
            let get_publisher_id = 'SELECT publisher_id FROM publisher WHERE publisher_name = ?'
            const [raw_publisher_id] = await pool.execute(get_publisher_id, [NewEbook.publisher])
            publisher_id = raw_publisher_id[0].publisher_id
            // console.log(publisher_id)
        }

        //ผลลัพธ์ ตรงตัวคือ ชื่อหนังสือ
        let title = NewEbook.title
        // console.log(title)

        let description = NewEbook.plot

        //ผลลัพธ์ ตรงตัวคือ rating
        let rating = parseFloat(NewEbook.rating)
        // console.log(rating)

        // console.log(NewEbook)
        console.log(ebookImage)
        console.log(ebookFiles)


        let insert_ebook =`
        INSERT INTO ebook (genre_id, author_id, publisher_id, description, title, ebook_image, ebook_file, release_date, average_rating, sum_view)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)
        `

        // console.log("ก่อนเข้า loop")
        for (let i = 0; i < genre_id.length; i++){
            // console.log("ยังไม่ error")
            const ebook_data_array = [genre_id[i], author_id, publisher_id, description, title, ebookImage.buffer, ebookFiles[0].buffer, rating, 0]
            const insert_ebook_table_result = await pool.execute(insert_ebook, ebook_data_array)
            console.log(insert_ebook_table_result)
            console.log("insert ebook ครั้งที่ ", i + 1)
        }


        //ต้องใช้ subquery ช่วย
        let insert_ebook_genre = `
        INSERT INTO ebook_genre (ebook_id, genre_id)
        VALUES((SELECT ebook_id from ebook WHERE title = ? LIMIT 1), ?)
        `

        for (let i = 0; i < genre_id.length; i++){
            const ebook_genre_data_array = [title, genre_id[i]]
            const insert_ebook_genre_table_result = await pool.execute(insert_ebook_genre, ebook_genre_data_array)
            console.log(insert_ebook_genre_table_result)
            console.log("insert ebook_genre ครั้งที่ ", i + 1)
        }
        
        console.log("Misha คั่นหน้า Create")
        res.send(`Create ${NewEbook.title} successfully!!`)
    }
    catch (error) {
        console.error("เพิ่มอนิเมะไม่สำเร็จ Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}