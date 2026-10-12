load('config.js');
function execute() {
    let doc = fetchDoc(BASE_URL + "/tim-kiem-nang-cao");
    if (!doc) return Response.error("Không tải được danh sách thể loại");

    let genres = [];
    let seen = {};
    doc.select(".book_tags_content a[href*=/the-loai/]").forEach(function (el) {
        let href = el.attr("href").replace(/^https?:\/\/[^\/]+/, "");
        let title = el.text().trim();
        if (!title || seen[href]) return;
        seen[href] = true;
        genres.push({ title: title, input: href, script: "search.js" });
    });

    return Response.success(genres);
}
