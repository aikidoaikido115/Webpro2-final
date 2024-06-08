const pool = require('../../models/database');

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

        const UpdateEbook = req.body
        let [ebookImage, ebookFiles] = ["api not change image", "api not change pdf file"]

        try{
            
            ebookFiles = req.files['ebookFile'];
            if (ebookFiles === undefined){
                ebookFiles = "api not change pdf file"
            }

            //ถ้าไม่ได้ใส่มา จะ error และตกไป catch
            try{
                ebookImage = req.files['ebookImage'][0];
            }
            catch (error){
                console.log("ไม่ใส่รูปปกมา")
            }
            
        }
        catch (error){
            console.log("Error เพราะ user ไม่ใส่รูป/ไฟล์ หรือใส่ไม่ครบทั้ง 2 อย่างแต่ช่างมัน")
        }
        
        console.table(UpdateEbook)
        console.log(ebookImage)
        console.log(ebookFiles)


        //นำชื่อเรื่อง ver เก่าก่อนอัพเดทออกมาเพื่อช่วย subquery

        // ผลลัพธ์คือ list ของ genre_id ใน MySQL ต้อง for loop เพิ่มเข้าไปทีละ genre
        const genre_array = UpdateEbook.genre.split(",")
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
        // console.log("รันตรงนี้ได้ก่อน error ", UpdateEbook.genre)
        const [raw_genre_id] = await pool.execute(get_genre_id, genre_array)
        const genre_id = raw_genre_id.map(element => element.genre_id)

        //แสดงตาราง ลองดู
        // console.table(genre_id)


        let author_id;
        try {
            let get_author_id = 'SELECT author_id FROM author WHERE author_name = ?'
            const [raw_author_id] = await pool.execute(get_author_id, [UpdateEbook.author])
            author_id = raw_author_id[0].author_id
            // console.log(author_id)
        } catch (error) {
            console.log("error ตรง try catch: ",error)
            console.log("ให้สร้าง row ใหม่ใน sql แทนเพราะมันไม่เคยมี author")
            let create_author = `INSERT INTO author (author_name) VALUES (?)`
            const result = await pool.execute(create_author, [UpdateEbook.author])

            //หลังจากเพิ่มเข้าไปแล้วก็ ดึง id มา
            let get_author_id = 'SELECT author_id FROM author WHERE author_name = ?'
            const [raw_author_id] = await pool.execute(get_author_id, [UpdateEbook.author])
            author_id = raw_author_id[0].author_id
            // console.log(author_id)
        }

        let publisher_id;
        try {
            let get_publisher_id = 'SELECT publisher_id FROM publisher WHERE publisher_name = ?'
            const [raw_publisher_id] = await pool.execute(get_publisher_id, [UpdateEbook.publisher])
            publisher_id = raw_publisher_id[0].publisher_id
            // console.log(publisher_id)
        } catch (error) {
            console.log("error ตรง try catch: ",error)
            console.log("ให้สร้าง row ใหม่ใน sql แทนเพราะมันไม่เคยมี publisher")
            let create_publisher = `INSERT INTO publisher (publisher_name) VALUES (?)`
            const result = await pool.execute(create_publisher, [UpdateEbook.publisher])

            let get_publisher_id = 'SELECT publisher_id FROM publisher WHERE publisher_name = ?'
            const [raw_publisher_id] = await pool.execute(get_publisher_id, [UpdateEbook.publisher])
            publisher_id = raw_publisher_id[0].publisher_id
            // console.log(publisher_id)
        }


        //ผลลัพธ์ ตรงตัวคือ ชื่ออนิเมะ
        let title = UpdateEbook.title
        // console.log(title)


        let description = UpdateEbook.plot
        // console.log(description)


        //ผลลัพธ์ ตรงตัวคือ rating
        let rating = parseFloat(UpdateEbook.rating)
        // console.log(rating)


        let delete_before_insert_ebook_genre =
        `
        DELETE FROM ebook_genre
        WHERE ebook_id IN (
            SELECT ebook_id FROM ebook
            WHERE title = ?
        )
        `
        
        //Step3 จริง
        let delete_before_insert_array = [delete_before_insert_ebook_genre]

        for (let i of delete_before_insert_array){
            await pool.execute(i, [UpdateEbook.old_title])
        }
        
        console.log("DELETE ตาราง ebook_genre สำเร็จ(เดี๋ยว INSERT กลับ)")


        //เช็คว่ามีรูปไหม และเปลี่ยนคำสั่ง sql ถ้าเกิด user ไม่ใส่รูปมา
        let get_ebook_id_array =
        `
        SELECT ebook_id FROM ebook WHERE title = ?
        `
        const [ebook_id_array] = await pool.execute(get_ebook_id_array, [UpdateEbook.old_title])
        // console.table(ebook_id_array)
        // console.log(ebook_id_array)
        let update_ebook;
        if (ebookImage === "api not change image" && ebookFiles === "api not change pdf file") {
            console.log("ตกเงื่อนไขไม่ input ทั้ง รูปและ ไฟล์ pdf")
            //ถ้าไม่มีรูปก็ไม่ต้องอัพเดทรูป
            update_ebook =
            `
            UPDATE ebook SET 
            genre_id = ?,
            author_id = ?,
            publisher_id = ?,
            title = ?,
            description = ?,
            average_rating = ?
            WHERE ebook_id = ?
            `

            //ต้อง WHERE ebook_id = ? ไม่ใช่ title เพราะมันซ้ำ
            // console.log(genre_id)
            // console.log(genre_array)
            const old_genre_array = UpdateEbook.old_genre.split(",")
            console.log(old_genre_array)

            //length ปัจจุบันเท่ากับอันเก่า
            if (genre_array.length == old_genre_array.length){
                console.log("ตกเงื่อนไข ==")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const ebook_data_array = [genre_id[i], author_id, publisher_id, title, description, rating, ebook_id_array[i].ebook_id]
                    const update_ebook_table_result = await pool.execute(update_ebook, ebook_data_array)
                    console.log(update_ebook_table_result)
                    console.log("update ebook ครั้งที่ ", i + 1)
                }
            }
            else if (genre_array.length < old_genre_array.length){
                console.log("ตกเงื่อนไข <")
                //ลบ table ebbok ทิ้งได้ก็ต่อเมื่อลบไม่หมดไปถึง id แรกของเรื่องนั้นๆเพราะจะติด constraints แค่ ebook_id row แรกของเรื่องนั้นๆเท่านั้น
                
                //เอาผลต่างของ len() มาปรับแต่งจำนวน row
                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                let get_row = `SELECT ebook_id FROM ebook WHERE title = ? ORDER BY ebook_id DESC LIMIT ${diff_row}`
                const query_for_get_row = await pool.execute(get_row, [UpdateEbook.old_title])

                console.log(diff_row)
                console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                console.log(query_for_get_row[0])
                let delete_unuse_row =`DELETE FROM ebook WHERE ebook_id = ?`
                for (let i = 0; i< query_for_get_row[0].length; i++){
                    const [result] = await pool.execute(delete_unuse_row, [query_for_get_row[0][i].ebook_id])
                    
                }
                console.log("ตอนนี้รัน loop แรกได้")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const ebook_data_array = [genre_id[i], author_id, publisher_id, title, description, rating, ebook_id_array[i].ebook_id]
                    const update_ebook_table_result = await pool.execute(update_ebook, ebook_data_array)
                    console.log(update_ebook_table_result)
                    console.log("update ebook ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
                
            }
            else if (genre_array.length > old_genre_array.length){
                console.log("ตกเงื่อนไข >")

                
                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                //สำหรับการเพิ่ม สามารถเพิ่มเท่าไรก็ได้ จึงไม่สามารถใช้ get_row อ้างอิงได้เพราะมันจะจำกัดให้เพิ่มได้แค่เท่าตัว แต่ถ้ามันเกินเท่าตัวจะ create dummy ได้ไม่ครบ
                // let get_row = `SELECT ebook_id FROM ebook WHERE title = ? ORDER BY ebook_id DESC LIMIT ${diff_row}`
                // const query_for_get_row = await pool.execute(get_row, [UpdateEbook.old_title])

                console.log(diff_row)
                // console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                // console.log(query_for_get_row[0])

                //โคลน row ตามจำนวนผลต่างโดยที่ได้ ebook_id ใหม่ต่อท้าย table
                let create_dummy_row =
                `
                INSERT INTO ebook (genre_id, author_id, publisher_id, title, description, ebook_image, ebook_file, release_date, average_rating, sum_view)
                SELECT genre_id, author_id, publisher_id, title, description, ebook_image, ebook_file, release_date, average_rating, sum_view
                FROM ebook
                WHERE title = ?
                ORDER BY ebook_id DESC
                LIMIT 1
                `
                //สร้าง dummy row เพื่อรองรับ genre ตามจำนวนผลต่าง genre ที่เพิ่มขึ้น
                for (let i = 0; i < diff_row; i++){
                    const [result] = await pool.execute(create_dummy_row, [UpdateEbook.old_title])
                }
                console.log("ตอนนี้รัน loop แรกได้")

                //ก่อนจะ loop ต้องอัพเดท ebook_id ด้วย เฉพาะเงื่อนไขที่ row มากกว่าเดิมเท่านั้นเพราะมี ebook_id เพิ่มมาใหม่ซึ่งไม่มีอยู่ใน array เดิม
                const [current_ebook_id_array] = await pool.execute(get_ebook_id_array, [UpdateEbook.old_title])
                console.table(current_ebook_id_array)
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const ebook_data_array = [genre_id[i], author_id, publisher_id, title, description, rating, current_ebook_id_array[i].ebook_id]
                    const update_ebook_table_result = await pool.execute(update_ebook, ebook_data_array)
                    console.log(update_ebook_table_result)
                    console.log("update ebook ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
            }
        }
        else if (ebookImage === "api not change image" && ebookFiles !== "api not change pdf file") {
            console.log("ตกเงื่อนไขไม่ input รูปแต่ input ไฟล์ pdf")
            //ถ้าไม่มีรูปก็ไม่ต้องอัพเดทรูป
            update_ebook =
            `
            UPDATE ebook SET 
            genre_id = ?,
            author_id = ?,
            publisher_id = ?,
            title = ?,
            description = ?,
            ebook_file = ?,
            average_rating = ?
            WHERE ebook_id = ?
            `

            //ต้อง WHERE ebook_id = ? ไม่ใช่ title เพราะมันซ้ำ
            // console.log(genre_id)
            // console.log(genre_array)
            const old_genre_array = UpdateEbook.old_genre.split(",")
            console.log(old_genre_array)

            //length ปัจจุบันเท่ากับอันเก่า
            if (genre_array.length == old_genre_array.length){
                console.log("ตกเงื่อนไข ==")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const ebook_data_array = [genre_id[i], author_id, publisher_id, title, description, ebookFiles[0].buffer, rating, ebook_id_array[i].ebook_id]
                    const update_ebook_table_result = await pool.execute(update_ebook, ebook_data_array)
                    console.log(update_ebook_table_result)
                    console.log("update ebook ครั้งที่ ", i + 1)
                }
            }
            else if (genre_array.length < old_genre_array.length){
                console.log("ตกเงื่อนไข <")
                //ลบ table ebbok ทิ้งได้ก็ต่อเมื่อลบไม่หมดไปถึง id แรกของเรื่องนั้นๆเพราะจะติด constraints แค่ ebook_id row แรกของเรื่องนั้นๆเท่านั้น
                
                //เอาผลต่างของ len() มาปรับแต่งจำนวน row
                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                let get_row = `SELECT ebook_id FROM ebook WHERE title = ? ORDER BY ebook_id DESC LIMIT ${diff_row}`
                const query_for_get_row = await pool.execute(get_row, [UpdateEbook.old_title])

                console.log(diff_row)
                console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                console.log(query_for_get_row[0])
                let delete_unuse_row =`DELETE FROM ebook WHERE ebook_id = ?`
                for (let i = 0; i< query_for_get_row[0].length; i++){
                    const [result] = await pool.execute(delete_unuse_row, [query_for_get_row[0][i].ebook_id])
                    
                }
                console.log("ตอนนี้รัน loop แรกได้")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const ebook_data_array = [genre_id[i], author_id, publisher_id, title, description, ebookFiles[0].buffer, rating, ebook_id_array[i].ebook_id]
                    const update_ebook_table_result = await pool.execute(update_ebook, ebook_data_array)
                    console.log(update_ebook_table_result)
                    console.log("update ebook ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
                
            }
            else if (genre_array.length > old_genre_array.length){
                console.log("ตกเงื่อนไข >")

                
                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                //สำหรับการเพิ่ม สามารถเพิ่มเท่าไรก็ได้ จึงไม่สามารถใช้ get_row อ้างอิงได้เพราะมันจะจำกัดให้เพิ่มได้แค่เท่าตัว แต่ถ้ามันเกินเท่าตัวจะ create dummy ได้ไม่ครบ
                // let get_row = `SELECT ebook_id FROM ebook WHERE title = ? ORDER BY ebook_id DESC LIMIT ${diff_row}`
                // const query_for_get_row = await pool.execute(get_row, [UpdateEbook.old_title])

                console.log(diff_row)
                // console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                // console.log(query_for_get_row[0])

                //โคลน row ตามจำนวนผลต่างโดยที่ได้ ebook_id ใหม่ต่อท้าย table
                let create_dummy_row =
                `
                INSERT INTO ebook (genre_id, author_id, publisher_id, title, description, ebook_image, ebook_file, release_date, average_rating, sum_view)
                SELECT genre_id, author_id, publisher_id, title, description, ebook_image, ebook_file, release_date, average_rating, sum_view
                FROM ebook
                WHERE title = ?
                ORDER BY ebook_id DESC
                LIMIT 1
                `
                //สร้าง dummy row เพื่อรองรับ genre ตามจำนวนผลต่าง genre ที่เพิ่มขึ้น
                for (let i = 0; i < diff_row; i++){
                    const [result] = await pool.execute(create_dummy_row, [UpdateEbook.old_title])
                }
                console.log("ตอนนี้รัน loop แรกได้")

                //ก่อนจะ loop ต้องอัพเดท ebook_id ด้วย เฉพาะเงื่อนไขที่ row มากกว่าเดิมเท่านั้นเพราะมี ebook_id เพิ่มมาใหม่ซึ่งไม่มีอยู่ใน array เดิม
                const [current_ebook_id_array] = await pool.execute(get_ebook_id_array, [UpdateEbook.old_title])
                console.table(current_ebook_id_array)
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const ebook_data_array = [genre_id[i], author_id, publisher_id, title, description, ebookFiles[0].buffer, rating, current_ebook_id_array[i].ebook_id]
                    const update_ebook_table_result = await pool.execute(update_ebook, ebook_data_array)
                    console.log(update_ebook_table_result)
                    console.log("update ebook ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
            }
        }
        else if (ebookImage !== "api not change image" && ebookFiles === "api not change pdf file") {
            console.log("ตกเงื่อนไข input รูปแต่ไม่ input ไฟล์ pdf")
            //ถ้าไม่มีรูปก็ไม่ต้องอัพเดทรูป
            update_ebook =
            `
            UPDATE ebook SET 
            genre_id = ?,
            author_id = ?,
            publisher_id = ?,
            title = ?,
            description = ?,
            ebook_image = ?,
            average_rating = ?
            WHERE ebook_id = ?
            `

            //ต้อง WHERE ebook_id = ? ไม่ใช่ title เพราะมันซ้ำ
            // console.log(genre_id)
            // console.log(genre_array)
            const old_genre_array = UpdateEbook.old_genre.split(",")
            console.log(old_genre_array)

            //length ปัจจุบันเท่ากับอันเก่า
            if (genre_array.length == old_genre_array.length){
                console.log("ตกเงื่อนไข ==")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const ebook_data_array = [genre_id[i], author_id, publisher_id, title, description, ebookImage.buffer, rating, ebook_id_array[i].ebook_id]
                    const update_ebook_table_result = await pool.execute(update_ebook, ebook_data_array)
                    console.log(update_ebook_table_result)
                    console.log("update ebook ครั้งที่ ", i + 1)
                }
            }
            else if (genre_array.length < old_genre_array.length){
                console.log("ตกเงื่อนไข <")
                //ลบ table ebbok ทิ้งได้ก็ต่อเมื่อลบไม่หมดไปถึง id แรกของเรื่องนั้นๆเพราะจะติด constraints แค่ ebook_id row แรกของเรื่องนั้นๆเท่านั้น
                
                //เอาผลต่างของ len() มาปรับแต่งจำนวน row
                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                let get_row = `SELECT ebook_id FROM ebook WHERE title = ? ORDER BY ebook_id DESC LIMIT ${diff_row}`
                const query_for_get_row = await pool.execute(get_row, [UpdateEbook.old_title])

                console.log(diff_row)
                console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                console.log(query_for_get_row[0])
                let delete_unuse_row =`DELETE FROM ebook WHERE ebook_id = ?`
                for (let i = 0; i< query_for_get_row[0].length; i++){
                    const [result] = await pool.execute(delete_unuse_row, [query_for_get_row[0][i].ebook_id])
                    
                }
                console.log("ตอนนี้รัน loop แรกได้")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const ebook_data_array = [genre_id[i], author_id, publisher_id, title, description, ebookImage.buffer, rating, ebook_id_array[i].ebook_id]
                    const update_ebook_table_result = await pool.execute(update_ebook, ebook_data_array)
                    console.log(update_ebook_table_result)
                    console.log("update ebook ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
                
            }
            else if (genre_array.length > old_genre_array.length){
                console.log("ตกเงื่อนไข >")

                
                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                //สำหรับการเพิ่ม สามารถเพิ่มเท่าไรก็ได้ จึงไม่สามารถใช้ get_row อ้างอิงได้เพราะมันจะจำกัดให้เพิ่มได้แค่เท่าตัว แต่ถ้ามันเกินเท่าตัวจะ create dummy ได้ไม่ครบ
                // let get_row = `SELECT ebook_id FROM ebook WHERE title = ? ORDER BY ebook_id DESC LIMIT ${diff_row}`
                // const query_for_get_row = await pool.execute(get_row, [UpdateEbook.old_title])

                console.log(diff_row)
                // console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                // console.log(query_for_get_row[0])

                //โคลน row ตามจำนวนผลต่างโดยที่ได้ ebook_id ใหม่ต่อท้าย table
                let create_dummy_row =
                `
                INSERT INTO ebook (genre_id, author_id, publisher_id, title, description, ebook_image, ebook_file, release_date, average_rating, sum_view)
                SELECT genre_id, author_id, publisher_id, title, description, ebook_image, ebook_file, release_date, average_rating, sum_view
                FROM ebook
                WHERE title = ?
                ORDER BY ebook_id DESC
                LIMIT 1
                `
                //สร้าง dummy row เพื่อรองรับ genre ตามจำนวนผลต่าง genre ที่เพิ่มขึ้น
                for (let i = 0; i < diff_row; i++){
                    const [result] = await pool.execute(create_dummy_row, [UpdateEbook.old_title])
                }
                console.log("ตอนนี้รัน loop แรกได้")

                //ก่อนจะ loop ต้องอัพเดท ebook_id ด้วย เฉพาะเงื่อนไขที่ row มากกว่าเดิมเท่านั้นเพราะมี ebook_id เพิ่มมาใหม่ซึ่งไม่มีอยู่ใน array เดิม
                const [current_ebook_id_array] = await pool.execute(get_ebook_id_array, [UpdateEbook.old_title])
                console.table(current_ebook_id_array)
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const ebook_data_array = [genre_id[i], author_id, publisher_id, title, description, ebookImage.buffer, rating, current_ebook_id_array[i].ebook_id]
                    const update_ebook_table_result = await pool.execute(update_ebook, ebook_data_array)
                    console.log(update_ebook_table_result)
                    console.log("update ebook ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
            }
        }
        else{
            console.log("ตกเงื่อนไข input ทั้ง รูปและไฟล์ pdf")
            update_ebook =
            `
            UPDATE ebook SET 
            genre_id = ?,
            author_id = ?,
            publisher_id = ?,
            title = ?,
            description = ?,
            ebook_image = ?,
            ebook_file = ?,
            average_rating = ?
            WHERE ebook_id = ?
            `

            const old_genre_array = UpdateEbook.old_genre.split(",")
            console.log(old_genre_array)

            //length ปัจจุบันเท่ากับอันเก่า
            if (genre_array.length == old_genre_array.length){
                console.log("ตกเงื่อนไข ==")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const ebook_data_array = [genre_id[i], author_id, publisher_id, title, description, ebookImage.buffer, ebookFiles[0].buffer, rating, ebook_id_array[i].ebook_id]
                    const update_ebook_table_result = await pool.execute(update_ebook, ebook_data_array)
                    console.log(update_ebook_table_result)
                    console.log("update ebook ครั้งที่ ", i + 1)
                }
            }
            else if (genre_array.length < old_genre_array.length){
                console.log("ตกเงื่อนไข <")
                //ลบ table ebook ทิ้งได้ก็ต่อเมื่อลบไม่หมดไปถึง id แรกของเรื่องนั้นๆเพราะจะติด constraints แค่ ebook_id row แรกของเรื่องนั้นๆเท่านั้น
                
                //เอาผลต่างของ len() มาปรับแต่งจำนวน row
                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                let get_row = `SELECT ebook_id FROM ebook WHERE title = ? ORDER BY ebook_id DESC LIMIT ${diff_row}`
                const query_for_get_row = await pool.execute(get_row, [UpdateEbook.old_title])

                console.log(diff_row)
                console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                console.log(query_for_get_row[0])
                let delete_unuse_row =`DELETE FROM ebook WHERE ebook_id = ?`
                for (let i = 0; i< query_for_get_row[0].length; i++){
                    const [result] = await pool.execute(delete_unuse_row, [query_for_get_row[0][i].ebook_id])
                    
                }
                console.log("ตอนนี้รัน loop แรกได้")
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const ebook_data_array = [genre_id[i], author_id, publisher_id, title, description, ebookImage.buffer, ebookFiles[0].buffer, rating, ebook_id_array[i].ebook_id]
                    const update_ebook_table_result = await pool.execute(update_ebook, ebook_data_array)
                    console.log(update_ebook_table_result)
                    console.log("update ebook ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
                
            }
            else if (genre_array.length > old_genre_array.length){
                console.log("ตกเงื่อนไข >")

                let diff_row = Math.abs(genre_array.length - old_genre_array.length);
                let get_row = `SELECT ebook_id FROM ebook WHERE title = ? ORDER BY ebook_id DESC LIMIT ${diff_row}`
                const query_for_get_row = await pool.execute(get_row, [UpdateEbook.old_title])

                console.log(diff_row)
                console.log(get_row)

                console.log("กำลังจะรัน loop แรก")
                console.log(query_for_get_row[0])

                //โคลน row ตามจำนวนผลต่างโดยที่ได้ ebook_id ใหม่ต่อท้าย table

                
                let create_dummy_row =
                `
                INSERT INTO ebook (genre_id, author_id, publisher_id, title, description, ebook_image, ebook_file, release_date, average_rating, sum_view)
                SELECT genre_id, author_id, publisher_id, title, description, ebook_image, ebook_file, release_date, average_rating, sum_view
                FROM ebook
                WHERE title = ?
                ORDER BY ebook_id DESC
                LIMIT 1
                `
                //สร้าง dummy row เพื่อรองรับ genre ตามจำนวนผลต่าง genre ที่เพิ่มขึ้น
                for (let i = 0; i< diff_row; i++){
                    const [result] = await pool.execute(create_dummy_row, [UpdateEbook.old_title])
                }
                console.log("ตอนนี้รัน loop แรกได้")

                //ก่อนจะ loop ต้องอัพเดท ebook_id ด้วย เฉพาะเงื่อไขที่ row มากกว่าเดิมเท่านั้นเพราะมันมี ebook_id เพิ่มมาใหม่ซึ่งไม่มีอยู่ใน array เดิม
                const [current_ebook_id_array] = await pool.execute(get_ebook_id_array, [UpdateEbook.old_title])
                console.table(current_ebook_id_array)
                for (let i = 0; i < genre_id.length; i++){
                    // console.log(genre_id[i])
                    const ebook_data_array = [genre_id[i], author_id, publisher_id, title, description, ebookImage.buffer, ebookFiles[0].buffer, rating, current_ebook_id_array[i].ebook_id]
                    const update_ebook_table_result = await pool.execute(update_ebook, ebook_data_array)
                    console.log(update_ebook_table_result)
                    console.log("update ebook ครั้งที่ ", i + 1)
                }
                console.log("ตอนนี้รัน loop 2 ได้")
                
            }
        }

        //INSERT กลับเข้าไปใหม่ สำหรับ table ที่ปัญหาจำนวน row อาจไม่เท่าเดิมกับ version เก่าก่อน UPDATE
        
        let insert_ebook_genre_after_update = `
        INSERT INTO ebook_genre (ebook_id, genre_id)
        VALUES((SELECT ebook_id from ebook WHERE title = ? LIMIT 1), ?)
        `
        for (let i = 0; i < genre_id.length; i++){
            const ebook_genre_data_array = [UpdateEbook.title, genre_id[i]]
            const result = await pool.execute(insert_ebook_genre_after_update, ebook_genre_data_array)
            console.log(result)
            console.log("insert ebook_genre after update ครั้งที่ ", i + 1)
        }

        console.log("Misha คั่นหน้า Update")
        res.send(`Update ${UpdateEbook.title} successfully!!`)
    }
    catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}