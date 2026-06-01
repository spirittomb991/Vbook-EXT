var BASE_URL = "https://lxmanga.org";
var HOST = "https://lxmanga.org";

function trimText(text) {
    if (text === null || text === undefined) return "";
    return ("" + text).replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
}

function cleanText(text) {
    return trimText((text || "").replace(/&nbsp;/g, " ").replace(/\u00a0/g, " "));
}

function htmlDecode(text) {
    if (!text) return "";
    text = "" + text;
    return text.replace(/&amp;/g, "&")
        .replace(/&#038;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#8217;/g, "'")
        .replace(/&#8211;/g, "-")
        .replace(/\\\//g, "/");
}

function safeDecodeUrl(url) {
    if (!url) return "";
    try { return decodeURI(url); } catch (e) { return url; }
}

function safeEncodeUrl(url) {
    if (!url) return "";
    try {
        var decoded = safeDecodeUrl(htmlDecode(url));
        return encodeURI(decoded).replace(/%25([0-9A-Fa-f]{2})/g, "%$1");
    } catch (e) {
        return url;
    }
}

function toAbsoluteUrl(url) {
    if (!url) return "";
    url = trimText(htmlDecode(url));
    if (url.indexOf("//") === 0) return safeEncodeUrl("https:" + url);
    if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) return safeEncodeUrl(url);
    if (url.indexOf("/") === 0) return safeEncodeUrl(BASE_URL + url);
    return safeEncodeUrl(BASE_URL + "/" + url);
}

function removeEndSlash(url) {
    if (!url) return "";
    while (url.length > 1 && url.lastIndexOf("/") === url.length - 1) url = url.substring(0, url.length - 1);
    return url;
}

function normalizeCompareUrl(url) {
    return removeEndSlash(safeDecodeUrl(toAbsoluteUrl(url))).toLowerCase();
}

function getDoc(url) {
    try {
        var u = safeEncodeUrl(url);
        var res = fetch(u, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Referer": BASE_URL + "/"
            }
        });
        if (!res || !res.ok) return null;
        return res.html();
    } catch (e) {
        try { Console.log("getDoc error: " + e); } catch (e2) {}
        return null;
    }
}

function getAttr(el, attr) {
    try {
        if (!el) return "";
        var v = el.attr(attr);
        if (v === null || v === undefined) return "";
        return trimText(v);
    } catch (e) { return ""; }
}

function getText(el) {
    try {
        if (!el) return "";
        return cleanText(el.text());
    } catch (e) { return ""; }
}

function isBadTitle(title) {
    title = cleanText(title).toLowerCase();
    if (title === "") return true;
    var bad = ["đăng nhập", "đăng ký", "đăng truyện", "manage", "trang dịch giả", "tài khoản", "login", "register", "account", "dashboard", "profile", "report", "báo lỗi", "yêu thích", "thêm vào", "xem", "tất cả truyện"];
    for (var i = 0; i < bad.length; i++) if (title === bad[i]) return true;
    return false;
}

function isBadLink(url, text) {
    var u = normalizeCompareUrl(url);
    var t = cleanText(text).toLowerCase();
    if (!u) return true;
    if (u.indexOf("javascript:") === 0 || u.indexOf("#") >= 0) return true;
    if (u.indexOf(BASE_URL) !== 0) return true;
    var bad = ["/login", "/register", "/account", "/tai-khoan", "/dang-nhap", "/dang-ky", "/manage", "/dashboard", "/profile", "/user", "/admin", "/upload", "/dang-truyen", "/report", "/translator"];
    for (var i = 0; i < bad.length; i++) if (u.indexOf(bad[i]) >= 0) return true;
    if (isBadTitle(t)) return true;
    return false;
}

function uniquePush(list, item, key) {
    try {
        var k = key || item.link || item.url || item.input || item.title || item.name;
        for (var i = 0; i < list.length; i++) {
            var x = list[i].link || list[i].url || list[i].input || list[i].title || list[i].name;
            if (x === k) return;
        }
        list.push(item);
    } catch (e) { list.push(item); }
}

function firstSrcFromSrcset(srcset) {
    try {
        if (!srcset) return "";
        var parts = srcset.split(",");
        for (var i = 0; i < parts.length; i++) {
            var one = trimText(parts[i]).split(" ")[0];
            if (one !== "") return one;
        }
    } catch (e) {}
    return "";
}

function decodeNextImage(url) {
    if (!url) return "";
    try {
        if (url.indexOf("/_next/image") >= 0 && url.indexOf("url=") >= 0) {
            var part = url.split("url=")[1];
            if (part.indexOf("&") >= 0) part = part.split("&")[0];
            return safeEncodeUrl(decodeURIComponent(part));
        }
    } catch (e) {}
    return safeEncodeUrl(url);
}

function cleanImageUrl(src) {
    try {
        if (!src) return "";
        src = trimText(htmlDecode(src));
        if (src.indexOf("//") === 0) src = "https:" + src;
        if (src.indexOf("http://") !== 0 && src.indexOf("https://") !== 0) src = toAbsoluteUrl(src);
        return decodeNextImage(src);
    } catch (e) { return src; }
}

function isGoodImage(url) {
    if (!url) return false;
    var u = ("" + url).toLowerCase();
    if (u.indexOf("data:image") === 0) return false;
    if (u.indexOf(".svg") >= 0) return false;
    var bad = ["noimage", "no-image", "space3-4", "imgmask", "placeholder", "loading", "logo", "avatar", "icon", "banner", "ads", "advert", "favicon"];
    for (var i = 0; i < bad.length; i++) if (u.indexOf(bad[i]) >= 0) return false;
    return u.indexOf(".jpg") >= 0 || u.indexOf(".jpeg") >= 0 || u.indexOf(".png") >= 0 || u.indexOf(".webp") >= 0 || u.indexOf(".avif") >= 0;
}

function pickImageAttr(img) {
    try {
        if (!img) return "";
        // LXMANGA list: src=noimage.jpg, ảnh thật ở data-src. Vì vậy data-src phải đứng trước src.
        var attrs = ["data-src", "data-original", "data-lazy-src", "data-url", "data-full", "data-image", "data-cfsrc", "srcset", "src"];
        for (var i = 0; i < attrs.length; i++) {
            var v = "";
            if (attrs[i] === "srcset") v = firstSrcFromSrcset(getAttr(img, attrs[i]));
            else v = getAttr(img, attrs[i]);
            v = cleanImageUrl(v);
            if (isGoodImage(v)) return v;
        }
    } catch (e) {}
    return "";
}

function extractUrlFromStyle(style) {
    try {
        var m = /url\(['"]?([^'")]+)['"]?\)/i.exec(style || "");
        if (m && m.length > 1) return cleanImageUrl(m[1]);
    } catch (e) {}
    return "";
}

function getCoverFromRoot(root) {
    try {
        if (!root) return "";
        var sels = [
            "a.comic-tmb img.card-img-top",
            ".image-container img.card-img-top",
            "img.card-img-top",
            "img.img-thumbnail",
            ".image-container img",
            "a.comic-tmb img"
        ];
        for (var s = 0; s < sels.length; s++) {
            var imgs = root.select(sels[s]);
            for (var i = 0; i < imgs.size(); i++) {
                var src = pickImageAttr(imgs.get(i));
                if (src !== "") return src;
            }
        }
        var styled = root.select("[style]");
        for (var j = 0; j < styled.size(); j++) {
            var bg = extractUrlFromStyle(getAttr(styled.get(j), "style"));
            if (isGoodImage(bg)) return bg;
        }
    } catch (e) {}
    return "";
}

function getHtml(doc) {
    try { if (doc && doc.html) return "" + doc.html(); } catch (e) {}
    try { return "" + doc; } catch (e2) {}
    return "";
}

function buildDescription(card) {
    var parts = [];
    try {
        var chap = getText(card.select(".label-code").size() > 0 ? card.select(".label-code").get(0) : null);
        if (chap !== "") parts.push(chap);
        var views = getText(card.select(".comic-views").size() > 0 ? card.select(".comic-views").get(0) : null);
        if (views !== "") parts.push(views);
        var time = getText(card.select(".comic-addtime").size() > 0 ? card.select(".comic-addtime").get(0) : null);
        if (time !== "") parts.push(time);
        var channel = getText(card.select(".channel-name").size() > 0 ? card.select(".channel-name").get(0) : null);
        if (channel !== "") parts.push(channel);
    } catch (e) {}
    return parts.join(" - ");
}

function parseComicList(doc) {
    var out = [];
    var used = {};
    try {
        // Đúng HTML list/search: mỗi truyện là .col.pb-3 chứa a.comic-tmb và a.comic-link.
        var cards = doc.select(".col.pb-3, li.splide__slide, .card.border-0.shadow-sm");
        for (var i = 0; i < cards.size(); i++) {
            var card = cards.get(i);
            var a = null;
            var links = card.select("a.comic-link[href]");
            if (links.size() > 0) a = links.get(0);
            if (!a) {
                links = card.select("a.comic-tmb[href]");
                if (links.size() > 0) a = links.get(0);
            }
            if (!a) continue;

            var href = toAbsoluteUrl(getAttr(a, "href"));
            var title = getAttr(a, "title");
            if (title === "") title = getText(a);
            if (title === "") title = getText(card.select("a.comic-link").size() > 0 ? card.select("a.comic-link").get(0) : null);
            if (isBadLink(href, title)) continue;
            if (href.indexOf(".html") < 0) continue;
            if (used[href]) continue;

            var cover = getCoverFromRoot(card);
            var desc = buildDescription(card);
            used[href] = true;
            out.push({
                name: cleanText(title),
                link: href,
                host: HOST,
                cover: cover,
                description: desc
            });
        }
    } catch (e) { try { Console.log("parseComicList error: " + e); } catch (e2) {} }
    return out;
}

function findNextPage(doc) {
    try {
        var active = doc.select("ul.pagination li.active a.page-link");
        if (active.size() > 0) {
            var page = parseInt(getAttr(active.get(0), "data-page"), 10);
            if (!isNaN(page)) {
                var links = doc.select("ul.pagination a.page-link[href]");
                for (var i = 0; i < links.size(); i++) {
                    var dp = parseInt(getAttr(links.get(i), "data-page"), 10);
                    if (!isNaN(dp) && dp === page + 1) return toAbsoluteUrl(getAttr(links.get(i), "href"));
                }
            }
        }
        var all = doc.select("ul.pagination a.page-link[href]");
        for (var j = 0; j < all.size(); j++) {
            var t = cleanText(getText(all.get(j)));
            if (t === "2" || getAttr(all.get(j), "data-page") === "2") return toAbsoluteUrl(getAttr(all.get(j), "href"));
        }
    } catch (e) {}
    return null;
}

function makeImageItem(url) {
    return {
        link: url,
        fallback: url
    };
}
