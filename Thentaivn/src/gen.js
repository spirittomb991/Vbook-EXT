load('config.js');
function execute(url, page) {
    if (!page) page = '1';
    let response = fetch(url + "?page=" + page);

    if (response.ok) {
        let doc = response.html();
        // HTML mới: danh sách truyện nằm trong .items > .item
        let el = doc.select(".items .item");
        let next = doc.select(".pagination .page-item.active + .page-item a").attr("href") ? page + 1 : null;

        const data = [];
        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            let name = e.select("h3 a").text();
            let link = e.select("h3 a").attr("href");
            let cover = e.select(".image img").attr("src");
            let description = e.select("figcaption ul.comic-item li.chapter").first().text();
            data.push({
                name: name,
                link: link,
                cover: cover,
                description: description,
                host: BASE_URL
            });
        }

        return Response.success(data, next);
    }
    return null;
}