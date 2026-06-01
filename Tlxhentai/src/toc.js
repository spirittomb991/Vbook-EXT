load("utils.js");

function storyBaseFromUrl(url) {
    try {
        url = removeEndSlash(toAbsoluteUrl(url));
        if (url.indexOf(".html") >= 0) url = url.substring(0, url.lastIndexOf(".html"));
        return url;
    } catch (e) { return removeEndSlash(url); }
}

function chapterNumber(name, url) {
    try {
        var s = (name || "") + " " + (url || "");
        var m = /chap(?:ter)?[-\s_]*(\d+)/i.exec(s);
        if (m && m.length > 1) return parseInt(m[1], 10);
        m = /chuong[-\s_]*(\d+)/i.exec(s);
        if (m && m.length > 1) return parseInt(m[1], 10);
    } catch (e) {}
    return -1;
}

function addChapter(out, used, href, name, base) {
    try {
        href = toAbsoluteUrl(href);
        name = cleanText(name);
        if (href === "" || used[href]) return;
        if (href.indexOf(base) !== 0 && href.indexOf(BASE_URL) !== 0) return;
        if (isBadLink(href, name || "chapter")) return;
        if (href.indexOf(".html") < 0) return;
        if (name === "") {
            var slug = href.substring(href.lastIndexOf("/") + 1).replace(".html", "");
            if (slug === "one-shot") name = "One Shot";
            else name = slug.replace(/-/g, " ");
        }
        // Không lọc theo chữ chap để giữ one-shot.html, coming-soon, chap slug lạ.
        used[href] = true;
        out.push({ name: name, url: href, host: HOST });
    } catch (e) {}
}

function execute(url) {
    try {
        url = toAbsoluteUrl(url);
        Console.log("toc url: " + url);
        var doc = getDoc(url);
        if (!doc) return Response.success([]);

        var out = [];
        var used = {};
        var base = storyBaseFromUrl(url);

        // Đúng HTML detail LXMANGA: danh sách chương nằm trong #result-for-action ul.chapter-list.
        var links = doc.select("#result-for-action ul.chapter-list a[href], ul.chapter-list a[href]");
        for (var i = 0; i < links.size(); i++) {
            addChapter(out, used, getAttr(links.get(i), "href"), getText(links.get(i)), base);
        }

        // Fallback hẹp: chỉ lấy các link con trực tiếp của truyện trong khu vực action/current-reading, không quét truyện liên quan.
        if (out.length === 0) {
            var a2 = doc.select("#result-for-action a[href], .current-reading a[href], a.btn-danger[href]");
            for (var j = 0; j < a2.size(); j++) {
                var href = toAbsoluteUrl(getAttr(a2.get(j), "href"));
                if (href.indexOf(base + "/") !== 0) continue;
                addChapter(out, used, href, getText(a2.get(j)), base);
            }
        }

        try {
            out.sort(function(a, b) {
                var na = chapterNumber(a.name, a.url);
                var nb = chapterNumber(b.name, b.url);
                if (na < 0 || nb < 0) return 0;
                return na - nb;
            });
        } catch (e2) {}

        Console.log("toc count: " + out.length);
        return Response.success(out);
    } catch (e) {
        Console.log("toc error: " + e);
        return Response.success([]);
    }
}
