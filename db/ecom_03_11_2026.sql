-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 03, 2026 at 12:25 AM
-- Server version: 9.7.0
-- PHP Version: 8.5.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecom`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `mobileNumber` varchar(255) DEFAULT NULL,
  `addressLine1` varchar(255) NOT NULL,
  `addressLine2` varchar(255) DEFAULT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `pinCode` varchar(255) NOT NULL,
  `addressType` varchar(255) NOT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `userId`, `mobileNumber`, `addressLine1`, `addressLine2`, `city`, `state`, `pinCode`, `addressType`, `isDefault`, `createdAt`, `updatedAt`) VALUES
(1, 2, '9887988798', 'Shiv Ganga Society', 'Kondhwa', 'Pune', 'Mah', '411001', 'home', 1, '2026-06-27 16:34:55', '2026-06-27 16:35:31');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int NOT NULL,
  `userId` int DEFAULT NULL,
  `userEmail` varchar(255) DEFAULT NULL,
  `userRole` varchar(255) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `entityType` varchar(255) DEFAULT NULL,
  `entityId` varchar(255) DEFAULT NULL,
  `description` text,
  `changes` text,
  `status` varchar(255) NOT NULL DEFAULT 'success',
  `ipAddress` varchar(255) DEFAULT NULL,
  `userAgent` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `userId`, `userEmail`, `userRole`, `action`, `entityType`, `entityId`, `description`, `changes`, `status`, `ipAddress`, `userAgent`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'ecomadminuser@web-library.net', 'admin', 'USER_LOGIN', NULL, NULL, 'User ecomadminuser@web-library.net (admin) logged in successfully.', NULL, 'success', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-28 16:03:26', '2026-06-28 16:03:26'),
(2, 1, 'ecomadminuser@web-library.net', 'admin', 'UPDATE_USER', 'User', '3', 'User ecomselleruser@web-library.net updated by ecomadminuser@web-library.net', '{\"before\":{\"isActive\":true,\"firstName\":\"seller\",\"lastName\":\"sutar\",\"mobileNumber\":\"7889566787\",\"userType\":\"seller\"},\"after\":{\"id\":3,\"firstName\":\"john\",\"lastName\":\"doe\",\"email\":\"ecomselleruser@web-library.net\",\"mobileNumber\":\"7889566787\",\"userType\":\"seller\",\"isActive\":true,\"addresses\":[]}}', 'success', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-28 16:04:53', '2026-06-28 16:04:53'),
(3, 1, 'ecomadminuser@web-library.net', 'admin', 'USER_LOGIN', NULL, NULL, 'User ecomadminuser@web-library.net (admin) logged in successfully.', NULL, 'success', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-28 16:37:15', '2026-06-28 16:37:15'),
(4, 1, 'ecomadminuser@web-library.net', 'admin', 'USER_LOGIN', NULL, NULL, 'User ecomadminuser@web-library.net (admin) logged in successfully.', NULL, 'success', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36', '2026-06-28 16:53:50', '2026-06-28 16:53:50'),
(5, NULL, 'admin@ecom.com', NULL, 'USER_LOGIN', NULL, NULL, 'Failed login attempt: email not found admin@ecom.com', NULL, 'failure', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', '2026-11-01 18:40:22', '2026-11-01 18:40:22'),
(6, NULL, 'admin@ecom.com', NULL, 'USER_LOGIN', NULL, NULL, 'Failed login attempt: email not found admin@ecom.com', NULL, 'failure', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', '2026-11-01 18:40:49', '2026-11-01 18:40:49'),
(7, 1, 'admin@ecom.com', 'admin', 'USER_LOGIN', NULL, NULL, 'User admin@ecom.com (admin) logged in successfully.', NULL, 'success', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', '2026-11-01 18:48:17', '2026-11-01 18:48:17');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `userId`, `productId`, `quantity`, `createdAt`, `updatedAt`) VALUES
(7, 2, 1, 1, '2026-06-28 16:16:36', '2026-06-28 16:16:36'),
(8, 2, 3, 1, '2026-06-28 16:18:51', '2026-06-28 16:18:51');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `createdAt`, `updatedAt`, `imageUrl`, `isFeatured`) VALUES
(1, 'Men', 'men\'s cloths\n', '2026-06-27 11:05:13', '2026-06-28 13:27:40', '/uploads/cat-men-1782653260390.jpg', 1),
(2, 'Women', 'women\'s cloths', '2026-06-27 11:05:19', '2026-06-28 13:27:40', '/uploads/1782559876747-974854040.png', 0),
(4, 'Children', '', '2026-06-27 14:16:30', '2026-06-28 13:27:40', '/uploads/1782569809528-912742527.jpg', 0),
(5, 'Shoes', '', '2026-06-27 14:17:27', '2026-06-28 13:27:40', '/uploads/1782569845033-238700452.png', 0),
(6, 'Beauty', 'Auto-generated category for Beauty', '2026-06-28 12:42:59', '2026-06-28 13:27:40', '/uploads/cat-beauty-1782653260431.jpg', 1),
(7, 'Fragrances', 'Auto-generated category for Fragrances', '2026-06-28 13:00:23', '2026-06-28 13:27:40', '/uploads/bulk-1782651623607-303951326.png', 0),
(8, 'Furniture', 'Auto-generated category for Furniture', '2026-06-28 13:03:10', '2026-06-28 13:27:40', '/uploads/cat-furniture-1782653260464.jpg', 1),
(9, 'Groceries', 'Auto-generated category for Groceries', '2026-06-28 13:03:12', '2026-06-28 13:27:40', '/uploads/cat-groceries-1782653260498.jpg', 1),
(10, 'Home-decoration', 'Auto-generated category for Home-decoration', '2026-06-28 13:03:25', '2026-06-28 13:27:40', '/uploads/bulk-1782651805181-837800147.png', 0),
(11, 'Kitchen-accessories', 'Auto-generated category for Kitchen-accessories', '2026-06-28 13:03:27', '2026-06-28 13:27:40', '/uploads/bulk-1782651807340-803527291.png', 0);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `firstName`, `lastName`, `email`, `subject`, `message`, `isRead`, `createdAt`, `updatedAt`) VALUES
(1, 'Shubham', 'Sutar', 'adb@gmail.com', 'test', 'demo msg', 1, '2026-06-27 15:04:38', '2026-06-27 15:05:21');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int NOT NULL,
  `code` varchar(255) NOT NULL,
  `discountType` varchar(255) NOT NULL,
  `discountValue` decimal(10,2) NOT NULL,
  `maxDiscountAmount` decimal(10,2) DEFAULT NULL,
  `minOrderAmount` decimal(10,2) DEFAULT NULL,
  `usageLimit` int DEFAULT NULL,
  `usedCount` int NOT NULL DEFAULT '0',
  `expiryDate` datetime DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdById` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `discountType`, `discountValue`, `maxDiscountAmount`, `minOrderAmount`, `usageLimit`, `usedCount`, `expiryDate`, `isActive`, `createdById`, `createdAt`, `updatedAt`) VALUES
(1, 'SAVE50', 'percentage', 50.00, 50.00, 10.00, 5, 1, '2026-12-31 00:00:00', 1, 1, '2026-06-28 14:53:48', '2026-06-28 15:11:18');

-- --------------------------------------------------------

--
-- Table structure for table `email_logs`
--

CREATE TABLE `email_logs` (
  `id` int NOT NULL,
  `toEmail` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `body` longtext NOT NULL,
  `templateName` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `errorMessage` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `email_logs`
--

INSERT INTO `email_logs` (`id`, `toEmail`, `subject`, `body`, `templateName`, `status`, `errorMessage`, `createdAt`, `updatedAt`) VALUES
(1, 'ecomtestadmin@proton.me\n', 'Order Update - Order #3', '\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <meta charset=\"utf-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Notification</title>\n      <style>\n        body { font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; background-color: #F9FAFB; margin: 0; padding: 20px; color: #1F2937; -webkit-font-smoothing: antialiased; }\n        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 1px solid #E5E7EB; }\n        .header { background: #1F2937; padding: 30px 20px; text-align: center; color: #ffffff; }\n        .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.05em; color: #ffffff; text-decoration: none; }\n        .content { padding: 40px 30px; line-height: 1.6; }\n        .footer { background: #F3F4F6; padding: 20px; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB; }\n        .btn { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: #ffffff !important; font-weight: 600; text-decoration: none; border-radius: 6px; margin-top: 20px; margin-bottom: 20px; text-align: center; }\n        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; background-color: #EEF2F6; color: #4F46E5; }\n        .table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; text-align: left; }\n        .table th { border-bottom: 2px solid #E5E7EB; padding: 10px 0; font-weight: 600; font-size: 14px; }\n        .table td { border-bottom: 1px solid #E5E7EB; padding: 12px 0; font-size: 14px; }\n        .text-right { text-align: right; }\n      </style>\n    </head>\n    <body>\n      <div class=\"container\">\n        <div class=\"header\">\n          <a href=\"#\" class=\"logo\">E-COMMERCE PLATFORM</a>\n        </div>\n        <div class=\"content\">\n  \n      <h2 style=\"margin-top: 0; font-size: 22px;\">Order Status Update</h2>\n      <p>Hello Shubham Sutar,</p>\n      <p>The status of your order <strong>#3</strong> has been updated to:</p>\n      \n      <div style=\"text-align: center; margin: 25px 0;\">\n        <span class=\"badge\" style=\"font-size: 16px; padding: 8px 20px; background-color: #EEF2F6; color: #4F46E5; border: 1px solid #D1D5DB;\">\n          PROCESSING\n        </span>\n      </div>\n\n      <p>Your order status has been updated.</p>\n\n      <div style=\"text-align: center;\">\n        <a href=\"http://localhost:3000/track-order?orderId=3\" class=\"btn\">Track Order</a>\n      </div>\n    \n        </div>\n        <div class=\"footer\">\n          <p>&copy; 2026 E-Commerce Platform. All rights reserved.</p>\n          <p>You received this email because you registered on our platform.</p>\n        </div>\n      </div>\n    </body>\n    </html>\n  ', 'order-status', 'failed', 'Mail command failed: 530 Error: authentication Required', '2026-06-28 10:34:21', '2026-06-28 10:34:24'),
(2, 'ecomtestadmin@proton.me\n', 'Order Update - Order #3', '\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <meta charset=\"utf-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Notification</title>\n      <style>\n        body { font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; background-color: #F9FAFB; margin: 0; padding: 20px; color: #1F2937; -webkit-font-smoothing: antialiased; }\n        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 1px solid #E5E7EB; }\n        .header { background: #1F2937; padding: 30px 20px; text-align: center; color: #ffffff; }\n        .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.05em; color: #ffffff; text-decoration: none; }\n        .content { padding: 40px 30px; line-height: 1.6; }\n        .footer { background: #F3F4F6; padding: 20px; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB; }\n        .btn { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: #ffffff !important; font-weight: 600; text-decoration: none; border-radius: 6px; margin-top: 20px; margin-bottom: 20px; text-align: center; }\n        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; background-color: #EEF2F6; color: #4F46E5; }\n        .table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; text-align: left; }\n        .table th { border-bottom: 2px solid #E5E7EB; padding: 10px 0; font-weight: 600; font-size: 14px; }\n        .table td { border-bottom: 1px solid #E5E7EB; padding: 12px 0; font-size: 14px; }\n        .text-right { text-align: right; }\n      </style>\n    </head>\n    <body>\n      <div class=\"container\">\n        <div class=\"header\">\n          <a href=\"#\" class=\"logo\">E-COMMERCE PLATFORM</a>\n        </div>\n        <div class=\"content\">\n  \n      <h2 style=\"margin-top: 0; font-size: 22px;\">Order Status Update</h2>\n      <p>Hello Shubham Sutar,</p>\n      <p>The status of your order <strong>#3</strong> has been updated to:</p>\n      \n      <div style=\"text-align: center; margin: 25px 0;\">\n        <span class=\"badge\" style=\"font-size: 16px; padding: 8px 20px; background-color: #EEF2F6; color: #4F46E5; border: 1px solid #D1D5DB;\">\n          SHIPPED\n        </span>\n      </div>\n\n      <p>Exciting news! Your order has been shipped and is on its way to you.</p>\n\n      <div style=\"text-align: center;\">\n        <a href=\"http://localhost:3000/track-order?orderId=3\" class=\"btn\">Track Order</a>\n      </div>\n    \n        </div>\n        <div class=\"footer\">\n          <p>&copy; 2026 E-Commerce Platform. All rights reserved.</p>\n          <p>You received this email because you registered on our platform.</p>\n        </div>\n      </div>\n    </body>\n    </html>\n  ', 'order-status', 'success', NULL, '2026-06-28 10:52:03', '2026-06-28 10:52:06'),
(3, 'ecomtestadmin@proton.me\n', 'Order Update - Order #3', '\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <meta charset=\"utf-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Notification</title>\n      <style>\n        body { font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; background-color: #F9FAFB; margin: 0; padding: 20px; color: #1F2937; -webkit-font-smoothing: antialiased; }\n        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 1px solid #E5E7EB; }\n        .header { background: #1F2937; padding: 30px 20px; text-align: center; color: #ffffff; }\n        .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.05em; color: #ffffff; text-decoration: none; }\n        .content { padding: 40px 30px; line-height: 1.6; }\n        .footer { background: #F3F4F6; padding: 20px; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB; }\n        .btn { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: #ffffff !important; font-weight: 600; text-decoration: none; border-radius: 6px; margin-top: 20px; margin-bottom: 20px; text-align: center; }\n        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; background-color: #EEF2F6; color: #4F46E5; }\n        .table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; text-align: left; }\n        .table th { border-bottom: 2px solid #E5E7EB; padding: 10px 0; font-weight: 600; font-size: 14px; }\n        .table td { border-bottom: 1px solid #E5E7EB; padding: 12px 0; font-size: 14px; }\n        .text-right { text-align: right; }\n      </style>\n    </head>\n    <body>\n      <div class=\"container\">\n        <div class=\"header\">\n          <a href=\"#\" class=\"logo\">E-COMMERCE PLATFORM</a>\n        </div>\n        <div class=\"content\">\n  \n      <h2 style=\"margin-top: 0; font-size: 22px;\">Order Status Update</h2>\n      <p>Hello Shubham Sutar,</p>\n      <p>The status of your order <strong>#3</strong> has been updated to:</p>\n      \n      <div style=\"text-align: center; margin: 25px 0;\">\n        <span class=\"badge\" style=\"font-size: 16px; padding: 8px 20px; background-color: #EEF2F6; color: #4F46E5; border: 1px solid #D1D5DB;\">\n          DELIVERED\n        </span>\n      </div>\n\n      <p>Your order has been delivered. We hope you enjoy your purchase!</p>\n\n      <div style=\"text-align: center;\">\n        <a href=\"http://localhost:3000/track-order?orderId=3\" class=\"btn\">Track Order</a>\n      </div>\n    \n        </div>\n        <div class=\"footer\">\n          <p>&copy; 2026 E-Commerce Platform. All rights reserved.</p>\n          <p>You received this email because you registered on our platform.</p>\n        </div>\n      </div>\n    </body>\n    </html>\n  ', 'order-status', 'success', NULL, '2026-06-28 10:56:41', '2026-06-28 10:56:44'),
(4, 'ecomtestadmin@proton.me', 'Reset Your Password', '\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <meta charset=\"utf-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Notification</title>\n      <style>\n        body { font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; background-color: #F9FAFB; margin: 0; padding: 20px; color: #1F2937; -webkit-font-smoothing: antialiased; }\n        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 1px solid #E5E7EB; }\n        .header { background: #1F2937; padding: 30px 20px; text-align: center; color: #ffffff; }\n        .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.05em; color: #ffffff; text-decoration: none; }\n        .content { padding: 40px 30px; line-height: 1.6; }\n        .footer { background: #F3F4F6; padding: 20px; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB; }\n        .btn { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: #ffffff !important; font-weight: 600; text-decoration: none; border-radius: 6px; margin-top: 20px; margin-bottom: 20px; text-align: center; }\n        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; background-color: #EEF2F6; color: #4F46E5; }\n        .table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; text-align: left; }\n        .table th { border-bottom: 2px solid #E5E7EB; padding: 10px 0; font-weight: 600; font-size: 14px; }\n        .table td { border-bottom: 1px solid #E5E7EB; padding: 12px 0; font-size: 14px; }\n        .text-right { text-align: right; }\n      </style>\n    </head>\n    <body>\n      <div class=\"container\">\n        <div class=\"header\">\n          <a href=\"#\" class=\"logo\">E-COMMERCE PLATFORM</a>\n        </div>\n        <div class=\"content\">\n  \n      <h2 style=\"margin-top: 0; font-size: 22px;\">Reset Your Password</h2>\n      <p>Hello Shubham Sutar,</p>\n      <p>We received a request to reset your password for your E-Commerce account. Click the button below to choose a new password. This link will expire shortly.</p>\n      <div style=\"text-align: center;\">\n        <a href=\"http://localhost:4005/reset-password?token=15vvfue11nd47g0yrnxord&email=ecomtestadmin%40proton.me\" class=\"btn\" target=\"_blank\">Reset Password</a>\n      </div>\n      <p style=\"color: #6B7280; font-size: 14px;\">If you did not request a password reset, you can safely ignore this email.</p>\n      <p style=\"color: #6B7280; font-size: 12px; word-break: break-all;\">Or copy and paste this link in your browser:<br>http://localhost:4005/reset-password?token=15vvfue11nd47g0yrnxord&email=ecomtestadmin%40proton.me</p>\n    \n        </div>\n        <div class=\"footer\">\n          <p>&copy; 2026 E-Commerce Platform. All rights reserved.</p>\n          <p>You received this email because you registered on our platform.</p>\n        </div>\n      </div>\n    </body>\n    </html>\n  ', 'forgot-password', 'success', NULL, '2026-06-28 11:25:38', '2026-06-28 11:25:41'),
(5, 'shubhamsutar5799@gmail.com', 'Reset Your Password', '\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <meta charset=\"utf-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Notification</title>\n      <style>\n        body { font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; background-color: #F9FAFB; margin: 0; padding: 20px; color: #1F2937; -webkit-font-smoothing: antialiased; }\n        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 1px solid #E5E7EB; }\n        .header { background: #1F2937; padding: 30px 20px; text-align: center; color: #ffffff; }\n        .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.05em; color: #ffffff; text-decoration: none; }\n        .content { padding: 40px 30px; line-height: 1.6; }\n        .footer { background: #F3F4F6; padding: 20px; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB; }\n        .btn { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: #ffffff !important; font-weight: 600; text-decoration: none; border-radius: 6px; margin-top: 20px; margin-bottom: 20px; text-align: center; }\n        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; background-color: #EEF2F6; color: #4F46E5; }\n        .table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; text-align: left; }\n        .table th { border-bottom: 2px solid #E5E7EB; padding: 10px 0; font-weight: 600; font-size: 14px; }\n        .table td { border-bottom: 1px solid #E5E7EB; padding: 12px 0; font-size: 14px; }\n        .text-right { text-align: right; }\n      </style>\n    </head>\n    <body>\n      <div class=\"container\">\n        <div class=\"header\">\n          <a href=\"#\" class=\"logo\">E-COMMERCE PLATFORM</a>\n        </div>\n        <div class=\"content\">\n  \n      <h2 style=\"margin-top: 0; font-size: 22px;\">Reset Your Password</h2>\n      <p>Hello Shubham Sutar,</p>\n      <p>We received a request to reset your password for your E-Commerce account. Click the button below to choose a new password. This link will expire shortly.</p>\n      <div style=\"text-align: center;\">\n        <a href=\"http://localhost:4010/ecom/reset-password?token=kal4x6gsrmb8zu980zmkb&email=shubhamsutar5799%40gmail.com\" class=\"btn\" target=\"_blank\">Reset Password</a>\n      </div>\n      <p style=\"color: #6B7280; font-size: 14px;\">If you did not request a password reset, you can safely ignore this email.</p>\n      <p style=\"color: #6B7280; font-size: 12px; word-break: break-all;\">Or copy and paste this link in your browser:<br>http://localhost:4010/ecom/reset-password?token=kal4x6gsrmb8zu980zmkb&email=shubhamsutar5799%40gmail.com</p>\n    \n        </div>\n        <div class=\"footer\">\n          <p>&copy; 2026 E-Commerce Platform. All rights reserved.</p>\n          <p>You received this email because you registered on our platform.</p>\n        </div>\n      </div>\n    </body>\n    </html>\n  ', 'forgot-password', 'success', NULL, '2026-06-28 11:30:12', '2026-06-28 11:30:15'),
(6, '4346advisory@web-library.net', 'Order Confirmation - Order #4', '\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <meta charset=\"utf-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Notification</title>\n      <style>\n        body { font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; background-color: #F9FAFB; margin: 0; padding: 20px; color: #1F2937; -webkit-font-smoothing: antialiased; }\n        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 1px solid #E5E7EB; }\n        .header { background: #1F2937; padding: 30px 20px; text-align: center; color: #ffffff; }\n        .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.05em; color: #ffffff; text-decoration: none; }\n        .content { padding: 40px 30px; line-height: 1.6; }\n        .footer { background: #F3F4F6; padding: 20px; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB; }\n        .btn { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: #ffffff !important; font-weight: 600; text-decoration: none; border-radius: 6px; margin-top: 20px; margin-bottom: 20px; text-align: center; }\n        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; background-color: #EEF2F6; color: #4F46E5; }\n        .table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; text-align: left; }\n        .table th { border-bottom: 2px solid #E5E7EB; padding: 10px 0; font-weight: 600; font-size: 14px; }\n        .table td { border-bottom: 1px solid #E5E7EB; padding: 12px 0; font-size: 14px; }\n        .text-right { text-align: right; }\n      </style>\n    </head>\n    <body>\n      <div class=\"container\">\n        <div class=\"header\">\n          <a href=\"#\" class=\"logo\">E-COMMERCE PLATFORM</a>\n        </div>\n        <div class=\"content\">\n  \n      <h2 style=\"margin-top: 0; color: #10B981; font-size: 22px;\">Order Placed Successfully!</h2>\n      <p>Hello Shubham Sutar,</p>\n      <p>Thank you for shopping with us! Your order <strong>#4</strong> has been received and is now being processed.</p>\n      \n      <div style=\"background-color: #F9FAFB; padding: 15px; border-radius: 6px; margin: 20px 0;\">\n        <div style=\"font-size: 14px; font-weight: bold; margin-bottom: 5px;\">Shipping Address:</div>\n        <div style=\"font-size: 14px; color: #6B7280;\">\n          undefined undefined<br>\n          Shiv Ganga Society, Kondhwa<br>\n          Pune, Mah - 411001<br>\n          Phone: 9887988798\n        </div>\n      </div>\n\n      <h3 style=\"font-size: 16px; margin-top: 20px; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;\">Order Summary</h3>\n      <table class=\"table\">\n        <thead>\n          <tr>\n            <th>Product</th>\n            <th class=\"text-right\">Qty</th>\n            <th class=\"text-right\">Price</th>\n            <th class=\"text-right\">Total</th>\n          </tr>\n        </thead>\n        <tbody>\n          \n      <tr>\n        <td>\n          <div style=\"font-weight: 600;\">Smooth Cloth</div>\n          <div style=\"font-size: 12px; color: #6B7280;\"> </div>\n        </td>\n        <td class=\"text-right\">1</td>\n        <td class=\"text-right\">$28.00</td>\n        <td class=\"text-right\">$28.00</td>\n      </tr>\n    \n          <tr>\n            <td colspan=\"3\" style=\"font-weight: bold; padding-top: 15px;\" class=\"text-right\">Total Amount:</td>\n            <td style=\"font-weight: bold; color: #4F46E5; padding-top: 15px;\" class=\"text-right\">$14.00</td>\n          </tr>\n        </tbody>\n      </table>\n      \n      <div style=\"text-align: center;\">\n        <a href=\"http://localhost:4005/track-order?orderId=4\" class=\"btn\">Track Your Order</a>\n      </div>\n    \n        </div>\n        <div class=\"footer\">\n          <p>&copy; 2026 E-Commerce Platform. All rights reserved.</p>\n          <p>You received this email because you registered on our platform.</p>\n        </div>\n      </div>\n    </body>\n    </html>\n  ', 'order-place', 'success', NULL, '2026-06-28 15:11:18', '2026-06-28 15:11:22');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(255) NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `userId`, `title`, `message`, `type`, `isRead`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'New Order Placed', 'Order #3 has been placed. Total amount: $28', 'order_placed', 1, '2026-06-28 08:34:41', '2026-06-28 08:36:27'),
(2, 3, 'New Order Placed', 'Order #3 has been placed. Total amount: $28', 'order_placed', 1, '2026-06-28 08:34:41', '2026-06-28 08:36:47'),
(3, 1, 'New Product Review', 'Shubham Sutar added a 4-star review for Product ID #N/A. Comment: \"\"', 'review_added', 1, '2026-06-28 11:01:05', '2026-06-28 11:01:24'),
(4, 3, 'New Product Review', 'Shubham Sutar added a 4-star review for Product ID #N/A. Comment: \"\"', 'review_added', 1, '2026-06-28 11:01:05', '2026-06-28 11:34:31'),
(5, 1, 'New Order Placed', 'Order #4 has been placed. Total amount: $14', 'order_placed', 1, '2026-06-28 15:11:22', '2026-06-28 15:12:43'),
(6, 3, 'New Order Placed', 'Order #4 has been placed. Total amount: $14', 'order_placed', 0, '2026-06-28 15:11:22', '2026-06-28 15:11:22');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `addressId` int DEFAULT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `couponCode` varchar(255) DEFAULT NULL,
  `discountAmount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `subTotal` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `userId`, `addressId`, `totalAmount`, `status`, `createdAt`, `updatedAt`, `couponCode`, `discountAmount`, `subTotal`) VALUES
(1, 2, 1, 144.00, 'cancelled by customer', '2026-06-27 16:36:06', '2026-06-27 18:03:47', NULL, 0.00, NULL),
(2, 2, 1, 20.00, 'delivered', '2026-06-27 18:20:42', '2026-06-27 18:21:07', NULL, 0.00, NULL),
(3, 2, 1, 28.00, 'delivered', '2026-06-28 08:34:40', '2026-06-28 10:56:41', NULL, 0.00, NULL),
(4, 2, 1, 14.00, 'pending', '2026-06-28 15:11:18', '2026-06-28 15:11:18', 'SAVE50', 14.00, 28.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int NOT NULL,
  `orderId` int NOT NULL,
  `productId` int DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `price` decimal(10,2) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `orderId`, `productId`, `quantity`, `price`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 1, 28.00, '2026-06-27 16:36:06', '2026-06-27 16:36:06'),
(2, 1, 3, 2, 58.00, '2026-06-27 16:36:06', '2026-06-27 16:36:06'),
(3, 2, 5, 1, 20.00, '2026-06-27 18:20:42', '2026-06-27 18:20:42'),
(4, 3, 2, 1, 28.00, '2026-06-28 08:34:40', '2026-06-28 08:34:40'),
(5, 4, 1, 1, 28.00, '2026-06-28 15:11:18', '2026-06-28 15:11:18');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `categoryId` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `imageUrl` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `sizes` varchar(255) DEFAULT NULL,
  `colors` varchar(255) DEFAULT NULL,
  `createdById` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `categoryId`, `name`, `description`, `price`, `stock`, `imageUrl`, `createdAt`, `updatedAt`, `sizes`, `colors`, `createdById`) VALUES
(1, 2, 'Smooth Cloth', '', 28.00, 100, '/uploads/1782562980974-925564108.png', '2026-06-27 12:23:05', '2026-06-27 12:23:05', NULL, NULL, NULL),
(2, 1, 'Denim Jacket', '', 28.00, 100, '/uploads/1782563003813-783498596.png', '2026-06-27 12:23:25', '2026-06-27 12:23:25', NULL, NULL, NULL),
(3, 1, 'Yellow Jacket', '', 58.00, 100, '/uploads/1782563020684-963001230.png', '2026-06-27 12:23:41', '2026-06-27 12:23:41', NULL, NULL, NULL),
(4, 2, 'Leather Green Bag', '', 28.00, 100, '/uploads/1782563038452-210884338.png', '2026-06-27 12:23:59', '2026-06-27 12:23:59', NULL, NULL, NULL),
(5, 1, 'Gray Shoe', '', 20.00, 100, '/uploads/1782563056162-222294329.png', '2026-06-27 12:24:17', '2026-06-27 17:26:29', 'S,M,L', 'Red,Blue,Green,Gray', NULL),
(6, 2, 'Blue Shoe High Heels', '', 28.00, 100, '/uploads/1782563073617-481139238.png', '2026-06-27 12:24:34', '2026-06-27 17:26:13', 'S,M,L', 'Red,Blue,Black', NULL),
(8, 2, 'Hat', '', 50.00, 400, '/uploads/1782646660381-297858450.jpg', '2026-06-28 11:37:57', '2026-06-28 11:37:57', 'S,M', 'White', 3),
(22, 6, 'Essence Mascara Lash Princess', 'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.', 9.99, 99, '/uploads/bulk-1782651524723-747727322.png', '2026-06-28 12:58:46', '2026-06-28 12:58:46', 'M,L,XL', 'Black,White', 1),
(23, 6, 'Eyeshadow Palette with Mirror', 'The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it\'s convenient for on-the-go makeup application.', 19.99, 34, '/uploads/bulk-1782651525253-684859098.png', '2026-06-28 12:58:46', '2026-06-28 12:58:46', 'M,L,XL', 'Black,White', 1),
(24, 6, 'Powder Canister', 'The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.', 14.99, 89, '/uploads/bulk-1782651525715-302620812.png', '2026-06-28 12:58:46', '2026-06-28 12:58:46', 'M,L,XL', 'Black,White', 1),
(25, 6, 'Red Lipstick', 'The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.', 12.99, 91, '/uploads/bulk-1782651525877-648538264.png', '2026-06-28 12:58:46', '2026-06-28 12:58:46', 'M,L,XL', 'Black,White', 1),
(26, 6, 'Red Nail Polish', 'The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.', 8.99, 79, '/uploads/bulk-1782651526030-644122518.png', '2026-06-28 12:58:46', '2026-06-28 12:58:46', 'M,L,XL', 'Black,White', 1),
(32, 7, 'Calvin Klein CK One', 'CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It\'s a versatile fragrance suitable for everyday wear.', 49.99, 29, '/uploads/bulk-1782651623704-980599565.png', '2026-06-28 13:00:24', '2026-06-28 13:00:24', 'M,L,XL', 'Black,White', 1),
(33, 7, 'Chanel Coco Noir Eau De', 'Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.', 129.99, 58, '/uploads/bulk-1782651623963-934388918.png', '2026-06-28 13:00:24', '2026-06-28 13:00:24', 'M,L,XL', 'Black,White', 1),
(34, 7, 'Dior J\'adore', 'J\'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.', 89.99, 98, '/uploads/bulk-1782651624042-202647228.png', '2026-06-28 13:00:24', '2026-06-28 13:00:24', 'M,L,XL', 'Black,White', 1),
(35, 7, 'Dolce Shine Eau de', 'Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It\'s a joyful and youthful scent.', 69.99, 4, '/uploads/bulk-1782651624530-826134808.png', '2026-06-28 13:00:24', '2026-06-28 13:00:24', 'M,L,XL', 'Black,White', 1),
(36, 7, 'Gucci Bloom Eau de', 'Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It\'s a modern and romantic scent.', 79.99, 91, '/uploads/bulk-1782651624611-952229390.png', '2026-06-28 13:00:24', '2026-06-28 13:00:24', 'M,L,XL', 'Black,White', 1),
(37, 8, 'Annibale Colombo Bed', 'The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.', 1899.99, 88, '/uploads/bulk-1782651790875-592917261.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(38, 8, 'Annibale Colombo Sofa', 'The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.', 2499.99, 60, '/uploads/bulk-1782651791618-865304590.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(39, 8, 'Bedside Table African Cherry', 'The Bedside Table in African Cherry is a stylish and functional addition to your bedroom, providing convenient storage space and a touch of elegance.', 299.99, 64, '/uploads/bulk-1782651791719-524578309.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(40, 8, 'Knoll Saarinen Executive Conference Chair', 'The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair, perfect for your office or conference room with its timeless design.', 499.99, 26, '/uploads/bulk-1782651792270-34043589.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(41, 8, 'Wooden Bathroom Sink With Mirror', 'The Wooden Bathroom Sink with Mirror is a unique and stylish addition to your bathroom, featuring a wooden sink countertop and a matching mirror.', 799.99, 7, '/uploads/bulk-1782651792357-896123102.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(42, 9, 'Apple', 'Fresh and crisp apples, perfect for snacking or incorporating into various recipes.', 1.99, 8, '/uploads/bulk-1782651792749-786804129.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(43, 9, 'Beef Steak', 'High-quality beef steak, great for grilling or cooking to your preferred level of doneness.', 12.99, 86, '/uploads/bulk-1782651793846-47239960.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(44, 9, 'Cat Food', 'Nutritious cat food formulated to meet the dietary needs of your feline friend.', 8.99, 46, '/uploads/bulk-1782651793940-756805303.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(45, 9, 'Chicken Meat', 'Fresh and tender chicken meat, suitable for various culinary preparations.', 9.99, 97, '/uploads/bulk-1782651794348-686548040.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(46, 9, 'Cooking Oil', 'Versatile cooking oil suitable for frying, sautéing, and various culinary applications.', 4.99, 10, '/uploads/bulk-1782651794431-474185358.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(47, 9, 'Cucumber', 'Crisp and hydrating cucumbers, ideal for salads, snacks, or as a refreshing side.', 1.49, 84, '/uploads/bulk-1782651795371-758146415.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(48, 9, 'Dog Food', 'Specially formulated dog food designed to provide essential nutrients for your canine companion.', 10.99, 71, '/uploads/bulk-1782651795471-502087979.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(49, 9, 'Eggs', 'Fresh eggs, a versatile ingredient for baking, cooking, or breakfast.', 2.99, 9, '/uploads/bulk-1782651796255-505298586.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(50, 9, 'Fish Steak', 'Quality fish steak, suitable for grilling, baking, or pan-searing.', 14.99, 74, '/uploads/bulk-1782651796341-974498149.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(51, 9, 'Green Bell Pepper', 'Fresh and vibrant green bell pepper, perfect for adding color and flavor to your dishes.', 1.29, 33, '/uploads/bulk-1782651797249-124916125.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(52, 9, 'Green Chili Pepper', 'Spicy green chili pepper, ideal for adding heat to your favorite recipes.', 0.99, 3, '/uploads/bulk-1782651797338-994127404.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(53, 9, 'Honey Jar', 'Pure and natural honey in a convenient jar, perfect for sweetening beverages or drizzling over food.', 6.99, 34, '/uploads/bulk-1782651798156-794431945.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(54, 9, 'Ice Cream', 'Creamy and delicious ice cream, available in various flavors for a delightful treat.', 5.49, 27, '/uploads/bulk-1782651798258-758835073.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(55, 9, 'Juice', 'Refreshing fruit juice, packed with vitamins and great for staying hydrated.', 3.99, 50, '/uploads/bulk-1782651798791-719584190.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(56, 9, 'Kiwi', 'Nutrient-rich kiwi, perfect for snacking or adding a tropical twist to your dishes.', 2.49, 99, '/uploads/bulk-1782651798891-675913911.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(57, 9, 'Lemon', 'Zesty and tangy lemons, versatile for cooking, baking, or making refreshing beverages.', 0.79, 31, '/uploads/bulk-1782651799533-29525050.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(58, 9, 'Milk', 'Fresh and nutritious milk, a staple for various recipes and daily consumption.', 3.49, 27, '/uploads/bulk-1782651799614-593608646.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(59, 9, 'Mulberry', 'Sweet and juicy mulberries, perfect for snacking or adding to desserts and cereals.', 4.99, 99, '/uploads/bulk-1782651800755-797867699.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(60, 9, 'Nescafe Coffee', 'Quality coffee from Nescafe, available in various blends for a rich and satisfying cup.', 7.99, 57, '/uploads/bulk-1782651800854-290215858.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(61, 9, 'Potatoes', 'Versatile and starchy potatoes, great for roasting, mashing, or as a side dish.', 2.29, 13, '/uploads/bulk-1782651801617-341667988.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(62, 9, 'Protein Powder', 'Nutrient-packed protein powder, ideal for supplementing your diet with essential proteins.', 19.99, 80, '/uploads/bulk-1782651801740-544433187.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(63, 9, 'Red Onions', 'Flavorful and aromatic red onions, perfect for adding depth to your savory dishes.', 1.99, 82, '/uploads/bulk-1782651802621-39607148.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(64, 9, 'Rice', 'High-quality rice, a staple for various cuisines and a versatile base for many dishes.', 5.99, 59, '/uploads/bulk-1782651802721-591517816.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(65, 9, 'Soft Drinks', 'Assorted soft drinks in various flavors, perfect for refreshing beverages.', 1.99, 53, '/uploads/bulk-1782651803213-647806790.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(66, 9, 'Strawberry', 'Sweet and succulent strawberries, great for snacking, desserts, or blending into smoothies.', 3.99, 46, '/uploads/bulk-1782651803319-547497242.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(67, 9, 'Tissue Paper Box', 'Convenient tissue paper box for everyday use, providing soft and absorbent tissues.', 2.49, 86, '/uploads/bulk-1782651803922-131640677.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(68, 9, 'Water', 'Pure and refreshing bottled water, essential for staying hydrated throughout the day.', 0.99, 53, '/uploads/bulk-1782651804013-948477193.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(69, 10, 'Decoration Swing', 'The Decoration Swing is a charming addition to your home decor. Crafted with intricate details, it adds a touch of elegance and whimsy to any room.', 59.99, 47, '/uploads/bulk-1782651805303-3112333.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(70, 10, 'Family Tree Photo Frame', 'The Family Tree Photo Frame is a sentimental and stylish way to display your cherished family memories. With multiple photo slots, it tells the story of your loved ones.', 29.99, 77, '/uploads/bulk-1782651805900-272190997.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(71, 10, 'House Showpiece Plant', 'The House Showpiece Plant is an artificial plant that brings a touch of nature to your home without the need for maintenance. It adds greenery and style to any space.', 39.99, 28, '/uploads/bulk-1782651806000-665679924.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(72, 10, 'Plant Pot', 'The Plant Pot is a stylish container for your favorite plants. With a sleek design, it complements your indoor or outdoor garden, adding a modern touch to your plant display.', 14.99, 59, '/uploads/bulk-1782651806727-714829486.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(73, 10, 'Table Lamp', 'The Table Lamp is a functional and decorative lighting solution for your living space. With a modern design, it provides both ambient and task lighting, enhancing the atmosphere.', 49.99, 9, '/uploads/bulk-1782651806810-54927596.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(74, 11, 'Bamboo Spatula', 'The Bamboo Spatula is a versatile kitchen tool made from eco-friendly bamboo. Ideal for flipping, stirring, and serving various dishes.', 7.99, 37, '/uploads/bulk-1782651807439-941845321.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(75, 11, 'Black Aluminium Cup', 'The Black Aluminium Cup is a stylish and durable cup suitable for both hot and cold beverages. Its sleek black design adds a modern touch to your drinkware collection.', 5.99, 75, '/uploads/bulk-1782651807994-42406346.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3),
(76, 11, 'Black Whisk', 'The Black Whisk is a kitchen essential for whisking and beating ingredients. Its ergonomic handle and sleek design make it a practical and stylish tool.', 9.99, 73, '/uploads/bulk-1782651808577-706159986.png', '2026-06-28 13:03:28', '2026-06-28 13:03:28', 'M,L,XL', 'Black,White', 3);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `orderId` int NOT NULL,
  `productId` int DEFAULT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `userId`, `orderId`, `productId`, `rating`, `comment`, `createdAt`, `updatedAt`) VALUES
(1, 2, 2, 5, 5, 'using even after 2 years', '2026-06-27 18:21:41', '2026-06-27 18:21:41'),
(2, 2, 2, NULL, 5, 'faster delivery', '2026-06-27 18:25:27', '2026-06-27 18:25:27'),
(3, 2, 3, NULL, 4, '', '2026-06-28 11:01:05', '2026-06-28 11:01:05');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20260627091500-create-users.js'),
('20260627092000-create-addresses.js'),
('20260627103000-create-categories.js'),
('20260627103500-create-products.js'),
('20260627104000-create-wishlists.js'),
('20260627104500-create-carts.js'),
('20260627105000-create-orders.js'),
('20260627105500-create-order-items.js'),
('20260627164000-add-image-url-to-categories.js'),
('20260627191600-add-is-featured-to-categories.js'),
('20260627195000-add-is-active-to-users.js'),
('20260627202700-create-contacts.js'),
('20260627224200-add-sizes-colors-to-products.js'),
('20260627234500-create-reviews.js'),
('20260628000000-create-notifications.js'),
('20260628142000-add-created-by-to-products.js'),
('20260628153000-create-email-logs.js'),
('20260628160000-add-reset-password-fields-to-users.js'),
('20260628203000-create-coupons-and-add-order-fields.js'),
('20260628230000-create-system-logs.js'),
('20260628233000-create-audit-logs.js');

-- --------------------------------------------------------

--
-- Table structure for table `system_logs`
--

CREATE TABLE `system_logs` (
  `id` int NOT NULL,
  `level` varchar(255) NOT NULL DEFAULT 'info',
  `message` text NOT NULL,
  `source` varchar(255) DEFAULT NULL,
  `meta` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `system_logs`
--

INSERT INTO `system_logs` (`id`, `level`, `message`, `source`, `meta`, `createdAt`, `updatedAt`) VALUES
(1, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-06-28 15:42:45', '2026-06-28 15:42:45'),
(2, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-06-28 15:42:51', '2026-06-28 15:42:51'),
(3, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-06-28 15:43:09', '2026-06-28 15:43:09'),
(4, 'info', 'User ecomadminuser@web-library.net (admin) logged in successfully.', 'AUTH_LOGIN', '{\"userId\":1,\"email\":\"ecomadminuser@web-library.net\",\"userType\":\"admin\"}', '2026-06-28 15:45:55', '2026-06-28 15:45:55'),
(5, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-06-28 15:52:54', '2026-06-28 15:52:54'),
(6, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-06-28 15:52:59', '2026-06-28 15:52:59'),
(7, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-06-28 15:53:07', '2026-06-28 15:53:07'),
(8, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-06-28 15:53:36', '2026-06-28 15:53:36'),
(9, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-06-28 15:54:21', '2026-06-28 15:54:21'),
(10, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-06-28 15:54:45', '2026-06-28 15:54:45'),
(11, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-06-28 16:03:15', '2026-06-28 16:03:15'),
(12, 'info', 'User ecomadminuser@web-library.net (admin) logged in successfully.', 'AUTH_LOGIN', '{\"userId\":1,\"email\":\"ecomadminuser@web-library.net\",\"userType\":\"admin\"}', '2026-06-28 16:03:26', '2026-06-28 16:03:26'),
(13, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-06-28 16:08:47', '2026-06-28 16:08:47'),
(14, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-06-28 16:13:32', '2026-06-28 16:13:32'),
(15, 'info', 'User ecomadminuser@web-library.net (admin) logged in successfully.', 'AUTH_LOGIN', '{\"userId\":1,\"email\":\"ecomadminuser@web-library.net\",\"userType\":\"admin\"}', '2026-06-28 16:37:15', '2026-06-28 16:37:15'),
(16, 'info', 'User ecomadminuser@web-library.net (admin) logged in successfully.', 'AUTH_LOGIN', '{\"userId\":1,\"email\":\"ecomadminuser@web-library.net\",\"userType\":\"admin\"}', '2026-06-28 16:53:50', '2026-06-28 16:53:50'),
(17, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-10-27 09:27:05', '2026-10-27 09:27:05'),
(18, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-10-27 09:37:08', '2026-10-27 09:37:08'),
(19, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-10-27 09:37:18', '2026-10-27 09:37:18'),
(20, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-10-27 13:09:05', '2026-10-27 13:09:05'),
(21, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-10-27 13:09:43', '2026-10-27 13:09:43'),
(22, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-11-01 12:14:52', '2026-11-01 12:14:52'),
(23, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-11-01 12:15:03', '2026-11-01 12:15:03'),
(24, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-11-01 12:15:41', '2026-11-01 12:15:41'),
(25, 'warn', 'Failed login attempt: email not found admin@ecom.com', 'AUTH_LOGIN', NULL, '2026-11-01 18:40:22', '2026-11-01 18:40:22'),
(26, 'warn', 'Failed login attempt: email not found admin@ecom.com', 'AUTH_LOGIN', NULL, '2026-11-01 18:40:49', '2026-11-01 18:40:49'),
(27, 'info', 'User admin@ecom.com (admin) logged in successfully.', 'AUTH_LOGIN', '{\"userId\":1,\"email\":\"admin@ecom.com\",\"userType\":\"admin\"}', '2026-11-01 18:48:17', '2026-11-01 18:48:17'),
(28, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-11-01 19:12:22', '2026-11-01 19:12:22'),
(29, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-11-02 18:46:55', '2026-11-02 18:46:55'),
(30, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-11-02 18:51:48', '2026-11-02 18:51:48'),
(31, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-11-02 18:52:15', '2026-11-02 18:52:15'),
(32, 'info', 'API Server started successfully and database is synchronized.', 'SERVER_STARTUP', NULL, '2026-11-02 18:52:29', '2026-11-02 18:52:29');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `userType` varchar(255) NOT NULL DEFAULT 'user',
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `mobileNumber` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `loginToken` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `userType`, `firstName`, `lastName`, `mobileNumber`, `email`, `password`, `loginToken`, `createdAt`, `updatedAt`, `isActive`, `resetPasswordToken`, `resetPasswordExpires`) VALUES
(1, 'admin', 'Shubham', 'Sutar', NULL, 'admin@ecom.com', '$2b$10$BtP4rxfaWbxn.wjS1YpXj.nwwp94Aug9IzCQZhSexdUQOeOeqnGyK', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AZWNvbS5jb20iLCJmaXJzdE5hbWUiOiJTaHViaGFtIiwibGFzdE5hbWUiOiJTdXRhciIsInVzZXJUeXBlIjoiYWRtaW4iLCJpYXQiOjE3OTM1NTg4OTcsImV4cCI6MTc5MzU2MjQ5N30.xLyhZvqBKZwLYq1kxUoCJ1ZubLESOg0YpStw85d5ekw', '2026-06-27 09:12:21', '2026-11-01 18:48:17', 1, NULL, NULL),
(2, 'user', 'Shubham', 'Sutar', '9604930402', 'user@ecom.com', '$2b$10$Blmf/D6dlDIxwnWAcGo1iO09gJyJPM9Cbq7EVi4et95e/neHSPtES', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiY3VzdG9tZXJlY29tQHdlYi1saWJyYXJ5Lm5ldCIsImZpcnN0TmFtZSI6IlNodWJoYW0iLCJsYXN0TmFtZSI6IlN1dGFyIiwidXNlclR5cGUiOiJ1c2VyIiwiaWF0IjoxNzgyNjYwNjU1LCJleHAiOjE3ODI2NjQyNTV9.j3MiQnVskgiApLr3rUxi8POy0lLBf03GNajldyt0Gn8', '2026-06-27 09:27:12', '2026-06-28 15:30:55', 1, NULL, NULL),
(3, 'seller', 'john', 'doe', '7889566787', 'seller@ecom.com', '$2b$10$SAPTNqRM.YCN4qRbYCOvYu7gaxy8nENFr8MotdMG8MgI0vfgwULyW', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZWNvbXNlbGxlcnVzZXJAd2ViLWxpYnJhcnkubmV0IiwiZmlyc3ROYW1lIjoic2VsbGVyIiwibGFzdE5hbWUiOiJzdXRhciIsInVzZXJUeXBlIjoic2VsbGVyIiwiaWF0IjoxNzgyNjUxNzgzLCJleHAiOjE3ODI2NTUzODN9.pwEqtsEjDGxy7wcfJDoo5-2tu8_oJNhgUMdc3xcUpVc', '2026-06-27 09:47:12', '2026-06-28 16:04:53', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` int NOT NULL,
  `userId` int NOT NULL,
  `productId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `userId`, `productId`, `createdAt`, `updatedAt`) VALUES
(2, 2, 4, '2026-06-27 12:50:53', '2026-06-27 12:50:53'),
(3, 2, 1, '2026-06-27 12:50:55', '2026-06-27 12:50:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD UNIQUE KEY `name_20` (`name`),
  ADD UNIQUE KEY `name_21` (`name`),
  ADD UNIQUE KEY `name_22` (`name`),
  ADD UNIQUE KEY `name_23` (`name`),
  ADD UNIQUE KEY `name_24` (`name`),
  ADD UNIQUE KEY `name_25` (`name`),
  ADD UNIQUE KEY `name_26` (`name`),
  ADD UNIQUE KEY `name_27` (`name`),
  ADD UNIQUE KEY `name_28` (`name`),
  ADD UNIQUE KEY `name_29` (`name`),
  ADD UNIQUE KEY `name_30` (`name`),
  ADD UNIQUE KEY `name_31` (`name`),
  ADD UNIQUE KEY `name_32` (`name`),
  ADD UNIQUE KEY `name_33` (`name`),
  ADD UNIQUE KEY `name_34` (`name`),
  ADD UNIQUE KEY `name_35` (`name`),
  ADD UNIQUE KEY `name_36` (`name`),
  ADD UNIQUE KEY `name_37` (`name`),
  ADD UNIQUE KEY `name_38` (`name`),
  ADD UNIQUE KEY `name_39` (`name`),
  ADD UNIQUE KEY `name_40` (`name`),
  ADD UNIQUE KEY `name_41` (`name`),
  ADD UNIQUE KEY `name_42` (`name`),
  ADD UNIQUE KEY `name_43` (`name`),
  ADD UNIQUE KEY `name_44` (`name`),
  ADD UNIQUE KEY `name_45` (`name`),
  ADD UNIQUE KEY `name_46` (`name`),
  ADD UNIQUE KEY `name_47` (`name`),
  ADD UNIQUE KEY `name_48` (`name`),
  ADD UNIQUE KEY `name_49` (`name`),
  ADD UNIQUE KEY `name_50` (`name`),
  ADD UNIQUE KEY `name_51` (`name`),
  ADD UNIQUE KEY `name_52` (`name`),
  ADD UNIQUE KEY `name_53` (`name`),
  ADD UNIQUE KEY `name_54` (`name`),
  ADD UNIQUE KEY `name_55` (`name`),
  ADD UNIQUE KEY `name_56` (`name`),
  ADD UNIQUE KEY `name_57` (`name`),
  ADD UNIQUE KEY `name_58` (`name`),
  ADD UNIQUE KEY `name_59` (`name`),
  ADD UNIQUE KEY `name_60` (`name`),
  ADD UNIQUE KEY `name_61` (`name`),
  ADD UNIQUE KEY `name_62` (`name`),
  ADD UNIQUE KEY `name_63` (`name`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `createdById` (`createdById`);

--
-- Indexes for table `email_logs`
--
ALTER TABLE `email_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `addressId` (`addressId`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orderId` (`orderId`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`),
  ADD KEY `products_createdById_foreign_idx` (`createdById`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_order_product_review` (`userId`,`orderId`,`productId`),
  ADD KEY `orderId` (`orderId`),
  ADD KEY `productId` (`productId`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `system_logs`
--
ALTER TABLE `system_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `productId` (`productId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `email_logs`
--
ALTER TABLE `email_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `system_logs`
--
ALTER TABLE `system_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_125` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `carts_ibfk_126` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `coupons`
--
ALTER TABLE `coupons`
  ADD CONSTRAINT `coupons_ibfk_1` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_123` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_124` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_111` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_112` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_createdById_foreign_idx` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_125` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlists_ibfk_126` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
