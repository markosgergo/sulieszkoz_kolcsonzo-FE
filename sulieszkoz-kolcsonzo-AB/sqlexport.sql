-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `eszkoz`
--

DROP TABLE IF EXISTS `eszkoz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eszkoz` (
  `eszkoz_id` int NOT NULL AUTO_INCREMENT,
  `nev` varchar(45) DEFAULT NULL,
  `tipus` varchar(45) DEFAULT NULL,
  `sku` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`eszkoz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eszkoz`
--

LOCK TABLES `eszkoz` WRITE;
/*!40000 ALTER TABLE `eszkoz` DISABLE KEYS */;
/*!40000 ALTER TABLE `eszkoz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `felhasznalo`
--

DROP TABLE IF EXISTS `felhasznalo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `felhasznalo` (
  `felhasznalo_id` int NOT NULL AUTO_INCREMENT,
  `nev` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `jelszo` varchar(255) DEFAULT NULL,
  `szerepkor_id` int DEFAULT NULL,
  PRIMARY KEY (`felhasznalo_id`),
  KEY `fk_felhasznalo_szerepkor_idx` (`szerepkor_id`),
  CONSTRAINT `fk_felhasznalo_szerepkor` FOREIGN KEY (`szerepkor_id`) REFERENCES `szerepkor` (`szerepkor_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `felhasznalo`
--

LOCK TABLES `felhasznalo` WRITE;
/*!40000 ALTER TABLE `felhasznalo` DISABLE KEYS */;
/*!40000 ALTER TABLE `felhasznalo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kolcsonzes`
--

DROP TABLE IF EXISTS `kolcsonzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kolcsonzes` (
  `kolcsonzes_id` int NOT NULL AUTO_INCREMENT,
  `felhasznalo_id` int DEFAULT NULL,
  `eszkoz_id` int DEFAULT NULL,
  `kiado_id` int DEFAULT NULL,
  `statusz_id` int DEFAULT NULL,
  `kiadas_datuma` datetime DEFAULT NULL,
  `visszavetel_datuma` datetime DEFAULT NULL,
  `hatarido` date DEFAULT NULL,
  PRIMARY KEY (`kolcsonzes_id`),
  KEY `fk_kolcsonzes_felhasznalo_idx` (`felhasznalo_id`),
  KEY `fk_kolcsonzes_eszkoz_idx` (`eszkoz_id`),
  KEY `fk_kolcsonzes_kiado_idx` (`kiado_id`),
  KEY `fk_kolcsonzes_statusz_idx` (`statusz_id`),
  CONSTRAINT `fk_kolcsonzes_eszkoz` FOREIGN KEY (`eszkoz_id`) REFERENCES `eszkoz` (`eszkoz_id`),
  CONSTRAINT `fk_kolcsonzes_felhasznalo` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalo` (`felhasznalo_id`),
  CONSTRAINT `fk_kolcsonzes_kiado` FOREIGN KEY (`kiado_id`) REFERENCES `felhasznalo` (`felhasznalo_id`),
  CONSTRAINT `fk_kolcsonzes_statusz` FOREIGN KEY (`statusz_id`) REFERENCES `kolcsonzesstatusz` (`statusz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kolcsonzes`
--

LOCK TABLES `kolcsonzes` WRITE;
/*!40000 ALTER TABLE `kolcsonzes` DISABLE KEYS */;
/*!40000 ALTER TABLE `kolcsonzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `kolcsonzesstatusz`
--

DROP TABLE IF EXISTS `kolcsonzesstatusz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kolcsonzesstatusz` (
  `statusz_id` int NOT NULL AUTO_INCREMENT,
  `statusz_nev` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`statusz_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kolcsonzesstatusz`
--

LOCK TABLES `kolcsonzesstatusz` WRITE;
/*!40000 ALTER TABLE `kolcsonzesstatusz` DISABLE KEYS */;
/*!40000 ALTER TABLE `kolcsonzesstatusz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `szerepkor`
--

DROP TABLE IF EXISTS `szerepkor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `szerepkor` (
  `szerepkor_id` int NOT NULL AUTO_INCREMENT,
  `szerepkor_nev` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`szerepkor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `szerepkor`
--

LOCK TABLES `szerepkor` WRITE;
/*!40000 ALTER TABLE `szerepkor` DISABLE KEYS */;
/*!40000 ALTER TABLE `szerepkor` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-26 18:11:45
