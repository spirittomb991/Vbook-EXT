var BASE_URL = "https://lxmanga.org";
var HOST = "https://lxmanga.org";

try {
    if (CONFIG_URL && CONFIG_URL.trim() !== "") {
        BASE_URL = CONFIG_URL.replace(/\/$/, "");
        HOST = BASE_URL;
    }
} catch (e) {}

var USE_PROXY_COVER = false; // đổi true nếu máy Vbook không hiện ảnh .avif

function absUrl(url) {
    if (!url) return "";
    url = ("" + url).trim();
    if (url.indexOf("//") === 0) return "https:" + url;
    if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) return url;
    if (url.indexOf("/") === 0) return BASE_URL + url;
    return BASE_URL + "/" + url;
}

function cleanText(s) {
    if (s === null || s === undefined) return "";
    return ("" + s).replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function getDocByBrowser(url, waitMs) {
    var browser = null;
    try {
        browser = Engine.newBrowser();
        browser.setUserAgent(UserAgent.android());
        browser.launch(url, 10);
        browser.callJs("", waitMs || 2500);
        var doc = browser.html();
        browser.close();
        return doc;
    } catch (e) {
        try { if (browser) browser.close(); } catch (ex) {}
        Console.log("browser error: " + e);
        return null;
    }
}

function fetchDoc(url) {
    try {
        var res = fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36", "referer": BASE_URL + "/" } });
        if (res && res.ok) return res.html();
    } catch (e) { Console.log("fetch error: " + e); }
    return null;
}

function getDoc(url) {
    url = absUrl(url);
    // Browser trước vì fetch trên một số Android bị lỗi IPv6 Cloudflare.
    var doc = getDocByBrowser(url, 2500);
    if (doc && doc.select("body").size() > 0) return doc;
    // Retry chờ lâu hơn nếu lazy/render chưa kịp.
    doc = getDocByBrowser(url, 5000);
    if (doc && doc.select("body").size() > 0) return doc;
    // Fallback cuối.
    return fetchDoc(url);
}

function imgUrl(img) {
    if (!img) return "";
    // Thử nhiều attributes khác nhau cho lazy loading ảnh
    var attrs = ["data-src", "data-original", "data-lazy-src", "data-image", "data-images", "data-url", "src"];
    var result = "";
    
    for (var i = 0; i < attrs.length; i++) {
        var u = img.attr(attrs[i]);
        if (!u || u.trim().length === 0) continue;
        
        u = ("" + u).trim().replace(/&amp;/g, "&").replace(/\s+/g, "");
        if (!u || u.length === 0) continue;
        
        u = absUrl(u);
        if (!u || u.length === 0) continue;
        
        var low = u.toLowerCase();
        
        // Lọc các ảnh không mong muốn
        if (low.indexOf("noimage") >= 0 || low.indexOf("logo") >= 0 || low.indexOf("icon") >= 0 || 
            low.indexOf("avatar") >= 0 || low.indexOf("placeholder") >= 0 || low.indexOf("default") >= 0) continue;
        if (low.indexOf(".svg") >= 0) continue;
        
        // Kiểm tra định dạng ảnh hỗ trợ
        var isValidImage = low.indexOf(".jpg") >= 0 || low.indexOf(".jpeg") >= 0 || low.indexOf(".png") >= 0 || 
                          low.indexOf(".webp") >= 0 || low.indexOf(".avif") >= 0 || low.indexOf(".gif") >= 0 ||
                          low.indexOf(".bmp") >= 0 || low.indexOf(".tiff") >= 0;
        
        // Nếu không rõ định dạng, vẫn chấp nhận nếu có domain
        if (!isValidImage && (low.indexOf("http") < 0 && low.indexOf("lxmanga") < 0)) continue;
        
        if (isValidImage || u.indexOf(BASE_URL) >= 0 || u.indexOf("lxmanga") >= 0 || u.indexOf("http") >= 0) {
            result = u;
            // Xử lý AVIF proxy nếu cần
            if (USE_PROXY_COVER && low.indexOf(".avif") >= 0) {
                return "https://images.weserv.nl/?url=ssl:" + u.replace(/^https?:\/\//,"") + "&output=jpg";
            }
            // Xử lý protocol-relative URLs
            if (result.indexOf("//") === 0) {
                result = "https:" + result;
            }
            if (result) return result;
        }
    }
    return result;
}

function parseList(doc) {
    var data = [];
    var used = {};
    if (!doc) return data;

    // Try multiple selector patterns for flexibility
    var selectors = [
        "a.comic-tmb[href]",
        "a.comic-item[href]",
        ".comic-item a[href]",
        ".story-item a[href]",
        ".book-item a[href]",
        ".comic-box a[href]",
        ".manga-item a[href]",
        "a[href*='.html'][href*='/'][href]:not([href*='/chap-']):not([href*='/page/'])"
    ];
    
    var links = null;
    for (var s = 0; s < selectors.length; s++) {
        links = doc.select(selectors[s]);
        if (links && links.size() > 0) {
            Console.log("Found " + links.size() + " links using selector: " + selectors[s]);
            break;
        }
    }
    
    if (!links || links.size() === 0) {
        Console.log("No comic links found with any selector");
        return data;
    }

    for (var i = 0; i < links.size(); i++) {
        var a = links.get(i);
        var href = absUrl(a.attr("href"));
        if (href.indexOf(BASE_URL) !== 0) continue;
        if (href.indexOf(".html") < 0) continue;
        if (href.indexOf("/chap-") >= 0) continue;
        if (href.indexOf("/page/") >= 0) continue;
        if (used[href]) continue;

        var title = cleanText(a.attr("title"));
        var img = a.select("img").first();
        var cover = "";
        
        if (img) {
            cover = imgUrl(img);
        }
        
        if (title === "" && img) title = cleanText(img.attr("alt"));
        if (title === "") title = cleanText(a.text());
        if (title === "") continue;

        used[href] = true;
        data.push({
            name: title,
            link: href,
            host: HOST,
            cover: cover,
            description: ""
        });
    }
    Console.log("list count: " + data.length);
    return data;
}

function findNext(doc, currentUrl) {
    if (!doc) return "";
    var next = doc.select("a.next.page-numbers[href], .pagination a[rel=next][href], ul.pagination a[rel=next][href]").first();
    if (next) return absUrl(next.attr("href"));

    var links = doc.select("a.page-numbers[href], ul.pagination a.page-link[href], .pagination a[href]");
    var cur = 0;
    var m = (currentUrl || "").match(/\/page\/(\d+)/i);
    if (m) cur = parseInt(m[1]);
    if (!cur) cur = 1;

    var best = "";
    var bestNum = 999999;
    for (var i = 0; i < links.size(); i++) {
        var a = links.get(i);
        var txt = cleanText(a.text());
        var n = parseInt(txt);
        var href = absUrl(a.attr("href"));
        if (!n || !href) continue;
        if (n === cur + 1) return href;
        if (n > cur && n < bestNum) { bestNum = n; best = href; }
    }
    return best;
}
