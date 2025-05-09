load("config.js");

function execute(url) {
    let list = [];
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();

        // Lấy danh sách chương trên trang đầu tiên
        doc.select("ul.list-chapter li a").forEach(e => {
            list.push({
                name: e.text().trim(),
                url: e.attr("href"),
                host: BASE_URL
            });
        });

        // Lấy danh sách trang từ phân trang
        let paginationLinks = [];
        doc.select("ul.pagination li a.page-link").forEach(e => {
            let pageUrl = e.attr("href");
            if (pageUrl && !paginationLinks.includes(pageUrl)) {
                paginationLinks.push(pageUrl);
            }
        });

        // Duyệt qua các trang tiếp theo
        paginationLinks.forEach(pageUrl => {
            let pageResponse = fetch(pageUrl);
            if (pageResponse.ok) {
                let pageDoc = pageResponse.html();
                pageDoc.select("ul.list-chapter li a").forEach(e => {
                    list.push({
                        name: e.text().trim(),
                        url: e.attr("href"),
                        host: BASE_URL
                    });
                });
            }
        });

        return Response.success(list);
    }

    return null;
}
