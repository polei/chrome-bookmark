//import 'bootstrap/dist/css/bootstrap.css';

import './bookmark.css';
var $ = require('jquery');
var fileSaver = require('./FileSaver');

$("#btnRefresh").click(function(){
    chrome.bookmarks.getTree(function(bookmarkNodes){
        createTree(bookmarkNodes);
    });
    return false;
});

$(function(){
    chrome.bookmarks.getTree(function(bookmarkNodes){
        createTree(bookmarkNodes);
    });
});

function fetchFavicon(url) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width =this.width;
            canvas.height =this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };
        img.src = 'chrome://favicon/' + url;
    });
}

var $bookmarkContainer = $(".bookmark-container");
function createTree(nodes) {
    $bookmarkContainer.empty();
    appendBookmark(nodes[0], $bookmarkContainer);

    function appendBookmark(curData, $target) {
        $(curData.children).each(function (index, item) {
            if (!$.isArray(item.children)) {
                var url = item.url;
                var name = item.title;


                var $bookmarkItem = $('<div class="bookmark-item"><input type="checkbox" class="item-check"/><a href = "' + url + '" target="_blank"><img/><span class="label-name">' + name + '</span></a></div>');
                $bookmarkItem.appendTo($target);

                fetchFavicon(url).then(function(imgUrl){
                    $bookmarkItem.find('img').attr('src',imgUrl);
                });
            }
            else {
                //存在文件夹得情况
                var folderName = item.title;
                var folderSrc = 'folder.png';
                var $bookmarkGroup = $("<div class='bookmark-group'>\
                                    <span class='group-title'><input type='checkbox' class='group-check'/><img src='"+ folderSrc + "'/><span class='label-name'>" + folderName + "</span></span>\
                                    <ul class='bookmark-group-data'></ul>\
                                    </div>");
                $bookmarkGroup.appendTo($target);
                appendBookmark(item, $bookmarkGroup.find('ul.bookmark-group-data'));
            }
        });

    }
};

function createGroupItemHtml($groupItems){
    var html = "";

    $groupItems.each(function(index,item){
        var $item = $(item);

        if ($item.hasClass('bookmark-group')) {
            var $checkbox = $item.children('.group-title').children('input:checked');


            var $groupItems = $item.children('.group-title').next('.bookmark-group-data').children('.bookmark-group,.bookmark-item');

            var groupItemHtml = createGroupItemHtml($groupItems);

            if ($checkbox.length <= 0) {
                html += groupItemHtml;
            }
            else {
                var head = $item.children('.group-title').text();

                html += '\r\n\
                <DT><H3>'+ head + '</H3>\r\n\
                <DL><p>\r\n\
                '+ groupItemHtml + '\r\n\
                </DL><p>\r\n';
            }
        }
        else if($item.hasClass('bookmark-item')){
            var $checkbox = $item.children('input:checked');
            if($checkbox.length<=0){
                return true;
            }

            var $link = $checkbox.next('a');
            var text = $link.text();
            var href = $link.attr('href');
            var icon = $link.find('img').attr('src') || '';

            var iconHtml = (icon && ('ICON="' + icon + '"')) || '';
            html += '<DT><A HREF="' + href + '" ' + iconHtml + '>' + text + '</A>\r\n';
        }
    });
    return html;
}

//checkbox 全选/全不选
$bookmarkContainer.on('click','input.group-check',function(e){
    var checked = $(this).prop('checked');

    $(this).closest('.bookmark-group').find('input[type="checkbox"]').prop('checked',checked);
    e.stopPropagation();
});

$bookmarkContainer.on('click','.group-title',function(){
    $(this).next('.bookmark-group-data').slideToggle();
    return false;
});



$("#btnExport").click(function(){
    var $data = $bookmarkContainer.children('.bookmark-group,.bookmark-item');
    var dataHtml = createGroupItemHtml($data);
    
    var headHtml = '\
    <!DOCTYPE NETSCAPE-Bookmark-file-1>\r\n\
    <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\r\n\
    <TITLE>Bookmarks</TITLE>\r\n\
    <H1>Bookmarks</H1>\r\n\
    <DL><p>\r\n';
    var footHtml = '\
    </DL><p>';

    var preHtml = headHtml + dataHtml + footHtml;
   
    dataToTxt(preHtml,'导出书签.html');
    return false;
});

function dataToTxt(content,fileName) {
    var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    fileSaver.saveAs(blob, fileName);//saveAs(blob,filename)
}