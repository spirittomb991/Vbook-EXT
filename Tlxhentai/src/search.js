load("utils.js");

function execute(key, page) {
    key = trimText(key);
    if (!page) page = "1";
    var p = parseInt(page);
    if (isNaN(p) || p < 1) p = 1;

    var url = BASE_URL + "/?s=" + encodeURIComponent(key);
    if (p > 1) url = BASE_URL + "/page/" + p + "/?s=" + encodeURIComponent(key);

    var doc = getDoc(url);
    var data = [];
    var used = {};
    var items = doc.select(".lista > ul > li, ul.lista > li, .post-fotos > li");
    for (var i = 0; i < items.size(); i++) {
        var item = items.get(i);
        var a = item.select(".thumb-conteudo > a[href]:not(.thumbParodiaNome), a[href]:has(.thumb-imagem), a[href]:has(.thumb-titulo)").first();
        if (!a) continue;
        var link = absUrl(getAttr(a, "href"));
        if (link.indexOf(BASE_URL) !== 0 || link.indexOf("/galery") >= 0 || used[link]) continue;
        var title = cleanTitle(getAttr(a, "title"));
        if (title === "") title = cleanTitle(getText(a.select(".thumb-titulo").first()));
        if (title === "") continue;
        var cover = imageFrom(a.select("img.wp-post-image, .thumb-imagem img, img").first());
        used[link] = true;
        data.push({ name: title, title: title, link: link, input: link, cover: cover, description: "", host: BASE_URL });
    }
    var next = doc.select(".paginacao li.next a[href], a.next.page-numbers[href]").first();
    return Response.success(data, next ? (p + 1).toString() : null);
}
