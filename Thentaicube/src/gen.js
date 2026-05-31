load('config.js');
function execute(url, page) {
    if (!page) page = '1';
    var pageUrl = url;
    // Nếu là trang > 1 và url có dạng /read/?m_orderby=...
    if (/\/read\/?\?m_orderby=/.test(url) && page !== '1') {
        pageUrl = url.replace(/\/read\//, '/read/page/' + page + '/');
    } else if (page !== '1') {
        if (url.indexOf('?') !== -1) {
            pageUrl = url + '&page=' + page;
        } else {
            pageUrl = url + '/page' + page;
        }
    }
    var doc = fetch(pageUrl).html();
    var next = doc.select(".wp-pagenavi").select("span.current + a").text();
    var el = doc.select("div.page-item-detail");
    if (el.size() === 0) {
        el = doc.select("div.c-tabs-item__content");
    }
    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var img = e.select("a img").first().attr("data-src") || e.select("a img").first().attr("src");
        var name = e.select("h3 a").first().text();
        var link = e.select("a").first().attr("href");
        var desc = e.select(".chapter a").first().text();
        if (!desc) {
            desc = e.select(".tab-meta .chapter a").first().text();
        }
        data.push({
            name: name,
            link: link,
            cover: img,
            description: desc,
            host: BASE_URL
        });
    }
    return Response.success(data, next);
}