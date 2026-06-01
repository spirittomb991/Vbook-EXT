load("utils.js");

function execute(url) {
    try {
        url = toAbsoluteUrl(url);
        Console.log("detail url: " + url);
        var doc = getDoc(url);
        if (!doc) return Response.success({ name: "", cover: "", host: HOST, author: "", description: "", detail: "", ongoing: true, genres: [] });

        var name = "";
        var h1 = doc.select("h1.comic-title");
        if (h1.size() > 0) name = getText(h1.get(0));
        if (name === "") {
            var ogTitle = doc.select("meta[property=og:title]");
            if (ogTitle.size() > 0) name = getAttr(ogTitle.get(0), "content");
        }
        name = cleanText(name);

        var cover = "";
        var ogImg = doc.select("meta[property=og:image]");
        if (ogImg.size() > 0) cover = cleanImageUrl(getAttr(ogImg.get(0), "content"));
        if (!isGoodImage(cover)) cover = getCoverFromRoot(doc.select("#comic-section").size() > 0 ? doc.select("#comic-section").get(0) : doc);

        var desc = "";
        var descEl = doc.select("#post-decription p");
        if (descEl.size() > 0) desc = getText(descEl.get(0));
        if (desc === "") {
            var md = doc.select("meta[name=description]");
            if (md.size() > 0) desc = getAttr(md.get(0), "content");
        }

        var author = "";
        var details = [];
        var genres = [];
        var usedGenre = {};
        var items = doc.select(".comic-details__item");
        for (var i = 0; i < items.size(); i++) {
            var item = items.get(i);
            var label = getText(item.select(".comic-details__label").size() > 0 ? item.select(".comic-details__label").get(0) : null);
            if (label === "") continue;
            var valEl = item.select(".comic-details__item_links").size() > 0 ? item.select(".comic-details__item_links").get(0) : item;
            var val = getText(valEl);
            if (label !== "" && val !== "") details.push(label + ": " + val);
            if (label.toLowerCase().indexOf("tác giả") >= 0) author = val;

            if (label.toLowerCase().indexOf("danh mục") >= 0 || label.toLowerCase().indexOf("thể loại") >= 0) {
                var as = item.select("a[href]");
                for (var j = 0; j < as.size(); j++) {
                    var a = as.get(j);
                    var title = getAttr(a, "title");
                    if (title === "") title = getText(a);
                    var href = toAbsoluteUrl(getAttr(a, "href"));
                    if (title !== "" && !isBadLink(href, title) && !usedGenre[href]) {
                        usedGenre[href] = true;
                        genres.push({ title: title, input: href, script: "genrecontent.js" });
                    }
                }
            }
        }

        var status = getText(doc.select(".baka-status-completed, h5[class*=status]").size() > 0 ? doc.select(".baka-status-completed, h5[class*=status]").get(0) : null);
        var ongoing = true;
        if (status.toLowerCase().indexOf("hoàn thành") >= 0 || status.toLowerCase().indexOf("completed") >= 0) ongoing = false;

        return Response.success({
            name: name,
            cover: cover,
            host: HOST,
            author: author,
            description: desc,
            detail: details.join("\n"),
            ongoing: ongoing,
            genres: genres
        });
    } catch (e) {
        Console.log("detail error: " + e);
        return Response.success({ name: "", cover: "", host: HOST, author: "", description: "", detail: "", ongoing: true, genres: [] });
    }
}
