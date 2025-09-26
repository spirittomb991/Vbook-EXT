load('config.js');

function _normalizeUrl(u) {
    if (!u) return BASE_URL + "/";
    u = ("" + u).trim();

    // Nếu có nhiều "http" do ghép sai -> lấy từ lần xuất hiện cuối cùng
    var idx = u.indexOf("http");
    if (idx !== -1) {
        var second = u.indexOf("http", idx + 1);
        if (second !== -1) u = u.substring(second);
    }

    if (u.indexOf("http") === 0) return u;
    if (u.indexOf("//") === 0) return "https:" + u;
    if (u.indexOf("/") === 0) return BASE_URL + u;
    return BASE_URL + "/" + u;
}

function safeText(sel) {
    return sel && sel.text ? sel.text().trim() : "";
}

function execute(url, page) {
    page = page || '1';
    try {
        url = _normalizeUrl(url);

        var doc = Http.get(url).params({ "page": page }).html();
        if (!doc) return Response.error("Không load được HTML: " + url);

        // Lấy next page number từ pagination
        var next = "";
        var nextSel = doc.select(".pagination a.current + a");
        if (nextSel && nextSel.size() > 0) next = nextSel.text();
        if (!next) {
            var nextHref = doc.select(".pagination a[rel=next]").attr("href");
            if (nextHref) {
                var m = nextHref.match(/page=(\d+)/);
                if (m) next = m[1];
            }
        }

        // Lấy gallery nodes
        var el = doc.select(".gallery");
        var data = [];

        el.forEach(e => {
            var img = e.select("a.cover img").first();
            var cover = "";
            if (img) {
                cover = img.attr("data-src") || img.attr("src") || "";
                if (cover && cover.startsWith("//")) cover = "https:" + cover;
            }

            // Name
            var name = safeText(e.select(".caption").first()) || "";

            // Link
            var href = e.select("a").first().attr("href") || "";
            if (href.startsWith(BASE_URL)) href = href.replace(BASE_URL, "");
            if (!href.startsWith("/")) href = "/" + href;

            // Pages từ title attribute
            var pages = "";
            if (img) {
                var titleAttr = img.attr("title") || "";
                var mm = titleAttr.match(/\((\d+)\s+pages?\)/i);
                if (mm) pages = mm[1] + " pages";
            }

            data.push({
                name: name || href,
                link: href,
                cover: cover,
                description: pages,
                host: BASE_URL
            });
        });

        return Response.success(data, next || '');
    } catch (err) {
        return Response.error("gen.js error: " + err);
    }
}
