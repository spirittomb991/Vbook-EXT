load("utils.js");

function getStoryBase(url) {
    try {
        url = toAbsoluteUrl(url);
        url = url.split("?")[0].split("#")[0];
        if (url.lastIndexOf(".html") === url.length - 5) url = url.substring(0, url.length - 5);
        var parts = url.split("/");
        if (parts.length > 4) {
            var last = parts[parts.length - 1];
            // Nếu đang ở chap page thì bỏ slug chương để về URL truyện.
            if (last !== "" && parts[parts.length - 2] !== "") {
                return parts.slice(0, parts.length - 1).join("/");
            }
        }
        return url;
    } catch (e) { return url; }
}

function chapterNameFromHref(href) {
    try {
        var s = safeDecodeUrl(href).split("?")[0].split("#")[0];
        var arr = s.split("/");
        var slug = arr[arr.length - 1].replace(/\.html$/i, "");
        if (slug === "coming-soon") return "Coming Soon";
        return cleanText(slug.replace(/-/g, " ").replace(/\bchap\b/i, "Chap"));
    } catch (e) { return "Chapter"; }
}

function addChapter(list, used, href, name, storyBase) {
    try {
        href = toAbsoluteUrl(href);
        var cmp = normalizeCompareUrl(href);
        var baseCmp = normalizeCompareUrl(storyBase);
        if (used[cmp]) return;
        if (cmp.indexOf(baseCmp + "/") !== 0) return;
        if (href.indexOf(".html") < 0 && href.indexOf("coming-soon") < 0) return;
        var low = cmp.toLowerCase();
        var bad = ["/login", "/register", "/tag/", "/genre/", "/category/", "/artist/", "/country/", "/doujinshi/", "/profile", "/account", "/report"];
        for (var b = 0; b < bad.length; b++) if (low.indexOf(bad[b]) >= 0) return;
        name = cleanText(name || "");
        if (name === "" || name === "ĐỌC NGAY" || name === "Tiếp tục đọc") name = chapterNameFromHref(href);
        // Chỉ cắt phần tên truyện nếu dạng "Tên truyện - Chap 1".
        if (name.indexOf(" - ") >= 0) name = cleanText(name.substring(name.lastIndexOf(" - ") + 3));
        used[cmp] = true;
        list.push({ name: name, url: href, host: HOST });
    } catch (e) {}
}

function findChapterCount(doc) {
    try {
        var text = cleanText(doc.text());
        var m = /D\.S\s*Chương\s*\((\d+)\)/i.exec(text);
        if (m) return parseInt(m[1], 10);
        m = /(\d+)\s*Chương/i.exec(text);
        if (m) return parseInt(m[1], 10);
    } catch (e) {}
    return 0;
}

function execute(url) {
    try {
        url = toAbsoluteUrl(url);
        Console.log("toc url: " + url);
        var doc = getDoc(url);
        if (!doc) return Response.success([]);

        var storyBase = getStoryBase(url);
        var chapters = [];
        var used = {};

        // 1) Chỉ ưu tiên đúng vùng danh sách chương, không quét toàn trang để tránh lấy truyện liên quan.
        var listLinks = doc.select("ul.chapter-list a[href], #result-for-action ul.chapter-list a[href], .chapter-list a[href], .result-for-action-content a[href]");
        for (var i = 0; i < listLinks.size(); i++) {
            var a = listLinks.get(i);
            addChapter(chapters, used, getAttr(a, "href"), getText(a) || getAttr(a, "title"), storyBase);
        }

        // 2) Nếu không có list render sẵn, lấy nút ĐỌC NGAY/current-reading làm chap đầu tiên.
        if (chapters.length === 0) {
            var readLinks = doc.select("a.btn-danger[href], .current-reading a[href], a[href*='/chap-'], a[href*='/coming-soon']");
            for (var r = 0; r < readLinks.size(); r++) {
                var ra = readLinks.get(r);
                addChapter(chapters, used, getAttr(ra, "href"), getAttr(ra, "title") || getText(ra), storyBase);
            }
        }

        // 3) Fallback cuối: nếu trang chỉ hiện D.S Chương (n) nhưng không render danh sách, sinh chap-1..chap-n.
        // Chỉ áp dụng khi URL mẫu của website dùng /chap-n.html.
        if (chapters.length <= 1) {
            var count = findChapterCount(doc);
            if (count > chapters.length && count < 500) {
                chapters = [];
                used = {};
                for (var c = count; c >= 1; c--) {
                    addChapter(chapters, used, storyBase + "/chap-" + c + ".html", "Chap " + c, storyBase);
                }
            }
        }

        Console.log("toc count: " + chapters.length);
        return Response.success(chapters);
    } catch (e) {
        Console.log("toc error: " + e);
        return Response.success([]);
    }
}
