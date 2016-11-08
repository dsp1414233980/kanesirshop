$(document).ready(function() {
        // 描述校验
    $('#upload #summary').focus(function(e) {
            $('.uploadtitle').html('请描述一下您的宝贝吧~')
            $('.uploaddescription').html('描述最多不能超过140个字')
            $(this).keyup(function() {
                const words = 141 - $.trim($(this).val()).length
                if (words > 0) {
                    $('.uploaddescription').html('还可以输入' + words + '个字')
                } else {
                    $('.uploadtitle').html('您输入的描述有误！')
                    $('.uploaddescription').html('您输入的字数已经超过140字，请修改后再进行上传')
                    return false;
                }
            })
        })
        // 异步上传图片
    $('#upload #imgfile').change(function(e) {
            $("#fileuploader").attr({ "disabled": "disabled" });
            const img = $('#upload #imgfile').val()
            if (img.length == 0) {
                $('.uploadtitle').html('您没有上传任何图片！')
                $('.uploaddescription').html('请选择上传照片以后在重试！')
                return false
            }
            const extName = img.substring(img.lastIndexOf('.'), img.length).toLowerCase();
            if (extName != '.png' && extName != '.jpg' && extName != '.jpeg' && extName != '.gif') {
                $('.uploadtitle').html('您上传的图片格式有误！')
                $('.uploaddescription').html('当前只支持jpg、jpeg、gif和png格式的上传，大小不超过2M，目前只支持上传一张')
                return false
            }
            const imgsize = $("#imgfile")[0].files[0].size;
            const imgfile = $("#imgfile")[0].files[0]
            const size = 2 * 1024 * 1024
            if (imgsize > size) {
                $('.uploadtitle').html('您上传的图片超过了2M！')
                $('.uploaddescription').html('请重新选择小于2M的图片')
                return false
            }
            const data = new FormData();
            if (imgfile) {
                data.append("tmpFile", imgfile);
                $.ajax({
                    url: '/admin/uploadbanner/bannerimg',
                    type: 'post',
                    data: data,
                    async: false,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(data) {
                        if (data.status === 1) {
                            $("#fileuploader").removeAttr("disabled")
                            $('.uploadtitle').html('请检查无误以后上传您的宝贝吧~')
                            $('.uploaddescription').html('(*^__^*) ')
                            const summary = $.trim($('#summary').val())
                            $('#fileuploader').click(function(e) {
                                if (summary.length == 0) {
                                    $('.uploadtitle').html('您的描述不能为空！')
                                    $('.uploaddescription').html('请输入描述在试试吧')
                                    return false
                                }
                                if (summary.length > 140) {
                                    $('.uploadtitle').html('您的描述超过了140字！')
                                    $('.uploaddescription').html('请修改描述在试试吧')
                                    return false
                                }
                                if (img.length == 0) {
                                    $('.uploadtitle').html('您没有上传任何图片！')
                                    $('.uploaddescription').html('请选择上传照片以后在重试！')
                                    return false
                                }
                                $.ajax({
                                    url: '/admin/uploadbanner',
                                    type: 'post',
                                    data: {
                                        summary: summary,
                                    },
                                    dataType: 'json',
                                    success: function(result) {
                                        if (result.status === 1) {
                                            alert('上传成功')
                                            location.href = '/admin/bannerlist';
                                        } else {
                                            $('.uploadtitle').html('上传失败/(ㄒoㄒ)/~')
                                            $('.uploaddescription').html('请您刷新一下再试吧~ ')
                                        }
                                    }
                                })
                            })
                        } else {
                            $('.uploadtitle').html('您上传的图片有误！')
                            $('.uploaddescription').html('当前只支持jpg、jpeg、gif和png格式的上传，大小不超过2M，目前只支持上传一张')
                            return false
                        }

                    }
                })
            }
        })
        // 上传商品
    $('#fileuploader').click(function(e) {
        const summary = $.trim($('#upload #summary').val())
        const img = $('#upload #imgfile').val()
        if (summary.length == 0) {
            $('.uploadtitle').html('您的描述不能为空！')
            $('.uploaddescription').html('请输入描述在试试吧')
            return false
        }
        if (summary.length > 140) {
            $('.uploadtitle').html('您的描述超过了140字！')
            $('.uploaddescription').html('请修改描述在试试吧')
            return false
        }
        if (img.length == 0) {
            $('.uploadtitle').html('您没有上传任何图片！')
            $('.uploaddescription').html('请选择上传照片以后在重试！')
            return false
        }
    })
});