function execute(url) {
    var response = fetch(url);
    if (response.ok) {
        var doc = response.html();
        var pages = [];

        doc.select(".chapter-list .chapter-item").forEach(e => {
            pages.push(e.attr("href"));
        });

        return Response.success(pages);
    }
    return null;
}