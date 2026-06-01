load('config.js');
function execute(url) {
    url = absUrl(url);
    Console.log("toc: " + url);
    var doc = getDoc(url);
    if (!doc) return Response.success([]);
    var data = [];
    var used = {};

    var links = doc.select("ul.chapter-list a[href], .chapter-list a[href], #result-for-action a[href], .current-reading a[href], a.btn-danger[href], a[href*='/chap-'], a[href*='/oneshot']");
    for (var i = 0; i < links.size(); i++) {
        var a = links.get(i);
        var href = absUrl(a.attr("href"));
        if (href.indexOf(BASE_URL) !== 0) continue;
        if (href === url) continue;
        if (href.indexOf(".html") < 0 && href.indexOf("/oneshot") < 0) continue;
        if (href.indexOf("/genre/") >= 0 || href.indexOf("/category/") >= 0) continue;
        if (used[href]) continue;
        var name = cleanText(a.attr("title"));
        if (name === "") name = cleanText(a.text());
        if (name === "" || name === "ĐỌC NGAY") {
            var slug = href.split("?")[0].split("#")[0].split("/").pop().replace(/\.html$/i, "");
            name = slug.replace(/-/g, " ").replace(/chap/i, "Chap");
        }
        used[href] = true;
        data.push({name: name, url: href, host: HOST});
    }
    return Response.success(data.reverse());
}
