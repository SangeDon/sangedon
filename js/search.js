var searchFunc = function(path, search_id, content_id) {
    'use strict';
    $.ajax({
        url: path,
        dataType: "xml",
        success: function( xmlResponse ) {
            // get the contents from search data
            var datas = $( "entry", xmlResponse ).map(function() {
                return {
                    title: $( "title", this ).text(),
                    content: $("content",this).text(),
                    url: $( "url" , this).text(),
                    categories: $( "category" , this).map(function(){
                        return {
                            category: this.textContent.trim(),
                        }
                    }).get(),
                    tags: $( "tag" , this).map(function(){
                        return {
                            tag: this.textContent.trim(),
                        }
                    }).get()
                };
            }).get();
            var $input = document.getElementById(search_id);
            // var $resultContent = document.getElementById(content_id);
            $input.addEventListener('focus', function(){
                $('.ins-search').addClass('show')
                initSearch(datas)
            })
            
            showResult(datas)

            listenerOn()
            
        }
    });
}

function initSearch(datas){
    var $resultContent = document.querySelector('.ins-section-container');
    var str="<section class = 'ins-section'><header class = 'ins-section-header'><i class = 'fa fa-book'></i>文章<small>共"+datas.length+"篇</small></header>";
    datas.forEach(function(data) {
        var data_title = data.title.trim().toLowerCase();
        var data_url = data.url;
        // show all articles
        str += "<div class='ins-selectable ins-search-item' data-url = '"+data_url+"'><header><i class = 'fa fa-file-o'></i>"+data_title+"</header>";
        var content = data.content.trim().replace(/<[^>]+>/g,"");
        str += "<p class='ins-search-preview'>" + content + "</p></div>"
    });
    str += "</section>";
    $resultContent.innerHTML = str;
}

function showResult(datas){
    var $resultContent = document.querySelector('.ins-section-container');
    document.querySelector('.ins-search-input').addEventListener('input', function(){
        var str="<section class = 'ins-section'><header class = 'ins-section-header'>文章</header>";
        var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
        $resultContent.innerHTML = "";
        if (this.value.trim().length <= 0) {
            return;
        }
        // perform local searching
        datas.forEach(function(data) {
            var isMatch = true;
            var content_index = [];
            var data_title = data.title.trim().toLowerCase();
            var data_content = data.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
            var data_url = data.url;
            var index_title = -1;
            var index_content = -1;
            var first_occur = -1;
            // only match artiles with not empty titles and contents
            if(data_title != '' && data_content != '') {
                keywords.forEach(function(keyword, i) {
                    index_title = data_title.indexOf(keyword);
                    index_content = data_content.indexOf(keyword);
                    if( index_title < 0 && index_content < 0 ){
                        isMatch = false;
                    } else {
                        if (index_content < 0) {
                            index_content = 0;
                        }
                        if (i == 0) {
                            first_occur = index_content;
                        }
                    }
                });
            }
            // show search results
            if (isMatch) {
                str += "<div class='ins-selectable ins-search-item' data-url = '"+data_url+"'><header><i class = 'icon icon-file'></i>"+data_title+"</header>";
                var content = data.content.trim().replace(/<[^>]+>/g,"");
                if (first_occur >= 0) {
                    // cut out 100 characters
                    var start = first_occur - 10;
                    var outLength = content.length;
                    if(start < 0){
                        start = 0;
                    }
                    var match_content = content.substr(start, outLength);
                    // highlight all keywords
                    keywords.forEach(function(keyword){
                        var regS = new RegExp(keyword, "gi");
                        match_content = match_content.replace(regS, "<em class=\"search-keyword\">"+keyword+"</em>");
                    });

                    str += "<p class='ins-search-preview'>" + match_content +"...</p>"
                }
                str += "</div>";
            }
        });
        str += "</section>";
        $resultContent.innerHTML = str;
    });
}

function listenerOn(){
    var $main = $('.ins-search');
    var $input = $('.ins-search-input');
    var $wrapper = $main.find('.ins-section-wrapper');
    var $container = $main.find('.ins-section-container');

    $(document).on('click focus', '#local-search-input', function (e) {
        $main.addClass('show');
        $input.focus();
    }).on('click', '.ins-search-item', function () {
        gotoLink($(this));
    }).on('click', '.ins-close', function () {
        $main.removeClass('show');
    }).on('keydown', function (e) {
        if (!$main.hasClass('show')) return;
        switch (e.keyCode) {
            case 27: // ESC
                $main.removeClass('show'); break;
            case 38: // UP
                selectItemByDiff(-1); break;
            case 40: // DOWN
                selectItemByDiff(1); break;
            case 13: //ENTER
                gotoLink($container.find('.ins-selectable.active').eq(0)); break;
        }
    }).on('over', '.ins-selectable', function(e){
        $(e.target).addClass('active')
        $(e.target).removeClass('active')
    });
}

function gotoLink ($item) {
    if ($item && $item.length) {
        location.href = $item.attr('data-url');
    }
}

function selectItemByDiff (value) {
    var $container = $('.ins-section-container');
    var $items = $.makeArray($container.find('.ins-selectable'));
    var prevPosition = -1;
    $items.forEach(function (item, index) {
        if ($(item).hasClass('active')) {
            prevPosition = index;
            return;
        }
    });
    var nextPosition = ($items.length + prevPosition + value) % $items.length;
    $($items[prevPosition]).removeClass('active');
    $($items[nextPosition]).addClass('active');
    scrollTo($($items[nextPosition]));
}

function beifen(){
    $input.addEventListener('input', function(){
        var str='<ul class=\"search-result-list\">';
        var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
        $resultContent.innerHTML = "";
        if (this.value.trim().length <= 0) {
            return;
        }
        // perform local searching
        datas.forEach(function(data) {
            var isMatch = true;
            var content_index = [];
            var data_title = data.title.trim().toLowerCase();
            var data_content = data.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
            var data_url = data.url;
            var index_title = -1;
            var index_content = -1;
            var first_occur = -1;
            // only match artiles with not empty titles and contents
            if(data_title != '' && data_content != '') {
                keywords.forEach(function(keyword, i) {
                    index_title = data_title.indexOf(keyword);
                    index_content = data_content.indexOf(keyword);
                    if( index_title < 0 && index_content < 0 ){
                        isMatch = false;
                    } else {
                        if (index_content < 0) {
                            index_content = 0;
                        }
                        if (i == 0) {
                            first_occur = index_content;
                        }
                    }
                });
            }
            // show search results
            if (isMatch) {
                str += "<li><a href='"+ data_url +"' class='search-result-title'>"+ data_title +"</a>";
                var content = data.content.trim().replace(/<[^>]+>/g,"");
                if (first_occur >= 0) {
                    // cut out 100 characters
                    var start = first_occur - 30;
                    var outLength = 78;
                    if(start < 0){
                        start = 0;
                    }
                    if (start + outLength > content.length){
                        if(content.length < outLength){
                            outLength = content.length - start;
                        }else{
                            start = content.length - outLength;
                        }
                    }
                    var match_content = content.substr(start, outLength);
                    // highlight all keywords
                    keywords.forEach(function(keyword){
                        var regS = new RegExp(keyword, "gi");
                        match_content = match_content.replace(regS, "<em class=\"search-keyword\">"+keyword+"</em>");
                    });

                    str += "<p class=\"search-result\">" + match_content +"...</p>"
                }
                str += "</li>";
            }
        });
        str += "</ul>";
        $resultContent.innerHTML = str;
    });
}
