function execute(key, page) {
    var url = `https://tangthuvien.net/search?q=${encodeURIComponent(key)}`;
    var response = fetch(url);
    if (response.ok) {
        var doc = response.html();
        var books = [];
        var next = null;
        
        doc.select(".book-list .book-item").forEach(e => {
            books.push({
                name: e.select(".book-title").text(),
                link: e.select(".book-title a").attr("href"),
                cover: e.select(".book-cover img").attr("src"),
                description: e.select(".book-description").text()
            });
        });

        var nextPage = doc.select(".pagination .next a");
        if (nextPage.size() > 0) {
            next = nextPage.attr("href");
        }

        return Response.success(books, next);
    }
    return null;
}