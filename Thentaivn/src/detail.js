load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL)
    let response = fetch(url, {
        headers: {
            "referer": BASE_URL
        }
    });
    if (response.ok) {
        let doc = response.html();

        // Tên truyện
        let name = doc.select(".title-detail").text();

        // Ảnh bìa
        let cover = doc.select(".col-image img").attr("src");

        // Tác giả
        let author = doc.select(".list-info .author p.col-xs-8").text();

        // Tình trạng
        let ongoing = doc.select(".list-info .status p.col-xs-8").text().indexOf("Đang tiến hành") !== -1;

        // Thể loại
        let genres = [];
        doc.select(".list-info .kind p.col-xs-8 a").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });

        // Mô tả (lấy preview truyện nếu có)
        let description = doc.select(".detail-content .shortened").text();
        if (!description) {
            description = doc.select(".detail-content").text();
        }

        // Danh sách chương
        let chapters = [];
        doc.select(".list-chapter ul li .chapter a").forEach(e => {
            chapters.push({
                name: e.text(),
                url: e.attr("href"),
                host: BASE_URL
            });
        });

        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            host: BASE_URL,
            genres: genres,
            ongoing: ongoing,
            nsfw: true,
            chapters: chapters
        });
    }
    return null;
}