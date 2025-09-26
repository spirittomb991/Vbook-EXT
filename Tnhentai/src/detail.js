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

        // Cover
        var img = doc.select("#cover img").first();
        var cover = "";
        if (img) {
            cover = img.attr("data-src") || img.attr("src") || "";
            if (cover && cover.startsWith("//")) cover = "https:" + cover;
        }

        // Name
        var name = safeText(doc.select(".title .pretty")) || safeText(doc.select("h1"));

        // Author / Artist
        var author = safeText(doc.select("a[href^='/artist/'] .name")) || safeText(doc.select("a[href^='/artist/']"));
        if (!author) author = "";

        // Description
        var description = safeText(doc.select("h2")) || "";

        // Gallery ID
        var gidMatch = url.match(/\/g\/(\d+)\/?/);
        var gid = gidMatch ? gidMatch[1] : "";

        // Tags / detail
        var detailText = [];
        var tags = doc.select(".tag-container a.tag");
        if (tags && tags.size() > 0) {
            tags.forEach(t => detailText.push(safeText(t)));
        }
        detailText = detailText.join(", ");

        // Chapter list (single)
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
