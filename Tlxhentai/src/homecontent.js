load("utils.js");

function execute(url) {
    try {
        if (!url) url = BASE_URL + "/moi-cap-nhat";
        Console.log("home input: " + url);
        var doc = getDoc(url);
        if (!doc) return Response.success([], null);
        var list = parseComicList(doc);
        var next = findNextPage(doc, url);
        Console.log("list count: " + list.length);
        return Response.success(list, next || null);
    } catch (e) {
        Console.log("homecontent error: " + e);
        return Response.success([], null);
    }
}
