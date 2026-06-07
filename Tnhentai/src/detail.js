load("utils.js");

function execute(url) {
    var doc = getDoc(url);
    if (!doc) return Response.error("Không tải được chi tiết");

    var name = cleanTitle(text(doc.select("h1").first()) || doc.title());
    var body = text(doc.body());

    var cover = "";
    var galleryImg = doc.select("img[alt]").first();
    if (galleryImg) {
        cover = abs(attr(galleryImg, "data-src") || attr(galleryImg, "data-lazy-src") || attr(galleryImg, "src"));
    }

    var author = "";
    var artist = doc.select("a[href*='/artist/']").first();
    if (artist) author = text(artist);

    var genres = [];
    var tags = doc.select("a[href*='/tag/']");
    for (var i = 0; i < tags.size(); i++) {
        var g = text(tags.get(i)).replace(/\s+\d+$/, "");
        if (g && genres.indexOf(g) < 0) genres.push(g);
    }

    var pages = parsePages(body);
    var language = "";
    var lang = doc.select("a[href*='/language/']").first();
    if (lang) language = text(lang);

    var desc = [];
    if (language) desc.push("Language: " + language);
    if (pages) desc.push("Pages: " + pages);

    return Response.success({
        name: name,
        cover: cover,
        author: author,
        description: desc.join("\n"),
        detail: desc.join("\n"),
        genres: genres,
        host: BASE_URL,
        ongoing: false
    });
}