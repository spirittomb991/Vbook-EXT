load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let doc = fetchDoc(url);
    if (!doc) return Response.error("Không tải được chương");

    let images = [];
    doc.select(".chapter_content .page-chapter img").forEach(function (el) {
        let link = absUrl(el.attr("data-original") || el.attr("src"));
        if (!link) return;
        let fallback = [];
        let src = absUrl(el.attr("src"));
        let cdn = absUrl(el.attr("data-cdn"));
        if (src && src !== link) fallback.push(src);
        if (cdn && cdn !== link) fallback.push(cdn);
        images.push({ link: link, fallback: fallback });
    });

    if (images.length === 0) return Response.error("Không tìm thấy ảnh chương");
    return Response.success(images);
}
