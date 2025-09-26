function execute(url) {
    let doc = fetch(url).html()

    // Lấy ảnh cover đúng dạng URL
    let img = doc.select("#cover img").first();
    let cover = img ? img.attr("data-src") : "";
    if (cover.startsWith("//")) {
        cover = "https:" + cover;
    }

    return Response.success({
        name: doc.select("h1").first().text(),
        cover: cover,
        author: doc.select("[href^=/artist/] .name").first().text(),
        description: doc.select("h2").html(),
        detail: doc.select(".tags .name").text(),
        host: "https://nhentai.net",
        ongoing: true,
        nsfw: true
    });
}