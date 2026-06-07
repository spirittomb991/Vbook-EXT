var BASE_URL = "https://nhentai.online";

function getDoc(url) {
    return Http.get(url)
        .userAgent("Mozilla/5.0")
        .referrer(BASE_URL + "/")
        .timeout(20000)
        .html();
}

function text(e) {
    return e ? e.text().replace(/\s+/g, " ").trim() : "";
}

function attr(e, k) {
    return e ? (e.attr(k) || "") : "";
}

function abs(url) {
    if (!url) return "";
    url = url.trim();
    if (url.indexOf("//") === 0) return "https:" + url;
    if (url.indexOf("http") === 0) return url;
    if (url.indexOf("/") === 0) return BASE_URL + url;
    return BASE_URL + "/" + url;
}

function cleanTitle(s) {
    return (s || "")
        .replace(/^New\s+/i, "")
        .replace(/\s+/g, " ")
        .trim();
}

function isStoryUrl(url) {
    if (!url || url.indexOf(BASE_URL) !== 0) return false;
    if (url.indexOf("/galery") >= 0) return false;
    if (url.indexOf("/tag/") >= 0) return false;
    if (url.indexOf("/category/") >= 0) return false;
    if (url.indexOf("/artist/") >= 0) return false;
    if (url.indexOf("/group/") >= 0) return false;
    if (url.indexOf("/language/") >= 0) return false;
    if (url.indexOf("/page/") >= 0) return false;
    if (url.indexOf("/login") >= 0 || url.indexOf("/register") >= 0) return false;
    return /https:\/\/nhentai\.online\/[^\/]+\/?$/.test(url);
}

function getImageFromBox(box) {
    if (!box) return "";
    var img = box.select("img").first();
    if (!img) return "";
    return abs(attr(img, "data-src") || attr(img, "data-lazy-src") || attr(img, "src"));
}

function parseList(doc) {
    var out = [];
    var used = {};
    var links = doc.select("a[href]");

    for (var i = 0; i < links.size(); i++) {
        var a = links.get(i);
        var href = abs(attr(a, "href")).replace(/#.*$/, "");
        if (!isStoryUrl(href) || used[href]) continue;

        var name = cleanTitle(attr(a, "title") || text(a));
        if (!name || name.length < 8) continue;

        var box = a.parent();
        var cover = getImageFromBox(a);
        for (var j = 0; j < 5 && !cover && box; j++) {
            cover = getImageFromBox(box);
            box = box.parent();
        }

        out.push({
            name: name,
            link: href,
            cover: cover,
            host: BASE_URL
        });

        used[href] = true;
    }

    return out;
}

function parsePages(bodyText) {
    var m = bodyText.match(/Pages\s*:?\s*(\d+)/i);
    return m ? parseInt(m[1]) : 0;
}

function parseGalleryId(doc) {
    var links = doc.select("a[href*='galery']");
    for (var i = 0; i < links.size(); i++) {
        var href = attr(links.get(i), "href");
        var m = href.match(/[?&]id=(\d+)/);
        if (m) return m[1];
    }
    return "";
}