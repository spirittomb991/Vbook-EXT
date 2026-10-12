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
        if (!doc) return Response.error("Không lấy được TOC HTML: " + url);

        // Most galleries are single-chapter; provide a single chapter pointing to the page
        var chapters = [
            {
                name: "Read",
                url: url,
                host: BASE_URL
            }
        ];

        return Response.success(chapters);
    } catch (err) {
        return Response.error("toc.js error: " + err);
    }
}
