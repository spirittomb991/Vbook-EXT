load("utils.js");

function execute(url) {
    try {
        Console.log("genrecontent input: " + url);
        var doc = getDoc(url);
        if (!doc) return Response.success([], null);
        var list = parseComicList(doc);
        var next = findNextPage(doc, url);
        Console.log("list count: " + list.length);
        return Response.success(list, next || null);
    } catch (e) {
        Console.log("genrecontent error: " + e);
        return Response.success([], null);
    }
}
