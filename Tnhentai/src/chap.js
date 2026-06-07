load("utils.js");

function execute(url) {
    var doc = getDoc(url);
    if (!doc) return Response.error("Không tải được chương");

    var body = text(doc.body());
    var pages = parsePages(body);
    var id = parseGalleryId(doc);

    if (!id || !pages) {
        return Response.error("Không lấy được gallery id hoặc số trang");
    }

    var images = [];

    for (var i = 1; i <= pages; i++) {
        var pageUrl = BASE_URL + "/galery/?id=" + id + "&img=" + i;
        var pdoc = getDoc(pageUrl);
        if (!pdoc) continue;

        var img = pdoc.select("img[alt]").first();
        if (!img) img = pdoc.select("img[src*='wp-content/uploads']").first();

        if (img) {
            var src = abs(attr(img, "data-src") || attr(img, "data-lazy-src") || attr(img, "src"));
            if (src && src.indexOf("loading") < 0) {
                images.push(src);
            }
        }
    }

    return Response.success(images);
}