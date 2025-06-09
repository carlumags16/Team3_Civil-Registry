-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 09, 2025 at 07:23 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `civil_registry`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `birth_certi`
--

CREATE TABLE `birth_certi` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `child_firstname` varchar(50) NOT NULL,
  `child_middlename` varchar(50) NOT NULL,
  `child_lastname` varchar(50) NOT NULL,
  `child_suffix` varchar(10) DEFAULT NULL,
  `child_date_birth` date NOT NULL,
  `sexual_orientation` enum('Male','Female','Binary') NOT NULL,
  `child_place_birth` varchar(100) NOT NULL,
  `nationality` enum('Filipino','Foreigner') NOT NULL DEFAULT 'Filipino',
  `mother_maiden_middlename` bigint(50) NOT NULL,
  `mother_maiden_firstname` varchar(50) NOT NULL,
  `mother_maiden_lastname` varchar(50) NOT NULL,
  `father_firstname` varchar(50) NOT NULL,
  `father_middlename` varchar(50) NOT NULL,
  `father_lastname` varchar(50) NOT NULL,
  `father_suffix` varchar(10) DEFAULT NULL,
  `address` varchar(100) NOT NULL,
  `address_option` enum('Pickup','Delivery') NOT NULL,
  `purpose_certi` varchar(150) NOT NULL,
  `number_copies` int(50) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `birth_certi`
--

INSERT INTO `birth_certi` (`id`, `user_id`, `child_firstname`, `child_middlename`, `child_lastname`, `child_suffix`, `child_date_birth`, `sexual_orientation`, `child_place_birth`, `nationality`, `mother_maiden_middlename`, `mother_maiden_firstname`, `mother_maiden_lastname`, `father_firstname`, `father_middlename`, `father_lastname`, `father_suffix`, `address`, `address_option`, `purpose_certi`, `number_copies`, `created_at`) VALUES
(24, 32, 'Carl Angelo', 'fsfs', 'Lumagui', '', '2025-06-05', 'Male', 'fsf', 'Filipino', 0, 'fs', 's', 'sf', 'fsf', 'f', '', 'fsfs', 'Pickup', 'Proof of No Death Record', 2, '2025-06-09 07:25:17');

-- --------------------------------------------------------

--
-- Table structure for table `cenodeath_certi`
--

CREATE TABLE `cenodeath_certi` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `deceased_firstname` varchar(50) NOT NULL,
  `deceased_middlename` varchar(50) NOT NULL,
  `deceased_lastname` varchar(50) NOT NULL,
  `deceased_suffix` varchar(10) DEFAULT NULL,
  `sexual_orientation` enum('Male','Female','Binary') NOT NULL,
  `nationality` enum('Filipino','Foreigner') NOT NULL,
  `mother_firstname` varchar(50) NOT NULL,
  `mother_middlename` varchar(50) NOT NULL,
  `mother_lastname` varchar(50) NOT NULL,
  `father_firstname` varchar(50) NOT NULL,
  `father_middlename` varchar(50) NOT NULL,
  `father_lastname` varchar(50) NOT NULL,
  `father_suffix` varchar(10) DEFAULT NULL,
  `date_birth` date NOT NULL,
  `place_birth` varchar(150) NOT NULL,
  `address` varchar(150) NOT NULL,
  `address_option` enum('Pickup','Delivery') NOT NULL,
  `purpose_cert` varchar(150) NOT NULL,
  `number_copies` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cenodeath_certi`
--

INSERT INTO `cenodeath_certi` (`id`, `user_id`, `deceased_firstname`, `deceased_middlename`, `deceased_lastname`, `deceased_suffix`, `sexual_orientation`, `nationality`, `mother_firstname`, `mother_middlename`, `mother_lastname`, `father_firstname`, `father_middlename`, `father_lastname`, `father_suffix`, `date_birth`, `place_birth`, `address`, `address_option`, `purpose_cert`, `number_copies`, `created_at`) VALUES
(6, 32, 'afaf', 'fafafa', 'af', '', 'Male', 'Filipino', 'faf', 'dfaf', 'df', 'dfsf', 'df', 'sfsf', '', '2025-06-06', 'fafafa', 'fadffsd', 'Pickup', 'legal_and_administrative_purposes', 1, '2025-06-08 18:09:02'),
(7, 32, 'sfa', 'fasfaf', 'fafa', '', 'Male', 'Foreigner', 'fafafa', 'afa', 'fafaf', 'fafa', 'fafa', 'fafa', '', '2025-06-04', 'fafafa', '1543 Milagros St.', 'Delivery', '0', 3, '2025-06-09 09:11:53');

-- --------------------------------------------------------

--
-- Table structure for table `cenomar_certi`
--

CREATE TABLE `cenomar_certi` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `child_firstname` varchar(50) NOT NULL,
  `child_middlename` int(50) NOT NULL,
  `child_lastname` varchar(50) NOT NULL,
  `child_suffix` varchar(10) DEFAULT NULL,
  `date_birth` date NOT NULL,
  `place_birth` varchar(100) NOT NULL,
  `sexual_orientation` enum('Male','Female','Binary') NOT NULL,
  `nationality` enum('Filipino','Foreigner') NOT NULL,
  `mother_maiden_firstname` varchar(50) NOT NULL,
  `mother_maiden_middlename` varchar(50) NOT NULL,
  `mother_maiden_lastname` varchar(50) NOT NULL,
  `father_firstname` varchar(50) NOT NULL,
  `father_middlename` varchar(50) NOT NULL,
  `father_lastname` varchar(50) NOT NULL,
  `father_suffix` varchar(10) NOT NULL,
  `address` varchar(100) NOT NULL,
  `address_option` enum('Pickup','Delivery') NOT NULL,
  `purpose_certi` varchar(100) NOT NULL,
  `number_copies` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cenomar_certi`
--

INSERT INTO `cenomar_certi` (`id`, `user_id`, `child_firstname`, `child_middlename`, `child_lastname`, `child_suffix`, `date_birth`, `place_birth`, `sexual_orientation`, `nationality`, `mother_maiden_firstname`, `mother_maiden_middlename`, `mother_maiden_lastname`, `father_firstname`, `father_middlename`, `father_lastname`, `father_suffix`, `address`, `address_option`, `purpose_certi`, `number_copies`, `created_at`) VALUES
(2, 32, 'fafaf', 0, 'faf', '', '2025-06-12', 'fafafa', '', 'Filipino', 'faf', 'ffaf', 'afa', 'afa', 'af', 'faf', '', 'fafaf', 'Pickup', '', 1, '2025-06-08 18:12:06'),
(3, 32, 'Carl Angelo', 0, 'Lumagui', '', '2025-06-05', 'safaf', '', 'Foreigner', 'sa', 'afaf', 'faf', 'afa', 'hjtj', 'fsf', '', 'ateta', 'Delivery', 'proof_no_death_record', 3, '2025-06-09 09:11:16');

-- --------------------------------------------------------

--
-- Table structure for table `death_certi`
--

CREATE TABLE `death_certi` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `dead_firstname` varchar(50) NOT NULL,
  `dead_middlename` varchar(50) NOT NULL,
  `dead_lastname` varchar(50) DEFAULT NULL,
  `dead_suffix` varchar(10) NOT NULL,
  `date_birth` date NOT NULL,
  `date_death` date NOT NULL,
  `sexual_orientation` enum('Male','Female','Binary') NOT NULL,
  `nationality` enum('Filipino','Foreigner') NOT NULL,
  `place_death` varchar(100) NOT NULL,
  `address` varchar(100) NOT NULL,
  `address_option` enum('Pickup','Delivery') NOT NULL,
  `purpose_certi` varchar(100) NOT NULL,
  `number_copies` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `death_certi`
--

INSERT INTO `death_certi` (`id`, `user_id`, `dead_firstname`, `dead_middlename`, `dead_lastname`, `dead_suffix`, `date_birth`, `date_death`, `sexual_orientation`, `nationality`, `place_death`, `address`, `address_option`, `purpose_certi`, `number_copies`, `created_at`) VALUES
(24, 32, 'Carl Angelo', 'fafafa', 'Lumagui', '', '2025-06-05', '2025-06-08', 'Male', 'Filipino', '', '1543 Milagros St.', '', 'proof_no_death_record', 2, '2025-06-09 07:34:42'),
(25, 52, 'Carl Angelo', 'fafa', 'Lumagui', '', '2025-06-05', '2025-06-07', 'Male', 'Foreigner', '', 'g gdsg d', 'Delivery', 'legal_and_administrative_purposes', 2, '2025-06-09 13:10:30');

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `reg_id` varchar(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `cert_id` int(11) NOT NULL,
  `certif_type` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `document`
--

INSERT INTO `document` (`reg_id`, `user_id`, `cert_id`, `certif_type`, `status`) VALUES
('REG-00001', 32, 16, 'Marriage Certificate', 'PENDING'),
('REG-00002', 32, 24, 'Birth Certificate', 'PENDING'),
('REG-00003', 32, 24, 'Death Certificate', 'PENDING'),
('REG-00004', 32, 3, 'Cenomar Certificate', 'PENDING'),
('REG-00005', 32, 7, 'Cenodeath Certificate', 'PENDING'),
('REG-00006', 52, 25, 'Death Certificate', 'PENDING');

-- --------------------------------------------------------

--
-- Table structure for table `marriage_certi`
--

CREATE TABLE `marriage_certi` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `wife_firstname` varchar(50) NOT NULL,
  `wife_middle_name` varchar(10) NOT NULL,
  `wife_lastname` varchar(50) NOT NULL,
  `husband_firstname` varchar(50) NOT NULL,
  `husband_middle_name` varchar(10) NOT NULL,
  `husband_lastname` varchar(50) NOT NULL,
  `husband_suffix` varchar(20) NOT NULL,
  `date_marriage` date NOT NULL,
  `place_marriage` varchar(100) NOT NULL,
  `wife_nationality` enum('Filipino','Foreigner') NOT NULL,
  `husband_nationality` enum('Filipino','Foreigner') NOT NULL,
  `address` varchar(100) NOT NULL,
  `address_option` enum('Pickup','Delivery') NOT NULL,
  `purpose_certi` varchar(100) NOT NULL,
  `number_copies` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `marriage_certi`
--

INSERT INTO `marriage_certi` (`id`, `user_id`, `wife_firstname`, `wife_middle_name`, `wife_lastname`, `husband_firstname`, `husband_middle_name`, `husband_lastname`, `husband_suffix`, `date_marriage`, `place_marriage`, `wife_nationality`, `husband_nationality`, `address`, `address_option`, `purpose_certi`, `number_copies`, `created_at`) VALUES
(12, 14, 'aa', 'aaa', 'aaa', 'aaa', 'aa', 'aa', '', '2025-06-04', 'afasg', 'Filipino', 'Filipino', '', 'Pickup', 'legal_and_administrative_purposes', 1, '2025-06-08 18:03:02'),
(16, 32, 'Carl Angelo', 'g', 'Lumagui', 'Carl Angelo', 'aa', 'Lumagui', '', '2025-06-04', 'fsff', 'Filipino', 'Filipino', '1543 Milagros St.', 'Delivery', 'proof_no_death_record', 2, '2025-06-09 01:53:15');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(14, 'carl098', 'carl098@gmail.com', '$2y$10$fhbt28f/d3keuLAF0/.Z/e04NGK2bnRT38mL22zp.mfe0mJeP2Kgu', '2025-06-05 05:54:51'),
(32, 'carl456', 'carl456@gmail.com', '$2y$10$k6AMMFAtfBHHf1WMu3ckkuc6GOVhTPw/gjQfsldA4IR0WbvC3JK92', '2025-06-07 05:35:24'),
(52, 'carl678', 'carl678@gmail.com', '$2y$10$UTUGo49H3ES1PJqYmssdOOnxZiDaZ2.EIE2edzXlZb3KQpOXBnrja', '2025-06-09 05:09:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `birth_certi`
--
ALTER TABLE `birth_certi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cenodeath_certi`
--
ALTER TABLE `cenodeath_certi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cenomar_certi`
--
ALTER TABLE `cenomar_certi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `death_certi`
--
ALTER TABLE `death_certi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`reg_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `marriage_certi`
--
ALTER TABLE `marriage_certi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `birth_certi`
--
ALTER TABLE `birth_certi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `cenodeath_certi`
--
ALTER TABLE `cenodeath_certi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `cenomar_certi`
--
ALTER TABLE `cenomar_certi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `death_certi`
--
ALTER TABLE `death_certi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `marriage_certi`
--
ALTER TABLE `marriage_certi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `birth_certi`
--
ALTER TABLE `birth_certi`
  ADD CONSTRAINT `birth_certi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `birth_certi_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `cenodeath_certi`
--
ALTER TABLE `cenodeath_certi`
  ADD CONSTRAINT `cenodeath_certi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `cenomar_certi`
--
ALTER TABLE `cenomar_certi`
  ADD CONSTRAINT `cenomar_certi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `death_certi`
--
ALTER TABLE `death_certi`
  ADD CONSTRAINT `death_certi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `document_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `marriage_certi`
--
ALTER TABLE `marriage_certi`
  ADD CONSTRAINT `marriage_certi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
