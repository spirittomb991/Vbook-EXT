function execute(url) {
    load('config.js');

    var response = fetch(url, {
        headers: {
            "Referer": BASE_URL,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
    });
    if (!response.ok) return null;

    var doc = response.html();
    var imgs = [];

    // Ảnh thật nằm trong div.lazy (data-src)
    var el = doc.select("div.lazy[data-src]");

    for (var i = 0; i < el.size(); i++) {
        var link = el.get(i).attr("data-src");
        if (link && !link.includes("load.gif")) {
            if (link.startsWith("//")) link = "https:" + link;
            else if (link.startsWith("/")) link = BASE_URL + link;
            imgs.push(link.trim());
        }
    }

    return Response.success(imgs);
}
