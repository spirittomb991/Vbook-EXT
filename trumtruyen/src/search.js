load("config.js");

function execute(key, page) {
    if (!page) page = '1';
    let response = fetch(BASE_URL + "/tim-kiem", {
        method: "GET",
        queries: {
            q: key,
            page: page
        }
    });
    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        let next = doc.select("ul.pagination > li > a").last().attr("href").match(/page=(\d+)/);
        if (next) next = next[1]; else next = '';

        doc.select(".list-group .list-search-res li").forEach(e => {
            let titleElement = e.select("a").first();
            let descriptionElement = e.select(".description").first();
            let coverElement = e.select("img").first();

            if (titleElement && descriptionElement && coverElement) {
                novelList.push({
                    name: titleElement.text().trim(),
                    link: titleElement.attr("href"),
                    description: descriptionElement.text().trim(),
                    cover: coverElement.attr("src"),
                    host: BASE_URL
                });
            }
        });

        return Response.success(novelList, next);
    }

    return null;
}