$(document).ready(function() {
    // 表单切换效果
    (function() {
        const staticPanel = $('.panel-static');
        const slidingPanel = $('.panel-sliding');

        const signupBtn = staticPanel.find('.btn.signup');
        const loginBtn = staticPanel.find('.btn.login');

        const signupContent = slidingPanel.find('.panel-content.signup');

        const loginContent = slidingPanel.find('.panel-content.login');

        signupBtn.on('click', function() {
            loginContent.hide();
            signupContent.show();
            slidingPanel.animate({
                'left': '4%'
            }, 550, 'easeInOutBack');
        });

        loginBtn.on('click', function() {
            signupContent.hide();
            loginContent.show();
            slidingPanel.animate({
                'left': '54%'
            }, 550, 'easeInOutBack');
        });
    })();


    // 登录验证
    $('#login-submit').click(function() {
        const loginEmail = $.trim($('#login-email').val());
        const loginPassword = $.trim($('#login-password').val());
        const logindata = {
            email: loginEmail,
            password: loginPassword
        }
        if (loginEmail == '') {
            $('#notice-login h1').html('邮箱不能为空哦~');
            $('#notice-login p').html('快快填写你的邮箱登录吧~');
            return false;
        }

        function validEmail(v) {
            const r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
            return (v.match(r) == null) ? false : true;
        }

        if (!validEmail(loginEmail)) {
            $('#notice-login h1').html('您输入的邮箱格式不正确哦~');
            $('#notice-login p').html('检查一下在试试吧~');
            return false;
        }
        if (loginPassword == '') {
            $('#notice-login h1').html('密码不能为空哦~');
            $('#notice-login p').html('就差密码就可以登录啦！~');
            return false;
        }
        $.ajax({
            url: '/login',
            type: 'post',
            data: logindata,
            dataType: 'json',
            success: function(data) {
                if (data.status == -1) {
                    $('#notice-login h1').html(data.title);
                    $('#notice-login p').html('啊哦,请再次输入一下密码试试吧~');
                    return false;
                }
                if (data.status == -2) {
                    $('#notice-login h1').html(data.title);
                    $('#notice-login p').html('请仔细想想并检查您输入的用户名是否正确，如果还没有账户，请立即注册吧~');
                    return false;
                }
                if (data.status == 10) {
                    $('#notice-login h1').html(data.title);
                    $('#notice-login p').html('即将跳转到首页~');
                    $(function() {
                        window.setTimeout(function() {
                            location.href = '/';
                        }, 1000);
                    });
                }
            }
        });
    })
    $('#signin-username').blur(function(event) {
        const signinUsername = $.trim($('#signin-username').val());
        if (signinUsername == '') {
            $('#notice-signin h1').html('用户名不能为空哦~');
            $('#notice-signin p').html('快为自己想一个独一无二的名字吧！~');
            return false;
        }
        $.ajax({
            url: '/signin/username/' + signinUsername,
            type: "get",
            data: { username: signinUsername },
            dataType: 'json',
            success: function(data) {
                if (data) {
                    $('#notice-signin h1').html('啊哦，这个用户名已经存在(⊙﹏⊙)b');
                    $('#notice-signin p').html('在用您的洪荒之力想一个用户名吧！~');
                    return false;
                }
            }

        });
    });
    $('#signin-email').blur(function(event) {

        const signinEmail = $.trim($('#signin-email').val());
        if (signinEmail == '') {
            $('#notice-signin h1').html('邮箱不能为空哦~');
            $('#notice-signin p').html('邮箱作为找回账户和登录账户的关键哦！~');
            return false;
        } else {
            function validEmail(v) {
                const r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
                return (v.match(r) == null) ? false : true;
            }

            if (!validEmail(signinEmail)) {
                $('#notice-signin h1').html('您输入的邮箱格式不正确哦~');
                $('#notice-signin p').html('检查一下在试试吧~');
                return false;
            } else {
                $.ajax({
                    url: '/signin/email/' + signinEmail,
                    type: "get",
                    data: { email: signinEmail },
                    dataType: 'json',
                    success: function(data) {
                        if (data) {
                            $('#notice-signin h1').html('啊哦，这个邮箱已经被注册过了(⊙﹏⊙)b');
                            $('#notice-signin p').html('请仔细回想是否为您的邮箱，如果是可以通过忘记密码找回^_^~');
                            return false;
                        }
                    }
                });
                $('#notice-signin h1').html('请输入密码~');
                $('#notice-signin p').html('建议由数字和字母组成，要是有大小写就更好啦~');
            }


        }
    });
    $('#signin-submit').click(function() {
        const signinEmail = $.trim($('#signin-email').val());
        const signinPassword = $.trim($('#signin-password').val());
        const signinUsername = $.trim($('#signin-username').val());
        const signinData = {
            username: signinUsername,
            password: signinPassword,
            email: signinEmail
        };
        if (signinUsername == '') {
            $('#notice-signin h1').html('用户名不能为空哦~');
            $('#notice-signin p').html('快为自己想一个独一无二的名字吧！~');
            return false;
        }
        if (signinEmail == '') {
            $('#notice-signin h1').html('邮箱不能为空哦~');
            $('#notice-signin p').html('邮箱作为找回账户和登录账户的关键哦！~');
            return false;
        }

        function validEmail(v) {
            const r = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
            return (v.match(r) == null) ? false : true;
        }

        if (!validEmail(signinEmail)) {
            $('#notice-signin h1').html('您输入的邮箱格式不正确哦~');
            $('#notice-signin p').html('检查一下在试试吧~');
            return false;
        }
        if (signinPassword == '') {
            $('#notice-signin h1').html('密码不能为空哦~');
            $('#notice-signin p').html('就差填写密码就可以登录啦！~');
            return false;
        }



        $.ajax({
            url: '/sign/insert',
            type: 'post',
            data: signinData,
            dataType: 'json',
            success: function(data) {
                if (data.status == 1) {
                    $('#notice-signin h1').html('恭喜您注册成功！^_^');
                    $('#notice-signin p').html('欢迎您加入kanesir，即将为您跳转到主页');
                    $(function() {
                        window.setTimeout(function() {
                            location.href = '/';
                        }, 1000);
                    });
                }

            }
        });
    })
})
