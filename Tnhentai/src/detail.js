function execute(url) {
    let doc = fetch(url).html()

    return Response.success({
        name: doc.select("h1").first().text(),
        cover: doc.select("#cover img").first().attr("data-src"),
        author: doc.select("[href^=/artist/] .name").first().text(),
        description: doc.select("h2").html(),
        detail: doc.select(".tags .name").text(),
        host: "https://nhentai.website",
        ongoing: true,
        nsfw: true
    });
}