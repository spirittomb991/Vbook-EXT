function execute(url) {
    var response = fetch(url);
    if (response.ok) {
        var doc = response.html();
        
        var name = doc.select(".book-title").text();
        var cover = doc.select(".book-cover img").attr("src");
        var author = doc.select(".book-author").text();
        var description = doc.select(".book-description").text();
        var genres = [];
        doc.select(".book-genres a").forEach(e => {
            genres.push(e.text());
        });

        var ongoing = doc.select(".book-status").text().includes("Đang ra");

        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            detail: description,
            ongoing: ongoing,
            genres: genres
        });
    }
    return null;
}