load("utils.js");

function getHtmlText(doc) {
    try {
        if (!doc) return "";
        if (doc.html) return "" + doc.html();
    } catch (e) {}
    try { return "" + doc; } catch (e2) {}
    return "";
}

function htmlDecodeBasic(s) {
    if (!s) return "";
    s = "" + s;
    s = s.replace(/&amp;/g, "&");
    s = s.replace(/&#038;/g, "&");
    s = s.replace(/&quot;/g, '"');
    s = s.replace(/&#039;/g, "'");
    s = s.replace(/&#8217;/g, "'");
    s = s.replace(/\\\//g, "/");
    return s;
}

function cleanChapImageUrl(src) {
    try {
        if (!src) return "";
        src = trimText(htmlDecodeBasic(src));
        if (src === "") return "";

        if (src.indexOf("//") === 0) src = "https:" + src;
        if (src.indexOf("/_next/image") === 0) src = BASE_URL + src;

        // Decode ảnh NextJS nếu gặp dạng /_next/image?url=https%3A%2F%2F...
        if (src.indexOf("/_next/image") >= 0 && src.indexOf("url=") >= 0) {
            try {
                var part = src.split("url=")[1];
                if (part.indexOf("&") >= 0) part = part.split("&")[0];
                src = decodeURIComponent(part);
            } catch (e) {}
        }

        if (src.indexOf("http://") !== 0 && src.indexOf("https://") !== 0) {
            src = toAbsoluteUrl(src);
        }

        return safeEncodeUrl(src);
    } catch (e2) {
        return src;
    }
}

function isChapImage(src) {
    try {
        if (!src) return false;
        var u = ("" + src).toLowerCase();
        if (u.indexOf("data:image") === 0) return false;
        if (u.indexOf(".svg") >= 0) return false;
        if (u.indexOf("noimage") >= 0) return false;
        if (u.indexOf("space3-4") >= 0) return false;
        if (u.indexOf("placeholder") >= 0) return false;
        if (u.indexOf("loading") >= 0) return false;
        if (u.indexOf("logo") >= 0) return false;
        if (u.indexOf("avatar") >= 0) return false;
        if (u.indexOf("banner") >= 0) return false;
        if (u.indexOf("ads") >= 0) return false;
        if (u.indexOf("advert") >= 0) return false;
        if (u.indexOf("favicon") >= 0) return false;

        return u.indexOf(".jpg") >= 0 ||
               u.indexOf(".jpeg") >= 0 ||
               u.indexOf(".png") >= 0 ||
               u.indexOf(".webp") >= 0 ||
               u.indexOf(".avif") >= 0;
    } catch (e) {}
    return false;
}

function pushChapImage(out, used, src) {
    try {
        src = cleanChapImageUrl(src);
        if (!isChapImage(src)) return;
        if (used[src]) return;
        used[src] = true;

        // Vbook comic dùng link/fallback. Thêm headers để CDN tymanga không chặn hotlink nếu bản Vbook hỗ trợ.
        out.push({
            link: src,
            fallback: src,
            headers: {
                "Referer": BASE_URL + "/",
                "User-Agent": "Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36"
            }
        });
    } catch (e) {}
}

function addFromImg(out, used, img) {
    try {
        // Chap LXMANGA đang để ảnh thật ngay ở src trong #viewer img.
        // Vẫn giữ data-src trước để hỗ trợ lazy-load nếu website đổi về sau.
        var attrs = ["data-src", "data-original", "data-lazy-src", "data-url", "data-full", "data-image", "src"];
        for (var i = 0; i < attrs.length; i++) {
            var v = getAttr(img, attrs[i]);
            if (v !== "") pushChapImage(out, used, v);
        }

        var srcset = getAttr(img, "srcset");
        if (srcset !== "") {
            var arr = srcset.split(",");
            for (var s = 0; s < arr.length; s++) {
                var one = trimText(arr[s]).split(" ")[0];
                pushChapImage(out, used, one);
            }
        }
    } catch (e) {}
}

function addImagesBySelector(out, used, doc, selector) {
    try {
        var imgs = doc.select(selector);
        for (var i = 0; i < imgs.size(); i++) addFromImg(out, used, imgs.get(i));
    } catch (e) {}
}

function scanViewerHtml(out, used, html) {
    try {
        if (!html) return;
        html = htmlDecodeBasic(html);

        // Chỉ quét trong section id="viewer" để không lấy nhầm cover, logo, ảnh đánh giá, ads.
        var viewer = html;
        var mViewer = /<section[^>]+id=["']viewer["'][^>]*>([\s\S]*?)<\/section>/i.exec(html);
        if (mViewer && mViewer.length > 1) viewer = mViewer[1];

        var reImg = /<img[^>]+(?:src|data-src|data-original|data-lazy-src|data-url)=["']([^"']+)["'][^>]*>/ig;
        var m;
        while ((m = reImg.exec(viewer)) !== null) {
            pushChapImage(out, used, m[1]);
        }

        var reAbs = /https?:\\?\/\\?\/[^"'\s<>]+?\.(?:jpg|jpeg|png|webp|avif)(?:\?[^"'\s<>]*)?/ig;
        while ((m = reAbs.exec(viewer)) !== null) {
            pushChapImage(out, used, m[0]);
        }

        var reEsc = /https?%3A%2F%2F[^"'\s<>]+?\.(?:jpg|jpeg|png|webp|avif)(?:%3F[^"'\s<>]*)?/ig;
        while ((m = reEsc.exec(viewer)) !== null) {
            try { pushChapImage(out, used, decodeURIComponent(m[0])); } catch (e2) {}
        }
    } catch (e) {}
}

function execute(url) {
    try {
        url = toAbsoluteUrl(url);
        Console.log("chap url: " + url);

        var doc = getDoc(url);
        if (!doc) {
            Console.log("image count: 0");
            return Response.success([]);
        }

        var out = [];
        var used = {};

        // Đúng HTML bạn gửi: ảnh chương nằm trong <section id="viewer"><img src="..."></section>.
        addImagesBySelector(out, used, doc, "#viewer img");

        // Fallback nếu selector id thay đổi nhưng vẫn nằm trong vùng đọc truyện.
        if (out.length === 0) {
            addImagesBySelector(out, used, doc, "section#viewer img, .reading-content img, .chapter-content img, .entry-content img, article img");
        }

        // Fallback cuối: quét HTML trong #viewer bằng regex.
        if (out.length === 0) {
            scanViewerHtml(out, used, getHtmlText(doc));
        }

        Console.log("image count: " + out.length);
        return Response.success(out);
    } catch (e) {
        Console.log("chap error: " + e);
        return Response.success([]);
    }
}
