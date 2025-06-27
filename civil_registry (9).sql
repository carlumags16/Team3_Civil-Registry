-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 25, 2025 at 12:06 PM
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
  `mother_maiden_middlename` varchar(50) NOT NULL,
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
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('PENDING','RECEIVED','PROCESSING','APPROVED','REJECTED','PAID','UNPAID','SIGNED','READY_FOR_RELEASE','RELEASED') DEFAULT 'PENDING',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `birth_certi`
--

INSERT INTO `birth_certi` (`id`, `user_id`, `child_firstname`, `child_middlename`, `child_lastname`, `child_suffix`, `child_date_birth`, `sexual_orientation`, `child_place_birth`, `nationality`, `mother_maiden_middlename`, `mother_maiden_firstname`, `mother_maiden_lastname`, `father_firstname`, `father_middlename`, `father_lastname`, `father_suffix`, `address`, `address_option`, `purpose_certi`, `number_copies`, `created_at`, `status`, `updated_at`, `updated_by`, `amount`) VALUES
(25, 32, 'Carl Angelo', 'Pesigan', 'Lumagui', '', '2025-02-13', 'Male', 'fasfsf', 'Foreigner', 'fafa', 'fa', 'faf', 'fafa', 'afafa', 'af', '', 'fafafa', 'Delivery', 'Legal and Administrative Purposes', 2, '2025-06-09 14:32:11', 'RECEIVED', '2025-06-24 13:56:46', 0, 0.00),
(26, 53, 'sgsg', 'gsgsg', 'g', '', '2025-06-04', 'Male', 'gsgs', 'Filipino', 'sgg', 'gsg', 'g', 'gsg', 'gsg', 'gs', '', 'gsgs', 'Delivery', 'Proof of No Death Record', 2, '2025-06-09 21:23:04', 'REJECTED', '2025-06-23 10:19:00', NULL, 0.00),
(29, 72, 'Carl Angelo', 'a', 'Lumagui', 'N/A', '2025-06-09', 'Male', 'a', 'Filipino', 'a', 'Carl Angelo', 'Lumagui', 'Carl Angelo', 'a', 'Lumagui', 'Jr.', '1543 Milagros St.', 'Delivery', 'Legal and Administrative Purposes', 1, '2025-06-10 15:58:50', 'RECEIVED', '2025-06-24 13:56:47', 0, 0.00),
(33, 32, 'Carl Angelo', 'a', 'Lumagui', 'Jr.', '2025-06-18', 'Male', 'cac', 'Filipino', 'caca', 'Carl Angelo', 'Lumagui', 'Carl Angelo', 'cac', 'Lumagui', 'Sr.', '1543 Milagros St.', 'Delivery', 'Demonstrating Potential Alive Status', 1, '2025-06-23 18:53:38', 'REJECTED', '2025-06-24 02:42:51', 0, 0.00),
(34, 32, 'Juana', 'Marie', 'Dela Cruzs', 'N/A', '2025-06-11', 'Female', 'HAHHAHA', 'Filipino', 'AAAA', 'HAHA', 'HAA', 'RERER', 'QWRQ', 'QWEQ', 'N/A', '12345 SGAG', 'Delivery', 'Legal and Administrative Purposes', 1, '2025-06-24 20:03:50', 'RELEASED', '2025-06-25 09:18:53', 0, 0.00);

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
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('PENDING','RECEIVED','PROCESSING','APPROVED','REJECTED','PAID','UNPAID','SIGNED','READY_FOR_RELEASE','RELEASED') DEFAULT 'PENDING',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('PENDING','RECEIVED','PROCESSING','APPROVED','REJECTED','PAID','UNPAID','SIGNED','READY_FOR_RELEASE','RELEASED') DEFAULT 'PENDING',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cenomar_certi`
--

INSERT INTO `cenomar_certi` (`id`, `user_id`, `child_firstname`, `child_middlename`, `child_lastname`, `child_suffix`, `date_birth`, `place_birth`, `sexual_orientation`, `nationality`, `mother_maiden_firstname`, `mother_maiden_middlename`, `mother_maiden_lastname`, `father_firstname`, `father_middlename`, `father_lastname`, `father_suffix`, `address`, `address_option`, `purpose_certi`, `number_copies`, `created_at`, `status`, `updated_at`, `updated_by`, `amount`) VALUES
(8, 32, 'Juana', 0, 'Dela Susan', 'N/A', '2025-06-05', '1234 PUP', 'Male', 'Filipino', 'Carl', 'fsfsaf', 'afaas', 'fafafa', 'fafaf', 'fafa', 'N/A', '1234 PUP', 'Delivery', 'legal_and_administrative_purposes', 1, '2025-06-24 11:38:51', 'SIGNED', '2025-06-24 15:45:34', 0, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `certificate_releases`
--

CREATE TABLE `certificate_releases` (
  `id` int(11) NOT NULL,
  `certificate_id` int(11) NOT NULL,
  `certificate_type` enum('BIRTH','DEATH','CENODEATH','CENOMAR','MARRIAGE') NOT NULL,
  `released_by` int(11) NOT NULL,
  `released_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `received_by` varchar(100) NOT NULL,
  `relationship` varchar(50) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `is_representative` tinyint(1) DEFAULT 0,
  `representative_name` varchar(100) DEFAULT NULL,
  `representative_relationship` varchar(50) DEFAULT NULL,
  `valid_id_path` varchar(255) DEFAULT NULL,
  `auth_letter_path` varchar(255) DEFAULT NULL,
  `release_notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('PENDING','RECEIVED','PROCESSING','APPROVED','REJECTED','PAID','UNPAID','SIGNED','READY_FOR_RELEASE','RELEASED') DEFAULT 'PENDING',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `death_certi`
--

INSERT INTO `death_certi` (`id`, `user_id`, `dead_firstname`, `dead_middlename`, `dead_lastname`, `dead_suffix`, `date_birth`, `date_death`, `sexual_orientation`, `nationality`, `place_death`, `address`, `address_option`, `purpose_certi`, `number_copies`, `created_at`, `status`, `updated_at`, `updated_by`, `amount`) VALUES
(32, 32, 'ca', 'ss', 'ss', 'N/A', '2025-06-10', '2025-06-14', 'Male', 'Filipino', '', '1543 Milagros St.', 'Delivery', 'others', 2, '2025-06-23 14:57:55', 'REJECTED', '2025-06-24 03:25:30', 0, 0.00),
(35, 32, 'ALDEN', 'RECHARGE', 'RICHARD', 'N/A', '2025-03-05', '2025-06-21', 'Male', 'Filipino', '', '1234 PUP', 'Delivery', 'demonstrating_potential_alive_status', 1, '2025-06-24 11:42:06', 'SIGNED', '2025-06-24 10:23:43', 0, 0.00),
(36, 32, 'Coco', 'Cardo', 'Martin', 'N/A', '2025-06-05', '2025-06-17', 'Male', 'Filipino', '', '1234 PUP', 'Delivery', 'legal_and_administrative_purposes', 1, '2025-06-25 06:29:21', 'SIGNED', '2025-06-25 08:52:08', 0, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `id` int(11) NOT NULL,
  `reg_id` varchar(20) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cert_id` int(11) NOT NULL,
  `certif_type` enum('Birth Certificate','Death Certificate','Marriage Certificate','CENOMAR Certificate','CENODEATH Certificate') NOT NULL,
  `status` enum('PENDING','RECEIVED','PROCESSING','APPROVED','REJECTED','PAID','UNPAID','SIGNED','READY_FOR_RELEASE','RELEASED') DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `transaction_number` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `document`
--

INSERT INTO `document` (`id`, `reg_id`, `user_id`, `cert_id`, `certif_type`, `status`, `created_at`, `updated_at`, `amount`, `transaction_number`) VALUES
(21, 'REG-00014', 32, 32, 'Death Certificate', 'REJECTED', '2025-06-23 06:57:55', '2025-06-24 03:25:30', 0.00, NULL),
(22, 'REG-00015', 32, 33, 'Birth Certificate', 'REJECTED', '2025-06-23 10:53:38', '2025-06-24 02:42:51', 0.00, NULL),
(23, 'REG-00016', 32, 33, 'Death Certificate', 'APPROVED', '2025-06-24 02:33:50', '2025-06-24 02:41:45', 0.00, NULL),
(24, 'REG-00017', 32, 34, 'Death Certificate', 'APPROVED', '2025-06-24 02:51:11', '2025-06-24 02:57:06', 0.00, NULL),
(25, 'REG-00018', 32, 8, 'CENOMAR Certificate', 'REJECTED', '2025-06-24 03:38:51', '2025-06-24 04:23:42', 0.00, NULL),
(26, 'REG-00019', 32, 35, 'Death Certificate', 'SIGNED', '2025-06-24 03:42:06', '2025-06-24 10:23:43', 0.00, NULL),
(27, 'REG-00020', 32, 18, 'Marriage Certificate', 'SIGNED', '2025-06-24 07:59:27', '2025-06-24 10:23:47', 0.00, NULL),
(28, 'REG-00021', 32, 34, 'Birth Certificate', 'RELEASED', '2025-06-24 12:03:50', '2025-06-25 09:18:53', 0.00, NULL),
(29, 'REG-00022', 32, 36, 'Death Certificate', 'SIGNED', '2025-06-24 22:29:21', '2025-06-25 08:52:08', 710.00, 'TXN-20250625-9E3673');

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
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('PENDING','RECEIVED','PROCESSING','APPROVED','REJECTED','PAID','UNPAID','SIGNED','READY_FOR_RELEASE','RELEASED') DEFAULT 'PENDING',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `marriage_certi`
--

INSERT INTO `marriage_certi` (`id`, `user_id`, `wife_firstname`, `wife_middle_name`, `wife_lastname`, `husband_firstname`, `husband_middle_name`, `husband_lastname`, `husband_suffix`, `date_marriage`, `place_marriage`, `wife_nationality`, `husband_nationality`, `address`, `address_option`, `purpose_certi`, `number_copies`, `created_at`, `status`, `updated_at`, `updated_by`, `amount`) VALUES
(18, 32, 'a', 'a', 'a', 'a', 'a', 'a', 'N/A', '2025-06-22', '1234', 'Filipino', 'Filipino', '12355', 'Delivery', 'legal_and_administrative_purposes', 2, '2025-06-24 15:59:27', 'SIGNED', '2025-06-24 10:23:47', 0, 0.00);

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
(32, 'carl456', 'carl456@gmail.com', '$2y$10$k6AMMFAtfBHHf1WMu3ckkuc6GOVhTPw/gjQfsldA4IR0WbvC3JK92', '2025-06-07 05:35:24'),
(53, 'carl1234', 'carl1234@gmail.com', '$2y$10$3orDSrx11yjgdB8Fd7jVeuCV3MgxVONmZ7YTQN9osLZGxKbLyv3VG', '2025-06-09 13:21:52'),
(72, 'vea123', 'vea123@gmail.com', '$2y$10$5kOpvGMALSuLD/evbE8V3OaIlR1Z6goMLAMyT2ioOcqsyHi8JB9by', '2025-06-10 07:43:15');

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
-- Indexes for table `certificate_releases`
--
ALTER TABLE `certificate_releases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `released_by` (`released_by`),
  ADD KEY `idx_certificate_releases_cert` (`certificate_id`,`certificate_type`),
  ADD KEY `idx_certificate_releases_date` (`released_at`);

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
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_certificate` (`cert_id`,`certif_type`),
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `cenodeath_certi`
--
ALTER TABLE `cenodeath_certi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `cenomar_certi`
--
ALTER TABLE `cenomar_certi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `certificate_releases`
--
ALTER TABLE `certificate_releases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `death_certi`
--
ALTER TABLE `death_certi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `marriage_certi`
--
ALTER TABLE `marriage_certi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

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
-- Constraints for table `certificate_releases`
--
ALTER TABLE `certificate_releases`
  ADD CONSTRAINT `certificate_releases_ibfk_1` FOREIGN KEY (`released_by`) REFERENCES `admin` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `death_certi`
--
ALTER TABLE `death_certi`
  ADD CONSTRAINT `death_certi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `marriage_certi`
--
ALTER TABLE `marriage_certi`
  ADD CONSTRAINT `marriage_certi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
