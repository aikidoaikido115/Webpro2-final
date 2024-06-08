DROP SCHEMA IF EXISTS Aced_Ebook;
CREATE SCHEMA Aced_Ebook;
USE Aced_Ebook;


##############################Webpage Zone##############################

####แก้  genre เป็น multivalue
CREATE TABLE genre(
	genre_id INT NOT NULL AUTO_INCREMENT,
    genre_name VARCHAR(50),
    PRIMARY KEY (genre_id)
);

CREATE TABLE author(
	author_id INT NOT NULL AUTO_INCREMENT,
    author_name VARCHAR(30),
    PRIMARY KEY (author_id)
);

CREATE TABLE publisher(
	publisher_id INT NOT NULL AUTO_INCREMENT,
    publisher_name VARCHAR(30),
    PRIMARY KEY (publisher_id)
);


CREATE TABLE ebook(
	ebook_id INT NOT NULL AUTO_INCREMENT,
    genre_id INT,
    author_id INT,
    publisher_id INT,
    description VARCHAR(1000),
    title VARCHAR(100),
    ebook_image MEDIUMBLOB,
    ebook_file LONGBLOB,
    release_date DATETIME,
    average_rating DECIMAL(2,1),
    sum_view INT,
    PRIMARY KEY (ebook_id),
    CONSTRAINT `fk_anime_author` FOREIGN KEY (author_id) REFERENCES author (author_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_anime_publisher` FOREIGN KEY (publisher_id) REFERENCES publisher (publisher_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE ebook_genre(
	ebook_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (ebook_id, genre_id),
    CONSTRAINT `fk_anime_genre_ebook` FOREIGN KEY (ebook_id) REFERENCES ebook (ebook_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_anime_genre_genre` FOREIGN KEY (genre_id) REFERENCES genre (genre_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

#####################################################################  

############################## user zone/premium ##############################

CREATE TABLE user(
	user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(20),
    email VARCHAR(60),
    password VARCHAR(500),
    image MEDIUMBLOB,
    create_date DATETIME,
    PRIMARY KEY (user_id)
);

CREATE TABLE admin(
	admin_id INT NOT NULL AUTO_INCREMENT,
    user_id  INT,
    username VARCHAR(20),
    PRIMARY KEY (admin_id),
    CONSTRAINT `fk_admin_user` FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE read_list(
	read_list_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    ebook_id INT,
    PRIMARY KEY (read_list_id),
    CONSTRAINT `fk_read_list_user` FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT `fk_read_list_ebook` FOREIGN KEY (ebook_id) REFERENCES ebook (ebook_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `unique_read_list` UNIQUE (user_id,ebook_id)
);

CREATE TABLE history(
	history_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    ebook_id INT,
    history_date DATETIME,
    PRIMARY KEY (history_id),
    CONSTRAINT `fk_history_user` FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT `fk_history_ebook` FOREIGN KEY (ebook_id) REFERENCES ebook (ebook_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `unique_history` UNIQUE (user_id,ebook_id)
);

CREATE TABLE comment(
	comment_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    ebook_id INT,
    text VARCHAR(1000),
    comment_date DATETIME,
    #น่าจะต้องเป็น INT แทน
    like_ BOOLEAN,
    reply_count INT,
    PRIMARY KEY (comment_id),
    CONSTRAINT `fk_comment_user` FOREIGN KEY (user_id) REFERENCES user (user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_comment_ebook` FOREIGN KEY (ebook_id) REFERENCES ebook (ebook_id) ON DELETE RESTRICT ON UPDATE CASCADE
    
);

CREATE TABLE comment_reply(
	reply_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    comment_id INT,
    text VARCHAR(1000),
    reply_date DATETIME,
    like_ BOOLEAN,
    PRIMARY KEY (reply_id),
    CONSTRAINT `fk_comment_reply_comment` FOREIGN KEY (comment_id) REFERENCES comment (comment_id) ON DELETE RESTRICT ON UPDATE CASCADE
);