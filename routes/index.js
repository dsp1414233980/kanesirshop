const express = require('express');
const router = express.Router();
const orm = require('orm');
const moment = require('moment');
const crypto = require('crypto');
const path = require('path')
const formidable = require('formidable')
const fs = require('fs');
const dbs = require('../data/dbs')(router);

// 首页
router.get('/', function(req, res) {
    if (req.session.user_id) {
        // 查询轮播页
        dbs.getAdminByBannerList(req, 1, function(result) {
            // 查询分类
            dbs.getAdminByClassInfo(req, function(doc) {
                // 查询商品
                dbs.getIndexByGoodsInfo(req, 1, function(goods) {
                    res.render('index', {
                        title: 'kanesir.校园二手——方便快捷的校园二手交易平台',
                        login: 1,
                        username:req.session.user_name,
                        banner: result,
                        type: doc,
                        goods: goods
                    })
                })
            })
        })
    } else {
        dbs.getAdminByBannerList(req, 1, function(result) {
            // 查询分类
            dbs.getAdminByClassInfo(req, function(doc) {
                // 查询商品
                dbs.getIndexByGoodsInfo(req, 1, function(goods) {
                    res.render('index', {
                        title: 'kanesir.校园二手——方便快捷的校园二手交易平台',
                        login: 0,
                        banner: result,
                        type: doc,
                        goods: goods
                    })
                })
            })
        })
    }
})

router.get('/goods/:id',dbs.getIndexByIdGoodsInfo, function(req, res) {
    res.render('index_goods',{
        title: res.goods.goods_title + '——kanesir.校园二手',
        data:res.goods
    });
})


router.get('/search', function(req, res) {
    res.render('search', {
        title: '搜索结果——kanesir.校园二手'
    });
})


// 显示注册登录页面
router.get('/sign', function(req, res) {
    res.render('sign', {
        title: '注册|登录——kanesir.校园二手'
    });
})

// 验证登录
router.post('/login', function(req, res) {
    const key = req.body.password;
    const hmac = crypto.createHmac('md5', key);
    hmac.update('kanesir');
    const password = hmac.digest('hex');
    dbs.getUserByEmail(req, function(hasuername) {
        if (hasuername) {
            dbs.getUserByLogin(req, function(userinfo) {
                if (userinfo.user_password == password) {
                    req.session.user_id = userinfo.user_id;
                    req.session.user_name = userinfo.user_username;
                    res.json({
                        status: 10,
                        title: '恭喜您登录成功'
                    })
                } else {
                    res.json({
                        status: -1,
                        title: '您输入的密码不正确'
                    })
                }
            })
        } else {
            res.json({
                status: -2,
                title: '你输入的用户名有误'
            })
        }
    })
})

// 验证用户名是否存在
router.get('/signin/username/:username', dbs.getSigninByUsername, function(req, res) {
    res.send(res.doc)
})

// 验证邮箱是否存在
router.get('/signin/email/:email', dbs.getSigninByEmail, function(req, res) {
    res.send(res.doc)
})

// 添加新注册用户
router.post('/sign/insert', dbs.getUserInsert, function(req, res) {
    req.session.user_id = res.success.user_id;
    req.session.user_name = res.success.user_username;
    res.json({
        status: 1
    })
})

// 显示上传页面
router.get('/upload', function(req, res) {
    if (req.session.user_id) {
        dbs.getAdminByClassInfo(req, function(doc) {
            res.render('upload', {
                title: '填写拍卖表单——kanesir.校园二手',
                data: doc
            })
        })

    } else {
        res.send("<script>alert('您还没有登录，请先登录~');location.href='/sign'</script>")
    }

})

// 异步上传图片
router.post('/upload/tmpimg', function(req, res) {
    if (req.session.user_id) {
        const form = new formidable.IncomingForm()
        form.uploadDir = path.join(__dirname, '../tmp'); //文件保存的临时目录为当前项目下的tmp文件夹
        form.maxFieldsSize = 2 * 1024 * 1024; //用户头像大小限制为最大1M  
        form.keepExtensions = true; //使用文件的原扩展名
        form.parse(req, function(err, fields, file) {
            var filePath = '';
            //如果提交文件的form中将上传文件的input名设置为tmpFile，就从tmpFile中取上传文件。否则取for in循环第一个上传的文件。
            if (file.tmpFile) {
                filePath = file.tmpFile.path;
            } else {
                for (var key in file) {
                    if (file[key].path && filePath === '') {
                        filePath = file[key].path;
                        break;
                    }
                }
            }
            //文件移动的目录文件夹，不存在时创建目标文件夹
            const targetDir = path.join(__dirname, '../public/upload');
            if (!fs.existsSync(targetDir)) {
                fs.mkdir(targetDir);
            }
            const fileExt = filePath.substring(filePath.lastIndexOf('.'));
            //判断文件类型是否允许上传
            if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
                res.json({ status: -1, message: '此文件类型不允许上传' });
            } else {
                // 上传临时图片文件成功
                req.session.img_tmpfile = filePath
                res.json({ status: 1 })
            }
        });
    } else {
        res.send("<script>alert('您还没有登录，请先登录~');location.href='/sign'</script>")
    }
})

// 上传待审核宝贝
router.post('/upload', function(req, res) {
    if (req.session.user_id) {
        if (req.session.img_tmpfile) {
            const filePath = req.session.img_tmpfile
            const targetDir = path.join(__dirname, '../public/upload');
            if (!fs.existsSync(targetDir)) {
                fs.mkdir(targetDir);
            }
            const fileExt = filePath.substring(filePath.lastIndexOf('.'));
            //以当前时间戳对上传文件进行重命名
            const fileName = new Date().getTime() + fileExt;
            const targetFile = path.join(targetDir, fileName);
            //移动文件
            fs.rename(filePath, targetFile, function(err) {
                if (err) {
                    res.json({ status: -1, message: '操作失败' });
                } else {
                    //上传成功，返回文件的相对路径
                    const fileUrl = '/upload/' + fileName;
                    dbs.getUserByGoodsInfo(req, fileUrl, function(doc) {
                        if (doc) {
                            res.json({ status: 1 });
                        } else {
                            res.json({ status: -1, message: '操作失败' });
                        }
                    })
                }
            });
        } else {
            res.json({ status: -1, message: '操作失败' });
        }

    } else {
        res.send("<script>alert('您还没有登录，请先登录~');location.href='/sign'</script>")
    }
})

module.exports = router;
