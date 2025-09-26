load('config.js');
function execute(url, page) {
    if (!page) page = '1';
    let pageUrl = url;
    // Nếu là trang > 1 và url có dạng /read/?m_orderby=...
    if (/\/read\/?\?m_orderby=/.test(url) && page !== '1') {
        pageUrl = url.replace(/\/read\//, `/read/page/${page}/`);
    } else if (page !== '1') {
        // Các trường hợp khác, thêm &page= hoặc /page{n}
        if (url.includes('?')) {
            pageUrl = url + '&page=' + page;
        } else {
            pageUrl = url + '/page' + page;
        }
    }
    const doc = fetch(pageUrl).html();
    var next = doc.select(".wp-pagenavi").select("span.current + a").text();
    let el = doc.select("div.page-item-detail");
    if (el.size() === 0) {
        el = doc.select("div.c-tabs-item__content");
    }
    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        let img = e.select("a img").first().attr("data-src") || e.select("a img").first().attr("src");
        let name = e.select("h3 a").first().text();
        let link = e.select("a").first().attr("href");
        let desc = e.select(".chapter a").first().text();
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