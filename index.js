
var $iframe = $("#iframe");

var $bookmarkContainer = $(".bookmark-container");
$iframe.on('load', function () {
    var $iframeContent = $($iframe[0].contentDocument);

    $iframeContent.find('p').remove();
    var $data = $iframeContent.find("body>dl");

    appendBookmark($data, $bookmarkContainer);

    function appendBookmark($curData, $target) {
        $curData.children('dt').each(function (index, item) {
            var $a = $(item).children('a');
            if ($a.length > 0) {
                var url = $a.attr('href');
                var name = $a.text();
                var icon = $a.attr('icon')||'';

                var $bookmarkItem = $('<div class="bookmark-item"><input type="checkbox" class="item-check"/><a href = "' + url + '" target="_blank">'+(icon && ('<img src="' + icon + '"/>')||'' ) + name + '</a></div>');
                $bookmarkItem.appendTo($target);
            }
            else {
                //存在文件夹得情况
                var $groupHead = $(item).children("h3");
                var $groupItems = $(item).children("dl");

                var $bookmarkGroup = $("<div class='bookmark-group'>\
                                    <span class='group-title'><input type='checkbox' class='group-check'/>"+ $groupHead.text() + "</span>\
                                    <ul class='bookmark-group-data'></ul>\
                                    </div>");
                $bookmarkGroup.appendTo($target);
                appendBookmark($groupItems, $bookmarkGroup.find('ul.bookmark-group-data'));
            }
        });

    }
});

$iframe.attr("src", "data.html");


$bookmarkContainer.on('click','input.group-check',function(){
    var checked = $(this).prop('checked');

    $(this).closest('.bookmark-group').find('input[type="checkbox"]').prop('checked',checked);
});


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

$("#btnExport").click(function(){
    var $data = $bookmarkContainer.children('.bookmark-group,.bookmark-item');
    var dataHtml = createGroupItemHtml($data);
    // $checkData.each(function(index,item){
    //     var $item = $(item);

    //     if(!$item.hasClass('un-track')){
    //         return true;
    //     }

    //     //选择组
    //     if ($item.hasClass('group-check')) {
    //         var head = $item.closest('.group-title').text();

    //         var $groupItems = $item.closest('.group-title').next('.bookmark-group-data').children('.bookmark-group,.bookmark-item');

    //         var groupItemHtml = createGroupItemHtml($groupItems);

    //         dataHtml += '\r\n\
    //             <DT><H3>'+ head + '</H3>\r\n\
    //             <DL><p>\r\n\
    //             '+ groupItemHtml + '\r\n\
    //             </DL><p>';
    //         $item.removeClass('un-track');
    //     }
    //     //选择项
    //     else if ($item.hasClass('item-check')) {
    //         var $link = $item.next('a');
    //         var text = $link.text();
    //         var href = $link.attr('href');
    //         var icon = $link.find('img').attr('src') || '';

    //         var iconHtml = (icon && ('ICON="' + icon + '"')) || '';
    //         dataHtml += '<DT><A HREF="' + href + '" ' + iconHtml + '">' + text + '</A>\r\n';
    //         $item.removeClass('un-track');
    //     }
    // });
    
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
    saveAs(blob, fileName);//saveAs(blob,filename)
}