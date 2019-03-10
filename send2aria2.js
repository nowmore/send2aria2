
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

                $.ajax({
                    url:'http://localhost:6800/jsonrpc',
                    contentType:"application/json",
                    type: "POST",
                    processData:false,
                    data:JSON.stringify({
                        jsonrpc: "2.0", 
                        method: "aria2.addUri", 
                        id: "qwer",
                        params:[[link]]
                    })
                   
                }
                )
            }
        }
    }
});
