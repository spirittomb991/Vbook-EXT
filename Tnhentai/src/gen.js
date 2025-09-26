function execute(url, page) {
    if (!page) page = '1';
    const doc = Http.get(url).params({"page": page}).html()

    var next = doc.select(".pagination").select("a.current + a").text()

    const el = doc.select(".container").last().select(".gallery")

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        // Sửa lấy ảnh đúng từ thẻ img bên trong a.cover
        var img = e.select("a.cover img").first();
        var cover = "";
        if (img) {
            cover = img.attr("data-src");
            if (cover.startsWith("//")) {
                cover = "https:" + cover;
            }
        }
        data.push({
            name: e.select(".caption").first().text(),
            link: e.select("a").first().attr("href"),
            cover: cover,
            description: e.select(".chapter a").first().text(),
            host: "https://nhentai.net"
        })
    }

    return Response.success(data, next)
}