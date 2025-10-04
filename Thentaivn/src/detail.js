load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url, { headers: { "referer": BASE_URL } });
    if (!response.ok) return null;

    let doc = response.html();

    // Tên truyện
    let name = doc.select(".title-detail").text().trim();

    // Ảnh bìa
    let cover = doc.select(".col-image img").attr("src");
    if (cover && cover.startsWith("//")) cover = "https:" + cover;
    if (cover && cover.startsWith("/")) cover = BASE_URL + cover;

    // Tác giả
    let author = doc.select(".list-info .author p.col-xs-8").text().trim();

    // Tình trạng
    let ongoing = doc.select(".list-info .status p.col-xs-8").text().indexOf("Đang tiến hành") !== -1;

    // Thể loại
    let genres = [];
    doc.select(".list-info .kind p.col-xs-8 a").forEach(e => {
        let gUrl = e.attr("href");
        if (gUrl && gUrl.startsWith("/")) gUrl = BASE_URL + gUrl;
        genres.push({
            title: e.text().trim(),
            input: gUrl,
            script: "gen.js"
        });
    });

    // Mô tả
    let description = doc.select(".detail-content .shortened").text().trim();
    if (!description) {
        description = doc.select(".detail-content").text().trim();
    }

    // Danh sách chương
    let chapters = [];
    doc.select(".list-chapter ul li .chapter a").forEach(e => {
        let cUrl = e.attr("href");
        if (cUrl && cUrl.startsWith("/")) cUrl = BASE_URL + cUrl;
        chapters.push({
            name: e.text().trim(),
            url: cUrl,
            host: BASE_URL
        });
    });

    // Lấy id từ url (/12345-ten-truyen/)
    let idMatch = url.match(/\/(\d+)-/);
    let id = idMatch ? idMatch[1] : url;

    return Response.success({
        id: id,
        url: url,            // 🔑 thêm field url để app nhận diện
        name: name,
        cover: cover,
        author: author || "N/A",
        description: description,
        host: BASE_URL,
        genres: genres,
        ongoing: ongoing,
        nsfw: true,
        type: "comic",
        chapters: chapters
    });
}
