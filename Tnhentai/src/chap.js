function execute(url) {
    let response = fetch(url);
    if (!response.ok) return null;

    let doc = response.html();
    let thumbs = doc.select("div#thumbnail-container div.thumb-container a");
    thumbs.select("noscript").remove();

    // Lấy media server nếu có
    let mediaServerMatch = /media_server\s*:\s*(\d+)/.exec(doc.html());
    let mediaServer = mediaServerMatch ? mediaServerMatch[1] : null;

    let data = [];
    thumbs.forEach(e => {
        let img = e.select("img");
        let src = img.attr("data-src") || img.attr("data-srcset");
        if (!src) return;

        if (src.startsWith("//")) src = "https:" + src;

        // Đổi domain t* thành i*
        src = src.replace(/https:\/\/t(\d)\.nhentai\.net/, "https://i$1.nhentai.net");

        // Xử lý các trường hợp 1t.jpg.webp hoặc 1t.webp → 1.jpg / 1.webp
        src = src.replace(/\/(\d+)t(\.\w+)(\.\w+)?$/, "/$1$2");

        data.push(src);
    });

    return Response.success(data);
}
