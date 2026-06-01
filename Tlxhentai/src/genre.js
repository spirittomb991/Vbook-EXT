load("utils.js");

function execute() {
    try {
        var doc = getDoc(BASE_URL + "/the-loai");
        if (!doc) return Response.success([]);
        var out = [];
        var used = {};

        // Đúng HTML genre LXMANGA: mỗi genre nằm trong .channel-item, link chính có /genre/ hoặc /category/.
        var items = doc.select(".channel-item");
        for (var i = 0; i < items.size(); i++) {
            var item = items.get(i);
            var links = item.select("a[href*=/genre/], a[href*=/category/]");
            if (links.size() === 0) continue;
            var a = links.get(0);
            var href = toAbsoluteUrl(getAttr(a, "href"));
            var title = getAttr(a, "title");
            if (title.indexOf("Tất Cả Truyện ") === 0) title = title.replace("Tất Cả Truyện ", "");
            if (title === "") title = getText(item.select(".channel-item__name_details a").size() > 0 ? item.select(".channel-item__name_details a").get(0) : a);
            title = cleanText(title);
            if (title === "" || isBadLink(href, title) || used[href]) continue;

            var total = getText(item.select(".channel-item__name_details__total_mangas").size() > 0 ? item.select(".channel-item__name_details__total_mangas").get(0) : null);
            var views = getText(item.select(".channel-item__name_details__total_views").size() > 0 ? item.select(".channel-item__name_details__total_views").get(0) : null);
            var display = title;
            var desc = "";
            if (total !== "") desc += total;
            if (views !== "") desc += (desc !== "" ? " - " : "") + views;
            if (desc !== "") display = title + "\n- " + desc;

            used[href] = true;
            out.push({ title: display, input: href, script: "genrecontent.js" });
        }

        // Fallback nếu layout đổi: chỉ lấy link /genre/ và /category/ nhưng không lấy trùng.
        if (out.length === 0) {
            var as = doc.select("a[href*=/genre/], a[href*=/category/]");
            for (var j = 0; j < as.size(); j++) {
                var aa = as.get(j);
                var h = toAbsoluteUrl(getAttr(aa, "href"));
                var t = getAttr(aa, "title");
                if (t.indexOf("Tất Cả Truyện ") === 0) t = t.replace("Tất Cả Truyện ", "");
                if (t === "") t = getText(aa);
                t = cleanText(t);
                if (t === "" || isBadLink(h, t) || used[h]) continue;
                used[h] = true;
                out.push({ title: t, input: h, script: "genrecontent.js" });
            }
        }

        Console.log("genre count: " + out.length);
        return Response.success(out);
    } catch (e) {
        Console.log("genre error: " + e);
        return Response.success([]);
    }
}
