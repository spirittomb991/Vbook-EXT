load('config.js');

function buildDetail(doc) {
    let lines = [];
    doc.select(".book_info .list-info li").forEach(function (item) {
        let label = item.select(".name").text().replace(/\s+/g, " ").trim();
        let valueNode = item.select("p").last();
        let value = valueNode.text().replace(/\s+/g, " ").trim();
        if (!label || !value || label === value) return;
        lines.push(label + ": " + value);
    });
    return lines.join("<br>");
}

function execute(url) {
    url = normalizeUrl(url);
    let doc = fetchDoc(url);
    if (!doc) return Response.error("Không tải được trang truyện");

    let tags = doc.select(".book_info .list01 a").map(function (el) {
        return { title: el.text().trim(), input: el.attr("href").replace(/^https?:\/\/[^\/]+/, ""), script: "search.js" };
    });
    let status = doc.select(".book_info .list-info .status").text();

    return Response.success({
        name: doc.select("h1[itemprop=name]").text().trim(),
        author: doc.select(".book_info .list-info .author a").first().text().trim(),
        cover: absUrl(doc.select(".book_avatar img").first().attr("src")),
        description: doc.select(".story-detail-info").html(),
        detail: buildDetail(doc),
        url: url,
        type: "comic",
        format: "comic",
        ongoing: status.indexOf("Hoàn Thành") === -1,
        tags: tags,
        genres: tags.length > 0 ? [{ title: "Cùng thể loại", input: tags[0].input, script: "search.js" }] : []
    });
}
