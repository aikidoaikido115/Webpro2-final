USE Aced_Ebook;


# Debug

-- SHOW VARIABLES LIKE 'max_allowed_packet';

-- SET global max_allowed_packet	 = 1073741824;

SHOW VARIABLES LIKE 'secure_file_priv';

-- DELETE FROM author WHERE author_name = "Tomiyaki Kagisora";

-- INSERT INTO ebook (genre_id, author_id, title, ebook_image, ebook_file, release_date, average_rating, sum_view)
--                 SELECT genre_id, author_id, title, ebook_image, ebook_file, release_date, average_rating, sum_view
--                 FROM ebook
--                 WHERE title = "aasdwaqd"
--                 ORDER BY ebook_id DESC
--                 LIMIT 1;

-- test
-- INSERT INTO comment (user_id, ebook_id, text, comment_date) VALUES
-- (2,14,"สวัสดีชาวโลก", NOW());
-- INSERT INTO comment (user_id, ebook_id, text, comment_date) VALUES
-- (1,14,"ไอดีไก่", NOW());
-- INSERT INTO comment (user_id, ebook_id, text, comment_date) VALUES
-- (2,2,"ข้อสอบ OS ยากไปไหมครับ", NOW());

SELECT author_name, average_rating, publisher_name, description FROM ebook
            JOIN author
            USING(author_id)
            JOIN publisher
            USING(publisher_id)
            WHERE title = "s"
            LIMIT 1;

############################
####### DELETE ALL Anime Data
SET SQL_SAFE_UPDATES = 0;

#reset AUTO_INCREMENT
delete from ebook_genre;
#Spacial
delete from comment_reply;
delete from comment;

delete from read_list;
delete from history;
delete from ebook;
delete from author;
delete from publisher;
delete from genre;




ALTER TABLE comment_reply AUTO_INCREMENT = 1;
ALTER TABLE comment AUTO_INCREMENT = 1;

ALTER TABLE genre AUTO_INCREMENT = 1;

ALTER TABLE read_list AUTO_INCREMENT = 1;
ALTER TABLE history AUTO_INCREMENT = 1;

ALTER TABLE ebook AUTO_INCREMENT = 1;
ALTER TABLE author AUTO_INCREMENT = 1;
ALTER TABLE publisher AUTO_INCREMENT = 1;

SET SQL_SAFE_UPDATES = 1;



############################
####### DELETE ALL User
SET SQL_SAFE_UPDATES = 0;
delete from admin;
delete from user;
ALTER TABLE user AUTO_INCREMENT = 1;
ALTER TABLE admin AUTO_INCREMENT = 1;
SET SQL_SAFE_UPDATES = 1;

DELETE FROM admin WHERE user_id = 1;


############################


#book data
##############################
-- INSERT INTO genre (genre_name) VALUES ("technology");
INSERT INTO genre (genre_name) VALUES
("Action"),
("Sci-fi"),
("Drama"),
("Psychological"),
("Comedy"),
("Parody"),
("Fantasy"),
("Herem"),
("Slice of life"),
("Mecha"),
("Romance"),
("Horror"),
("Supernatural"),
("Thriller"),
("Adventure"),
("การเงิน"),
("การศึกษา"),
("technology"),
("วิชาภาษาไทย"),
("วิชาชีววิทยา"),
("วิชาสังคมศึกษา"),
("วิชา GEN"),
("วิชาเคมี");

-- INSERT INTO genre (genre_name) VALUES ("วิชาภาษาไทย"),
-- ("วิชาชีววิทยา"),
-- ("วิชาสังคมศึกษา"),
-- ("วิชา GEN"),
-- ("วิชาเคมี");

INSERT INTO author (author_name) VALUES
("SaRai"),
("จักรพงษ์ เมษพันธุ์"),
("ชูเกียรติ วรสุชีพ"),
("Nene Yukimori");

-- INSERT INTO author (author_name) VALUES ("Nene Yukimori");

INSERT INTO publisher (publisher_name) VALUES
("รักพิมพ์"),
("ศูนย์หนังสือจุฬา");

-- DELETE FROM publisher WHERE publisher_name = "ฟีนิกซ์";
-- ALTER TABLE publisher AUTO_INCREMENT = 5;

INSERT INTO ebook (genre_id, author_id, publisher_id, description, title, ebook_image, ebook_file, release_date, average_rating, sum_view) VALUES
(16,2,1,"นี่คือหนังสือที่สอนพื้นฐานการเงินแบบเข้าใจง่ายๆ","Money101",LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/image/money101.jpg'),LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/file/money101.pdf'), NOW(), 7.6,0),
(12,3,2,"หนังสือเล่มนี้ จะช่วยให้ผู้อ่านเข้าใจความรู้พื้นฐานและหลักการทำงานของส่วนประกอบสำคัญต่างๆ ของระบบปฏิบัติการ ทั้งในส่วนของการจัดการกระบวนการการจัดสรรหน่วยความจำ ระบบอุปกรณ์เข้าออก รบบกระจาย และความมั่นคงของระบบ","ระบบปฏิบัติการคอมพิวเตอร์ยุคใหม่",LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/image/os.jpg'),LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/file/os.pdf'), NOW(), 8, 0),
(17,3,2,"หนังสือเล่มนี้ จะช่วยให้ผู้อ่านเข้าใจความรู้พื้นฐานและหลักการทำงานของส่วนประกอบสำคัญต่างๆ ของระบบปฏิบัติการ ทั้งในส่วนของการจัดการกระบวนการการจัดสรรหน่วยความจำ ระบบอุปกรณ์เข้าออก รบบกระจาย และความมั่นคงของระบบ","ระบบปฏิบัติการคอมพิวเตอร์ยุคใหม่",LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/image/os.jpg'),LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/file/os.pdf'), NOW(), 8, 0),
(18,3,2,"หนังสือเล่มนี้ จะช่วยให้ผู้อ่านเข้าใจความรู้พื้นฐานและหลักการทำงานของส่วนประกอบสำคัญต่างๆ ของระบบปฏิบัติการ ทั้งในส่วนของการจัดการกระบวนการการจัดสรรหน่วยความจำ ระบบอุปกรณ์เข้าออก รบบกระจาย และความมั่นคงของระบบ","ระบบปฏิบัติการคอมพิวเตอร์ยุคใหม่",LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/image/os.jpg'),LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/file/os.pdf'), NOW(), 8, 0),

(3,1,1,"เรื่องนี้สอนให้รู้ว่าหัวชมพูมันจะต้องมีอะไรบางอย่างเสมอ","แผนลับดับศัตรู เล่ม 2",LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/image/nana2.webp'),LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/file/nana2.pdf'), NOW(), 8.2, 0),
(4,1,1,"เรื่องนี้สอนให้รู้ว่าหัวชมพูมันจะต้องมีอะไรบางอย่างเสมอ","แผนลับดับศัตรู เล่ม 2",LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/image/nana2.webp'),LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/file/nana2.pdf'), NOW(), 8.2, 0),
(11,4,1,"มีทั้งเพื่อน มีทั้งเธอ ฤดูร้อนครั้งนี้ไม่เหมือนเดิมแล้ว","คุณคุโบะไม่ยอมให้ผมเป็นตัวประกอบ เล่ม 8",LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/image/kubo8.jpg'),LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/file/kubo8.pdf'), NOW(), 8.1, 0),
(1,1,1,"ต้นตระกูลจอมมารสุดแข็งแกร่งระดับพ่อ GM","ใครว่าข้าไม่เหมาะเป็นจอมมาร เล่ม 4",LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/image/maou5.jpg'),LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/file/kubo8.pdf'), NOW(), 8.1, 0),
(19,1,2,"นะคะ นะค่ะ อ่านจบใช้เป็น","ติวเข้มภาษาไทย ระดับ ม.1 - ม.3 ฉบับสมบูรณ์",LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/image/thai1.jpg'),LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/file/kubo8.pdf'), NOW(), 8.1, 0),
(20,1,2,"สรุปรวบรวม และเรียบเรียง เนื้อหาสำคัญในวิชาชีววิทยา มัธยมปลาย พร้อมแบบฝึกหัด และแนวข้อสอบเข้ามหาวิทยาลัย","สรุปเข้มชีววิทยา มัธยมปลาย",LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/image/bio1.jpg'),LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/file/kubo8.pdf'), NOW(), 8.1, 0),
(22,1,2,"หนังสือเล่มนี้จะสอนให้รู้ว่าการแสดงบนเวทีนั้นสนุกมากๆเลยนะ","GEN 241 ความงดงามแห่งชีวิต",LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/image/gen1.jpg'),LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/Ebook/file/kubo8.pdf'), NOW(), 8.1, 0);

INSERT INTO ebook_genre (ebook_id,genre_id) VALUES
((SELECT ebook_id from ebook WHERE title = "Money101" LIMIT 1),16),
((SELECT ebook_id from ebook WHERE title = "ระบบปฏิบัติการคอมพิวเตอร์ยุคใหม่" LIMIT 1),12),
((SELECT ebook_id from ebook WHERE title = "ระบบปฏิบัติการคอมพิวเตอร์ยุคใหม่" LIMIT 1),17),
((SELECT ebook_id from ebook WHERE title = "ระบบปฏิบัติการคอมพิวเตอร์ยุคใหม่" LIMIT 1),18),
((SELECT ebook_id from ebook WHERE title = "แผนลับดับศัตรู เล่ม 2" LIMIT 1),3),
((SELECT ebook_id from ebook WHERE title = "แผนลับดับศัตรู เล่ม 2" LIMIT 1),4),
((SELECT ebook_id from ebook WHERE title = "คุณคุโบะไม่ยอมให้ผมเป็นตัวประกอบ เล่ม 8" LIMIT 1),11),
((SELECT ebook_id from ebook WHERE title = "ใครว่าข้าไม่เหมาะเป็นจอมมาร เล่ม 4" LIMIT 1),1),
((SELECT ebook_id from ebook WHERE title = "ติวเข้มภาษาไทย ระดับ ม.1 - ม.3 ฉบับสมบูรณ์" LIMIT 1),19),
((SELECT ebook_id from ebook WHERE title = "สรุปเข้มชีววิทยา มัธยมปลาย" LIMIT 1),20),
((SELECT ebook_id from ebook WHERE title = "GEN 241 ความงดงามแห่งชีวิต" LIMIT 1),22);


##############################


#User/Premium Data

-- INSERT INTO user (username, email, password, image, create_date, suscription_Status) VALUES
-- ('qwer1234', 'qwer1234@gmail.com', '1234', LOAD_FILE('C:/ProgramData/MySQL/MySQL Server 8.1/Uploads/user_image/vaillhaze.jpg'), NOW(), 1);

#เพิ่ม admin ด้วยมือ uncoment แล้วค่อยใช้ พอใช้แล้วคอมเม้นด้วยเพราะมันจะติด constraint
-- INSERT INTO admin(user_id, username) VALUES
-- (2, 'aikidoaikido115');

-- INSERT INTO admin(user_id, username) VALUES
-- (3, 'rr');

-- DELETE FROM admin WHERE admin_id = 2;



SELECT "success!!!!";



