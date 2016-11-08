$(document).ready(function() {
    // const ajaxadmin = {

    //         getClassinfo: function() {
    //             const $main = $('#main');
    //             $.ajax({
    //                 url: '/admin/classinfo',
    //                 type: 'get',
    //                 dataType: 'json',
    //                 success: function(data) {
    //                     $main.empty();
    //                     const $button = $('<button></button>').html('添加分类').attr("type","button").addClass('addClass btn btn-info btn-lg').prependTo($main);
    //                     const $table = $('<table></table>').addClass('table table-hover').appendTo($main);
    //                     const $thead = $('<thead></thead>').prependTo($table)
    //                     const $tr = $('<tr></tr>').prependTo($thead)
    //                     const $thid = $('<th></th>').html('ID').appendTo($tr)
    //                     const $thtype = $('<th></th>').html('分类名称').appendTo($tr)
    //                     const $thcount = $('<th></th>').html('该分类宝贝数量').appendTo($tr)
    //                     const $thoption = $('<th></th>').html('操作').appendTo($tr)
    //                     const $tbody = $('<tbody></tbody>').appendTo($table)
    //                     data.forEach(function(item, index, array) {
    //                     	const $tr = $('<tr></tr>').prependTo($tbody)
    //                         const $tdid = $('<td></td>').html(item.type_id).appendTo($tr)
    //                     	const $tdtype = $('<td></td>').html(item.type_name).appendTo($tr)
    //                     	const $tdcount = $('<td></td>').html(0	).appendTo($tr)
    //                     	const $tdoption = $('<td></td>').appendTo($tr)
    //                     	const $buttondelete = $('<button></button>').addClass('button btn btn-danger btn-xs').attr("type","button").html('删除分类').appendTo($tdoption)
    //                     })
    //                 }
    //             })
    //         }
    //     }
        // 加载菜单插件
    $("#menu").metisMenu();
    // 添加分类信息模态框
    $(".addClassModal").click(function(e) {
            $('#addClassModal').modal('show')
        })
        // 添加分类信息
    $('#addClassModal #confirmAddClass').click(function(e) {
            const classtitle = $.trim($('#classTitle').val())
            if (classtitle == '') {
                $('#addClassFrom').addClass('has-error');
                $('#addClassFrom label').html('分类标题不能为空！');
                return false;
            } else {
                $.ajax({
                    url: '/admin/addclass',
                    type: 'post',
                    data: {
                        name: classtitle
                    },
                    dataType: 'json',
                    success: function(data) {
                        if (data.success === 1) {
                            $('#addClassModal .modal-body').empty()
                            $('#addClassModal .modal-footer').empty()
                            $('<p>新增成功！<p>').prependTo($('#addClassModal .modal-body'))
                            $(function() {
                                window.setTimeout(function() {
                                    location.href = '/admin/classinfo';
                                }, 500);
                            });
                        } else {
                            $('#addClassModal .modal-body').empty()
                            $('#addClassModal .modal-footer').empty()
                            $('<p>新增失败！<p>').prependTo($('#addClassModal .modal-body'))
                            $(function() {
                                window.setTimeout(function() {
                                    location.href = '/admin/classinfo';
                                }, 500);
                            });
                        }
                    }
                })
            }

        })

})
