load('config.js');
function execute(query, page) {
    query = query || "";
    page = page || "";

    let url;
    if (page.indexOf("/") === 0 || page.indexOf("http") === 0) {
        url = absUrl(page);
    } else if (query.indexOf("/") === 0 || query.indexOf("http") === 0) {
        url = normalizeUrl(absUrl(query)).replace(/\/+$/, "");
        if (page && page !== "1") url += "/trang-" + page;
    } else {
        url = BASE_URL + "/tim-kiem/trang-" + (page || "1") + "?q=" + encodeURIComponent(query);
    }

    let doc = fetchDoc(url);
    if (!doc) return Response.error("Không tải được trang: " + url);

    let items = [];
    doc.select("#main_homepage .list_grid li").forEach(function (el) {
        let a = el.select(".book_name a").first();
        let name = a.text().trim();
        if (!name) return;
        let tags = el.select(".more-info .info").text();
        items.push({
            name: name,
            link: absUrl(a.attr("href")),
            cover: absUrl(el.select(".book_avatar img").attr("src")),
            description: el.select(".last_chapter a").text().trim(),
            tag: tags.indexOf("Hoàn Thành") !== -1 ? "Hoàn Thành" : ""
        });
    });

    let next = doc.select(".page_redirect a:has(p.active) + a").attr("href");
    return Response.success(items, next ? absUrl(next) : "");
}
