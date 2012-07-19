/*
 * ----------------------------------------------------------------------------
 * node-bencode v0.1.0
 * <ma.schmale@googlemail.com> wrote this file. As long as you retain this notice 
 * you can do whatever you want with this stuff. If we meet some day, and you 
 * think this stuff is worth it, you can buy me a beer in return. Mark Schmale
 * ----------------------------------------------------------------------------
 */
var sys = require('sys');

/**
 * decodes a bencoded string 
 */
exports.decode = function decode(str) {
    var arr = str.split('');

    function integer(start) {
        var c = '', n = '', i = 0, mul = 1;
        var len = arr.length;
        if(arr[start] === '-') {
            mul = -1;
            start = start+1;
        }
        for(i=start;i<len;i++) {
            c = arr[i];
            if(c == parseInt(c)) {
                n = n  + c;
            } else {
                break;
            }
        } 
        return {next: i+1, ret: mul*parseInt(n)};
    }
    
    function text(start) {
        var   nfo = integer(start), 
            start = nfo.next,
              len = nfo.ret
                i = 0
             full = '';

        for(i=start;i<len+start;i++) {
            full = full + arr[i]
        }
        return {next: i, ret: full};
    }

    function list(start) {
        var len  = arr.length, 
            i    = start+1,
            list = [], 
            tmp  = {}, 
            lcnt = 0;
        while(i<len && arr[i] !== 'e') {
            tmp        = next(i);
            i          = tmp.next;
            list[lcnt] = tmp.ret;
            lcnt++;
        }
        return {next: i+1, ret: list};
    }

    function dictionary(start) {
        var len   = arr.length, 
            i     = start+1,
            list  = {}, 
            tmp   = {}, 
            isKey = true,
            key   = '';
        while(i<len && arr[i] !== 'e') {
            tmp        = next(i);
            i          = tmp.next;
            if(isKey === true) {
                key = tmp.ret;
            } else {
                list[key] = tmp.ret;
            }
            isKey = !isKey;
        }
        return {next: i+1, ret: list};
    }


    function next(start) {
        var data = 0;
        start = start || 0;
        switch(arr[start]) { 
            case 'i':   // integer
                data = integer(start+1);
                break;
            case 'l':   // liste
                data = list(start);
                break;
            case 'd':   // dict
                data = dictionary(start);
                break; 
            default:    // string
                data = text(start);
        }
        return data;
    }

    return next(0).ret;
}

exports.encode = function encode(data) {
/*    sys.puts(sys.inspect(typeof(data)));
    sys.puts(sys.inspect(is_array(data)));*/
 
    function encode_string(data) {
        return data.length + ":" + data;
    }

    function encode_integer(data) {
        return "i" + data + "e";
    }

    function encode_list(data) {
        var max = data.length;
        var i   = 0;
        var str = "l";
        for(i=0;i<max;i++) {
            str = str + encode(data[i]);
        }
        str = str + "e";
        return str;
    }

    function encode_dict(data) {
        var str = "d";
        for(var key in data) {
            str = str + encode_string(key) + encode(data[key]);
        }
        str = str + "e";
        return str;
    }

    /** helper **/
    function is_array(obj) {
        return obj.constructor == Array;
    }

    var str = "";
   
    switch(typeof(data)) {
        case 'object':
            if(is_array(data) === true) {
                str = encode_list(data);
            } else {
                str = encode_dict(data);
            }
            break;

        case 'number':
            str = encode_integer(data);
            break;

        case 'string': 
            str = encode_string(data);
            break;
    }
    return str;
}
