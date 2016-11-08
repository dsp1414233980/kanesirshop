const express = require('express');
const orm = require('orm');
const moment = require('moment');
const crypto = require('crypto');



//服务器设置
const dbusername = "root";
const dbpassword = "111111";
const dbname = "kaneshop";


module.exports = function(router) {

    //数据库设置 
    router.use(orm.express("mysql://" + dbusername + ":" + dbpassword + "@localhost/" + dbname, {
        define: function(db, models, next) {

            models.user = db.define("user", {
                user_id: {
                    type: 'serial',
                    key: true
                },
                user_username: String,
                user_password: String,
                user_email: String,
                register_time: String
            });

            models.admin = db.define("admin", {
                admin_id: {
                    type: 'serial',
                    key: true
                },
                admin_username: String,
                admin_password: String,
                admin_useremail: String

            });

            models.goods_type = db.define("goods_type", {
                type_id: {
                    type: 'serial',
                    key: true
                },
                type_name: String,
                status: {
                    type: "number",
                    defaultValue: 1
                }
            });

            models.init_goods = db.define("init_goods", {
                user_id: {
                    type: 'number',
                },
                goods_id: {
                    type: 'serial',
                    key: true
                },
                goods_title: String,
                goods_img: String,
                type_name: String,
                goods_summary: String,
                goods_status: {
                    type: "number",
                    defaultValue: 0
                },
                user_username: String,
                goods_create_time: String,
                goods_update_time: String,
                goods_price: {
                    type: "number",
                    defaultValue: 0
                }
            })
            models.message = db.define('message', {
                user_id: {
                    type: 'number',
                },
                msg_id: {
                    type: 'serial',
                    key: true
                },
                content: String,
                status: {
                    type: "number",
                    defaultValue: 1
                }

            })
            models.banner = db.define('banner', {
                banner_id: {
                    type: 'serial',
                    key: true
                },
                banner_img: String,
                banner_summary: String,
                banner_create_time: String,
                banner_status: {
                    type: "number",
                    defaultValue: 1
                }

            })
            next();
        }
    }));
    const dbs = {

        //前端 查询用户是否存在
        getUserByEmail: function(req, callback) {
            req.models.user.exists({
                user_email: req.body.email
            }, function(err, hasusername) {
                if (err) throw err;
                callback(hasusername)
            });
        },
        //前端 查询用户基本信息
        getUserByLogin: function(req, callback) {
            req.models.user.find({
                user_email: req.body.email
            }, function(err, userinfo) {
                if (err) throw err;
                callback(userinfo[0]);
            });
        },
        //前端 查询用户名是否存在
        getSigninByUsername: function(req, res, next) {
            req.models.user.exists({
                user_username: req.query.username
            }, function(err, doc) {
                if (err) throw err;
                res.doc = doc;
                next();
            });
        },
        //前端 查询邮箱是否存在
        getSigninByEmail: function(req, res, next) {
            req.models.user.exists({
                user_email: req.query.email
            }, function(err, doc) {
                if (err) throw err;
                res.doc = doc;
                next();
            });
        },
        //前端 添加用户，使用MD5加密密码
        getUserInsert: function(req, res, next) {
            const insert_times = moment().format('YYYY-MM-DD');
            const key = req.body.password;
            const hmac = crypto.createHmac('md5', key);

            hmac.update('kanesir');
            const password = hmac.digest('hex');
            req.models.user.create({
                user_username: req.body.username,
                user_password: password,
                user_email: req.body.email,
                register_time: insert_times
            }, function(err, success) {
                if (err) throw err
                res.success = success
                next();
            });
        },
        //后端 查询后台用户信息
        getAdminByLogin: function(req, callback) {
            req.models.admin.find({
                admin_username: req.body.username
            }, function(err, userinfo) {
                if (err) throw err;
                callback(userinfo[0]);
            });
        },
        //后端 查询后台用户是否存在
        getAdminByUsername: function(req, callback) {
            req.models.admin.exists({
                admin_username: req.body.username
            }, function(err, hasusername) {
                if (err) throw err;
                callback(hasusername)
            });
        },
        // 后端添加分类信息
        getAdminByClassInsert: function(req, res, next) {
            req.models.goods_type.create({
                type_name: req.body.name,
            }, function(err, success) {
                if (err) throw err
                res.success = success
                next();
            });
        },
        // common获取分类信息
        getAdminByClassInfo: function(req, callback) {
            req.models.goods_type.find({
                status: 1
            }, function(err, doc) {
                if (err) throw err;
                callback(doc)
            });
        },
        // 前端提交未审核宝贝信息
        getUserByGoodsInfo: function(req, fileurl, callback) {
            const time = moment().format('YYYY-MM-DD');
            req.models.init_goods.create({
                user_id: req.session.user_id,
                goods_title: req.body.goods_title,
                goods_img: fileurl,
                type_name: req.body.goods_tag,
                goods_summary: req.body.goods_summary,
                user_username: req.session.user_name,
                goods_create_time: time,
                goods_update_time: time,
                goods_price: req.body.goods_price
            }, function(err, doc) {
                if (err) throw err;
                callback(doc)
            });
        },
        // 后台 根据后台状态查询审核信息
        getIndexByGoodsInfo: function(req, status, callback) {
            req.models.init_goods.find({
                goods_status: status
            }, function(err, goods) {
                if (err) {
                    throw err
                }
                callback(goods)
            })
        },
        // 前台，展示宝贝详情页
        getIndexByIdGoodsInfo: function(req,res,next) {
            req.models.init_goods.find({
                goods_status: 1,
                goods_id: req.params.id
            }, function(err, goods) {
                if (err) {
                    throw err
                }
                res.goods = goods[0]
                next()
            })
        },
        // 后台展示未审核信息详情页
        getAdminByGoodsIndex: function(req, callback) {
            const id = req.params.id
            req.models.init_goods.find({
                goods_id: id
            }, function(err, result) {
                if (err) {
                    throw err
                }
                callback(result[0])
            })
        },
        // 后端 待审核商品更新状态
        getGoodsByStatusTrue: function(req, status, callback) {
            req.models.init_goods.get(req.body.id, function(err, result) {
                result.save({
                    goods_status: status,
                }, function(err) {
                    if (err) throw err;
                    callback(result)
                });
            });
        },
        // 后端 添加信息状态
        getGoodsByMessageSuccess: function(req, callback) {
            req.models.message.create({
                user_id: req.body.id,
                content: '恭喜您，您提交的商品已经提交审核，快去查看吧',
                status: 2
            }, function(err, success) {
                if (err) throw err
                callback(success)
            });
        },
        getGoodsByMessageFalse: function(req, callback) {
            req.models.message.create({
                user_id: req.body.id,
                content: '抱歉，您提交的商品为通过审核，原因是:' + req.body.reason,
                status: 0
            }, function(err, success) {
                if (err) throw err
                callback(success)
            });
        },
        // 获取轮播页列表
        getAdminByBannerList: function(req, status, callback) {
            req.models.banner.find({
                banner_status: status
            }, function(err, result) {
                if (err) {
                    throw err
                }
                callback(result)
            })
        },
        // 上传轮播页
        getAdminByBannerItem: function(req, fileurl, callback) {
            const time = moment().format('YYYY-MM-DD');
            req.models.banner.create({
                banner_summary: req.body.summary,
                banner_img: fileurl,
                banner_create_time: time,
            }, function(err, doc) {
                if (err) throw err;
                callback(doc)
            });
        },
        //获取新闻信息
        // getUserByNews:function(req,res,next){
        //  req.models.news.find({
        //      news_sort: req.query.name,
        //      news_type:'新闻'
        //  }, function(err, news) {
        //      if (err) throw err;
        //      res.locals.news = news;
        //      next();
        //  });
        // },

        // //修改数据
        // getUpdata:function(req,res,next){
        //  req.models.news.get(req.body.news_id, function (err, news) {
        //      news.save({ 
        //          news_title : req.body.news_title,
        //          news_img : req.body.news_img,
        //          news_sort : req.body.news_sort,
        //          news_date : req.body.news_date,
        //          news_content : req.body.news_content,
        //          news_type : req.body.news_type,
        //          news_from : req.body.news_from
        //      }, function (err) {
        //          if (err) throw err;
        //          res.locals.news = "修改数据成功";
        //          next();
        //      });
        //  });
        // },
        // //删除数据
        // getDelete:function(req,res,next){
        //  req.models.news.get(req.body.name, function (err, news) {
        //      news.remove(function (err) {
        //          if (err) throw err;
        //          res.locals.news = "删除数据成功";
        //          next();
        //      });
        //  });
        // }
    }

    return dbs;
}
