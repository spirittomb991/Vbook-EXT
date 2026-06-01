load("utils.js");

function execute() {
    try {
        var doc = getDoc(BASE_URL + "/the-loai");
        if (!doc) return Response.success([]);
        var out = [];
        var used = {};
        var links = doc.select(".channel-item a[href], a[href*=/genre/], a[href*=/category/]");
        for (var i = 0; i < links.size(); i++) {
            var a = links.get(i);
            var href = toAbsoluteUrl(getAttr(a, "href"));
            if (used[href]) continue;
            if (href.indexOf(BASE_URL + "/genre/") !== 0 && href.indexOf(BASE_URL + "/category/") !== 0) continue;
            var title = getAttr(a, "title");
            if (title.indexOf("Tất Cả Truyện ") === 0) title = title.replace("Tất Cả Truyện ", "");
            if (title === "") {
                var titleEl = a.select(".text-txt-primary, .channel-item__name_details a, .fw-semibold");
                if (titleEl.size() > 0) title = getText(titleEl.get(0));
            }
            if (title === "") title = getText(a);
            title = cleanText(title).replace(/^Tất Cả Truyện\s+/i, "");
            if (isBadTitle(title)) continue;
            var description = "";
            var p = a.select("p");
            if (p.size() > 0) description = getText(p.get(0));
            var displayTitle = title;
            if (description !== "") displayTitle = title + "\n- " + description;
            used[href] = true;
            out.push({ title: displayTitle, input: href, script: "genrecontent.js" });
        }
        if (out.length === 0) {
            out.push({ title: "Không Che", input: BASE_URL + "/category/khong-che", script: "genrecontent.js" });
            out.push({ title: "One Shot", input: BASE_URL + "/category/one-shot", script: "genrecontent.js" });
            out.push({ title: "Có Che", input: BASE_URL + "/category/co-che", script: "genrecontent.js" });
        }
        Console.log("genre count: " + out.length);
        return Response.success(out);
    } catch (e) {
        Console.log("genre error: " + e);
        return Response.success([]);
    }
}
