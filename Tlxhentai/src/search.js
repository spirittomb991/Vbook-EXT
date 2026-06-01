load("utils.js");

function execute(key, page) {
    try {
        key = key || "";
        page = page || "1";
        var url = BASE_URL + "/?s=" + encodeURIComponent(key);
        if (page !== "1" && page !== 1) url = BASE_URL + "/page/" + page + "/?s=" + encodeURIComponent(key);
        Console.log("search url: " + url);
        var doc = getDoc(url);
        if (!doc) return Response.success([], null);
        var list = parseComicList(doc);
        var next = findNextPage(doc, url);
        if (!next && list.length > 0) {
            var p = parseInt(page);
            if (!p) p = 1;
            next = BASE_URL + "/page/" + (p + 1) + "/?s=" + encodeURIComponent(key);
        }
        Console.log("list count: " + list.length);
        return Response.success(list, next || null);
    } catch (e) {
        Console.log("search error: " + e);
        return Response.success([], null);
    }
}
