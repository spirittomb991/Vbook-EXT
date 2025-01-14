function execute() {
    var response = fetch("https://tangthuvien.net");
    if (response.ok) {
        var doc = response.html();
        var genres = [];
        
        doc.select(".genre-item").forEach(e => {
            genres.push({
                title: e.select("a").text(),
                input: e.select("a").attr("href"),
                script: "genrecontent.js"
            });
        });

        return Response.success(genres);
    }
    return null;
}