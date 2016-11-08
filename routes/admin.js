const express = require('express');
const router = express.Router();
const orm = require('orm');
const moment = require('moment');
const crypto = require('crypto');
const path = require('path')
const formidable = require('formidable')
const fs = require('fs');
const dbs = require('../data/dbs')(router);

// 后台主页
router.get('/', function(req, res) {
    if (req.session.admin_id) {
        res.render('admin', {
            title: 'kanesir.校园二手——后台管理系统',
            username: req.session.admin_name
        })
    } else {
        res.send("<script>alert('您还没有登录，请先登录！');location.href='/admin/login'</script>")
    }
});
// 后台登录页
router.get('/login', function(req, res) {
    res.render('admin_login', {
        title: '欢迎登录kanesir后台管理系统'
    });
});
// 后台登录页验证
router.post('/login', function(req, res) {
    const username = req.body.username
    const key = req.body.password;
    const hmac = crypto.createHmac('sha256', key);
    hmac.update('kanesir');
    const password = hmac.digest('hex');
    dbs.getAdminByUsername(req, function(hasuername) {
        if (hasuername) {
            dbs.getAdminByLogin(req, function(userinfo) {
                if (userinfo.admin_password == password) {
                    req.session.admin_id = userinfo.admin_id;
                    req.session.admin_name = userinfo.admin_username;
                    res.json({
                        status: 10,
                        message: '验证成功'
                    })
                } else {
                    res.json({
                        status: -1,
                        message: '密码错误'
                    })
                }
            })
        } else {
            res.json({
                status: -2,
                message: 'error'
            })
        }
    })
})
// 后台退出登录
router.get('/signout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            throw err
        }
        res.send("<script>alert('注销成功！');location.href='/admin/login'</script>")
    })
});
// 添加分类信息
router.post('/addclass', dbs.getAdminByClassInsert, function(req, res) {
    if (res.success) {
        res.json({
            success: 1
        })
    } else {
        res.json({
            success: 0
        })
    }

});
// 查看分类信息
router.get('/classinfo', function(req, res) {
    if (req.session.admin_id) {
        dbs.getAdminByClassInfo(req, function(doc) {
            res.render('admin_classinfo', {
                title: '分类信息——kanesir.校园二手后台管理系统',
                username: req.session.admin_name,
                data: res.doc
            })
        })

    } else {
        res.send("<script>alert('您还没有登录，请先登录！');location.href='/admin/login'</script>")
    }
});
// 审核信息页
router.get('/requestlist', function(req, res) {
    if (req.session.admin_id) {
        const status = 0
        dbs.getIndexByGoodsInfo(req, status, function(result) {
            res.render('admin_requestlist', {
                title: '审核信息——kanesir.校园二手',
                username: req.session.admin_name,
                data: result
            })
        })
    } else {
        res.send("<script>alert('您还没有登录，请先登录！');location.href='/admin/login'</script>")
    }
});
// 审核详情页
router.get('/requestlist/goods/:id', function(req, res) {
    if (req.session.admin_id) {
        dbs.getAdminByGoodsIndex(req, function(result) {
            if (result) {
                res.render('admin_goods', {
                    title: "审核详情页",
                    data: result
                })
            } else {
                res.send("<script>alert('系统错误，请稍后重试！');location.href='/admin/requestlist'</script>")
            }
        })

    } else {
        res.send("<script>alert('您还没有登录，请先登录！');location.href='/admin/login'</script>")
    }
});
// 审核成功订单
router.get('/passlist', function(req, res) {
    if (req.session.admin_id) {
        dbs.getIndexByGoodsInfo(req, 1, function(result) {
            res.render('admin_passlist', {
                title: '审核成功订单——kanesir.校园二手',
                username: req.session.admin_name,
                data: result
            })
        })
    } else {
        res.send("<script>alert('您还没有登录，请先登录！');location.href='/admin/login'</script>")
    }
});
// 提交审核订单
router.post('/inputgoods', function(req, res) {
    if (req.session.admin_id) {
        const status = req.body.status
        console.log(status)
        if (status == 1) {
            dbs.getGoodsByStatusTrue(req, status, function(result) {
                if (result) {
                    dbs.getGoodsByMessageSuccess(req, function(success) {
                        if (success) {
                            res.json({
                                status: 1
                            })
                        }
                    })
                } else {
                    res.send("<script>alert('系统错误，请稍后重试！');location.href='/admin/requestlist'</script>")
                }
            })
        }
        if (status == -1) {
            dbs.getGoodsByStatusTrue(req, status, function(result) {
                if (result) {
                    dbs.getGoodsByMessageFalse(req, function(success) {
                        if (success) {
                            res.json({
                                status: 1
                            })
                        }
                    })
                } else {
                    res.send("<script>alert('系统错误，请稍后重试！');location.href='/admin/requestlist'</script>")
                }
            })
        }
    } else {
        res.send("<script>alert('您还没有登录，请先登录！');location.href='/admin/login'</script>")
    }
});
// 轮播页列表
router.get('/bannerlist', function(req, res) {
    if (req.session.admin_id) {
        dbs.getAdminByBannerList(req, 1, function(result) {
            res.render('admin_bannerlist', {
                title: '轮播页列表——kanesir.校园二手',
                username: req.session.admin_name,
                data: result
            })
        })
    } else {
        res.send("<script>alert('您还没有登录，请先登录！');location.href='/admin/login'</script>")
    }
});
// 添加轮播页
router.get('/uploadbanner', function(req, res) {
    if (req.session.admin_id) {
        res.render('admin_uploadbanner', {
            title: '添加轮播页——kanesir.校园二手'
        });
    }else{
        res.send("<script>alert('您还没有登录，请先登录！');location.href='/admin/login'</script>")
    }
    
});
// 添加轮播页异步上传图片
router.post('/uploadbanner/bannerimg', function(req, res) {
    if (req.session.admin_id) {
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
            const fileExt = filePath.substring(filePath.lastIndexOf('.'));
            //判断文件类型是否允许上传
            if (('.jpg.jpeg.png.gif').indexOf(fileExt.toLowerCase()) === -1) {
                res.json({ status: -1, message: '此文件类型不允许上传' });
            } else {
                // 上传临时图片文件成功
                req.session.banner_tmpfile = filePath
                res.json({ status: 1 })
            }
        });
    } else {
        res.send("<script>alert('您还没有登录，请先登录~');location.href='/admin/login'</script>")
    }
})

// 上传轮播页详情
router.post('/uploadbanner', function(req, res) {
    if (req.session.admin_id) {
        if (req.session.banner_tmpfile) {
            const filePath = req.session.banner_tmpfile
            const targetDir = path.join(__dirname, '../public/banner');
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
                    const fileUrl = '/banner/' + fileName;
                    dbs.getAdminByBannerItem(req, fileUrl, function(doc) {
                        if (doc) {
                            res.json({ status: 1});
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
        res.send("<script>alert('您还没有登录，请先登录~');location.href='/admin/login'</script>")
    }
})
module.exports = router;
