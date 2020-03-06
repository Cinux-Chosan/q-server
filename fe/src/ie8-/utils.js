function request(url, callback, params, method = 'POST') {
    method = method.toUpperCase();
    let xmlHttp;
    try {
        // Firefox, Opera 8.0+, Safari
        xmlHttp = new XMLHttpRequest();
    }
    catch (e) {
        // Internet Explorer
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e) {
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {
                alert("您的浏览器不支持AJAX！");
                return false;
            }
        }
    }
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            try {
                callback(JSON.parse(xmlHttp.responseText))
            } catch (e) {
                alert(e.message);
            }
        }
    }

    switch (method) {
        case 'GET': {
            params = encodeURIComponent(makeParamsStr(params))
            xmlHttp.open(method.toUpperCase(), `${url}?${params}`, true);
            xmlHttp.send();
            break;
        }
        case 'POST': {
            xmlHttp.open(method.toUpperCase(), url, true);
            xmlHttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
            xmlHttp.send(JSON.stringify(params));
            break;
        }
    }
}

function makeParamsStr(o) {
    let str = '';
    for (const key in o) {
        if (o.hasOwnProperty(key)) {
            const value = o[key];
            str += `${key}=${value}&`
        }
    }
    return str;
}