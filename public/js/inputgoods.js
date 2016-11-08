$('#pass').click(function(e) {
    const id = $('#id').val()
    $.ajax({
        url: '/admin/inputgoods',
        type: 'post',
        data: {
            status: 1,
            id: id
        },
        dataType: 'json',
        success: function(data) {
            if (data.status === 1) {
                alert('通过审核成功')
                location.href = "/admin/requestlist"
            } else {
                alert('系统错误')
                location.href = "/admin/requestlist"
            }
        }
    })
})
$('#falsepass').click(function(e) {
    const id = $('#id').val()
    const reason = $.trim($('#reason').val())
    if (reason == '') {
        $('#request h2').html('请输入原因在上传！')
        return false;
    }
    $.ajax({
        url: '/admin/inputgoods',
        type: 'post',
        data: {
            status: -1,
            id: id,
            reason: reason
        },
        dataType: 'json',
        success: function(data) {
            if (data.status === 1) {
                alert('消息反馈成功成功')
                location.href = "/admin/requestlist"
            }
        }
    })
})
