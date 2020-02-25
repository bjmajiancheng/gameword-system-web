/**
 * Created by chenguojun on 9/28/16.
 */
;
(function ($, window, document, undefined) {
    App.menu = {
        "initVerticalMenu": initVerticalMenu,
        "showUserInfo": showUserInfo,
        "showTaskInfo": showTaskInfo,
        "showPageInfo": showPageInfo,
        "initPageMap": initPageMap
    };
    App.menusMapping = {};


    App.menu.userOption = {
        id: "current_user_form",//表单id
        name: "current_user_form",//表单名
        method: "POST",//表单method
        action: App.href + "/api/index/updateUser",
        ajaxSubmit: true,//是否使用ajax提交表单
        submitText: "提交",//保存按钮的文本
        showReset: true,//是否显示重置按钮
        resetText: "重置",//重置按钮文本
        isValidate: true,//开启验证
        buttonsAlign: "center",
        items: [
            {
                type: 'hidden',
                name: 'id',
                id: 'id'
            }, {
                type: 'text',//类型
                name: 'displayName',//name
                id: 'displayName',//id
                label: '昵称',//左边label
                cls: 'input-large',
                rule: {
                    required: true
                },
                message: {
                    required: "请输入昵称"
                }
            }, {
                type: 'text',//类型
                name: 'contactPhone',//name
                id: 'contactPhone',//id
                label: '手机'
            }, {
                type: 'text',//类型
                name: 'email',//name
                id: 'email',//id
                label: '邮箱',
                rule: {
                    email: true
                },
                message: {
                    email: "请输入正确的邮箱"
                }
            }
        ]
    };


    App.menu.taskGridOption = {
        url: App.href + "/api/core/exportTask/myList",
        pageNum: 1,//当前页码
        pageSize: 15,//每页显示条数
        idField: "id",//id域指定
        headField: "taskName",
        contentTypeItems: "table,card,list",
        showCheck: true,//是否显示checkbox
        checkboxWidth: "3%",
        showIndexNum: true,
        indexNumWidth: "5%",
        pageSelect: [2, 15, 30, 50],
        sort: "exportTime_desc",
        columns: [
            {
                title: "任务名称",
                align: "left",
                field: "taskName"
            }, {
                title: "导出时间",
                align: "left",
                field: "exportTime"
            }, {
                title: "完成时间",
                align: "left",
                field: "completeTime"
            }, {
                title: "耗时",
                align: "left",
                field: "costTime"
            }, {
                title: "状态",
                align: "left",
                field: "status",
                width: "10%",
                format: function (i, data) {
                    if (data.status == 2) {
                        return '<span class="label label-success">完成</span>'
                    } else if (data.status == 1) {
                        return '<span class="label label-warning">进行中</span>'
                    } else {
                        return '<span class="label label-danger">失败</span>'
                    }
                }
            },
            {
                title: "下载",
                field: "status",
                align: "left",
                format: function (index, data) {
                    if (data.status == 2) {
                        return '<a class="btn btn-danger btn-sm" href="' + data.attachmentUri + '">右键另存为</a>';
                    } else {
                        return '';
                    }
                }
            }
        ],
        actionColumnText: "操作",//操作列文本
        actionColumnWidth: "20%",
        actionColumns: [
            {
                text: "删除",
                cls: "btn-danger btn-sm",
                handle: function (index, data, grid) {
                    bootbox.confirm("确定该操作?", function (result) {
                        if (result) {
                            var requestUrl = App.href + "/api/core/exportTask/delete";
                            $.ajax({
                                type: "GET",
                                dataType: "json",
                                data: {
                                    id: data.id
                                },
                                url: requestUrl,
                                success: function (data) {
                                    if (data.code === 200) {
                                        grid.reload();
                                    } else {
                                        alert(data.message);
                                    }
                                },
                                error: function (e) {
                                    alert("请求异常。");
                                }
                            });
                        }
                    });
                }
            }
        ],
        tools: [
            {
                type: 'button',
                text: '刷新',
                cls: "btn btn-warning",
                handle: function (g) {
                    g.reload();
                }
            }
        ]
    };

    function getSubMenu(menus, menuId) {
        var subMenus = [];
        $.each(menus, function (i, m) {
            if (m.parentId == menuId) {
                subMenus.push(m);
            }
        });
        return subMenus;
    }

    function getMenu(menus, menuId) {
        var subMenus = [];
        $.each(menus, function (i, m) {
            if (m.id == menuId) {
                subMenus.push(m);
            }
        });
        return subMenus;
    }

    function getTopMenu(menus) {
        var topMenus = [];
        $.each(menus, function (i, m) {
            if (m.parentId == 0) {
                topMenus.push(m);
            } else {
                var subMenus = getMenu(menus, m.parentId);
                if (subMenus.length == 0) {
                    topMenus.push(m);
                }
            }
        });
        return topMenus;
    }

    /*<li data-url='dvd/example/panel.html'>面板</li>*/
    function secondVerticalMenu(menus, subMenus) {
        var eles = [];
        if (subMenus.length > 0) {
            $.each(subMenus, function (i, m) {
                var originAction = App.page.urls.mapping[m.action];
                eles.push("<li data-href='"+ originAction +"' onclick='App.menu.showPageInfo($(this));' style='padding-left:40px;'>" + m.functionName + "</li>");
            });
        }
        return eles.join('');
    }

    function showUserInfo() {
        var modal = $.orangeModal({
            id: "userForm",
            title: "用户信息",
            destroy: true,
            buttons: [
                {
                    type: 'button',
                    cls: 'btn-default',
                    text: '关闭',
                    handle: function (m) {
                        m.hide();
                    }
                }
            ]
        }).show();
        App.menu.userOption.ajaxSuccess = function () {
            modal.hide();
        };
        var form = modal.$body.orangeForm(App.menu.userOption);
        form.loadRemote(App.href + "/api/index/loadCurrentUser");
    }

    function showTaskInfo() {
        var modal = $.orangeModal({
            id: "exportList",
            title: "导出任务列表",
            destroy: true,
            buttons: [
                {
                    type: 'button',
                    cls: 'btn-default',
                    text: '关闭',
                    handle: function (m) {
                        m.hide();
                    }
                }
            ]
        }).show().$body.orangeGrid(App.menu.taskGridOption);
    }


        /*<div title="布局" data-options="iconCls:'fa fa-desktop'" >
            <ul>
            <li data-url='dvd/example/panel.html'>面板</li>
            <li data-url='dvd/example/tabs.html'>选项卡</li>
            <li data-url='dvd/example/accordion.html'>分类</li>
            <li data-url='dvd/example/layout.html'>布局</li>
            </ul>
        </div>*/
    function initVerticalMenu() {
        var ul = "#vertical-menu";
        $.ajax(
            {
                type: 'GET',
                url: App.href + "/api/index/current",
                async: false,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        var menus = result.data.functionList;
                        var userInfo = result.data.user;
                        App.currentUser = userInfo;
                        $("li.user").find("#gUserName").html(userInfo.displayName);
                        var topMenus = getTopMenu(menus);
                        $.each(menus, function (i, m) {
                            App.menusMapping[m.action] = m.functionName;
                        });
                        $.each(topMenus, function (i, m) {
                            if (m.parentId == 0) {
                                var subMenus = getSubMenu(menus, m.id);
                                var htmls = [];
                                htmls.push("<div title=\"" + m.functionName + "\" data-options=\"iconCls:'fa "+ m.icon +"'\" >");
                                htmls.push("<ul>");
                                if(subMenus.length > 0) {
                                    var subEles = secondVerticalMenu(menus, subMenus);
                                    htmls.push(subEles);
                                }
                                htmls.push("</ul>");
                                htmls.push("</div>");

                                var div = $(htmls.join(''));
                                $(ul).append(div);
                            }
                        });
                        refreshHref(ul);
                    } else if (result.code === 401) {
                        bootbox.alert("token失效,请登录!");
                        window.location.href = '../login.html';
                    }
                },
                error: function (err) {
                }
            }
        );
    }

    var refreshHref = function (ul) {
        var location = window.location.href;

        var pathname = window.location.pathname;
        if (pathname === "/index.html" || pathname === "/") {
            return true;
        } else {
            var validateFlag = validatePage("/api/validate"+pathname);
            if (!validateFlag) {
                window.location.href = App.href + "/index.html";
            }
        }
    };

    var loadCommonMenu = function (url, title) {
        $.ajax(
            {
                type: 'GET',
                url: App.href + url,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        App.content.empty();
                        var data = result.data;
                        App.title(title);
                        App.content.append(data.content);
                    } else {
                        alert(result.message);
                    }
                },
                error: function (e) {
                    alert("页面不存在");
                    //window.location.href = App.href + "/index.html";
                }
            }
        );
    };

    /**
     * 验证页面权限
     *
     * @param url
     */
    function validatePage(url) {
        var flag = false;
        $.ajax(
            {
                type: 'GET',
                url: App.href + url,
                async: false,
                contentType: "application/json",
                dataType: "json",
                success: function (result) {
                    if (result.code === 200) {
                        flag = true;
                    } else {
                        alert(result.message);
                        flag = false;
                        return false;
                    }
                },
                error: function (e) {
                    alert("页面不存在");
                    falg = false;
                    return false;
                }
            }
        );

        return flag;
    }

    /**
     * 展现页面内容
     *
     * @param ele
     */
    function showPageInfo(ele) {
        var tabUrl = $(ele).data('href');
        var validateUrl = "/api/validate/" + tabUrl;

        var valateflag = validatePage(validateUrl);

        if(valateflag) {
            $(ele).siblings().removeClass('super-accordion-selected');
            $(ele).addClass('super-accordion-selected');

            //新增一个选项卡
            var tabTitle = $(ele).text();
            //tab是否存在
            if($("#tt").tabs('exists', tabTitle)) {
                $("#tt").tabs('select', tabTitle);
            } else {
                var content = '<iframe scrolling="auto" frameborder="0"  src="' + tabUrl + '" style="width:100%;height:99%;"></iframe>';
                $('#tt').tabs('add', {
                    title: tabTitle,
                    //content: content,
                    href: tabUrl,
                    closable: true
                });
            }
        }
    }

    /**
     * 初始化页面映射
     */
    function initPageMap() {
        App.page.urls.mapping = {};
        App.page.urls.reverseMapping = {};
        if(App.page.urls.length == 0) {
            return;
        }

        $.each(App.page.urls, function(i, m){
            var originUrl = m;
            var url = originUrl.replace(/-[a-zA-Z0-9]+.html$/g, '.html');

            App.page.urls.mapping[url] = originUrl;
            App.page.urls.reverseMapping[originUrl] = url;
        });

    }

    $(document).ready(function () {
        //初始化文件映射
        App.menu.initPageMap();
        //初始化菜单信息
        App.menu.initVerticalMenu();

        $("#user-info").click(function () {
            App.menu.showUserInfo();
        });
        $("#task-info").click(function () {
            App.menu.showTaskInfo();
        });
    });
})(jQuery, window, document);
