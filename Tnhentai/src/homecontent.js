load("utils.js");

function getComicAnchor(item) {
    var links = item.select("a[href]");
    for (var i = 0; i < links.size(); i++) {
        var a = links.get(i);
        var href = absUrl(getAttr(a, "href"));
        if (href.indexOf(BASE_URL) !== 0) continue;
        if (href.indexOf("/category/") >= 0 || href.indexOf("/tag/") >= 0 || href.indexOf("/parody/") >= 0 || href.indexOf("/language/") >= 0) continue;
        if (href.indexOf("/galery") >= 0) continue;
        var hasImg = a.select("img").size() > 0;
        var hasTitle = a.select(".thumb-titulo").size() > 0 || getAttr(a, "title") !== "";
        if (hasImg || hasTitle) return a;
    }
    return null;
}

function execute(url, page) {
    if (!page) page = "1";
    var p = parseInt(page);
    if (isNaN(p) || p < 1) p = 1;

    url = removeEndSlash(url || BASE_URL);
    var pageUrl = url;
    if (p > 1) {
        if (url === BASE_URL) pageUrl = BASE_URL + "/page/" + p + "/";
        else pageUrl = url + "/page/" + p + "/";
    }

    var doc = getDoc(pageUrl);
    var data = [];
    var used = {};

    var items = doc.select(".lista ul li");
    for (var i = 0; i < items.size(); i++) {
        var item = items.get(i);
        var a = getComicAnchor(item);
        if (!a) continue;

        var link = absUrl(getAttr(a, "href"));
        if (used[link]) continue;

        var title = cleanTitle(getAttr(a, "title"));
        if (title === "") title = cleanTitle(getText(a.select(".thumb-titulo .tituloConteudo").first()));
        if (title === "") title = cleanTitle(getText(a.select(".thumb-titulo").first()));
        if (title === "") title = cleanTitle(getText(a));
        if (title === "") continue;

        var cover = imageFrom(a.select("img.wp-post-image").first());
        if (cover === "") cover = imageFrom(a.select(".thumb-imagem img").first());
        if (cover === "") cover = imageFrom(a.select("img").first());

        var parody = getText(item.select(".thumbParodiaNome").first());
        used[link] = true;
        data.push({
            name: title,
            title: title,
            link: link,
            input: link,
            cover: cover,
            description: parody,
            host: BASE_URL
        });
    }

    var next = doc.select(".paginacao li.next a[href]").first();
    if (!next) next = doc.select("a.next.page-numbers[href]").first();
    return Response.success(data, next ? (p + 1).toString() : null);
}
