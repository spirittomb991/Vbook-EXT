load('config.js');
function execute(key, page) {
    if (!page) page = '1';
    let response = fetch(BASE_URL + "/tim-truyen?keyword=" + key + "&page=" + page);

    if (response.ok) {
        let doc = response.html();
        let el = doc.select(".items .item");
        let next = doc.select(".pagination .page-item.active + .page-item a").attr("href") ? page + 1 : null;

        let data = [];
        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            let name = e.select("h3 a").text();
            let link = e.select("h3 a").attr("href");
            if (link && !link.startsWith("http")) {
                link = BASE_URL + link;
            }
            let cover = e.select(".image img").attr("src");
            if (cover && !cover.startsWith("http")) {
                cover = BASE_URL + cover;
            }
            data.push({
                name: name,
                link: link,
                cover: cover,
                host: BASE_URL
            });
        }
        return Response.success(data, next);
    }
    return null;
}
