load("utils.js");

function isChapImage(url) {
    if (!url) return false;
    var u = ("" + url).toLowerCase();
    if (!isGoodImage(u)) return false;
    // Ảnh chap LXMANGA nằm trong cdn tymanga hoặc link ảnh trực tiếp trong #viewer.
    return true;
}

function pushImage(out, used, src) {
    try {
        src = cleanImageUrl(src);
        if (!isChapImage(src)) return;
        if (used[src]) return;
        used[src] = true;
        out.push(makeImageItem(src));
    } catch (e) {}
}

function addFromImg(out, used, img) {
    try {
        // Chap thật bạn gửi: ảnh nằm ở src trong #viewer img.
        // Vẫn ưu tiên data-* để phòng lazyload.
        var attrs = ["data-src", "data-original", "data-lazy-src", "data-url", "data-full", "srcset", "src"];
        for (var i = 0; i < attrs.length; i++) {
            var v = "";
            if (attrs[i] === "srcset") v = firstSrcFromSrcset(getAttr(img, attrs[i]));
            else v = getAttr(img, attrs[i]);
            pushImage(out, used, v);
        }
    } catch (e) {}
}

function scanViewerHtml(out, used, html) {
    try {
        html = htmlDecode(html || "");
        var viewer = html;
        var m = /<section[^>]+id=["']viewer["'][^>]*>([\s\S]*?)<\/section>/i.exec(html);
        if (m && m.length > 1) viewer = m[1];

        var re = /<img[^>]+(?:data-src|data-original|data-lazy-src|data-url|src)=["']([^"']+)["'][^>]*>/ig;
        var x;
        while ((x = re.exec(viewer)) !== null) pushImage(out, used, x[1]);

        var reAbs = /https?:\\?\/\\?\/[^"'\s<>]+?\.(?:jpg|jpeg|png|webp|avif)(?:\?[^"'\s<>]*)?/ig;
        while ((x = reAbs.exec(viewer)) !== null) pushImage(out, used, x[0]);

        var reEnc = /https?%3A%2F%2F[^"'\s<>]+?\.(?:jpg|jpeg|png|webp|avif)(?:%3F[^"'\s<>]*)?/ig;
        while ((x = reEnc.exec(viewer)) !== null) {
            try { pushImage(out, used, decodeURIComponent(x[0])); } catch (e2) {}
        }
    } catch (e) {}
}

function execute(url) {
    try {
        url = toAbsoluteUrl(url);
        Console.log("chap url: " + url);
        var doc = getDoc(url);
        if (!doc) return Response.success([]);

        var out = [];
        var used = {};

        // Đúng HTML bạn gửi: <section id="viewer"><p><img src="https://cdn2.tymanga.com/...jpg"></p></section>
        var imgs = doc.select("#viewer img");
        for (var i = 0; i < imgs.size(); i++) addFromImg(out, used, imgs.get(i));

        // Fallback nếu id đổi, vẫn chỉ chọn vùng đọc truyện phổ biến.
        if (out.length === 0) {
            var imgs2 = doc.select("section#viewer img, .reading-content img, .chapter-content img, .entry-content img");
            for (var j = 0; j < imgs2.size(); j++) addFromImg(out, used, imgs2.get(j));
        }

        // Fallback cuối quét HTML trong viewer.
        if (out.length === 0) scanViewerHtml(out, used, getHtml(doc));

        Console.log("image count: " + out.length);
        return Response.success(out);
    } catch (e) {
        Console.log("chap error: " + e);
        return Response.success([]);
    }
}
