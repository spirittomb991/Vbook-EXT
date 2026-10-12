load("utils.js");

function execute() {
    var doc = getDoc(BASE_URL + "/");
    var data = [];
    var used = {};

    var links = doc.select("#menu-id a[href], .topoIdiomas a[href], .rodape-menu a[href]");
    for (var i = 0; i < links.size(); i++) {
        var a = links.get(i);
        var href = absUrl(getAttr(a, "href"));
        var title = getAttr(a, "title");
        if (title === "") title = getText(a);
        title = trimText(title);
        if (title === "" || used[href]) continue;
        if (href.indexOf(BASE_URL + "/category/") !== 0 && href.indexOf(BASE_URL + "/tag/") !== 0 && href.indexOf(BASE_URL + "/language/") !== 0 && href.indexOf(BASE_URL + "/parody/") !== 0) continue;
        used[href] = true;
        data.push({ title: title, input: href, script: "homecontent.js" });
    }
    return Response.success(data);
}
