function execute(url) {
    let doc = fetch(url).html()

    return Response.success({
        name: doc.select("h1").first().text(),
        cover: doc.select("#cover img").first().attr("data-src"),
        author: doc.select("a[href^=/artist/]").first().text(),
        description: doc.select("h2").html(),
        detail: doc.select("#info").html(),
        host: "https://nhentai.website",
        ongoing: false,
        nsfw: true
    });
}