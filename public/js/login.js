$('#login-submit').click(function() {
    // 获取登录页面的用户名和密码
    const adminusername = $.trim($('input[name="username"]').val());
    const adminpassword = $.trim($('input[name="password"]').val());

    if (adminusername == '') {
        $('#disclaimer p').html("用户名不能为空！");
        return false;
    }
    if (adminpassword == '') {
        $('#disclaimer p').html("密码不能为空！");
        return false;
    }
    const logindata = {
            username: adminusername,
            password: adminpassword
        }
        //执行异步请求
    $.ajax({
        url: '/admin/login',
        type: 'post',
        data: logindata,
        dataType: 'json',
        success: function(data) {
            console.log(data)
            if (data.status == 10) {
                $('#disclaimer p').html("恭喜您登录成功！~");
                $(function() {
                    window.setTimeout(function() {
                        location.href = '/admin';
                    }, 500);
                });
            }
            if (data.status == -1) {
                $('#disclaimer p').html("密码错误！");
                return false;
            }
            if (data.status == -2) {
                $('#disclaimer p').html("用户名错误！");
                return false;
            }
        }
    });

})





// 当输入框获得焦点，输入框图标高亮
$('input[type="text"],input[type="password"]').focus(function() {
    $(this).prev().animate({ 'opacity': '1' }, 200)
});
//当输入框不在有焦点时，图标恢复正常
$('input[type="text"],input[type="password"]').blur(function() {
    $(this).prev().animate({ 'opacity': '.5' }, 200)
});

// 当输入框输入内容时，右侧弹出图标
$('input[type="text"],input[type="password"]').keyup(function() {
    if (!$(this).val() == '') {
        $(this).next().animate({ 'opacity': '1', 'right': '30' }, 200)
    } else {
        $(this).next().animate({ 'opacity': '0', 'right': '20' }, 200)
    }
});
