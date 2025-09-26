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
        let data = [];
        // Thử lấy chương theo kiểu cũ
        let el = doc.select(".comic-item li.chapter a");
        if (el.size() === 0) {
            // Nếu không có, lấy theo kiểu mới (detail page)
            el = doc.select(".list-chapter ul li .chapter a");
        }
        for (let i = el.size() - 1; i >= 0; i--) {
            let e = el.get(i);
            data.push({
                name: e.text(),
                url: e.attr("href"),
                host: BASE_URL
            });
        }
        return Response.success(data);
    }
    return null;
}