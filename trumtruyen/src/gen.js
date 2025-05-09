load('config.js');

function execute(url, page) {
    if (!page) page = '1';

    let response = fetch(url + "?page=" + page);

    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        let next = doc.select("ul.pagination > li > a").last().attr("href").match(/page=(\d+)/);
        if (next) next = next[1]; else next = '';

        // Chọn tất cả các phần tử <div> với class "row" và thuộc tính itemscope
        doc.select("#list-page .list-truyen .row[itemscope]").forEach(e => {
            let coverElement = e.select("img.cover").first();
            let titleElement = e.select("h3.truyen-title a").first();
            let authorElement = e.select("span.author[itemprop=author]").first();
            let chapterElement = e.select("span.author:has(.glyphicon-list)").first();

            if (titleElement && coverElement && authorElement && chapterElement) {
                novelList.push({
                    name: titleElement.text().trim(),
                    link: titleElement.attr("href"),
                    description: authorElement.text().trim(),
                    cover: coverElement.attr("src"),
                    chapters: chapterElement.text().trim(),
                    host: BASE_URL
                });
            }
        });

        return Response.success(novelList, next);
    }

    return null;
}