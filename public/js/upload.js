$(document).ready(function() {
    // 标题校验
    $('#upload #title').focus(function(e) {
            $('.uploadtitle').html('请输入您想拍卖的宝贝的标题~')
            $('.uploaddescription').html('标题最多只能输入16个字哦~，而且在标题当中是不允许空格的存在的~')
            $(this).keyup(function() {
                const words = 17 - $.trim($(this).val()).length
                if (words > 0) {
                    $('.uploaddescription').html('标题还可以输入' + words + '个字，在标题当中是不允许空格的存在的~')
                } else {
                    $('.uploadtitle').html('您输入的标题有误！')
                    $('.uploaddescription').html('您输入的字数已经超过16字，请修改后再进行上传哦~，注意标题中不允许空格的存在~')
                    return false;
                }
            })
        })
        // 价格校验
    $('#upload #price').focus(function(e) {
            $('.uploadtitle').html('请输入您想拍卖的宝贝的价钱~')
            $('.uploaddescription').html('输入的是kanesir金币值而不是人民币哦~还有不支持小数，只能填写整数哦！')
            $(this).keyup(function() {
                const words = 4 - $.trim($(this).val()).length
                if (words > 0) {
                    $('.uploaddescription').html('如果价格不合适有可能被返回修改才能够上传哦~所以大人请三思~')
                } else {
                    $('.uploadtitle').html('您输入的价格有误！')
                    $('.uploaddescription').html('大人请三思啊，如果价格超过三位数是不能被上传的哦~就不要为难您的学姐学长学弟学妹们啦(⊙o⊙)…')
                    return false;
                }
            })
        })
        // 选择分类
    $('#upload #tag').focus(function(e) {
            $('.uploadtitle').html('请选择您宝贝的分类~')
            $('.uploaddescription').html('这样别人就可以在所属分类下找到您的宝贝啦~！')

        })
        // 描述校验
    $('#upload #summary').focus(function(e) {
            $('.uploadtitle').html('请描述一下您的宝贝吧~')
            $('.uploaddescription').html('描述最多不能超过140个字哦~言简意赅，好东西是不怕写的少的~')
            $(this).keyup(function() {
                const words = 141 - $.trim($(this).val()).length
                if (words > 0) {
                    $('.uploaddescription').html('还可以输入' + words + '个字，好好想想怎么赞美一下您的宝贝吧！')
                } else {
                    $('.uploadtitle').html('您输入的描述有误！')
                    $('.uploaddescription').html('您输入的字数已经超过140字，请修改后再进行上传哦~')
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
                    url: '/upload/tmpimg',
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
                            const title = $.trim($('#title').val())
                            const price = $.trim($('#price').val())
                            const tag = $('#tag').val()
                            const summary = $.trim($('#summary').val())
                            $('#fileuploader').click(function(e) {
                                if (title.length == 0) {
                                    $('.uploadtitle').html('您的标题不能为空！')
                                    $('.uploaddescription').html('请输入标题在试试吧')
                                    return false
                                }
                                if (title.length > 16) {
                                    $('.uploadtitle').html('您的标题超过了16字！')
                                    $('.uploaddescription').html('请修改标题在试试吧')
                                    return false
                                }
                                if (price.length == 0) {
                                    $('.uploadtitle').html('您的价格不能为空！')
                                    $('.uploaddescription').html('请输入价格在试试吧')
                                    return false
                                }
                                if (price.length > 3) {
                                    $('.uploadtitle').html('您的价格超过了3位数！')
                                    $('.uploaddescription').html('请修改价格在试试吧')
                                    return false
                                }
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
                                    url: '/upload',
                                    type: 'post',
                                    data: {
                                        goods_title: title,
                                        goods_price: price,
                                        goods_tag: tag,
                                        goods_summary: summary,
                                    },
                                    dataType: 'json',
                                    success: function(result) {
                                        if (result.status === 1) {
                                            alert('上传商品成功，请耐心等待审核O(∩_∩)O')
                                            location.href = '/';
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
        const title = $.trim($('#upload #title').val())
        const price = $.trim($('#upload #price').val())
        const tag = $('#upload #tag').val()
        const summary = $.trim($('#upload #summary').val())
        const img = $('#upload #imgfile').val()
        if (title.length == 0) {
            $('.uploadtitle').html('您的标题不能为空！')
            $('.uploaddescription').html('请输入标题在试试吧')
            return false
        }
        if (title.length > 16) {
            $('.uploadtitle').html('您的标题超过了16字！')
            $('.uploaddescription').html('请修改标题在试试吧')
            return false
        }
        if (price.length == 0) {
            $('.uploadtitle').html('您的价格不能为空！')
            $('.uploaddescription').html('请输入价格在试试吧')
            return false
        }
        if (price.length > 3) {
            $('.uploadtitle').html('您的价格超过了3位数！')
            $('.uploaddescription').html('请修改价格在试试吧')
            return false
        }
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
