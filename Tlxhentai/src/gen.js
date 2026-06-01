load('config.js');
function execute(url, page) {
    if (!page) page = "1";
    url = absUrl(url);
    // gen.js chỉ dành cho category/genre/country. Nếu nhập nhầm URL truyện thì không parse list.
    if (url.indexOf(".html") >= 0) return Response.success([], "");
    if (page !== "1" && url.indexOf("/page/") < 0) {
        url = url.replace(/\/$/, "") + "/page/" + page;
    }
    Console.log("gen: " + url);
    var doc = getDoc(url);
    if (!doc) return Response.success([], "");
    var data = parseList(doc);
    if (data.length === 0) {
        var doc2 = getDocByBrowser(url, 7000);
        data = parseList(doc2);
        var next2 = findNext(doc2, url);
        return Response.success(data, next2 || "");
    }
    return Response.success(data, findNext(doc, url) || "");
}
