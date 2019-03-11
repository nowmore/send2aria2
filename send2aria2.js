

var lastMethod
var lastParams
var times = 0
chrome.contextMenus.create({
    "title": "用aria2下载",
    "contexts":[
        "link",
        "selection",
    ],
    "onclick":function(info){
        var link;
        var protocols = ["http", "https", "ftp", "magnet"/*, "thunder", "ed2k"*/]
        if('linkUrl' in info){
            link = info.linkUrl;
        }
        else if('selectionText' in info){
            link = info.selectionText
        }
        else {
            return;
        }

        var index = link.indexOf(':');
        if(index != -1){
            if(protocols.indexOf(link.substring(0,index)) != -1){
                post('aria2.addUri', link)
            }
        }
    }
});

function post(method, params=null) {
    if(times >= 5){
        times = 0;
        return;
    }
    var req = {
            jsonrpc: "2.0", 
            method: method, 
            id: "qwer"
        }
    
    if(params){
        req.params = [[params]]
        lastParams = params
    }
    lastMethod = method
    
    $.ajax({
        url:'http://localhost:6800/jsonrpc',
        contentType:"application/json",
        type: "POST",
        processData:false,
        data:JSON.stringify(req),
        success:function(data){
            times = 0
            console.log(JSON.stringify(data))
        },
        failure:function(data){
            times = 0
            console.log(JSON.stringify(data))
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
            console.log(JSON.stringify(XMLHttpRequest))
            console.log(JSON.stringify(textStatus))
            console.log(JSON.stringify(errorThrown))

            /* 貌似访问不了的时候就会出现这种情况,先这样用吧 */
            if(textStatus == 'error' && XMLHttpRequest.status == 0
            && XMLHttpRequest.readyState == 0){    
                /* NativeMessage 调用本地exe */
                chrome.runtime.sendNativeMessage("com.fuck.run", {test:"hello"}, function (params) {
                    console.log("return with " + params)
                });

                /* 重试次数 */
                if(times){
                    times += 1;
                } else
                    times = 1;
                post(lastMethod, lastParams)
            }
        }

    }
    )
}
