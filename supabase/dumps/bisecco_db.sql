-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : dim. 17 mai 2026 à 10:10
-- Version du serveur : 11.4.10-MariaDB
-- Version de PHP : 8.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `laurentn_bisecco`
--

-- --------------------------------------------------------

--
-- Structure de la table `artisan_connections`
--

CREATE TABLE `artisan_connections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `follower_id` bigint(20) UNSIGNED NOT NULL,
  `following_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `artisan_posts`
--

CREATE TABLE `artisan_posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_news` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `artisan_post_comments`
--

CREATE TABLE `artisan_post_comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `artisan_post_likes`
--

CREATE TABLE `artisan_post_likes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `artisan_profiles`
--

CREATE TABLE `artisan_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `metier_id` bigint(20) UNSIGNED NOT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `availability` varchar(255) DEFAULT NULL,
  `business_hours` varchar(255) DEFAULT NULL,
  `service_radius` int(11) DEFAULT NULL COMMENT 'in km',
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `siret` varchar(255) DEFAULT NULL,
  `siret_verified` tinyint(1) NOT NULL DEFAULT 0,
  `rcs_verified` tinyint(1) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `artisan_profiles`
--

INSERT INTO `artisan_profiles` (`id`, `user_id`, `metier_id`, `company_name`, `description`, `availability`, `business_hours`, `service_radius`, `latitude`, `longitude`, `siret`, `siret_verified`, `rcs_verified`, `is_active`, `created_at`, `updated_at`) VALUES
(15, 44, 398, 'AMP BAT', 'Bonjour \r\nPour un travail de serieux et de qualiter', 'week', '8 H / 17 H', 100, NULL, NULL, NULL, 0, 0, 1, '2026-04-28 12:03:34', '2026-04-28 12:14:40'),
(26, 57, 398, 'Bennour Naguez', 'Bennour Naguez est une entreprise professionnelle, basée à Meaux.', NULL, NULL, 30, NULL, NULL, '501828982', 0, 0, 1, '2026-04-29 17:19:06', '2026-04-29 17:19:06'),
(27, 58, 398, 'Malik Haddad (hm Services)', 'Malik Haddad (hm Services) est une entreprise professionnelle, basée à Melun.', NULL, NULL, 8, NULL, NULL, '983433210', 0, 0, 1, '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
(28, 60, 17, 'Sirius Automobiles', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 1, '2026-04-30 14:35:40', '2026-04-30 14:35:40'),
(29, 65, 16, 'Agisco', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 1, '2026-05-01 12:32:35', '2026-05-01 12:32:35'),
(30, 66, 413, 'Ns controle', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 1, '2026-05-11 09:09:41', '2026-05-11 09:09:41');

-- --------------------------------------------------------

--
-- Structure de la table `artisan_profile_metier`
--

CREATE TABLE `artisan_profile_metier` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `artisan_profile_id` bigint(20) UNSIGNED NOT NULL,
  `metier_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `artisan_profile_metier`
--

INSERT INTO `artisan_profile_metier` (`id`, `artisan_profile_id`, `metier_id`) VALUES
(2, 15, 398),
(9, 26, 398),
(10, 27, 398),
(11, 28, 17),
(12, 28, 411),
(13, 28, 412),
(14, 29, 16),
(15, 30, 413);

-- --------------------------------------------------------

--
-- Structure de la table `artisan_reports`
--

CREATE TABLE `artisan_reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `reporter_id` bigint(20) UNSIGNED NOT NULL,
  `reported_user_id` bigint(20) UNSIGNED NOT NULL,
  `post_id` bigint(20) UNSIGNED DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('bisecco-cache-bisecco_internal_news', 'a:2:{i:0;a:8:{s:5:\"title\";s:57:\"🎉 5 nouveaux artisans rejoignent Bisecco cette semaine\";s:4:\"link\";s:8:\"/profils\";s:4:\"desc\";s:128:\"Le réseau s\'agrandit ! Découvrez les derniers profils d\'artisans certifiés sur Bisecco. Bienvenue à eux dans la communauté.\";s:6:\"source\";s:7:\"Bisecco\";s:4:\"date\";s:10:\"01/05/2026\";s:12:\"published_at\";s:25:\"2026-05-01T10:08:55+02:00\";s:5:\"image\";N;s:8:\"internal\";b:1;}i:1;a:8:{s:5:\"title\";s:48:\"⚡ Répondez sous 2h pour décrocher la mission\";s:4:\"link\";s:11:\"/mon-profil\";s:4:\"desc\";s:131:\"70 % des particuliers choisissent l\'artisan qui répond le plus vite. Activez les notifications email pour ne rater aucune demande.\";s:6:\"source\";s:15:\"Conseil Bisecco\";s:4:\"date\";s:10:\"01/05/2026\";s:12:\"published_at\";s:25:\"2026-05-01T06:08:55+02:00\";s:5:\"image\";N;s:8:\"internal\";b:1;}}', 1777633735),
('bisecco-cache-rss_artisanat_v3', 'a:0:{}', 1777644537);

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `chat_conversations`
--

CREATE TABLE `chat_conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `visitor_id` varchar(64) NOT NULL,
  `visitor_name` varchar(255) DEFAULT NULL,
  `visitor_email` varchar(255) DEFAULT NULL,
  `page_url` varchar(255) DEFAULT NULL,
  `status` enum('open','handled','closed','bot') NOT NULL DEFAULT 'open',
  `human_mode` tinyint(1) NOT NULL DEFAULT 0,
  `last_activity_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `chat_conversations`
--

INSERT INTO `chat_conversations` (`id`, `visitor_id`, `visitor_name`, `visitor_email`, `page_url`, `status`, `human_mode`, `last_activity_at`, `created_at`, `updated_at`) VALUES
(18, 'Izo1O31gGw78fiBIgiFdBpDC9ZsJnXuFY2gG5W1A', NULL, NULL, '/', 'open', 0, '2026-05-14 20:01:59', '2026-05-14 20:01:59', '2026-05-14 20:01:59');

-- --------------------------------------------------------

--
-- Structure de la table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `body` text NOT NULL,
  `sender` enum('visitor','agent','bot') NOT NULL,
  `sender_name` varchar(255) DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `conversation_id`, `body`, `sender`, `sender_name`, `read_at`, `created_at`, `updated_at`) VALUES
(32, 18, 'Comment fonctionne Bisecco ?', 'visitor', 'Visiteur', NULL, '2026-05-14 20:01:59', '2026-05-14 20:01:59'),
(33, 18, 'Je note votre demande. Souhaitez-vous trouver un artisan, en savoir plus sur la plateforme ou gérer votre compte ?', 'bot', 'Camille — Conseillère Bisecco', NULL, '2026-05-14 20:01:59', '2026-05-14 20:01:59');

-- --------------------------------------------------------

--
-- Structure de la table `daily_visit_stats`
--

CREATE TABLE `daily_visit_stats` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `page_views` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `unique_visitors` bigint(20) UNSIGNED NOT NULL DEFAULT 0,
  `new_artisans` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `new_particuliers` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `pending_validations` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `active_sirens` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `total_accounts` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `daily_visit_stats`
--

INSERT INTO `daily_visit_stats` (`id`, `date`, `page_views`, `unique_visitors`, `new_artisans`, `new_particuliers`, `pending_validations`, `active_sirens`, `total_accounts`, `created_at`, `updated_at`) VALUES
(1, '2026-04-19', 59, 10, 0, 0, 0, 0, 0, '2026-04-19 09:23:57', '2026-04-19 14:28:02'),
(2, '2026-04-20', 307, 38, 0, 0, 0, 0, 0, '2026-04-19 22:09:39', '2026-04-20 20:59:52'),
(3, '2026-04-21', 238, 37, 0, 0, 0, 0, 0, '2026-04-21 01:31:58', '2026-04-21 19:26:14'),
(4, '2026-04-22', 461, 46, 0, 0, 0, 0, 0, '2026-04-22 06:29:23', '2026-04-22 18:27:03'),
(5, '2026-04-23', 57, 7, 0, 0, 0, 0, 0, '2026-04-23 07:03:19', '2026-04-23 18:59:38'),
(6, '2026-04-24', 3, 1, 0, 0, 0, 0, 0, '2026-04-24 09:19:37', '2026-04-24 09:24:55'),
(7, '2026-04-25', 9, 6, 0, 0, 0, 0, 0, '2026-04-25 04:52:50', '2026-04-25 17:54:46'),
(8, '2026-04-26', 647, 54, 0, 0, 0, 0, 0, '2026-04-26 06:58:49', '2026-04-26 20:25:13'),
(9, '2026-04-27', 474, 97, 0, 0, 0, 0, 0, '2026-04-27 06:03:54', '2026-04-27 20:01:39'),
(10, '2026-04-28', 396, 157, 0, 0, 0, 0, 0, '2026-04-27 22:13:28', '2026-04-28 21:35:25'),
(11, '2026-04-29', 168, 94, 0, 0, 0, 0, 0, '2026-04-28 22:20:48', '2026-04-29 18:22:13'),
(12, '2026-04-30', 116, 103, 0, 0, 0, 0, 0, '2026-04-29 23:39:33', '2026-04-30 18:27:31'),
(13, '2026-05-01', 270, 222, 0, 0, 0, 0, 0, '2026-05-01 00:34:27', '2026-05-01 21:53:38'),
(14, '2026-05-02', 70, 64, 0, 0, 0, 0, 0, '2026-05-02 04:39:34', '2026-05-02 21:04:47'),
(17, '2026-05-03', 90, 86, 0, 0, 0, 0, 0, '2026-05-03 00:03:19', '2026-05-03 17:28:50'),
(18, '2026-05-04', 16, 16, 0, 0, 0, 0, 0, '2026-05-04 04:32:27', '2026-05-04 17:05:17'),
(19, '2026-05-05', 38, 30, 0, 0, 0, 0, 0, '2026-05-05 01:12:03', '2026-05-05 18:51:09'),
(20, '2026-05-06', 23, 21, 0, 0, 0, 0, 0, '2026-05-05 22:56:47', '2026-05-06 14:10:40'),
(23, '2026-05-07', 118, 117, 0, 0, 0, 0, 0, '2026-05-06 22:03:28', '2026-05-07 19:40:08'),
(24, '2026-05-08', 38, 35, 0, 0, 0, 0, 0, '2026-05-08 00:15:11', '2026-05-08 20:31:18'),
(25, '2026-05-09', 44, 36, 0, 0, 0, 0, 0, '2026-05-09 02:36:48', '2026-05-09 21:26:32'),
(26, '2026-05-10', 37, 37, 0, 0, 0, 0, 0, '2026-05-09 22:54:11', '2026-05-10 20:09:06'),
(27, '2026-05-11', 64, 60, 0, 0, 0, 0, 0, '2026-05-11 00:19:21', '2026-05-11 21:59:52'),
(28, '2026-05-12', 32, 32, 0, 0, 0, 0, 0, '2026-05-11 22:09:48', '2026-05-12 21:46:05'),
(29, '2026-05-13', 40, 34, 0, 0, 0, 0, 0, '2026-05-12 22:05:50', '2026-05-13 21:49:55'),
(30, '2026-05-14', 69, 68, 0, 0, 0, 0, 0, '2026-05-13 22:16:08', '2026-05-14 20:13:43'),
(31, '2026-05-15', 32, 31, 0, 0, 0, 0, 0, '2026-05-15 06:24:11', '2026-05-15 18:35:18'),
(32, '2026-05-16', 31, 30, 0, 0, 0, 0, 0, '2026-05-16 03:36:03', '2026-05-16 19:31:08'),
(33, '2026-05-17', 9, 9, 0, 0, 0, 0, 0, '2026-05-16 22:34:45', '2026-05-17 07:41:57');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `follows`
--

CREATE TABLE `follows` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `follower_id` bigint(20) UNSIGNED NOT NULL,
  `following_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `gallery_images`
--

CREATE TABLE `gallery_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `artisan_profile_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `image_path` varchar(255) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `gallery_images`
--

INSERT INTO `gallery_images` (`id`, `artisan_profile_id`, `user_id`, `image_path`, `caption`, `sort_order`, `created_at`, `updated_at`) VALUES
(5, NULL, 36, 'gallery/InAnUWKw83XW2Gh7PM0vKbj7EtnJEyYWaujPc0w2.jpg', NULL, 0, '2026-04-26 17:56:08', '2026-04-26 17:56:08');

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `jobs`
--

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(1, 'default', '{\"uuid\":\"99c55a74-16bd-44ba-b787-fa2473231a49\",\"displayName\":\"App\\\\Jobs\\\\NotifySubscribers\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\NotifySubscribers\",\"command\":\"O:26:\\\"App\\\\Jobs\\\\NotifySubscribers\\\":0:{}\",\"batchId\":null},\"createdAt\":1776688271,\"delay\":null}', 0, NULL, 1776688271, 1776688271),
(2, 'default', '{\"uuid\":\"1dc75d0f-0602-4033-b0b2-30bacbf0f553\",\"displayName\":\"App\\\\Jobs\\\\NotifySubscribers\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\NotifySubscribers\",\"command\":\"O:26:\\\"App\\\\Jobs\\\\NotifySubscribers\\\":0:{}\",\"batchId\":null},\"createdAt\":1776689017,\"delay\":null}', 0, NULL, 1776689017, 1776689017),
(3, 'default', '{\"uuid\":\"9381033d-3cc6-4a0b-9775-a23c2ea6a447\",\"displayName\":\"App\\\\Jobs\\\\NotifySubscribers\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\NotifySubscribers\",\"command\":\"O:26:\\\"App\\\\Jobs\\\\NotifySubscribers\\\":0:{}\",\"batchId\":null},\"createdAt\":1776689048,\"delay\":null}', 0, NULL, 1776689048, 1776689048),
(4, 'default', '{\"uuid\":\"7d42ad5d-a782-4041-b614-de7b517d94d0\",\"displayName\":\"App\\\\Jobs\\\\NotifySubscribers\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\NotifySubscribers\",\"command\":\"O:26:\\\"App\\\\Jobs\\\\NotifySubscribers\\\":0:{}\",\"batchId\":null},\"createdAt\":1777229884,\"delay\":null}', 0, NULL, 1777229884, 1777229884),
(5, 'default', '{\"uuid\":\"ef0e946d-1a4b-42e7-af9f-10a442b0c85d\",\"displayName\":\"App\\\\Jobs\\\\NotifySubscribers\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"deleteWhenMissingModels\":false,\"data\":{\"commandName\":\"App\\\\Jobs\\\\NotifySubscribers\",\"command\":\"O:26:\\\"App\\\\Jobs\\\\NotifySubscribers\\\":0:{}\",\"batchId\":null},\"createdAt\":1777465421,\"delay\":null}', 0, NULL, 1777465421, 1777465421);

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `maintenance_subscribers`
--

CREATE TABLE `maintenance_subscribers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `notified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED NOT NULL,
  `receiver_id` bigint(20) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `content`, `read_at`, `created_at`, `updated_at`) VALUES
(16, 64, 4, 'Essai', '2026-05-11 09:16:53', '2026-05-01 12:21:51', '2026-05-11 09:16:53');

-- --------------------------------------------------------

--
-- Structure de la table `metiers`
--

CREATE TABLE `metiers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `category` enum('batiment','facade_equipement','services_techniques','metiers_bouche','services_proximite') NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `metiers`
--

INSERT INTO `metiers` (`id`, `name`, `slug`, `category`, `description`, `icon`, `created_at`, `updated_at`) VALUES
(1, 'Maçon', 'macon', 'batiment', 'Murs porteurs, dalles, ouvertures et gros œuvre', NULL, '2026-04-19 09:25:38', '2026-04-26 12:31:43'),
(2, 'Peintre', 'peintre', 'batiment', 'Peinture intérieure, extérieure et finitions', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
(3, 'Carreleur', 'carreleur', 'batiment', 'Pose de carrelage, faïence et terrasse', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
(4, 'Plâtrier', 'platrier', 'batiment', 'Cloisons, doublages, enduits et faux plafonds', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
(5, 'Couvreur', 'couvreur', 'batiment', 'Pose et réparation de toitures', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
(6, 'Charpentier', 'charpentier', 'batiment', 'Charpente bois, ossature et renforts', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
(7, 'Serrurier', 'serrurier', 'batiment', 'Ouverture, remplacement de serrure et blindage', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
(8, 'Vitrier', 'vitrier', 'batiment', 'Remplacement vitrage, double vitrage et vitrine', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
(9, 'Façadier', 'facadier', 'facade_equipement', 'Ravalement, isolation extérieure et bardage', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
(10, 'Étancheur', 'etancheur', 'facade_equipement', 'Étanchéité toiture, terrasse et fondations', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
(11, 'Installateur de cuisine', 'installateur-de-cuisine', 'facade_equipement', 'Pose de cuisine équipée sur mesure', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
(12, 'Climaticien', 'climaticien', 'facade_equipement', 'Installation et entretien de climatisation', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
(13, 'Pompe à chaleur', 'pompe-a-chaleur', 'facade_equipement', 'Installation de PAC air-eau et air-air', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
(14, 'Panneaux solaires', 'panneaux-solaires', 'facade_equipement', 'Installation photovoltaïque', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
(15, 'Électroménager', 'electromenager', 'services_techniques', 'Dépannage lave-linge, frigo, four et lave-vaisselle', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
(16, 'Informatique', 'informatique', 'services_techniques', 'Dépannage PC/Mac logiciel et matériel', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
(17, 'Mécanicien auto', 'mecanicien-auto', 'services_techniques', 'Entretien et réparation automobile', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
(18, 'Mécanicien moto', 'mecanicien-moto', 'services_techniques', 'Entretien et révision moto', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
(19, 'Boulanger', 'boulanger', 'metiers_bouche', 'Pain traditionnel et viennoiseries', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
(20, 'Pâtissier', 'patissier', 'metiers_bouche', 'Gâteaux, entremets et pièces montées', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
(21, 'Boucher', 'boucher', 'metiers_bouche', 'Viandes de qualité et découpe', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
(22, 'Fromager', 'fromager', 'metiers_bouche', 'Sélection et affinage de fromages', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
(23, 'Chocolatier', 'chocolatier', 'metiers_bouche', 'Chocolats fins et confiseries', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
(24, 'Coiffeur', 'coiffeur', 'services_proximite', 'Coupe, coloration et brushing', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
(25, 'Esthéticienne', 'estheticienne', 'services_proximite', 'Soins visage, épilation et maquillage', NULL, '2026-04-19 09:25:38', '2026-04-19 09:25:38'),
(26, 'Orthodontiste', 'orthodontiste', 'services_proximite', 'Alignement dentaire, appareils et suivi', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
(27, 'Photographe', 'photographe', 'services_proximite', 'Mariage, portrait et événements', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
(28, 'Jardinier', 'jardinier', 'services_proximite', 'Entretien, tonte, taille et plantations', NULL, '2026-04-19 09:25:38', '2026-04-22 13:30:22'),
(29, 'Paysagiste', 'paysagiste', 'services_proximite', 'Aménagement et création de jardins', NULL, '2026-04-19 09:25:38', '2026-04-22 13:56:53'),
(398, 'Plombier', 'plombier', 'batiment', 'Installation sanitaire, dépannage et réseaux d\'eau', NULL, '2026-04-22 12:17:31', '2026-04-26 12:31:43'),
(399, 'Électricien', 'electricien', 'batiment', 'Installation électrique, mise aux normes et dépannage', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
(400, 'Menuisier', 'menuisier', 'batiment', 'Fabrication et pose de menuiseries intérieures et extérieures', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(401, 'Terrassier', 'terrassier', 'batiment', 'Préparation de terrain, tranchées et fondations', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(402, 'Chauffagiste', 'chauffagiste', 'batiment', 'Installation et entretien chauffage et eau chaude', NULL, '2026-04-22 12:17:31', '2026-04-22 13:30:22'),
(403, 'Pisciniste', 'pisciniste', 'batiment', 'Construction, rénovation et entretien de piscines', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(404, 'Domoticien', 'domoticien', 'batiment', 'Automatisation de l\'habitat, sécurité et objets connectés', NULL, '2026-04-22 12:17:31', '2026-04-26 12:31:43'),
(405, 'Storiste', 'storiste', 'batiment', 'Pose de stores, volets et protections solaires', NULL, '2026-04-22 12:17:31', '2026-04-22 13:30:22'),
(406, 'Ascensoriste', 'ascensoriste', 'batiment', 'Installation et maintenance d\'ascenseurs et élévateurs', NULL, '2026-04-22 12:17:31', '2026-04-26 12:31:43'),
(407, 'Parqueteur', 'parqueteur', 'batiment', 'Pose, rénovation et vitrification de parquet', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(408, 'Peintre en bâtiment', 'peintre-en-batiment', 'batiment', 'Peinture intérieure, extérieure et finitions de chantier', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
(409, 'Installateur panneaux solaires', 'installateur-panneaux-solaires', 'facade_equipement', 'Pose et mise en service de panneaux solaires', NULL, '2026-04-22 12:17:31', '2026-04-22 13:30:22'),
(410, 'Garagiste', 'garagiste', 'services_techniques', 'Entretien courant, diagnostic et réparations atelier', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(411, 'Carrossier', 'carrossier', 'services_techniques', 'Réparation carrosserie, redressage et finitions', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(412, 'Peintre automobile', 'peintre-automobile', 'services_techniques', 'Peinture, raccords et finitions carrosserie', NULL, '2026-04-22 12:17:31', '2026-04-22 13:30:22'),
(413, 'Contrôleur technique', 'controleur-technique', 'services_techniques', 'Contrôle technique et vérification sécurité véhicule', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
(414, 'Dépanneur', 'depanneur', 'services_techniques', 'Assistance, remorquage et dépannage rapide', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
(415, 'Électricien automobile', 'electricien-automobile', 'services_techniques', 'Diagnostic et réparation des systèmes électriques auto', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
(416, 'Préparateur automobile', 'preparateur-automobile', 'services_techniques', 'Préparation esthétique et technique de véhicules', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
(417, 'Vulcanisateur', 'vulcanisateur', 'services_techniques', 'Réparation, montage et entretien de pneus', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(418, 'Réparateur électroménager', 'reparateur-electromenager', 'services_techniques', 'Diagnostic et réparation des appareils électroménagers', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
(419, 'Réparateur informatique', 'reparateur-informatique', 'services_techniques', 'Diagnostic, maintenance et réparation informatique', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
(420, 'Charcutier', 'charcutier', 'metiers_bouche', 'Préparation de charcuteries et spécialités traiteur', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(421, 'Poissonnier', 'poissonnier', 'metiers_bouche', 'Préparation et vente de poissons et produits de la mer', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(422, 'Traiteur', 'traiteur', 'metiers_bouche', 'Buffets, repas événementiels et cuisine livrée', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(423, 'Glacier', 'glacier', 'metiers_bouche', 'Glaces artisanales, sorbets et desserts glacés', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(424, 'Confiseur', 'confiseur', 'metiers_bouche', 'Confiseries artisanales et douceurs sucrées', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(425, 'Brasseur artisanal', 'brasseur-artisanal', 'metiers_bouche', 'Brassage, fermentation et production de bière artisanale', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(426, 'Cuisinier traiteur', 'cuisinier-traiteur', 'metiers_bouche', 'Cuisine sur mesure pour réceptions et événements', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(427, 'Pizzaiolo', 'pizzaiolo', 'metiers_bouche', 'Préparation et cuisson de pizzas artisanales', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(428, 'Barbier', 'barbier', 'services_proximite', 'Taille de barbe, rasage et soins homme', NULL, '2026-04-22 12:17:31', '2026-04-22 13:30:22'),
(429, 'Taxi', 'taxi', 'services_proximite', 'Transport local de personnes et trajets réservés', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(430, 'Chauffeur VTC', 'chauffeur-vtc', 'services_proximite', 'Transport privé sur réservation', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(431, 'Déménageur', 'demenageur', 'services_proximite', 'Transport, manutention et installation lors de déménagements', NULL, '2026-04-22 12:17:31', '2026-04-22 12:17:31'),
(432, 'Blanchisseur', 'blanchisseur', 'services_proximite', 'Entretien, lavage et traitement du linge', NULL, '2026-04-22 12:17:31', '2026-04-22 13:30:22'),
(433, 'Pressing', 'pressing', 'services_proximite', 'Nettoyage, détachage et entretien textile', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(434, 'Cordonnier', 'cordonnier', 'services_proximite', 'Réparation de chaussures, maroquinerie et entretien cuir', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(435, 'Horloger', 'horloger', 'services_proximite', 'Réparation et entretien de montres et pendules', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(436, 'Toiletteur animalier', 'toiletteur-animalier', 'services_proximite', 'Toilettage, coupe et soins d\'hygiène pour animaux', NULL, '2026-04-22 12:17:31', '2026-04-26 12:31:43'),
(437, 'Agent de nettoyage', 'agent-de-nettoyage', 'services_proximite', 'Nettoyage régulier, remise en état et entretien de locaux', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(438, 'Tatoueur', 'tatoueur', 'services_proximite', 'Tatouage artistique, dessin personnalisé et retouches', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(439, 'Prothésiste ongulaire', 'prothesiste-ongulaire', 'services_proximite', 'Pose, entretien et décoration d\'ongles', NULL, '2026-04-22 12:17:31', '2026-04-26 12:31:43'),
(440, 'Laveur automobile', 'laveur-automobile', 'services_proximite', 'Nettoyage intérieur, extérieur et préparation esthétique', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(441, 'Laveur auto', 'laveur-auto', 'services_proximite', 'Nettoyage intérieur et extérieur de véhicules', NULL, '2026-04-22 12:17:31', '2026-04-22 13:56:53'),
(442, 'Ébéniste', 'ebeniste', 'services_techniques', 'Création et restauration de mobilier en bois', NULL, '2026-04-22 12:25:34', '2026-04-22 12:25:34'),
(443, 'Ferronnier', 'ferronnier', 'services_techniques', 'Ouvrages en métal, garde-corps et ferronnerie décorative', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
(444, 'Céramiste', 'ceramiste', 'services_techniques', 'Création de pièces en terre cuite et émaillée', NULL, '2026-04-22 12:25:34', '2026-04-22 12:25:34'),
(445, 'Bijoutier', 'bijoutier', 'services_techniques', 'Fabrication et réparation de bijoux', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
(446, 'Joaillier', 'joaillier', 'services_techniques', 'Création de bijoux précieux et sertissage', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
(447, 'Tailleur', 'tailleur', 'services_techniques', 'Confection et ajustement de vêtements sur mesure', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
(448, 'Couturier', 'couturier', 'services_techniques', 'Retouches, confection textile et créations sur mesure', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
(449, 'Tapissier', 'tapissier', 'services_techniques', 'Réfection de sièges, rideaux et décoration textile', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
(450, 'Imprimeur', 'imprimeur', 'services_techniques', 'Impression artisanale, supports papier et finitions', NULL, '2026-04-22 12:25:34', '2026-04-22 13:30:22'),
(451, 'Graveur', 'graveur', 'services_techniques', 'Gravure sur métal, verre, bois ou pierre', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
(452, 'Maroquinier', 'maroquinier', 'services_techniques', 'Création et réparation d\'articles en cuir', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
(453, 'Luthier', 'luthier', 'services_techniques', 'Fabrication, réglage et réparation d\'instruments à cordes', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
(454, 'Souffleur de verre', 'souffleur-de-verre', 'services_techniques', 'Création d\'objets décoratifs et utilitaires en verre', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
(455, 'Sculpteur', 'sculpteur', 'services_techniques', 'Création et taille de pièces artistiques', NULL, '2026-04-22 12:25:34', '2026-04-22 13:56:53'),
(456, 'Encadreur', 'encadreur', 'services_techniques', 'Encadrement sur mesure pour œuvres et documents', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
(457, 'Relieur', 'relieur', 'services_techniques', 'Reliure, restauration et finition d\'ouvrages', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
(458, 'Horloger d\'art', 'horloger-dart', 'services_techniques', 'Restauration d\'horlogerie ancienne et pièces d\'exception', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
(459, 'Verrier', 'verrier', 'services_techniques', 'Création, découpe et restauration d\'ouvrages en verre', NULL, '2026-04-22 12:25:34', '2026-04-26 12:31:43'),
(552, 'Maçon', 'maaon', 'batiment', 'Murs porteurs, dalles, ouvertures et gros Å“uvre', NULL, '2026-04-22 13:30:22', '2026-04-22 13:30:22'),
(554, 'Façadier', 'faaadier', 'facade_equipement', 'Ravalement, isolation extÃ©rieure et bardage', NULL, '2026-04-22 13:30:22', '2026-04-22 13:30:22'),
(570, 'Prothésiste ongulaire', 'prothasiste-ongulaire', 'services_proximite', 'Pose, entretien et dÃ©coration d ongles', NULL, '2026-04-22 13:30:22', '2026-04-22 13:30:22');

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_04_11_000001_create_metiers_table', 1),
(5, '2026_04_11_000002_create_artisan_profiles_table', 1),
(6, '2026_04_11_000003_create_services_table', 1),
(7, '2026_04_11_000004_create_gallery_images_table', 1),
(8, '2026_04_11_000005_create_messages_table', 1),
(9, '2026_04_11_000006_create_reviews_table', 1),
(10, '2026_04_13_000001_add_siren_and_validation_to_users_table', 1),
(11, '2026_04_13_000002_add_client_number_to_users_table', 1),
(12, '2026_04_13_060132_create_customer_columns', 1),
(13, '2026_04_13_060133_create_subscriptions_table', 1),
(14, '2026_04_13_060134_create_subscription_items_table', 1),
(15, '2026_04_13_060135_add_meter_id_to_subscription_items_table', 1),
(16, '2026_04_13_060136_add_meter_event_name_to_subscription_items_table', 1),
(17, '2026_04_13_000003_add_siren_status_to_users_table', 2),
(18, '2026_04_14_120000_create_daily_visit_stats_table', 2),
(19, '2026_04_18_000001_add_soft_deletes_to_users_table', 2),
(20, '2026_04_19_000001_add_is_flagged_to_reviews_table', 3),
(21, '2026_04_20_000001_create_maintenance_subscribers_table', 4),
(22, '2026_04_20_000002_add_stats_columns_to_daily_visit_stats_table', 4),
(23, '2026_04_20_000003_add_description_to_users_table', 5),
(24, '2026_04_21_000001_create_artisan_posts_table', 6),
(25, '2026_04_21_000002_add_is_news_to_artisan_posts_table', 7),
(26, '2026_04_21_000003_create_artisan_reports_table', 8),
(27, '2026_04_22_000001_create_posts_table', 9),
(28, '2026_04_22_000002_create_follows_table', 9),
(29, '2026_04_22_000003_create_personal_access_tokens_table', 9),
(30, '2026_04_24_130000_expand_gallery_images_to_all_users', 10),
(31, '2026_04_25_204628_create_chat_conversations_table', 10),
(34, '2026_04_25_204629_create_chat_messages_table', 11),
(35, '2026_04_26_000001_fix_metiers_encoding', 12),
(36, '2026_04_27_000001_add_informatique_to_metiers', 12),
(37, '2026_04_27_000002_create_profile_views_table', 13),
(38, '2026_04_29_000001_create_artisan_profile_metier_table', 14),
(39, '2026_04_30_000005_add_oauth_to_users', 15);

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('dejesustavaresp@gmail.com', '$2y$12$Atv0pQR0.Vpckb/fzGpIR.711Eo0XsY5eZHf1PJCYHwd9UFLhfieC', '2026-04-26 14:23:56'),
('nero.lorenzo@gmail.com', '$2y$12$QvdGBmUWFdq7PALUXe/FGOR2QtlbvbUuJ1s86uPa2Gq86XRBSTyqK', '2026-04-26 14:26:41');

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

CREATE TABLE `posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `likes` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `comments` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `type` varchar(50) NOT NULL DEFAULT 'general',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `profile_views`
--

CREATE TABLE `profile_views` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `profile_user_id` bigint(20) UNSIGNED NOT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `profile_views`
--

INSERT INTO `profile_views` (`id`, `profile_user_id`, `viewed_at`) VALUES
(4, 44, '2026-04-28 12:10:44'),
(5, 44, '2026-04-28 12:12:00'),
(6, 44, '2026-04-28 14:23:14'),
(7, 44, '2026-04-28 14:49:05'),
(8, 44, '2026-04-28 14:52:28'),
(10, 44, '2026-04-29 06:29:04'),
(12, 44, '2026-04-29 07:01:08'),
(14, 44, '2026-04-29 13:45:11'),
(27, 44, '2026-05-01 11:14:13'),
(37, 44, '2026-05-07 13:28:38'),
(43, 44, '2026-05-08 02:36:56'),
(18, 57, '2026-04-29 17:19:33'),
(26, 57, '2026-05-01 10:47:12'),
(34, 57, '2026-05-03 08:28:32'),
(44, 57, '2026-05-08 06:45:41'),
(52, 57, '2026-05-13 06:17:54'),
(56, 57, '2026-05-14 12:28:26'),
(57, 57, '2026-05-14 12:28:30'),
(19, 58, '2026-04-29 17:37:47'),
(21, 58, '2026-04-30 09:23:06'),
(32, 58, '2026-05-01 19:27:39'),
(33, 58, '2026-05-01 21:53:38'),
(45, 58, '2026-05-08 08:46:49'),
(53, 58, '2026-05-13 06:21:08'),
(55, 58, '2026-05-14 12:28:01'),
(22, 60, '2026-04-30 15:16:35'),
(23, 60, '2026-04-30 15:16:40'),
(24, 60, '2026-05-01 10:22:04'),
(28, 60, '2026-05-01 12:07:58'),
(29, 60, '2026-05-01 12:14:19'),
(35, 60, '2026-05-03 08:56:14'),
(42, 60, '2026-05-08 01:07:11'),
(47, 60, '2026-05-09 12:11:18'),
(49, 60, '2026-05-11 12:24:20'),
(50, 60, '2026-05-11 12:24:26'),
(51, 60, '2026-05-11 16:14:57'),
(58, 60, '2026-05-14 20:11:17'),
(59, 60, '2026-05-16 07:44:04'),
(30, 65, '2026-05-01 12:35:15'),
(31, 65, '2026-05-01 12:56:38'),
(36, 65, '2026-05-05 04:26:21'),
(38, 65, '2026-05-07 15:54:36'),
(39, 65, '2026-05-07 15:54:41'),
(40, 65, '2026-05-07 15:55:53'),
(41, 65, '2026-05-07 16:42:14'),
(46, 65, '2026-05-09 12:10:55'),
(48, 66, '2026-05-11 09:17:20'),
(54, 66, '2026-05-14 06:43:58');

-- --------------------------------------------------------

--
-- Structure de la table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `is_flagged` tinyint(1) NOT NULL DEFAULT 0,
  `artisan_profile_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

CREATE TABLE `services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `artisan_profile_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `services`
--

INSERT INTO `services` (`id`, `artisan_profile_id`, `name`, `price`, `created_at`, `updated_at`) VALUES
(2, 27, 'Débouchage canalisation', '80 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
(3, 27, 'Réparation fuite d\'eau', '90 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
(4, 27, 'Installation robinetterie', '120 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
(5, 27, 'Remplacement chauffe-eau', '350 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28'),
(6, 27, 'Dépannage urgent', '150 €', '2026-04-29 17:37:28', '2026-04-29 17:37:28');

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('3Dnk0BpDlPKw7GLwv7EHdgthMV6PrvvsQe0FoCEi', NULL, '89.90.141.161', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJVVldFZWZUNE9sQ25GR0V3bnBSZU1Pc3lNV0NvVVlXRTl3T09EcDlIIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778938118),
('4NOdAYnXmHHbIpPUobgoRrgkbgv9jpmhEfbZEW7L', NULL, '131.117.203.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJlYks5dzlDR1haMkNFZzFlWUJPcTVVV2xCVnFWcXJqeHJlYTJ0MmI5IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778911273),
('7qEjj6sqqIrgbbUcu6ceyPTRDCjYC28lpJOq450y', NULL, '212.227.48.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.3029.110 Safari/537.3', 'eyJfdG9rZW4iOiJHdnFMRHp2MUZtQm1abVFKblphNU5CNGRvZEVUUzhOcVlpOGFoaW0zIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE3Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvYmlzZWNjby5mclwvY29udGFjdCIsInJvdXRlIjoiY29udGFjdCJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1779003718),
('88MtS0hUqu56nOLIzgbxfuCse7WmBURzkw7B3n6M', NULL, '93.158.90.151', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115', 'eyJfdG9rZW4iOiJRRHdEN1R4d3ZKenpVUzR5d3RxY0FQZ3M4ZHE1NXY0dmJtZTEzaDNQIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE3Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvYmlzZWNjby5mciIsInJvdXRlIjoiaG9tZSJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1779001872),
('8KlWI5fWNN5hAn08Pg0tCEdFeSad1aGW0Z3YskkX', NULL, '212.227.48.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.3029.110 Safari/537.3', 'eyJfdG9rZW4iOiI2YWpjZmVncDJZWUxKVUNyOVY1Q0psZFF0czE4WTVXYXB4RHhrUVBrIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE3Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvYmlzZWNjby5mciIsInJvdXRlIjoiaG9tZSJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1779003716),
('8So3m4VBw9O14FdqIh5HRcuUkxwAxuAADWnoqSnO', NULL, '89.90.141.161', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)', 'eyJfdG9rZW4iOiIzMHg5MlRvRlhEZVlSc1hGQkVibGFaMU4wa3ltcGVCdmZXSlJQZlRpIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778938116),
('9fCqKMPGLWEWCURatjpJR92pH5qqwerzFf8I0Juk', NULL, '89.90.141.161', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148', 'eyJfdG9rZW4iOiJ1T2dvS3FCdWQzM2RlZ2xmQkxiR2hqNFhac2w0QTd4NjZ0a1U5b1Y5IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL3d3dy5iaXNlY2NvLmZyIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1778932212),
('a3nieDrtUlDkUBv2Wl0qs9UIk2kD2NN9whOjiEa2', NULL, '194.5.49.166', '', 'eyJfdG9rZW4iOiIzSTBGZExsREpXWk5SbHFiYzJlc0hWUU9PWm50T0xNb1NxeXN0QUw5IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvYmlzZWNjby5mciIsInJvdXRlIjoiaG9tZSJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1778959868),
('AHTHzloF1EKFDu0n2RPo1kj64OrindBWwDyjYDcI', NULL, '198.235.24.15', 'Hello from Palo Alto Networks, find out more about our scans in https://docs-cortex.paloaltonetworks.com/r/1/Cortex-Xpanse/Scanning-activity', 'eyJfdG9rZW4iOiJ0RWJ4eUl3UTJMZ2txV004MGRkbWN6R0tiZlZWUzFybkp4R0UycXExIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvYmlzZWNjby5mciIsInJvdXRlIjoiaG9tZSJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1778943452),
('B3YODE3IP6sz7H5KYGiQ66VkCOVl4llV7fzk5B05', NULL, '107.175.39.153', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_7_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.5532.2 Safari/537.36 OPR/97.0.4711.0', 'eyJfdG9rZW4iOiJFd2YzN1o4OGM2NEUxSXJGSGlIcFVxWE1wd3JaN0hJT0xrRjZkbkNtIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE3Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL3d3dy5iaXNlY2NvLmZyIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1778984864),
('bIgeaRPqfNL87aDpnoE4fSEjbOkkhKfj39acG5np', NULL, '185.227.151.64', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.7444.59 Safari/537.36', 'eyJfdG9rZW4iOiJqRDNTNEhDSnlNckp0ZTFoTzVwMXFOdnpKT2FZV0dOVVU2RTVUNlpVIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778935111),
('dgN4RTYGiIXH7YuSqYHEM60b6qPGzjXK4RtIfiJ4', NULL, '89.90.141.161', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJ1amF4eGgzUDdvdmd5ejNuMHVpa0xwZmJ0dGJ1bVBLcGRXaEtzMUFNIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL3d3dy5iaXNlY2NvLmZyIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1778932240),
('E3f9XQKbUGn1VkXON9p9G4EpachjNEME2pbvG33i', NULL, '89.90.141.161', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15', 'eyJfdG9rZW4iOiJNbzBQWlZpVEIzcGFPQzFzTXE1clN6R0ZKRmNTSklidUNab0Q1c1A3IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778930644),
('F1EuVlt1PQ31Fo6O0gevNUTcm5tPKOGcj2F3NrCT', NULL, '89.90.141.161', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15', 'eyJfdG9rZW4iOiJCOWFTc0JDcU5GZE9Zd3BTcm1ET29wVDJwSDFRMDZqNDRRTVRtcjc3IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778931992),
('F3YhwFSbQU0D1BojeThgf8AumGxmUcUzDQo38uJP', NULL, '54.86.66.252', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/600.1.25 (KHTML, like Gecko) Version/8.0 Safari/600.1.25', 'eyJfdG9rZW4iOiJZcUlUQm93NlJyOGxQb1BEcVN5c0YzRVVlbGtuUmVsd0xmVU1oMHkwIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE3Ijp0cnVlLCJzdGF0ZSI6IlVuRTlEajR6VnBKazlzSEJCaWl1UFczMHpvYk1FQ3kyMklac3VBb1YiLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnJcL2F1dGhcL2dvb2dsZSIsInJvdXRlIjoib2F1dGgucmVkaXJlY3QifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778996462),
('FaDwkHhebEwIGzKqiAc84UYhpN0skAFwPF1DIljf', NULL, '185.227.151.61', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJCYW9OYURQbGQ3akFxdUU1M3dhUjVwSE1HczROQjllemRlMU5YRDlwIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778935113),
('GopCnr7vapL5zkJn2Sae7UV6Ub2B3gQfZHi26303', NULL, '89.90.141.161', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/601.2.4 (KHTML, like Gecko) Version/9.0.1 Safari/601.2.4 facebookexternalhit/1.1 Facebot Twitterbot/1.0', 'eyJfdG9rZW4iOiJETmJLQ2tpeVVzM2dJc1ZsREZWWHY1WERpZnVtUXl4ZFc3WXB0YVI3IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL3d3dy5iaXNlY2NvLmZyIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1778932240),
('hRrDOweYM5up9Aen8UJ0iSf0tsMgj1CN22q6fAYv', NULL, '131.117.203.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ1UmJpYUR3NXFBSUgzMUJQWGNCUk1hd1NwNmk1eTZzZ1p4eU9sS2dtIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnJcL21ldGllcnMiLCJyb3V0ZSI6Im1ldGllcnMifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778915690),
('iEw8D1lmoEwXjnXC8jk546HnZcK1aZWp6wjxvUaU', NULL, '141.98.153.47', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0', 'eyJfdG9rZW4iOiJQYVQwRFFzSkl2c3dYTFBHVDI3SVRGQ3B0ZVJFYU1Rd3RBeUdtbGRXIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnJcL3NpdGVtYXAueG1sIiwicm91dGUiOiJzaXRlbWFwIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1778947879),
('IImCvTbqzv7FlZUm3hv4CAOIotDTeKXpUrn0suNc', NULL, '141.98.153.47', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJzWUdIWjYwZDV6TXRKaFNleVNlSEhMQWRCMk91RDFwUlBlVVllR2NvIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778947879),
('J5Z1hFPJYgrLlWfhk1JVl2HPzCBySeBGC15jo1PM', NULL, '204.101.161.15', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJzdDdxMUNtanNjdmdPWkp3ZGJNMVJPUUtZOWdBVmV5UWFjeWRhZklwIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE3Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778970892),
('JUwzp5UljPQFSSzaO3swIa6tNVYbZZaYGZwt2Ckh', NULL, '89.90.141.161', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJpNGtnazZiVUtHTmdiMWRtWklhQUtueDhtOE1rOGlqYlNQczlKVmI4IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778940233),
('LBJThcKqfLXqbuNmhlS3PD0jaOsBjvVD85QquFrL', NULL, '89.90.141.161', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1', 'eyJfdG9rZW4iOiJMVEJmczBXbkNzdDhHYUNUaVVqaXZ4TnNockRuejJQZ25QMVgzQW13IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778939195),
('MK86VIhQFhO213eHGD2g5Nupz0VikSWF7PPltGHS', NULL, '131.117.203.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI4UTlpTDROSXZMNHBiVTlvRHRRRjNMZlBCWnpoRlZHWVNTVmVTcnNDIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778916009),
('oVy7zm9VouUzO3f49yMY0gAI7xPzOOT6FWFJYTht', NULL, '178.170.14.75', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0', 'eyJfdG9rZW4iOiJpN0E3YU1ydWtQMkVZaEJvUk1GZ2hDbVFhNjRzVThOeXFsSzBzZnR0IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778910048),
('P93tvP6rhAmvod1D377y5h7K2zrVQHXebmS6U4Bn', NULL, '212.135.12.70', 'Mozilla/5.0 (Linux; Android 15; SM-S931B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.7444.48 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJ1Y0k1eWQxY3VUYXcxZ2tEdWFSWGlZU2ZBQlJXZFpoUUZ5eWNhOUJzIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778935111),
('pbQLgN1BpRgpSvofLcXunvs6HliACr9PWxrSGmCI', NULL, '131.117.203.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ6djVCVzR0bnZUTXQ0bjBHMWlNSDhza1RuZFJZT0NHUDNkZ0V0VVpoIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnJcL2Nvbm5leGlvbiIsInJvdXRlIjoiY29ubmV4aW9uIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1778918418),
('QDeJq6iDNgWbzQuesmTlz5aZAAwn8KSiSLCexSpo', NULL, '82.23.68.21', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJkQ096c0JlQXpVS3VoQzNZS2hjd0h1emZSNXlFU3lIMENTUTRtSUJOIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778911349),
('QTz5cNcxUGDPo77VZz58jCE5i8H7Is7V6H60WJtj', NULL, '89.90.141.161', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148', 'eyJfdG9rZW4iOiJvdVBRQjdqSzZRZGpFRzZ2OTBiWER5cHI1U3M2WE56QUdEbnFFU0Z5IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL3d3dy5iaXNlY2NvLmZyIiwicm91dGUiOiJob21lIn0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1778932222),
('qZzPQbMLeRczX1dQGYaUg7vMBVCLG8dlF3lr5R2r', NULL, '204.101.161.15', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJlVG0yajBaalU5VW5MWThxckMyOGVxVkRwaFJaT1RSb001c2JSNnJ5IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE3Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvYmlzZWNjby5mciIsInJvdXRlIjoiaG9tZSJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1778970886),
('t59sZofuKfBvO5sMYVmLQbmzB7yD3GdtptJQntBR', NULL, '212.135.12.139', 'Mozilla/5.0 (Linux; Android 15; SM-S931B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36', 'eyJfdG9rZW4iOiJOY2VaN2VmNTlRWHdzNnpROXJvRnFIYWZ2VWxSYUxpdlBiWTFNZENOIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778935113),
('TNePNNlsbtC5oADlvHDMgtxk7itERIoUhtihVndZ', NULL, '131.117.203.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJlOXJWR0RQWGxsQWxoV1V6Q0ZuSFFZSjNYMnY1NUl5akFiSk9JcXd4IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778918412),
('VVEI2onIEIrxHihYR1FzFrjNGoAqc44ROqHekdRk', NULL, '89.90.141.161', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)', 'eyJfdG9rZW4iOiJhaENoRDVTdnNCdmhUM2hNS002Wkc1NTdDY1RFa3FoNkt3Q2l1YVhnIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778939192),
('xHTZSW41Nx2624qP6IXgPoVaYZiwrkHVWBlDSVCB', NULL, '131.117.203.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJYYzhKcUl1MEp2c2lvdVMyMEhyZ0dQeXowNW5QRFowaUxyZDc2eVZUIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE3Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1779001970),
('xz6jxENeE2ISTf3Odrws0AxfCg7wVu0Mq4FzW7K6', NULL, '195.96.139.243', 'Mozilla/5.0 (compatible; InternetMeasurement/1.0; +https://internet-measurement.com/)', 'eyJfdG9rZW4iOiJQMldiRXZGTldPeE1pVlFnWXRGNnVJRkxSWlF3TWs4QlZBcFFiOENVIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE3Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cDpcL1wvd3d3LmJpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778984454),
('y2qwYHOH4kVJpMjIfzYCd9UjPDVahHQtUQLf4yZy', NULL, '131.117.203.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJQVHRnTFVpUmx2UHJQYVV0dW9BR2xUZHN3TWh2YkxxT0Zqejc1RVF0IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnJcL3Byb2ZpbFwvNjAiLCJyb3V0ZSI6InByb2ZpbC5zaG93In0sIl9mbGFzaCI6eyJvbGQiOltdLCJuZXciOltdfX0=', 1778917444),
('Ysz5YcJpqrVvEEOHcZPcHgFMsrEvIhn5fYDmSXkt', NULL, '89.90.141.161', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)', 'eyJfdG9rZW4iOiJ3SXFHRjRQRUJtS3BCVUtaVHpnUU5nd3dWWjJMZERJSE1pNUlzNlM5IiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778940231),
('zpx0HQI8VHH7IGSLcF4v6Bl0qfIKjdoKNBLNrH4S', NULL, '131.117.203.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJvV1pzeXZoSVVMcmUxOEk4aXFNbDJIS091Rjd5bTMzcE9rcDlRaVlIIiwidmlzaXRfY291bnRlZF8yMDI2LTA1LTE2Ijp0cnVlLCJfcHJldmlvdXMiOnsidXJsIjoiaHR0cHM6XC9cL2Jpc2VjY28uZnIiLCJyb3V0ZSI6ImhvbWUifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1778916663);

-- --------------------------------------------------------

--
-- Structure de la table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `stripe_id` varchar(255) NOT NULL,
  `stripe_status` varchar(255) NOT NULL,
  `stripe_price` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `trial_ends_at` timestamp NULL DEFAULT NULL,
  `ends_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `subscription_items`
--

CREATE TABLE `subscription_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `subscription_id` bigint(20) UNSIGNED NOT NULL,
  `stripe_id` varchar(255) NOT NULL,
  `stripe_product` varchar(255) NOT NULL,
  `stripe_price` varchar(255) NOT NULL,
  `meter_id` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `meter_event_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `client_number` varchar(20) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `oauth_provider` varchar(30) DEFAULT NULL,
  `oauth_id` varchar(100) DEFAULT NULL,
  `role` enum('admin','artisan','particulier') NOT NULL DEFAULT 'particulier',
  `phone` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `siren` varchar(9) DEFAULT NULL,
  `validation_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `validated_at` timestamp NULL DEFAULT NULL,
  `validated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `cover_photo` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `stripe_id` varchar(255) DEFAULT NULL,
  `pm_type` varchar(255) DEFAULT NULL,
  `pm_last_four` varchar(4) DEFAULT NULL,
  `trial_ends_at` timestamp NULL DEFAULT NULL,
  `siren_status` varchar(1) DEFAULT NULL,
  `siren_last_checked_at` timestamp NULL DEFAULT NULL,
  `siren_closed_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `client_number`, `name`, `email`, `email_verified_at`, `password`, `oauth_provider`, `oauth_id`, `role`, `phone`, `city`, `description`, `siren`, `validation_status`, `validated_at`, `validated_by`, `rejection_reason`, `profile_photo`, `cover_photo`, `remember_token`, `created_at`, `updated_at`, `stripe_id`, `pm_type`, `pm_last_four`, `trial_ends_at`, `siren_status`, `siren_last_checked_at`, `siren_closed_at`, `deleted_at`) VALUES
(4, 'BIS-2026-000003', 'Admin Bisecco', 'bisecco.support@gmail.com', NULL, '$2y$12$8fIGdK9A13keHCvj74TZs.K10Lny8NkYkClXxFLHchumyGBKMDjLy', NULL, NULL, 'admin', NULL, NULL, NULL, NULL, 'approved', '2026-04-19 09:37:11', NULL, NULL, NULL, NULL, '3LIFTSsron7Mdw3ajqIRGkLkgV6XYRz3U2r1jo3c1bXOlUtNCAt8frGU9ELM', '2026-04-18 05:03:59', '2026-04-21 07:24:49', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(35, 'BIS-2026-000004', 'Pedro De Jesus Tavares', 'assistance.endormis@gmail.com', NULL, '$2y$12$cS3pKPzovWL62AihlQlY1uLPBBBPi1zMCVAY5D9GXgOscS0jkqjB2', NULL, NULL, 'particulier', '0766035018', 'MEAUX', NULL, NULL, 'approved', '2026-04-26 18:00:28', NULL, NULL, 'uploads/v9Copez19Uj0T4MaVnlfEBYFxElTGLQxaEdI6Lcv.png', 'uploads/LwxdS3wPYkOBtFtQ9bdt8iy7Gq1ggpU8SKnpfIpF.png', NULL, '2026-04-26 17:53:39', '2026-04-26 18:00:28', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(36, 'BIS-2026-000005', 'Lorenzo nero', 'nero.lorenzo@gmail.com', NULL, '$2y$12$42Ju6ArA8sL7lJH1Sz7giOOoNXB632uTKy2h5Fjhhq8sHfSXz9RtO', NULL, NULL, 'particulier', NULL, 'Meaux', NULL, NULL, 'approved', '2026-04-26 18:00:27', NULL, NULL, NULL, NULL, 'RA1y6QrqU6dNuoFw5a30QRdwym9Bpb9IspTFssqdhGZDUcRsaeC1uCpRNfQy', '2026-04-26 17:55:20', '2026-04-26 18:00:27', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, 'BIS-2026-000009', 'Binda Gama', 'bindagama@hotmail.com', NULL, '$2y$12$N9I1MP.PQ.l8emJPCKc0U.rlXq.G7HNXfur7bh69KvzXsaytd3IaK', NULL, NULL, 'particulier', '0624676128', '77139 MARCILLY', NULL, NULL, 'approved', '2026-04-27 08:07:49', NULL, NULL, NULL, NULL, NULL, '2026-04-27 08:07:15', '2026-04-27 08:07:49', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(41, 'BIS-2026-000010', 'Rajah Kuna', 'gkunarajah@gmail.com', NULL, '$2y$12$eII2R.viIK8EHGUWlJ3d8edvYuPQqAnOR/qEXtpT9/1etIHwPM8ke', NULL, NULL, 'particulier', '0628982443', 'Garges les Gonesse', NULL, NULL, 'approved', '2026-04-27 13:19:41', NULL, NULL, NULL, NULL, NULL, '2026-04-27 13:19:12', '2026-04-27 13:19:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(42, 'BIS-2026-000011', 'Olivier Lambin', 'oliviermontoir@gmail.com', NULL, '$2y$12$liDk3nyuhkL7zdrnj/QSnOXZ7guaISJ.zmJh8wvoZb5IM8E45Z3rq', NULL, NULL, 'particulier', NULL, 'Coincy', NULL, NULL, 'approved', '2026-04-27 15:38:59', NULL, NULL, NULL, NULL, NULL, '2026-04-27 15:38:23', '2026-04-27 15:38:59', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(43, 'BIS-2026-000012', 'Jessie Clayette', 'jess700@hotmail.fr', NULL, '$2y$12$x4xZahR.ah0cJ74qLBTH2OHhZH/Zhc8SNPHRp/wBQuEBucFuYUzni', NULL, NULL, 'particulier', '0668811033', 'Mandelieu la Napoule', NULL, NULL, 'approved', '2026-04-28 08:54:32', NULL, NULL, NULL, NULL, NULL, '2026-04-28 08:54:01', '2026-04-28 08:54:32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(44, 'BIS-2026-000013', 'Miguel Pinheiro - AMP BAT', 'miguel.pinheiro.mp@gmail.com', '2026-04-28 12:03:34', '$2y$12$nhFJNfHZx5d/dpYs3k5YXOIFMl2Msboogs3AYkBmTwYI/PRuWzn6.', NULL, NULL, 'artisan', '0621073702', 'Vinantes', 'Bonjour \r\nPour un travail de serieux et de qualiter', '934890187', 'approved', '2026-04-28 12:08:03', NULL, NULL, NULL, NULL, 'm0c4KLLpGmsk4bpGxXN5fQelUs3e3qAG7tRZYf8DvNZdi63Gmdb8lgcpK7eR', '2026-04-28 12:03:34', '2026-04-28 12:14:40', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(45, 'BIS-2026-000014', 'Anna SIRUFO', 'anna.sirufo@gmail.com', NULL, '$2y$12$9d1BzR8zO2Onp3mpyiDCFueBhnMyQGDQXhg5NWCjTAXq9wSZ8lQT6', NULL, NULL, 'particulier', '0781013300', 'CANNES', NULL, NULL, 'approved', '2026-04-29 09:14:41', NULL, NULL, NULL, NULL, NULL, '2026-04-28 13:08:24', '2026-04-29 09:14:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(57, 'BIS-2026-000015', 'Bennour Naguez (naguez)', 'bennour-naguez-naguez-oagTvV@bisecco.fr', NULL, '$2y$12$UndwLLAideak5v2iclwuBudXC2wUSZrYD8RaM2VqYDsMJnbbl1aSm', NULL, NULL, 'artisan', NULL, 'Meaux', NULL, '501828982', 'approved', '2026-04-29 17:19:06', 4, NULL, 'uploads/qjgSk1pHEyME9wN7ZQnZ2v96O9NZ5KmoEOak3Nez.png', 'uploads/ThXlevx2XWp4zdKMrH3rD6fKCFcnNaPgtfOUDHvB.png', NULL, '2026-04-29 17:19:06', '2026-04-29 17:19:06', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(58, 'BIS-2026-000016', 'Malik Haddad', 'malik-haddad-GkQahZ@bisecco.fr', NULL, '$2y$12$ZxBCSvFv8EGgt273065iEuxNb.G26ZkUb3ltri6mMM32V12zQ1KkG', NULL, NULL, 'artisan', NULL, 'Melun', NULL, '983433210', 'approved', '2026-04-29 17:37:28', 4, NULL, 'uploads/XjFo98gTnC4REaaX5niee8e2x05CCEmdZDC3oDCA.png', 'uploads/JTHkQSIKGHj9uwdN8WAGT5UhHYtjpce4z69tRvO8.png', NULL, '2026-04-29 17:37:28', '2026-04-29 17:37:28', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(59, 'BIS-2026-000017', 'Adil Taoufik', 'adtaetc@gmail.com', NULL, '$2y$12$cutB3x0O/yoljhziQJod5.xYJW5kHQcMDWDrXrnTzO4JpqBaUrYpi', NULL, NULL, 'particulier', NULL, '60300 Senlis', NULL, NULL, 'approved', '2026-04-30 09:23:12', NULL, NULL, NULL, NULL, NULL, '2026-04-30 09:22:33', '2026-04-30 09:23:12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(60, 'BIS-2026-000018', 'Franck Mino - Sirius Automobiles', 'siriusautomobiles@gmail.com', '2026-04-30 14:35:40', '$2y$12$BLJj/1jpBxRhj3WEvfKNyuBPr.hRTEcVaA7x/sMlioOCfaIb/bqXe', NULL, NULL, 'artisan', '01 60 32 98 19', '77165 Saint Soupplets', NULL, '851509372', 'approved', '2026-04-30 14:59:55', NULL, NULL, NULL, NULL, NULL, '2026-04-30 14:35:40', '2026-04-30 14:59:55', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(63, 'BIS-2026-000020', 'Angie Cornejo', 'veronica.angie@hotmail.com', NULL, '$2y$12$zP4buFRLDmvCFZfv2x5K5Ovzd0/ygLVC5ggD5Z6ii31NwvfQJKghS', NULL, NULL, 'particulier', NULL, NULL, NULL, NULL, 'approved', '2026-05-01 10:22:09', NULL, NULL, NULL, NULL, NULL, '2026-05-01 10:21:12', '2026-05-01 10:22:09', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(64, 'BIS-2026-000021', 'Enzo Nero-Recrosio', 'laurent.rn@gmail.com', '2026-05-01 12:17:31', '$2y$12$aD1XnOa4QOuFOqrG66eU5uOavkYVjpNfB7Fxgo.IZXKxrjlDBwmp.', NULL, NULL, 'particulier', '0658133313', 'Mandelieu la Napoule', NULL, NULL, 'approved', '2026-05-01 12:17:31', NULL, NULL, 'uploads/vlKUjAaKy5an6wtUtYjgn06qEnb2WtobtrFADrVk.jpg', NULL, 'GxpyS6d3DcPFVPmLpdiNh66lRUJsqfOl7ejgHAGo4yu3i7PT7yIdAwV87fzW', '2026-05-01 12:17:31', '2026-05-01 12:42:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(65, 'BIS-2026-000022', 'Laurent Nero - Agisco', 'agisco.fr@gmail.com', '2026-05-01 12:32:35', '$2y$12$brv293fduwNExv7fS5jMWOut4vj6pAErA9msWynhpZgYJ.0PnuQ8O', NULL, NULL, 'artisan', '0658133313', '06400 Cannes', NULL, '750463317', 'approved', '2026-05-01 12:32:58', NULL, NULL, 'uploads/8p7RUtXe5Bij5zYr5zTNpGuEmoRKqRd4O8OGAO84.png', NULL, NULL, '2026-05-01 12:32:35', '2026-05-01 12:54:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(66, 'BIS-2026-000023', 'Nassim HAMMANI - Ns controle', 'ns.controle77@gmail.com', '2026-05-11 09:09:41', '$2y$12$//P70gSnLqd8GaYVrRYDEODdzGmf8Bs1zkB68yUxXtmCupG40KaNy', NULL, NULL, 'artisan', NULL, '77165 Saint-Soupplets', NULL, '921752275', 'approved', '2026-05-11 09:11:35', NULL, NULL, NULL, NULL, NULL, '2026-05-11 09:09:41', '2026-05-11 09:11:35', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `artisan_connections`
--
ALTER TABLE `artisan_connections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `artisan_connections_follower_id_following_id_unique` (`follower_id`,`following_id`),
  ADD KEY `artisan_connections_following_id_foreign` (`following_id`);

--
-- Index pour la table `artisan_posts`
--
ALTER TABLE `artisan_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artisan_posts_user_id_foreign` (`user_id`);

--
-- Index pour la table `artisan_post_comments`
--
ALTER TABLE `artisan_post_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artisan_post_comments_post_id_foreign` (`post_id`),
  ADD KEY `artisan_post_comments_user_id_foreign` (`user_id`);

--
-- Index pour la table `artisan_post_likes`
--
ALTER TABLE `artisan_post_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `artisan_post_likes_post_id_user_id_unique` (`post_id`,`user_id`),
  ADD KEY `artisan_post_likes_user_id_foreign` (`user_id`);

--
-- Index pour la table `artisan_profiles`
--
ALTER TABLE `artisan_profiles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artisan_profiles_user_id_foreign` (`user_id`),
  ADD KEY `artisan_profiles_metier_id_foreign` (`metier_id`);

--
-- Index pour la table `artisan_profile_metier`
--
ALTER TABLE `artisan_profile_metier`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `artisan_profile_metier_artisan_profile_id_metier_id_unique` (`artisan_profile_id`,`metier_id`),
  ADD KEY `artisan_profile_metier_metier_id_foreign` (`metier_id`);

--
-- Index pour la table `artisan_reports`
--
ALTER TABLE `artisan_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `artisan_reports_reporter_id_foreign` (`reporter_id`),
  ADD KEY `artisan_reports_reported_user_id_foreign` (`reported_user_id`),
  ADD KEY `artisan_reports_post_id_foreign` (`post_id`);

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Index pour la table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_conversations_visitor_id_index` (`visitor_id`);

--
-- Index pour la table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_messages_conversation_id_foreign` (`conversation_id`);

--
-- Index pour la table `daily_visit_stats`
--
ALTER TABLE `daily_visit_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `daily_visit_stats_date_unique` (`date`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `follows_follower_id_following_id_unique` (`follower_id`,`following_id`),
  ADD KEY `follows_follower_id_index` (`follower_id`),
  ADD KEY `follows_following_id_index` (`following_id`);

--
-- Index pour la table `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gallery_images_tmp_artisan_profile_id_foreign` (`artisan_profile_id`),
  ADD KEY `gallery_images_tmp_user_id_foreign` (`user_id`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `maintenance_subscribers`
--
ALTER TABLE `maintenance_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `maintenance_subscribers_email_unique` (`email`),
  ADD UNIQUE KEY `maintenance_subscribers_token_unique` (`token`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_sender_id_foreign` (`sender_id`),
  ADD KEY `messages_receiver_id_foreign` (`receiver_id`);

--
-- Index pour la table `metiers`
--
ALTER TABLE `metiers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `metiers_slug_unique` (`slug`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Index pour la table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `posts_user_id_index` (`user_id`),
  ADD KEY `posts_created_at_index` (`created_at`),
  ADD KEY `posts_user_id_created_at_index` (`user_id`,`created_at`),
  ADD KEY `posts_type_index` (`type`);

--
-- Index pour la table `profile_views`
--
ALTER TABLE `profile_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profile_views_profile_user_id_viewed_at_index` (`profile_user_id`,`viewed_at`);

--
-- Index pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_artisan_profile_id_foreign` (`artisan_profile_id`),
  ADD KEY `reviews_user_id_foreign` (`user_id`);

--
-- Index pour la table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `services_artisan_profile_id_foreign` (`artisan_profile_id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscriptions_stripe_id_unique` (`stripe_id`),
  ADD KEY `subscriptions_user_id_stripe_status_index` (`user_id`,`stripe_status`);

--
-- Index pour la table `subscription_items`
--
ALTER TABLE `subscription_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subscription_items_stripe_id_unique` (`stripe_id`),
  ADD KEY `subscription_items_subscription_id_stripe_price_index` (`subscription_id`,`stripe_price`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_client_number_unique` (`client_number`),
  ADD KEY `users_validated_by_foreign` (`validated_by`),
  ADD KEY `users_stripe_id_index` (`stripe_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `artisan_connections`
--
ALTER TABLE `artisan_connections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `artisan_posts`
--
ALTER TABLE `artisan_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `artisan_post_comments`
--
ALTER TABLE `artisan_post_comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `artisan_post_likes`
--
ALTER TABLE `artisan_post_likes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `artisan_profiles`
--
ALTER TABLE `artisan_profiles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT pour la table `artisan_profile_metier`
--
ALTER TABLE `artisan_profile_metier`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `artisan_reports`
--
ALTER TABLE `artisan_reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `chat_conversations`
--
ALTER TABLE `chat_conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT pour la table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `daily_visit_stats`
--
ALTER TABLE `daily_visit_stats`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `follows`
--
ALTER TABLE `follows`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `gallery_images`
--
ALTER TABLE `gallery_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `maintenance_subscribers`
--
ALTER TABLE `maintenance_subscribers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `metiers`
--
ALTER TABLE `metiers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=644;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `profile_views`
--
ALTER TABLE `profile_views`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT pour la table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `subscription_items`
--
ALTER TABLE `subscription_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `artisan_connections`
--
ALTER TABLE `artisan_connections`
  ADD CONSTRAINT `artisan_connections_follower_id_foreign` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `artisan_connections_following_id_foreign` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `artisan_posts`
--
ALTER TABLE `artisan_posts`
  ADD CONSTRAINT `artisan_posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `artisan_post_comments`
--
ALTER TABLE `artisan_post_comments`
  ADD CONSTRAINT `artisan_post_comments_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `artisan_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `artisan_post_comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `artisan_post_likes`
--
ALTER TABLE `artisan_post_likes`
  ADD CONSTRAINT `artisan_post_likes_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `artisan_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `artisan_post_likes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `artisan_profiles`
--
ALTER TABLE `artisan_profiles`
  ADD CONSTRAINT `artisan_profiles_metier_id_foreign` FOREIGN KEY (`metier_id`) REFERENCES `metiers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `artisan_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `artisan_profile_metier`
--
ALTER TABLE `artisan_profile_metier`
  ADD CONSTRAINT `artisan_profile_metier_artisan_profile_id_foreign` FOREIGN KEY (`artisan_profile_id`) REFERENCES `artisan_profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `artisan_profile_metier_metier_id_foreign` FOREIGN KEY (`metier_id`) REFERENCES `metiers` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `artisan_reports`
--
ALTER TABLE `artisan_reports`
  ADD CONSTRAINT `artisan_reports_post_id_foreign` FOREIGN KEY (`post_id`) REFERENCES `artisan_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `artisan_reports_reported_user_id_foreign` FOREIGN KEY (`reported_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `artisan_reports_reporter_id_foreign` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `follows_follower_id_foreign` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `follows_following_id_foreign` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `gallery_images`
--
ALTER TABLE `gallery_images`
  ADD CONSTRAINT `gallery_images_tmp_artisan_profile_id_foreign` FOREIGN KEY (`artisan_profile_id`) REFERENCES `artisan_profiles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `gallery_images_tmp_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `profile_views`
--
ALTER TABLE `profile_views`
  ADD CONSTRAINT `profile_views_profile_user_id_foreign` FOREIGN KEY (`profile_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_artisan_profile_id_foreign` FOREIGN KEY (`artisan_profile_id`) REFERENCES `artisan_profiles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_artisan_profile_id_foreign` FOREIGN KEY (`artisan_profile_id`) REFERENCES `artisan_profiles` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_validated_by_foreign` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
