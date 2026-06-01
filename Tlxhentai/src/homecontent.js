load('config.js');
function execute(url) {
    if (!url) url = BASE_URL + "/moi-cap-nhat";
    Console.log("homecontent: " + url);
    var doc = getDoc(url);
    if (!doc) return Response.success([], "");
    var data = parseList(doc);
    // Nếu lần đầu browser chưa render đủ, retry một lần chờ lâu hơn.
    if (data.length === 0) {
        var doc2 = getDocByBrowser(url, 7000);
        data = parseList(doc2);
        var next2 = findNext(doc2, url);
        return Response.success(data, next2 || "");
    }
    return Response.success(data, findNext(doc, url) || "");
}
