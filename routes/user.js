const express = require('express');
const router = express.Router();
const orm = require('orm');
const moment = require('moment');
const crypto = require('crypto');
const dbs = require('../data/dbs')(router);

// 显示上传页面
router.get('/:username', function(req, res) {
    if (req.session.user_id) {
            res.render('index_user', {
                title: req.session.user_name+'的个人中心——kanesir.校园二手',
                username:req.session.user_name
            })
    } else {
        res.send("<script>alert('您还没有登录，请先登录~');location.href='/sign'</script>")
    }

})


module.exports = router;