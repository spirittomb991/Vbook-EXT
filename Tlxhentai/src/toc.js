load("utils.js");

function execute(url) {
    var doc = getDoc(url);
    var title = cleanTitle(getText(doc.select("h1.post-titulo, .post-titulo, h1.entry-title, h1").first()));
    if (title === "") title = "Gallery";
    var pages = "";
    var lis = doc.select(".post-itens li");
    for (var i = 0; i < lis.size(); i++) {
        var t = getText(lis.get(i));
        var m = t.match(/Pages\s*([0-9]+)/i);
        if (m) pages = m[1];
    }
    var name = pages !== "" ? ("Full gallery - " + pages + " pages") : "Full gallery";
    return Response.success([{ name: name, title: name, url: url, link: url, input: url, host: BASE_URL }]);
}
