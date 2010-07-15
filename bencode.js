var sys = require('sys');

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

    return next(0);
}
