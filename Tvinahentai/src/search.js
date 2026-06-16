load('config.js');

function _normalizeUrl(u) {
    if (!u) return BASE_URL + "/";
    u = ("" + u).trim();
    if (u.indexOf("http") === 0) return u;
    if (u.indexOf("//") === 0) return "https:" + u;
    if (u.indexOf("/") === 0) return BASE_URL + u;
    return BASE_URL + "/" + u;
}

function safeText(sel) {
    return sel && sel.text ? sel.text().trim() : "";
}

function execute(key, page) {
    try {
        var q = encodeURIComponent(key || "");
        var searchUrl = BASE_URL + "/search?q=" + q;
        if (page && page > 1) searchUrl += "&paged=" + page;

        var doc = Http.get(searchUrl).html();
        if (!doc) return Response.error("Không lấy được trang tìm kiếm: " + searchUrl);

        var items = [];
        var posts = doc.select("article, .post, .search-result, .item-loop");
        if (posts && posts.size() > 0) {
            posts.forEach(p => {
                try {
                    var a = p.select("a").first();
                    var url = a ? a.attr('href') : null;
                    var title = safeText(p.select("h2, h3, .entry-title, .title").first()) || safeText(a);
                    var img = p.select("img").first();
                    var cover = img ? (img.attr('data-src') || img.attr('src') || '') : '';
                    if (cover && cover.indexOf('//') === 0) cover = 'https:' + cover;
                    if (url) items.push({name: title || '', url: url, cover: cover, host: BASE_URL});
                } catch (e) {}
            });
        }

        return Response.success({results: items, hasMore: false});
    } catch (err) {
        return Response.error("search.js error: " + err);
    }
}
