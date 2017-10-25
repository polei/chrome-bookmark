
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
                var icon = $a.attr('icon');

                var $bookmarkItem = $('<div class="bookmark-item"><input type="checkbox" class="item-check"/><a href = "' + url + '" target="_blank"><img src="' + icon + '"/>' + name + '</a></div>');
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