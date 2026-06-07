load("utils.js");

function execute(url) {
    var doc = getDoc(url);
    var title = cleanTitle(getText(doc.select("h1.post-titulo, .post-titulo, h1.entry-title, h1").first()));
    if (title === "") title = cleanTitle(getAttr(doc.select("meta[property=og:title]").first(), "content"));

    var cover = imageFrom(doc.select(".post-capa img, img.wp-post-image").first());
    if (cover === "") cover = getAttr(doc.select("meta[property=og:image]").first(), "content");

    var original = getText(doc.select(".tituloOriginal").first());
    var info = [];
    var lis = doc.select(".post-itens li");
    for (var i = 0; i < lis.size(); i++) {
        var t = getText(lis.get(i));
        if (t !== "") info.push(t);
    }
    if (original !== "") info.unshift("Original: " + original);

    var author = "";
    var artist = doc.select(".post-itens li:contains(Artist) a").first();
    if (artist) author = getText(artist);

    return Response.success({
        name: title,
        title: title,
        cover: cover,
        author: author,
        description: info.join("\n"),
        detail: info.join("\n"),
        host: BASE_URL
    });
}
