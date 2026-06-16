load("utils.js");

function execute(key, page) {
    var pageNo = 1;

    if (page !== null && page !== undefined && String(page) !== "") {
        pageNo = parseInt(page, 10);
    }

    if (!pageNo || pageNo < 1) {
        pageNo = 1;
    }

    var q = encodeURIComponent(String(key || ""));
    var url = setPageParam(BASE_URL + "/search?q=" + q, pageNo);

    var doc = getDoc(url);
    var list = [];

    if (!doc) {
        return Response.success([], null);
    }

    var items = doc.select("a.group[href]");

    for (var i = 0; i < items.size(); i++) {
        var a = items.get(i);
        var href = a.attr("href");

        if (!href) continue;
        if (href.indexOf("/truyen-hentai/") < 0) continue;

        var link = href;

        if (link.indexOf("http") !== 0) {
            link = BASE_URL + link;
        }

        if (typeof safeEncodeUrl === "function") {
            link = safeEncodeUrl(link);
        }

        var titleEl = a.select("h2");
        var imgEl = a.select("img");

        var name = "";
        var cover = "";

        if (titleEl.size() > 0) {
            name = titleEl.get(0).text().trim();
        } else {
            name = a.text().trim();
        }

        if (imgEl.size() > 0) {
            cover = imgEl.get(0).attr("src");

            if (!cover) {
                cover = imgEl.get(0).attr("data-src");
            }

            if (cover && cover.indexOf("http") !== 0) {
                cover = BASE_URL + cover;
            }
        }

        if (!name || name.length < 2) continue;

        list.push({
            name: name,
            link: link,
            host: BASE_URL,
            cover: cover,
            description: ""
        });
    }

    var next = null;

    if (list.length >= 18) {
        next = String(pageNo + 1);
    }

    return Response.success(list, next);
}
