load('config.js');
function execute(url) {
    if (!url) url = BASE_URL + "/moi-cap-nhat";
    url = absUrl(url);
    Console.log("homecontent: " + url);
    var doc = getDoc(url);
    if (!doc) return Response.success([], "");
    var data = parseList(doc);
    Console.log("First fetch: found " + data.length + " comics");
    // Nếu lần đầu browser chưa render đủ, retry với wait time lâu hơn.
    if (data.length === 0) {
        Console.log("No results on first try, retrying with browser...");
        var doc2 = getDocByBrowser(url, 7000);
        data = parseList(doc2);
        Console.log("Retry fetch: found " + data.length + " comics");
        var next2 = findNext(doc2, url);
        return Response.success(data, next2 || "");
    }
    return Response.success(data, findNext(doc, url) || "");
}
