/*TMODJS:{"version":"1.0.0"}*/
;(function () {
    if(!this.gomeTemplate){
        function template (filename, content) {
            return (
                /string|function/.test(typeof content)
                ? compile : renderFile
            )(filename, content);
        };


        var cache = template.cache = {};

        function toString (value, type) {

            if (typeof value !== 'string') {

                type = typeof value;
                if (type === 'number') {
                    value += '';
                } else if (type === 'function') {
                    value = toString(value.call(value));
                } else {
                    value = '';
                }
            }

            return value;

        };


        var escapeMap = {
            "<": "&#60;",
            ">": "&#62;",
            '"': "&#34;",
            "'": "&#39;",
            "&": "&#38;"
        };


        function escapeFn (s) {
            return escapeMap[s];
        }


        function escapeHTML (content) {
            return toString(content)
            .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
        };


        var isArray = Array.isArray || function(obj) {
            return ({}).toString.call(obj) === '[object Array]';
        };


        function each (data, callback) {
            if (isArray(data)) {
                for (var i = 0, len = data.length; i < len; i++) {
                    callback.call(data, data[i], i, data);
                }
            } else {
                for (i in data) {
                    callback.call(data, data[i], i);
                }
            }
        };


        function resolve (from, to) {
            var DOUBLE_DOT_RE = /(\/)[^/]+\1\.\.\1/;
            var dirname = ('./' + from).replace(/[^/]+$/, "");
            var filename = dirname + to;
            filename = filename.replace(/\/\.\//g, "/");
            while (filename.match(DOUBLE_DOT_RE)) {
                filename = filename.replace(DOUBLE_DOT_RE, "/");
            }
            return filename;
        };


        var utils = template.utils = {

            $helpers: {},

            $include: function (filename, data, from) {
                filename = resolve(from, filename);
                return renderFile(filename, data);
            },

            $string: toString,

            $escape: escapeHTML,

            $each: each
            
        };


        var helpers = template.helpers = utils.$helpers;


        function renderFile (filename, data) {
            var fn = template.get(filename) || showDebugInfo({
                filename: filename,
                name: 'Render Error',
                message: 'Template not found'
            });
            return data ? fn(data) : fn; 
        };


        function compile (filename, fn) {

            if (typeof fn === 'string') {
                var string = fn;
                fn = function () {
                    return new String(string);
                };
            }

            var render = cache[filename] = function (data) {
                try {
                    return new fn(data, filename) + '';
                } catch (e) {
                    return showDebugInfo(e)();
                }
            };

            render.prototype = fn.prototype = utils;
            render.toString = function () {
                return fn + '';
            };

            return render;
        };


        function showDebugInfo (e) {

            var type = "{Template Error}";
            var message = e.stack || '';

            if (message) {
                // 利用报错堆栈信息
                message = message.split('\n').slice(0,2).join('\n');
            } else {
                // 调试版本，直接给出模板语句行
                for (var name in e) {
                    message += "<" + name + ">\n" + e[name] + "\n\n";
                }  
            }

            return function () {
                if (typeof console === "object") {
                    console.error(type + "\n\n" + message);
                }
                return type;
            };
        };


        template.get = function (filename) {
            return cache[filename.replace(/^\.\//, '')];
        };


        template.helper = function (name, helper) {
            helpers[name] = helper;
        };

        this.gomeTemplate = template;
    }
    var gomeTemplate = template = this.gomeTemplate;

    if (typeof define === 'function') {define(function() {return template;});} else if (typeof exports !== 'undefined') {module.exports = template;}
    
    /*v:1*/
gomeTemplate('tpl1',function($data,$filename
/**/) {
'use strict';var $utils=this,$helpers=$utils.$helpers,$escape=$utils.$escape,title=$data.title,$each=$utils.$each,list=$data.list,value=$data.value,i=$data.i,$out='';$out+='<h1>';
$out+=$escape(title);
$out+='</h1> <ul> ';
$each(list,function(value,i){
$out+=' <li>索引 ';
$out+=$escape(i + 1);
$out+=' ：';
$out+=$escape(value);
$out+='</li> ';
});
$out+=' </ul>';
return new String($out);
});

})();