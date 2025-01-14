function execute(url) {
    var response = fetch(url);
    if (response.ok) {
        var doc = response.html();
        var chapters = [];
        
        doc.select(".chapter-list a").forEach(e => {
            chapters.push({
                name: e.text(),
                url: e.attr("href")
            });
        });

        return Response.success(chapters);
    }
    return null;
}