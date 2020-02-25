;
(function ($, window, document, undefined) {

    // 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
    // 详情查看javascript的数值范围
    function checkIDCard(idcode){
        // 加权因子
        var weight_factor = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
        // 校验码
        var check_code = ['1', '0', 'X' , '9', '8', '7', '6', '5', '4', '3', '2'];

        var code = idcode + "";
        var last = idcode[17];//最后一个

        var seventeen = code.substring(0,17);

        // ISO 7064:1983.MOD 11-2
        // 判断最后一位校验码是否正确
        var arr = seventeen.split("");
        var len = arr.length;
        var num = 0;
        for(var i = 0; i < len; i++){
            num = num + arr[i] * weight_factor[i];
        }

        // 获取余数
        var resisue = num%11;
        var last_no = check_code[resisue];

        // 格式的正则
        // 正则思路
        /*
        第一位不可能是0
        第二位到第六位可以是0-9
        第七位到第十位是年份，所以七八位为19或者20
        十一位和十二位是月份，这两位是01-12之间的数值
        十三位和十四位是日期，是从01-31之间的数值
        十五，十六，十七都是数字0-9
        十八位可能是数字0-9，也可能是X
        */
        var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

        // 判断格式是否正确
        var format = idcard_patter.test(idcode);

        // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
        return last === last_no && format ? true : false;
    }

    $.extend($.fn.validatebox.defaults.rules, {
        telephone: {    //第三步,选中校验谁
            validator: function(value){    //第四步, 具体编写校验规则
                var reg = /^1[3,4,5,6,7,8,9][0-9]{9}$/;

                return reg.test(value);
            },
            message: '请输入正确的手机号!'   //第五步,如果输入内容不符合校验规则,出现的提示语.
        },
        idcard: {// 验证身份证
            validator: function (value) {
                return checkIDCard(value);
            },
            message: '身份证号码格式不正确'
        },
        isDecimal: {
            validator: function (value) {
                return /^\d*(?:\.\d{0,2})?$/.test(value);
            },
            message: '请输入数字(例:0.00),最高保留两位小数'
        },
        isGps: {
            validator: function (value) {
                return /^\d*(?:\.\d{1,6})?,\d*(?:\.\d{1,6})?$/.test(value);
            },
            message: '请输入GPS地址(例:116.486691,40.00249)'
        },
        isNumber: {
            validator: function (value) {
                return /^\d*$/.test(value);
            },
            message: '请输入数字(例:1234)'
        }
    });

    $.extend($.validator.messages, {
        required   : "必选字段",
        remote     : "请修正该字段",
        email      : "请输入正确格式的电子邮件",
        url        : "请输入合法的网址",
        date       : "请输入合法的日期",
        dateISO    : "请输入合法的日期 (ISO).",
        number     : "请输入合法的数字",
        digits     : "只能输入整数",
        creditcard : "请输入合法的信用卡号",
        equalTo    : "请再次输入相同的值",
        accept     : "请输入拥有合法后缀名的字符串",
        maxlength  : jQuery.validator.format("请输入一个长度最多是{0}的字符串"),
        minlength  : jQuery.validator.format("请输入一个长度最少是{0}的字符串"),
        rangelength: jQuery.validator.format("请输入一个长度介于{0}和{1}之间的字符串"),
        range      : jQuery.validator.format("请输入一个介于{0}和{1}之间的值"),
        max        : jQuery.validator.format("请输入一个最大为{0}的值"),
        min        : jQuery.validator.format("请输入一个最小为{0}的值")
    });

    // 身份证号码验证
    jQuery.validator.addMethod("idcard", function(value, element) {
        return this.optional(element) || checkIDCard(value);
    }, "请输入正确的身份证号码。");

    jQuery.validator.addMethod("isTel", function(value,element) {
        var length = value.length;
        var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
        return this.optional(element) || tel.test(value) || (length==11 && mobile.test(value));
    }, "请正确填写您的联系方式");

    // 手机号码验证
    jQuery.validator.addMethod("isMobile", function(value, element) {
        var length = value.length;
        return this.optional(element) || (length == 11 && /^1[3,4,5,6,7,8,9][0-9]{9}$/.test(value));
    }, "请正确填写您的手机号码。");

    // GPS地址验证
    jQuery.validator.addMethod("isGps", function(value, element) {
        return this.optional(element) || /^\d*(?:\.\d{1,6})?,\d*(?:\.\d{1,6})?$/.test(value);
    }, "请输入GPS地址(例:116.486691,40.00249)。");

})(jQuery, window, document);