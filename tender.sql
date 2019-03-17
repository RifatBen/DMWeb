-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 17, 2019 at 05:16 PM
-- Server version: 10.1.37-MariaDB
-- PHP Version: 7.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tender`
--

-- --------------------------------------------------------

--
-- Table structure for table `Photos`
--

CREATE TABLE `Photos` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Photos`
--

INSERT INTO `Photos` (`id`, `user_id`, `name`) VALUES
(82, 8, 'Benmebarek_Rafik_8_rafik.jpg'),
(103, 85, 'Ouldsmina_Samia_85_RELEVE 3eme-001.jpg'),
(104, 86, 'Keys_Alicia_86_aliciakeys.jpg'),
(105, 87, 'Amokrane_Anas_87_anas.jpg'),
(106, 88, 'Dahou_Walid_88_dadou.jpg'),
(107, 89, 'Jackson_Michael_89_michael.jpeg'),
(108, 90, 'Boutorh_Aicha_90_Aicha_Boutorh.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `sexe` char(1) NOT NULL,
  `email` varchar(254) NOT NULL,
  `datenaissance` date NOT NULL,
  `password` varchar(255) NOT NULL,
  `description` text,
  `likes` longtext
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `nom`, `prenom`, `sexe`, `email`, `datenaissance`, `password`, `description`, `likes`) VALUES
(8, 'Benmebarek', 'Rafik', 'H', 'benmebarek.raf@gmail.com', '1998-05-01', '$2b$10$yfRCPMm1NkdGHIkdqEJ4yOi8qN0YhfcGuI6nPKxy6B90vyjXF0WUW', 'Créateur du site', '[{\"id\":88,\"likes\":1},{\"id\":87,\"likes\":1},{\"id\":86,\"likes\":0}]'),
(86, 'Keys', 'Alicia', 'F', 'alicia@keys.com', '1993-01-01', '$2b$10$SR9cNnGs3RDsZkhkTF/nvuKb/fI..nQxyVbfv9cx/KzEWsw/fR4JK', 'Je suis alicia keys, je chante et j\'aime ça', '[{\"id\":90,\"likes\":0}]'),
(87, 'Amokrane', 'Anas', 'H', 'anas@amokrane.dz', '1997-01-01', '$2b$10$oTJtPt.T6pFBvjVVnil3aea3qdbERmqWPdo1NCuthZkpcasIUPLbu', 'Je suis anas, je fais du sport, je joues a APEX et je veux pas jouer a SC2', '[{\"id\":8,\"likes\":1},{\"id\":88,\"likes\":1}]'),
(88, 'Dahou', 'Walid', 'H', 'dahou@walid.ez', '1994-01-01', '$2b$10$eGBjVnU3CfoofwBElg/AYOKb0eyT8PsQmNOzjX0djkUNflOOS89Za', 'Biologiste, je vis a clermont ferrand je m\'ennuie', '[{\"id\":8,\"likes\":1},{\"id\":85,\"likes\":0}]'),
(89, 'Jackson', 'Michael', 'H', 'michael@jackson.fake', '1980-01-01', '$2b$10$HtgI5reabABOGhIHSB8uSuapy3aud01vAns3pua0/LHGGuMhFBjry', 'Je suis un faux michael jackson, mais faut pas le dire', '[]'),
(90, 'Boutorh', 'Aicha', 'F', 'aicha@boutorh.fr', '1978-06-02', '$2b$10$lOrIfgNd1/Ef6gxqJ9u5Cetk7bAEglqF5Hc/VZgEdiFP0I4Er8kmK', 'Je suis connue pour ma fameuse phrase \"vou orié kru o cénéma\"', '[]');

-- --------------------------------------------------------

--
-- Table structure for table `User_criteres`
--

CREATE TABLE `User_criteres` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `minage` int(11) DEFAULT NULL,
  `maxage` int(11) DEFAULT NULL,
  `sexe` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User_criteres`
--

INSERT INTO `User_criteres` (`id`, `user_id`, `minage`, `maxage`, `sexe`) VALUES
(1, 8, 18, 80, 'H'),
(2, 84, NULL, NULL, NULL),
(3, 85, NULL, NULL, NULL),
(4, 86, 18, 26, 'H'),
(5, 87, 18, 28, 'F'),
(6, 88, 18, 32, 'H'),
(7, 89, 18, 34, 'B'),
(8, 90, 22, 34, 'H');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Photos`
--
ALTER TABLE `Photos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `User_criteres`
--
ALTER TABLE `User_criteres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Photos`
--
ALTER TABLE `Photos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `User_criteres`
--
ALTER TABLE `User_criteres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
