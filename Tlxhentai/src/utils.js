var BASE_URL = "https://lxmanga.org";
var HOST = "https://lxmanga.org";

function trimText(text) {
    if (text === null || text === undefined) return "";
    return ("" + text).replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
}

function cleanText(text) {
    return trimText((text || "").replace(/&nbsp;/g, " ").replace(/\u00a0/g, " "));
}

function safeDecodeUrl(url) {
    if (!url) return "";
    try { return decodeURI(url); } catch (e) { return url; }
}

function safeEncodeUrl(url) {
    if (!url) return "";
    try {
        var decoded = safeDecodeUrl(url);
        return encodeURI(decoded).replace(/%25([0-9A-Fa-f]{2})/g, "%$1");
    } catch (e) {
        return url;
    }
}

function toAbsoluteUrl(url) {
    if (!url) return "";
    url = trimText(url);
    if (url.indexOf("//") === 0) return "https:" + url;
    if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) return safeEncodeUrl(url);
    if (url.indexOf("/") === 0) return safeEncodeUrl(BASE_URL + url);
    return safeEncodeUrl(BASE_URL + "/" + url);
}

function normalizeCompareUrl(url) {
    return removeEndSlash(safeDecodeUrl(toAbsoluteUrl(url))).toLowerCase();
}

function removeEndSlash(url) {
    if (!url) return "";
    while (url.length > 1 && url.lastIndexOf("/") === url.length - 1) url = url.substring(0, url.length - 1);
    return url;
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
        try { Console.log("getDoc error: " + e); } catch (ex) {}
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
    var bad = ["đăng nhập", "đăng ký", "đăng truyện", "manage", "trang dịch giả", "tài khoản", "login", "register", "account", "dashboard", "profile", "report", "báo lỗi", "yêu thích", "thêm vào", "xem"];
    for (var i = 0; i < bad.length; i++) if (title === bad[i]) return true;
    return false;
}

function isBadLink(url, text) {
    url = normalizeCompareUrl(url);
    text = cleanText(text).toLowerCase();
    if (!url || url.indexOf(BASE_URL) !== 0) return true;
    var bad = ["/login", "/register", "/account", "/tai-khoan", "/dang-nhap", "/dang-ky", "/manage", "/dashboard", "/profile", "/user", "/admin", "/upload", "/dang-truyen", "/report", "/translator", "/tag/", "/artist/", "/country/", "/doujinshi/", "#", "javascript:"];
    for (var i = 0; i < bad.length; i++) if (url.indexOf(bad[i]) >= 0) return true;
    if (isBadTitle(text)) return true;
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

function extractUrlFromStyle(style) {
    try {
        if (!style) return "";
        var m = /url\(['"]?([^'")]+)['"]?\)/i.exec(style);
        if (m && m.length > 1) return m[1];
    } catch (e) {}
    return "";
}

function firstSrcFromSrcset(srcset) {
    try {
        if (!srcset) return "";
        var parts = srcset.split(",");
        for (var i = 0; i < parts.length; i++) {
            var one = trimText(parts[i]).split(" ")[0];
            if (one) return one;
        }
    } catch (e) {}
    return "";
}

function pickImageAttr(img) {
    try {
        if (!img) return "";
        // LXMANGA dùng src=noimage.jpg và ảnh thật nằm ở data-src.
        // Vì vậy tuyệt đối ưu tiên data-src trước src.
        var attrs = ["data-src", "data-original", "data-lazy-src", "data-url", "data-full", "data-image", "data-bg", "data-cfsrc", "srcset", "src"];
        for (var i = 0; i < attrs.length; i++) {
            var val = "";
            if (attrs[i] === "srcset") val = firstSrcFromSrcset(getAttr(img, attrs[i]));
            else val = getAttr(img, attrs[i]);
            val = cleanImageUrlForAny(val);
            if (isGoodImage(val)) return val;
        }
    } catch (e) {}
    return "";
}

function getImageFromElement(root) {
    try {
        if (!root) return "";

        // 1) Đúng HTML list LXMANGA: a.comic-tmb > .image-container > img.card-img-top
        // src có thể là noimage.jpg, data-src mới là cover thật.
        var coverImgs = root.select("a.comic-tmb img.card-img-top");
        for (var c = 0; c < coverImgs.size(); c++) {
            var cover = pickImageAttr(coverImgs.get(c));
            if (cover !== "") return cover;
        }

        // 2) Fallback cho search/home/genre carousel.
        var priorityImgs = root.select(".image-container img.card-img-top, img.card-img-top, a.comic-tmb img, .image-container img, img.img-thumbnail");
        for (var p = 0; p < priorityImgs.size(); p++) {
            var src = pickImageAttr(priorityImgs.get(p));
            if (src !== "") return src;
        }

        // 3) Fallback toàn bộ ảnh nhưng vẫn lọc noimage/imgmask/svg.
        var imgs = root.select("img");
        for (var i = 0; i < imgs.size(); i++) {
            var src2 = pickImageAttr(imgs.get(i));
            if (src2 !== "") return src2;
        }

        // 4) Background chỉ dùng cuối cùng.
        var styled = root.select("[style]");
        for (var s = 0; s < styled.size(); s++) {
            var bg = cleanImageUrlForAny(extractUrlFromStyle(getAttr(styled.get(s), "style")));
            if (isGoodImage(bg)) return bg;
        }
    } catch (e) {}
    return "";
}

function isGoodImage(url) {
    if (!url) return false;
    var u = ("" + url).toLowerCase();
    if (u.indexOf("data:image") === 0) return false;
    if (u.indexOf(".svg") >= 0) return false;
    var bad = ["noimage", "no-image", "default", "logo", "avatar", "icon", "banner", "ads", "advert", "placeholder", "favicon", "space3-4", "loading"];
    for (var i = 0; i < bad.length; i++) if (u.indexOf(bad[i]) >= 0) return false;
    return (u.indexOf(".jpg") >= 0 || u.indexOf(".jpeg") >= 0 || u.indexOf(".png") >= 0 || u.indexOf(".webp") >= 0 || u.indexOf(".avif") >= 0);
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

function proxyCoverUrl(url) {
    try {
        // Trả ảnh gốc của website. Không đổi sang proxy vì Vbook có thể không load được proxy
        // và website dùng cover thật dạng .avif trong wp-content/uploads.
        url = cleanImageUrlForAny(url);
        if (!url) return "";
        return url;
    } catch (e) { return url; }
}

function cleanImageUrlForAny(src) {
    try {
        if (!src) return "";
        src = trimText(src);
        src = src.replace(/\\\//g, "/").replace(/&amp;/g, "&");
        if (src.indexOf("//") === 0) src = "https:" + src;
        if (src.indexOf("http://") !== 0 && src.indexOf("https://") !== 0) src = toAbsoluteUrl(src);
        src = decodeNextImage(src);
        return src;
    } catch (e) { return src; }
}

function parseComicList(doc) {
    var list = [];
    var used = {};
    try {
        var cards = doc.select(".col.pb-3, .col, li.splide__slide, .card");
        for (var i = 0; i < cards.size(); i++) {
            var card = cards.get(i);
            var a = null;
            var links = card.select("a.comic-link[href], a.comic-tmb[href]");
            if (links.size() > 0) a = links.get(0);
            if (!a) {
                links = card.select("a[href$=.html]");
                if (links.size() > 0) a = links.get(0);
            }
            if (!a) continue;
            var href = toAbsoluteUrl(getAttr(a, "href"));
            var title = getAttr(a, "title");
            if (title === "") title = getText(a);
            if (isBadLink(href, title)) continue;
            if (href.indexOf(".html") < 0 || href.indexOf("/chap-") >= 0) continue;
            if (used[href]) continue;
            used[href] = true;
            var cover = proxyCoverUrl(getImageFromElement(card));
            var desc = "";
            var chapEl = card.select(".label-code");
            var timeEl = card.select(".comic-addtime");
            var viewEl = card.select(".comic-views");
            if (chapEl.size() > 0) desc += cleanText(chapEl.get(0).text());
            if (timeEl.size() > 0) desc += (desc ? " - " : "") + cleanText(timeEl.get(0).text());
            if (viewEl.size() > 0) desc += (desc ? " - " : "") + cleanText(viewEl.get(0).text());
            uniquePush(list, { name: title, link: href, host: HOST, cover: cover, description: desc }, href);
        }
        if (list.length === 0) {
            var links2 = doc.select("a[href$=.html]");
            for (var j = 0; j < links2.size(); j++) {
                var a2 = links2.get(j);
                var href2 = toAbsoluteUrl(getAttr(a2, "href"));
                var title2 = getAttr(a2, "title");
                if (title2 === "") title2 = getText(a2);
                if (isBadLink(href2, title2) || href2.indexOf("/chap-") >= 0 || used[href2]) continue;
                used[href2] = true;
                uniquePush(list, { name: title2, link: href2, host: HOST, cover: "", description: "" }, href2);
            }
        }
    } catch (e) { try { Console.log("parseComicList error: " + e); } catch (ex) {} }
    return list;
}

function findNextPage(doc, currentUrl) {
    try {
        var active = doc.select("ul.pagination li.active a[data-page]");
        var cur = 0;
        if (active.size() > 0) cur = parseInt(getAttr(active.get(0), "data-page"));
        var links = doc.select("ul.pagination a.page-link[href]");
        var best = "";
        var bestPage = 999999;
        for (var i = 0; i < links.size(); i++) {
            var a = links.get(i);
            var p = parseInt(getAttr(a, "data-page"));
            var href = toAbsoluteUrl(getAttr(a, "href"));
            if (!p || !href) continue;
            if (cur > 0 && p === cur + 1) return href;
            if (cur === 0 && p > 1 && p < bestPage) { bestPage = p; best = href; }
        }
        return best;
    } catch (e) { return ""; }
}
