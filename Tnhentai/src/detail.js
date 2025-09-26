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

function safeText(sel) { return sel && sel.text ? sel.text().trim() : ""; }

function execute(url) {
    try {
        url = _normalizeUrl(url);
        var doc = Http.get(url).html();
        if (!doc) return Response.error("Không lấy được detail HTML: " + url);

        // cover
        var img = doc.select("#cover img").first();
        var cover = "";
        if (img) {
            cover = img.attr("data-src") || img.attr("src") || "";
            if (cover && cover.indexOf("//") === 0) cover = "https:" + cover;
        }

        var name = safeText(doc.select(".title .pretty")) || safeText(doc.select("h1"));
        var author = safeText(doc.select("a[href^='/artist/'] .name")) || safeText(doc.select("a[href^='/artist/']"));
        if (!author) author = "";

        var description = safeText(doc.select("h2"));

        // get gallery id from url (/g/123456/)
        var m = url.match(/\/g\/(\d+)\/?/);
        var gid = m ? m[1] : "";

        var detailText = safeText(doc.select(".tag-container"));

        // Chapter list: single chapter that points to gallery path
        var chapterUrl = "/g/" + gid + "/";
        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            detail: detailText,
            host: BASE_URL,
            ongoing: false,
            nsfw: true,
            chapters: [
                {
                    name: "Read",
                    url: chapterUrl,
                    host: BASE_URL
                }
            ]
        });
    } catch (err) {
        return Response.error("detail.js error: " + err);
    }
}
