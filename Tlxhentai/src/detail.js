load("utils.js");

function execute(url) {
    try {
        url = toAbsoluteUrl(url);
        Console.log("detail url: " + url);
        var doc = getDoc(url);
        if (!doc) return Response.success({ name: "", cover: "", host: HOST, author: "", description: "", detail: "", ongoing: true, genres: [] });
        var name = "";
        var h1 = doc.select("h1.comic-title, h1");
        if (h1.size() > 0) name = getText(h1.get(0));
        if (name === "") {
            var ogTitle = doc.select("meta[property=og:title]");
            if (ogTitle.size() > 0) name = getAttr(ogTitle.get(0), "content");
        }
        var cover = "";
        var og = doc.select("meta[property=og:image]");
        if (og.size() > 0) cover = decodeNextImage(toAbsoluteUrl(getAttr(og.get(0), "content")));
        if (cover === "") cover = getImageFromElement(doc.select("#comic-section, .card").size() > 0 ? doc.select("#comic-section, .card").get(0) : doc);
        var desc = "";
        var descEl = doc.select("#post-decription p, meta[name=description]");
        if (descEl.size() > 0) {
            if (("" + descEl.get(0).tagName()).toLowerCase() === "meta") desc = getAttr(descEl.get(0), "content");
            else desc = getText(descEl.get(0));
        }
        var author = "";
        var details = [];
        var genres = [];
        var items = doc.select(".comic-details__item");
        for (var i = 0; i < items.size(); i++) {
            var item = items.get(i);
            var labelEl = item.select(".comic-details__label");
            if (labelEl.size() === 0) continue;
            var label = getText(labelEl.get(0));
            var val = getText(item.select(".comic-details__item_links").size() > 0 ? item.select(".comic-details__item_links").get(0) : item);
            if (label !== "" && val !== "") details.push(label + ": " + val);
            if (label.toLowerCase().indexOf("tác giả") >= 0) author = val;
            if (label.toLowerCase().indexOf("danh mục") >= 0 || label.toLowerCase().indexOf("thể loại") >= 0) {
                var as = item.select("a[href]");
                for (var j = 0; j < as.size(); j++) {
                    var a = as.get(j);
                    var title = getAttr(a, "title");
                    if (title === "") title = getText(a);
                    var href = toAbsoluteUrl(getAttr(a, "href"));
                    if (title !== "" && !isBadLink(href, title)) genres.push({ title: title, input: href, script: "genrecontent.js" });
                }
            }
        }
        var statusText = getText(doc.select(".baka-status-completed, h5[class*=status]").size() > 0 ? doc.select(".baka-status-completed, h5[class*=status]").get(0) : null);
        var ongoing = true;
        if (statusText.toLowerCase().indexOf("hoàn thành") >= 0) ongoing = false;
        var detail = details.join("\n");
        return Response.success({ name: name, cover: proxyCoverUrl(cover), host: HOST, author: author, description: desc, detail: detail, ongoing: ongoing, genres: genres });
    } catch (e) {
        Console.log("detail error: " + e);
        return Response.success({ name: "", cover: "", host: HOST, author: "", description: "", detail: "", ongoing: true, genres: [] });
    }
}
