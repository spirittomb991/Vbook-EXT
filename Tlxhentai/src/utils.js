load("config.js");

function trimText(s) {
    if (!s) return "";
    return ("" + s).replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
}

function getText(e) {
    if (!e) return "";
    try { return trimText(e.text()); } catch (err) { return ""; }
}

function getAttr(e, name) {
    if (!e) return "";
    try { return trimText(e.attr(name)); } catch (err) { return ""; }
}

function absUrl(url) {
    url = trimText(url);
    if (url === "") return "";
    if (url.indexOf("//") === 0) return "https:" + url;
    if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) return url;
    if (url.charAt(0) === "/") return BASE_URL + url;
    return BASE_URL + "/" + url;
}

function removeEndSlash(url) {
    url = trimText(url);
    while (url.length > 1 && url.charAt(url.length - 1) === "/") url = url.substring(0, url.length - 1);
    return url;
}

function cleanTitle(t) {
    t = trimText(t);
    t = t.replace(/^New\s+/i, "");
    return trimText(t);
}

function bestFromSrcset(srcset) {
    srcset = trimText(srcset);
    if (srcset === "") return "";
    var parts = srcset.split(",");
    var best = "";
    var bestW = -1;
    for (var i = 0; i < parts.length; i++) {
        var p = trimText(parts[i]);
        if (p === "") continue;
        var seg = p.split(/\s+/);
        var u = seg[0];
        var w = 0;
        if (seg.length > 1) {
            var m = seg[1].match(/(\d+)w/);
            if (m) w = parseInt(m[1]);
        }
        if (w >= bestW) {
            bestW = w;
            best = u;
        }
    }
    return best;
}

function unSizeWpImage(url) {
    url = trimText(url);
    if (url === "") return "";
    // WordPress thumbnail: abc-241x334.webp -> abc.webp
    return url.replace(/-\d+x\d+(\.(?:jpg|jpeg|png|webp|gif))(\?.*)?$/i, "$1$2");
}

function imageFrom(img) {
    var u = bestFromSrcset(getAttr(img, "srcset"));
    if (u === "") u = getAttr(img, "data-src");
    if (u === "") u = getAttr(img, "data-lazy-src");
    if (u === "") u = getAttr(img, "src");
    return absUrl(unSizeWpImage(u));
}

function getDoc(url) {
    return Http.get(url)
        .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36")
        .header("Referer", BASE_URL + "/")
        .html();
}

function uniquePush(arr, used, url) {
    url = trimText(url);
    if (url === "" || used[url]) return;
    used[url] = true;
    arr.push(url);
}
