DROP DATABASE IF EXISTS `[[DB-NAME]]`;
CREATE DATABASE `[[DB-NAME]]`;
USE `[[DB-NAME]]`;

CREATE TABLE IF NOT EXISTS `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `manager` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `costCenter` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastChanged` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `projects` (`id`, `number`, `label`, `description`, `manager`, `customer`, `costCenter`, `lastChanged`) VALUES
	(1, 'PR20-0005', 'Test-Projekt 5', 'Unser erstes gemeinsames agiles Projekt.', 'Michael Lamprecht', 'Snickers vs Mars', 'Studenten', NULL),
	(2, 'PR20-0001', 'Test-Projekt 1', 'Das ist das erste Test-Projekt.', 'Christian Sitzwohl', 'Campus02', 'Intern', NULL),
	(3, 'PR20-0003', 'Test-Projekt 3', 'Es wird noch immer fleißig getestet! Brav ;)', 'Karl Karlson', 'Carlsberg', 'Event-Management', NULL),
	(4, 'PR20-0004', 'Test-Projekt 4', 'Hier folgt eine sehr kreative Beschreibung dieses Projekts, das ohnehin nur zu Testzwecken angelegt wurd.', 'Christian Sitzwohl', 'TU Graz', 'Extern', NULL),
	(5, 'PR20-0002', 'Test-Projekt 2', 'Schon wieder ein Test-Projekt.', 'Thorsten Mustermensch', 'Intern', 'Intern', NULL);


CREATE TABLE IF NOT EXISTS `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`) USING BTREE,
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=130 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `employees` (`id`, `project_id`, `name`) VALUES
	(1, 1, 'Islam Hemida'),
	(2, 1, 'Martin Guevara-Kunerth'),
	(3, 2, 'Michael Lamprecht'),
	(4, 2, 'Marian Korosec'),
	(5, 2, 'Samuel Angerer'),
	(6, 4, 'Michael Lamprecht'),
	(7, 4, 'Marian Korosec'),
	(8, 5, 'Christian Sitzwohl'),
	(9, 5, 'Marian Korosec'),
	(10, 5, 'Samuel Angerer'),
	(11, 5, 'Islam Hemida'),
	(12, 5, 'Martin Guevara-Kunerth');

CREATE TABLE IF NOT EXISTS `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `filename` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` mediumblob NOT NULL,
  `mimeType` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `files_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=172 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `milestones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `date` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=211 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `milestones` (`id`, `project_id`, `date`, `label`, `description`) VALUES
	(1, 1, '2020-12-09', 'Projekt Start', 'Projektstart'),
	(2, 1, '2021-12-09', 'Projekt Ende', 'Projektabschluss'),
	(3, 2, '2020-11-09', 'Kick-off', 'Kick-off Meeting'),
	(4, 2, '2020-11-08', 'Projekt Start', 'Projektstart'),
	(5, 2, '2021-01-09', 'Projekt Ende', 'Projektabschluss'),
	(6, 3, '2020-11-09', 'Projekt Start', 'Projektstart'),
	(7, 3, '2021-01-06', 'Haupt-Event', 'Veranstaltung XY'),
	(8, 3, '2021-01-09', 'Projekt Ende', 'Projektabschluss'),
	(9, 4, '2020-11-09', 'Projekt Start', 'Projektstart'),
	(10, 4, '2021-01-09', 'Projekt Ende', 'Projektabschluss'),
	(11, 5, '2020-11-09', 'Projekt Start', 'Projektstart'),
	(12, 5, '2021-01-09', 'Projekt Ende', 'Projektabschluss');

CREATE TABLE IF NOT EXISTS `numbers` (
  `tableName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '0',
  `year` int NOT NULL,
  `nextNumber` int DEFAULT NULL,
  PRIMARY KEY (`tableName`,`year`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `numbers` (`tableName`, `year`, `nextNumber`) VALUES
	('projects', 2021, 200);

SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `tg_projects_number` BEFORE INSERT ON `projects` FOR EACH ROW BEGIN
	DECLARE next_number INT;
	
	SELECT nextNumber INTO next_number
	FROM numbers
	WHERE tableName = 'projects' AND `year` = YEAR(CURDATE());
     
   SET NEW.number = CONCAT('PR', DATE_FORMAT(CURDATE(), '%y'), '-', LPAD(next_number, 4, '0'));
   
   UPDATE numbers
   SET nextNumber = nextNumber + 1
	WHERE tableName = 'projects' AND `year` = YEAR(CURDATE());
   
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;