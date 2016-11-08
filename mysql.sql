-- 创建数据库
CREATE DATABASE `kaneshop` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

-- 创建用户表
CREATE TABLE `user` (
    `user_id` int unsigned NOT NULL AUTO_INCREMENT,
    -- 邮箱或者手机号
    `user_useremail` char(64)  NOT NULL DEFAULT '',
    -- 用户密码
    `user_password` varchar(64)  NOT NULL DEFAULT '',
    -- 昵称
    `user_username` varchar(64)  NOT NULL DEFAULT '',
    -- 注册时间
    `registertime` varchar(10)  NOT NULL DEFAULT '',
    -- 用户状态
    `status` tinyint(1) unsigned NOT NULL DEFAULT 1,
    PRIMARY KEY (`user_id`)
  );
-- 创建后台管理员表
CREATE TABLE `admin` (
    `admin_id` int unsigned NOT NULL AUTO_INCREMENT,
    -- 邮箱或者手机号
    `admin_useremail` char(64)  NOT NULL DEFAULT '',
    -- 用户密码
    `admin_password` varchar(64)  NOT NULL DEFAULT '',
    -- 昵称
    `admin_username` varchar(64)  NOT NULL DEFAULT '',
    -- 用户状态
    `status` tinyint(1) unsigned NOT NULL DEFAULT 1,
    PRIMARY KEY (`admin_id`)
  );
-- 上传商品表
CREATE TABLE `init_goods` (
    `user_id` int unsigned NOT NULL,
    `goods_id` int unsigned NOT NULL AUTO_INCREMENT,
    `goods_title` varchar(64) NOT NULL DEFAULT '',
    `goods_img` varchar(100) NOT NULL DEFAULT '',
    `goods_price` int(5) NOT NULL DEFAULT '0',
    `type_name` varchar(40) NOT NULL DEFAULT '',
    `goods_summary` varchar(140) NOT NULL  COMMENT '商品描述',
    `goods_status` tinyint(1)  NOT NULL DEFAULT '0',
    `user_username` varchar(64)  NOT NULL DEFAULT '',
    `goods_create_time` varchar(10) NOT NULL DEFAULT '',
    `goods_update_time` varchar(10) NOT NULL DEFAULT '',
    PRIMARY KEY (`goods_id`)
);
-- 商品分类表
CREATE TABLE `goods_type` (
  `type_id` int unsigned NOT NULL AUTO_INCREMENT,
  `type_name` varchar(32) NOT NULL DEFAULT '',
  `status` tinyint(1)  NOT NULL DEFAULT '1',
  PRIMARY KEY (`type_id`)
);
-- 消息表
CREATE TABLE `message` (
    `user_id` int unsigned NOT NULL,
    `msg_id` int unsigned NOT NULL AUTO_INCREMENT,
    `content` varchar(200) NOT NULL DEFAULT '',
    `status` tinyint(1)  NOT NULL DEFAULT '1',
    PRIMARY KEY (`msg_id`)
);
-- 轮播页表
CREATE TABLE `banner` (
    `banner_id` int unsigned NOT NULL AUTO_INCREMENT,
    `banner_img` varchar(100) NOT NULL DEFAULT '',
    `banner_summary` varchar(140) NOT NULL  COMMENT '轮播页描述',
    `banner_status` tinyint(1)  NOT NULL DEFAULT '1',
    `banner_create_time` varchar(32) NOT NULL DEFAULT '',
    PRIMARY KEY (`banner_id`)
);