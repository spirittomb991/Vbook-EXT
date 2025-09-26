load('config.js');

function _normalizeUrl(u) {
    if (!u) return BASE_URL + "/";
    u = ("" + u).trim();

    // nếu có nhiều "https://" do ghép sai -> lấy từ lần xuất hiện cuối cùng
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
    if (!page) page = '1';

    try {
        url = _normalizeUrl(url);

        var doc = Http.get(url).params({ "page": page }).html();
        if (!doc) return Response.error("Không load được HTML: " + url);

        // lấy next page number (text "2"...) hoặc href fallback
        var next = doc.select(".pagination a.current + a").text();
        if (!next) {
            var nextHref = doc.select(".pagination a.current + a").attr("href");
            if (!nextHref) {
                nextHref = doc.select(".pagination a[rel=next]").attr("href");
            }
            if (nextHref) {
                // lấy page param từ href nếu có ?page=...
                var m = nextHref.match(/page=(\d+)/);
                if (m) next = m[1];
            }
        }

        var el = doc.select(".gallery"); // chọn trực tiếp gallery nodes

        var data = [];
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);

            // cover: nhiều site dùng data-src hoặc src
            var img = e.select("a.cover img").first();
            var cover = "";
            if (img) {
                cover = img.attr("data-src") || img.attr("src") || "";
                if (cover && cover.indexOf("//") === 0) cover = "https:" + cover;
            }

            // name
            var name = safeText(e.select(".caption").first());

            // link: muốn trả path (ví dụ "/g/123456/") để detail.js xử lý đều được
            var href = e.select("a").first().attr("href") || "";
            // nếu là absolute -> convert thành path
            if (href.indexOf("http") === 0) {
                try {
                    var tmp = href.replace(BASE_URL, "");
                    if (!tmp.startsWith("/")) tmp = "/" + tmp;
                    href = tmp;
                } catch (e) {}
            }

            // pages từ title của ảnh (nếu có): "Title (123 pages)"
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
        }

        return Response.success(data, next || '');
    } catch (err) {
        return Response.error("gen.js error: " + err);
    }
}
