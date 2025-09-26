load('config.js');

function _normalizeUrl(u) {
    if (!u) return BASE_URL + "/";
    u = ("" + u).trim();
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

function execute(key, page) {
    if (!page) page = '1';
    try {
        var url = _normalizeUrl("/search");
        var doc = Http.get(url).params({ "q": key, "page": page }).html();
        if (!doc) return Response.error("Không load được search HTML");

        var next = doc.select(".pagination a.current + a").text();
        if (!next) {
            var nhref = doc.select(".pagination a.current + a").attr("href");
            if (nhref) {
                var m = nhref.match(/page=(\d+)/);
                if (m) next = m[1];
            }
        }

        var el = doc.select(".gallery");
        var data = [];
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);

            var img = e.select("a.cover img").first();
            var cover = "";
            if (img) {
                cover = img.attr("data-src") || img.attr("src") || "";
                if (cover && cover.indexOf("//") === 0) cover = "https:" + cover;
            }

            var href = e.select("a").first().attr("href") || "";
            if (href.indexOf("http") === 0) {
                try { href = href.replace(BASE_URL, ""); if (!href.startsWith("/")) href = "/" + href; } catch(e){}
            }

            data.push({
                name: safeText(e.select(".caption").first()),
                link: href,
                cover: cover,
                description: "",
                host: BASE_URL
            });
        }

        return Response.success(data, next || '');
    } catch (err) {
        return Response.error("search.js error: " + err);
    }
}
