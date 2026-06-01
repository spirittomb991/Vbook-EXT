load('config.js');
function execute(key, page) {
    if (!key) key = "";
    if (!page) page = "1";
    var url = BASE_URL + "/?s=" + encodeURIComponent(key);
    if (page !== "1") {
        if (url.indexOf("/page/") < 0) {
            url = BASE_URL + "/page/" + page + "/?s=" + encodeURIComponent(key);
        } else {
            url = url.replace(/\/page\/\d+/, "/page/" + page);
        }
    }
    Console.log("search: " + url);
    var doc = getDoc(url);
    if (!doc) return Response.success([], "");
    var data = parseList(doc);
    if (data.length === 0) {
        // Retry with browser if no results found on first try
        var doc2 = getDocByBrowser(url, 5000);
        data = parseList(doc2);
    }
    return Response.success(data, findNext(doc, url) || "");
}
