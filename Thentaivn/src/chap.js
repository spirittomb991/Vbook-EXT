load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url, {
        headers: {
            "referer": BASE_URL
        }
    });

    if (response.ok) {
        let doc = response.html();
        let data = [];
        // Lấy tất cả ảnh trong các page-chapter
        doc.select(".reading-detail.box_doc .page-chapter img").forEach(e => {
            let src = e.attr("src");
            if (src) data.push(src);
        });
        return Response.success(data);
    }

    return null;
}