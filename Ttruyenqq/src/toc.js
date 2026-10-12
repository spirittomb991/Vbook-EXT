load('config.js');
function execute(url) {
    url = normalizeUrl(url);
    let doc = fetchDoc(url);
    if (!doc) return Response.error("Không tải được danh sách chương");

    let links = doc.select(".works-chapter-list a");
    let chapters = [];
    for (let i = links.size() - 1; i >= 0; i--) {
        let el = links.get(i);
        chapters.push({
            name: el.text().trim(),
            url: absUrl(el.attr("href")),
            description: "",
            lock: false,
            pay: false
        });
    }

    return Response.success(chapters);
}
