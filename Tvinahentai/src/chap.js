load('config.js');

function _normalizeUrl(u) {
    if (!u) return BASE_URL + "/";
    u = ("" + u).trim();
    if (u.indexOf("http") === 0) return u;
    if (u.indexOf("//") === 0) return "https:" + u;
    if (u.indexOf("/") === 0) return BASE_URL + u;
    return BASE_URL + "/" + u;
}

function execute(url) {
    try {
        url = _normalizeUrl(url);
        var doc = Http.get(url).html();
        if (!doc) return Response.error("Không lấy được trang đọc: " + url);

        var selectors = [
            "div.reading-content img",
            "div#content img",
            ".entry-content img",
            ".post-content img",
            ".gallery img",
            "img.wp-manga-chapter-img",
            "img"
        ];

        var images = [];
        for (var i = 0; i < selectors.length; i++) {
            var els = doc.select(selectors[i]);
            if (els && els.size() > 0) {
                els.forEach(e => {
                    var src = e.attr('data-src') || e.attr('data-original') || e.attr('src') || "";
                    if (!src) return;
                    src = src.trim();
                    if (src.indexOf('//') === 0) src = 'https:' + src;
                    if (src.indexOf('http') !== 0) {
                        // relative url
                        if (src.indexOf('/') === 0) src = BASE_URL + src;
                        else src = BASE_URL + '/' + src;
                    }
                    if (images.indexOf(src) === -1) images.push(src);
                });
                if (images.length > 0) break;
            }
        }

        // If no images found via selectors (site may render pages into JS), extract CDN image URLs from the raw HTML
        try {
            var raw = doc.toString();
            var re = /https:\/\/cdn\.vinahentai\.life\/[\w\-./]+\.(?:webp|jpg|jpeg|png)/g;
            var m;
            while ((m = re.exec(raw)) !== null) {
                var u = m[0];
                if (images.indexOf(u) === -1) images.push(u);
            }
        } catch (e) {
            // ignore
        }

        return Response.success(images);
    } catch (err) {
        return Response.error("chap.js error: " + err);
    }
}
