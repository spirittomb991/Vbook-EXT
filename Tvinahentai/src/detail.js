load('config.js');

function _normalizeUrl(u) {
    if (!u) return BASE_URL + "/";
    u = ("" + u).trim();
    if (u.indexOf("http") === 0) {
        var second = u.indexOf("http", 5);
        if (second !== -1) u = u.substring(second);
        return u;
    }
    if (u.indexOf("//") === 0) return "https:" + u;
    if (u.indexOf("/") === 0) return BASE_URL + u;
    return BASE_URL + "/" + u;
}

function safeText(sel) {
    return sel && sel.text ? sel.text().trim() : "";
}

function execute(url) {
    try {
        url = _normalizeUrl(url);
        var doc = Http.get(url).html();
        if (!doc) return Response.error("Không lấy được detail HTML: " + url);

        var cover = doc.select("meta[property='og:image']").attr("content") || "";
        if (cover && cover.indexOf('//') === 0) cover = 'https:' + cover;

        var name = safeText(doc.select("h1.entry-title")) || safeText(doc.select("meta[property='og:title']").first());

        var author = safeText(doc.select("a[href*='/author/']")) || safeText(doc.select(".author a")) || "";

        var description = doc.select("meta[name='description']").attr("content") || safeText(doc.select(".entry-content p").first()) || "";

        var tagEls = doc.select(".tags a, .post-tags a, a[href*='/tag/']");
        var tags = [];
        if (tagEls && tagEls.size() > 0) tagEls.forEach(t => tags.push(safeText(t)));

        var chapters = [
            {
                name: "Read",
                url: url,
                host: BASE_URL
            }
        ];

        return Response.success({
            name: name || "",
            cover: cover || "",
            author: author || "",
            description: description || "",
            detail: (tags || []).join(", "),
            host: BASE_URL,
            ongoing: false,
            nsfw: true,
            chapters: chapters
        });
    } catch (err) {
        return Response.error("detail.js error: " + err);
    }
}
