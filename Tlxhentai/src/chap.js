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

    // Tìm container chứa chapter content
    var container = doc.select("div.page-chapter, div.chapter-content, div#chapter-content, div.story-content").first();
    
    if (container) {
        // Lấy img trong container này
        var el = container.select("img");
        for (var i = 0; i < el.size(); i++) {
            var link = el.get(i).attr("data-src") || el.get(i).attr("src");
            if (link && !link.includes("gifs/") && !link.includes("load.gif") && !link.includes("data:image")) {
                if (link.startsWith("//")) link = "https:" + link;
                else if (link.startsWith("/")) link = BASE_URL + link;
                imgs.push(link.trim());
            }
        }
    }

    return Response.success(imgs);
}
