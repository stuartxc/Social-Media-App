DROP TABLE IF EXISTS Message CASCADE;
DROP TABLE IF EXISTS participates CASCADE;
DROP TABLE IF EXISTS Chat CASCADE;
DROP TABLE IF EXISTS likeComment CASCADE;
DROP TABLE IF EXISTS reply CASCADE;
DROP TABLE IF EXISTS Comment CASCADE;
DROP TABLE IF EXISTS ImagePost CASCADE;
DROP TABLE IF EXISTS VideoPost CASCADE;
DROP TABLE IF EXISTS TextPost CASCADE;
DROP TABLE IF EXISTS likePost CASCADE;
DROP TABLE IF EXISTS Post CASCADE;
DROP TABLE IF EXISTS Caption CASCADE;
DROP TABLE IF EXISTS associateHashtag CASCADE;
DROP TABLE IF EXISTS Hashtags CASCADE;
DROP TABLE IF EXISTS validateUser CASCADE;
DROP TABLE IF EXISTS Login CASCADE;
DROP TABLE IF EXISTS follow CASCADE;
DROP TABLE IF EXISTS hasPermissions CASCADE;
DROP TABLE IF EXISTS Permissions CASCADE;
DROP TABLE IF EXISTS Account CASCADE;



CREATE TABLE Account (
	username VARCHAR(20) PRIMARY KEY,
	email VARCHAR(63),
	URL VARCHAR(255)
);

CREATE TABLE Permissions (
	type VARCHAR(20) PRIMARY KEY,
	cost INT NOT NULL
);

CREATE TABLE hasPermissions (
	username VARCHAR(20),
	perms VARCHAR(20) NOT NULL DEFAULT 'normalUser',
	FOREIGN KEY (username) REFERENCES Account(username)
	ON DELETE CASCADE,
	FOREIGN KEY (perms) REFERENCES Permissions(type)
	ON DELETE SET DEFAULT,
	PRIMARY KEY (username)
);

CREATE TABLE follow (
	follower VARCHAR(20),
	following VARCHAR(20),
	PRIMARY KEY (follower, following),
	FOREIGN KEY (follower) REFERENCES Account(username)
	ON DELETE CASCADE,
	FOREIGN KEY (following) REFERENCES Account(username)
	ON DELETE CASCADE
);

CREATE TABLE Login (
	username VARCHAR(20) PRIMARY KEY,
	password VARCHAR(80)
);

CREATE TABLE validateUser (
	accountUser VARCHAR(20),
	loginUser VARCHAR(20),
	PRIMARY KEY (accountUser, loginUser),	
	FOREIGN KEY (accountUser) REFERENCES Account(username)
	ON DELETE CASCADE,
	FOREIGN KEY (loginUser) REFERENCES Login(username) 
	ON DELETE CASCADE
);

CREATE TABLE Caption (
	caption VARCHAR(280) PRIMARY KEY,
	advertisement BOOLEAN
);

CREATE TABLE Post (
	postID INT PRIMARY KEY,
	URL VARCHAR(255),
	caption VARCHAR(280),
	createdBy VARCHAR(20) NOT NULL,
	timestamp TIMESTAMP NOT NULL,
	type INT,
	FOREIGN KEY (createdBy) REFERENCES Account(username)	
);

CREATE TABLE likePost (
	postID INT,
	acc VARCHAR(20),
	PRIMARY KEY (postID, acc),
	FOREIGN KEY (postID) REFERENCES Post(postID)
	ON DELETE CASCADE,
	FOREIGN KEY (acc) REFERENCES Account(username)
	ON DELETE CASCADE
);

CREATE TABLE TextPost (
	postID INT PRIMARY KEY,
	content VARCHAR(280),
	FOREIGN KEY (postID) REFERENCES Post(postID)
	ON DELETE CASCADE
);

CREATE TABLE VideoPost (
	postID INT PRIMARY KEY,
	content BYTEA,
	FOREIGN KEY (postID) REFERENCES Post(postID)
	ON DELETE CASCADE
);

CREATE TABLE ImagePost (
	postID INT PRIMARY KEY,
	content BYTEA,
	FOREIGN KEY (postID) REFERENCES Post(postID)
	ON DELETE CASCADE
);

CREATE TABLE Hashtags (
	text VARCHAR(20) PRIMARY KEY,
	color CHAR(6)
);

CREATE TABLE associateHashtag (
	postID INT,
	hashTag VARCHAR(20),
	FOREIGN KEY (postID) REFERENCES Post(postID),
	FOREIGN KEY (hashTag) REFERENCES Hashtags(text)
);

CREATE TABLE Comment (
	commentPost INT,
	FOREIGN KEY (commentPost) REFERENCES Post(postID),
	commenter VARCHAR(20),
	timeStamp TIMESTAMP PRIMARY KEY,
	contents VARCHAR(280)
);

CREATE TABLE reply (
	post INT,
	repliedTo TIMESTAMP,
	reply TIMESTAMP,
	PRIMARY KEY (repliedTo, reply),
	FOREIGN KEY (post) REFERENCES Post(postID)
	ON DELETE CASCADE,
	FOREIGN KEY (repliedTo) REFERENCES Comment(timeStamp)
	ON DELETE CASCADE,
	FOREIGN KEY (reply) REFERENCES Comment(timeStamp)
	ON DELETE CASCADE
);

CREATE TABLE likeComment (
	commentPost INT,
	commentTimeStamp TIMESTAMP,
	account VARCHAR(20),
	PRIMARY KEY (commentPost, commentTimeStamp, account),
	FOREIGN KEY (commentPost) REFERENCES Post(postID),
	FOREIGN KEY (commentTimeStamp) REFERENCES Comment(timeStamp),
	FOREIGN KEY (account) REFERENCES Account(username)
);

CREATE TABLE Chat (
	chatID SERIAL PRIMARY KEY
);

CREATE TABLE participates (
	chatID INT,
	acc VARCHAR(20) DEFAULT 'user0',
	PRIMARY KEY (chatID, acc),
	FOREIGN KEY (chatID) REFERENCES Chat(chatID)
	ON DELETE CASCADE,
	FOREIGN KEY (acc) REFERENCES Account(username)
	ON DELETE SET DEFAULT 
);

CREATE TABLE Message (
	chatID INT,
	account VARCHAR(20) DEFAULT 'user0',
	timeAndDate TIMESTAMP,
	PRIMARY KEY (chatID, account, timeAndDate),
	FOREIGN KEY (chatID) REFERENCES Chat(chatID) 
	ON DELETE CASCADE,
	FOREIGN KEY (account) REFERENCES Account(username) 
	ON DELETE SET DEFAULT
);


INSERT INTO Account(username, email, URL) VALUES
('user1', 'test1@gmail.com', 'http://www.example1.com'),
('user2', 'test2@gmail.com', 'http://www.example2.com'),
('user3', 'test3@gmail.com', 'http://www.example3.com'),
('user4', 'test4@gmail.com', 'http://www.example4.com'),
('user5', 'test5@gmail.com', 'http://www.example5.com');

INSERT INTO Permissions(type, cost) VALUES
('normalUser', 0),
('premiumUser', 10),
('admin', 20),
('editor', 5),
('viewer', 0);

INSERT INTO hasPermissions(username, perms) VALUES
('user1', 'normalUser'),
('user2', 'premiumUser'),
('user3', 'admin'),
('user4', 'editor'),
('user5', 'viewer');

INSERT INTO follow(follower, following) VALUES
('user1', 'user2'),
('user2', 'user3'),
('user3', 'user4'),
('user4', 'user5'),
('user5', 'user1');

INSERT INTO Login(username, password) VALUES
('user1', 'pass1'),
('user2', 'pass2'),
('user3', 'pass3'),
('user4', 'pass4'),
('user5', 'pass5');

INSERT INTO validateUser(accountUser, loginUser) VALUES
('user1', 'user1'),
('user2', 'user2'),
('user3', 'user3'),
('user4', 'user4'),
('user5', 'user5');

INSERT INTO Hashtags(text, color) VALUES
('Hashtag1', 'FF0000'),
('Hashtag2', '00FF00'),
('Hashtag3', '0000FF'),
('Hashtag4', 'FFFF00'),
('Hashtag5', 'FF00FF');

INSERT INTO Caption(caption, advertisement) VALUES
('This is caption 1', TRUE),
('This is caption 2', FALSE),
('This is caption 3', TRUE),
('This is caption 4', FALSE),
('This is caption 5', TRUE);

INSERT INTO Post(postID, URL, caption, createdBy, timestamp, type) VALUES
(1, 'http://example1.com', 'This is caption 1', 'user1', '2023-10-10 00:00:00', 0),
(2, 'http://example2.com', 'This is caption 2', 'user2', '2023-10-10 00:00:00', 0),
(3, 'http://example3.com', 'This is caption 3', 'user3', '2023-10-10 00:00:00', 0),
(4, 'http://example4.com', 'This is caption 4', 'user4', '2023-10-10 00:00:00', 0),
(5, 'http://example5.com', 'This is caption 5', 'user5', '2023-10-10 00:00:00', 0),
(6, 'http://example6.com', 'This is caption 1', 'user1', '2023-10-10 00:00:00', 1),
(7, 'http://example7.com', 'This is caption 2', 'user2', '2023-10-10 00:00:00', 1),
(8, 'http://example8.com', 'This is caption 3', 'user3', '2023-10-10 00:00:00', 1),
(9, 'http://example9.com', 'This is caption 4', 'user4', '2023-10-10 00:00:00', 1),
(10, 'http://example10.com', 'This is caption 5', 'user5', '2023-10-10 00:00:00', 1),
(11, 'http://example11.com', 'This is caption 1', 'user1', '2023-10-10 00:00:00', 2),
(12, 'http://example12.com', 'This is caption 2', 'user2', '2023-10-10 00:00:00', 2),
(13, 'http://example13.com', 'This is caption 3', 'user3', '2023-10-10 00:00:00', 2),
(14, 'http://example14.com', 'This is caption 4', 'user4', '2023-10-10 00:00:00', 2),
(15, 'http://example15.com', 'This is caption 5', 'user5', '2023-10-10 00:00:00', 2);

INSERT INTO likePost(postID, acc) VALUES
(1, 'user1'),
(2, 'user2'),
(3, 'user3'),
(4, 'user4'),
(5, 'user5');

INSERT INTO TextPost(postID, content) VALUES
(1, 'This is a text post 1'),
(2, 'This is a text post 2'),
(3, 'This is a text post 3'),
(4, 'This is a text post 4'),
(5, 'This is a text post 5');

INSERT INTO VideoPost(postID, content) VALUES
(11, 'BINARY_DATA'),
(12, 'BINARY_DATA'),
(13, 'BINARY_DATA'),
(14, 'BINARY_DATA'),
(15, 'BINARY_DATA');

INSERT INTO ImagePost(postID, content) VALUES
(6, 'BINARY_DATA'),
(7, 'BINARY_DATA'),
(8, 'BINARY_DATA'),
(9, 'BINARY_DATA'),
(10, 'BINARY_DATA');

INSERT INTO associateHashtag(postID, hashTag) VALUES
(1, 'Hashtag1'),
(2, 'Hashtag2'),
(3, 'Hashtag3'),
(4, 'Hashtag4'),
(5, 'Hashtag5');

INSERT INTO Comment(commentPost, commenter, timeStamp, contents) VALUES
(1, 'user1', '2023-10-10 00:00:00', 'This is a comment 1'),
(1, 'user2', '2023-10-10 00:00:01', 'This is a comment 2'),
(1, 'user3', '2023-10-10 00:00:02', 'This is a comment 3'),
(1, 'user4', '2023-10-10 00:00:03', 'This is a comment 4'),
(1, 'user5', '2023-10-10 00:00:04', 'This is a comment 5'),
(1, 'user1', '2023-10-10 00:00:05', 'This is a comment 6');


INSERT INTO reply(post, repliedTo, reply) VALUES
(1, '2023-10-10 00:00:00', '2023-10-10 00:00:01'),
(1, '2023-10-10 00:00:01', '2023-10-10 00:00:02'),
(1, '2023-10-10 00:00:02', '2023-10-10 00:00:03'),
(1, '2023-10-10 00:00:03', '2023-10-10 00:00:04'),
(1, '2023-10-10 00:00:04', '2023-10-10 00:00:05');


INSERT INTO likeComment(commentPost, commentTimeStamp, account) VALUES
(1, '2023-10-10 00:00:00', 'user1'),
(1, '2023-10-10 00:00:01', 'user2'),
(1, '2023-10-10 00:00:02', 'user3'),
(1, '2023-10-10 00:00:03', 'user4'),
(1, '2023-10-10 00:00:04', 'user5');

-- Commented out due to Serial
-- INSERT INTO Chat(chatID) VALUES
-- (-1),
-- (-2),
-- (-3),
-- (-4),
-- (-5);

-- INSERT INTO participates(chatID, acc) VALUES
-- (1, 'user1'),
-- (2, 'user2'),
-- (3, 'user3'),
-- (4, 'user4'),
-- (5, 'user5');

-- INSERT INTO Message(chatID, account, timeAndDate) VALUES
-- (1, 'user1', '2023-10-10 00:00:00'),
-- (2, 'user2', '2023-10-10 00:00:01'),
-- (3, 'user3', '2023-10-10 00:00:02'),
-- (4, 'user4', '2023-10-10 00:00:03'),
-- (5, 'user5', '2023-10-10 00:00:04');


