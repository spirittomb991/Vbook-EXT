load('config.js');
function execute(key, page) {
    if (!key) key = "";
    if (!page) page = "1";
    var url = BASE_URL + "/?s=" + encodeURIComponent(key);
    if (page !== "1") url = BASE_URL + "/page/" + page + "/?s=" + encodeURIComponent(key);
    Console.log("search: " + url);
    var doc = getDoc(url);
    if (!doc) return Response.success([], "");
    var data = parseList(doc);
    return Response.success(data, findNext(doc, url) || "");
}
