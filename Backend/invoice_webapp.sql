-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 02, 2025 at 05:52 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `invoice_webapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(72) NOT NULL,
  `description` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `category_name`, `description`) VALUES
(1, 'Graduation', 'Photography Graduation ');

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--
SET sql_mode = '';
CREATE TABLE `invoice` (
  `id` int(11) NOT NULL,
  `customer` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `due_date` date NOT NULL,
  `note` varchar(50) NOT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `downpayment` decimal(10,2) NOT NULL DEFAULT 0.00,
  `inv_id` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`id`, `customer`, `date`, `due_date`, `note`, `total`, `discount`, `downpayment`, `inv_id`) VALUES
(19, 'Beta Deni', '2025-03-06', '2025-03-06', 'test 1', '478000.00', '12.00', '50000.00', 'INV0019'),
(20, 'test', '2025-03-06', '2025-05-02', '', '629000.00', '3.00', '50000.00', 'INV0020'),
(24, 'Yosef', '2025-06-30', '2025-06-03', '', '190000.00', '20.00', '50000.00', 'INV0021'),
(26, 'testcust', '2025-07-01', '2025-07-05', 'test', '168400.00', '16.00', '50000.00', 'INV0022');

--
-- Triggers `invoice`
--
DELIMITER $$
CREATE TRIGGER `before_invoice_insert` BEFORE INSERT ON `invoice` FOR EACH ROW BEGIN
  IF NEW.inv_id IS NULL THEN
    SET NEW.inv_id = CONCAT('INV', LPAD(NEW.id, 4, '0'));
  END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `generate_inv_id` BEFORE INSERT ON `invoice` FOR EACH ROW BEGIN
  DECLARE next_seq INT;
  SELECT IFNULL(MAX(CAST(SUBSTRING(inv_id, 4) AS UNSIGNED)), 0) + 1 
  INTO next_seq FROM invoice;
  SET NEW.inv_id = CONCAT('INV', LPAD(next_seq, 4, '0'));
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `description`, `price`) VALUES
(24, 19, 'Item 1', '200000.00'),
(25, 19, 'Item 2', '400000.00'),
(26, 20, 'test', '200000.00'),
(27, 20, 'test', '500000.00'),
(33, 24, 'Personal', '300000.00'),
(37, 26, 'te', '240000.00'),
(38, 26, 'of', '20000.00');

-- --------------------------------------------------------

--
-- Table structure for table `price_list`
--

CREATE TABLE `price_list` (
  `id` int(11) NOT NULL,
  `package` varchar(50) NOT NULL,
  `price` bigint(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `price_list`
--

INSERT INTO `price_list` (`id`, `package`, `price`, `description`, `category`, `date`) VALUES
(1, 'Personal Package', 200000, '- 1 Graduate\r\n- 45 Minutes\r\n- Unlimited Shoot\r\n- 25 Edited Photo\r\n- All file in Google Drive', 'Graduation', '2025-03-06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `price_list`
--
ALTER TABLE `price_list`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category` (`category`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `price_list`
--
ALTER TABLE `price_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `price_list`
--
ALTER TABLE `price_list`
  ADD CONSTRAINT `price_list_ibfk_1` FOREIGN KEY (`category`) REFERENCES `category` (`category_name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
