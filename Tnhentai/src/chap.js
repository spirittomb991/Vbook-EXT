function execute(url) {
    let response = fetch(url);
    if (response.ok) {

        let doc = response.html();
        let el = doc.select("div#thumbnail-container div.thumb-container a");
        var mediaServer = /media_server\s*:\s*(\d+)/g.exec(doc.html());
        if (mediaServer) mediaServer = mediaServer[1];
        el.select("noscript").remove();
        let data = [];
        el.forEach(e => {
            let src = e.select("img").attr("data-src");
            if (src && src.startsWith("//")) {
                src = "https:" + src;
            }
            // Đổi domain t* thành i*
            src = src.replace(/https:\/\/t(\d)\.nhentai\.net/, "https://i$1.nhentai.net");
            // Trường hợp 1t.jpg.webp => 1.jpg
            src = src.replace(/\/(\d+)t(\.\w+)\.\w+$/, "/$1$2");
            // Trường hợp thông thường 1t.webp => 1.webp
            src = src.replace(/\/(\d+)t(\.[^.]+)$/, "/$1$2");
            data.push(src);
        });
        return Response.success(data);
    }
    return null;
}