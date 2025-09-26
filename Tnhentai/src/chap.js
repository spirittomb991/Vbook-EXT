function execute(url) {
    let maxDocRetry = 2;
    let doc = null;

    // Retry fetch document 1–2 lần
    for (let i = 0; i <= maxDocRetry; i++) {
        try {
            let response = fetch(url);
            if (!response.ok) continue;
            doc = response.html();
            if (doc) break;
        } catch (err) {
            if (i === maxDocRetry) return Response.error("chap.js fetch failed: " + err);
        }
    }
    if (!doc) return Response.error("chap.js could not load document");

    let thumbs = doc.select("div#thumbnail-container div.thumb-container a");
    thumbs.select("noscript").remove();

    let data = [];

    thumbs.forEach(e => {
        try {
            let img = e.select("img");
            let src = img.attr("data-src") || img.attr("data-srcset");
            if (!src) return;

            if (src.startsWith("//")) src = "https:" + src;

            // Đổi domain t* → i* (giảm redirect / handshake fail)
            src = src.replace(/https:\/\/t(\d)\.nhentai\.net/, "https://i$1.nhentai.net");

            // 1t.jpg.webp hoặc 1t.webp → 1.jpg / 1.webp
            src = src.replace(/\/(\d+)t(\.\w+)(\.\w+)?$/, "/$1$2");

            data.push(src);
        } catch (errImg) {
            // bỏ ảnh lỗi, không ảnh hưởng toàn bộ
        }
    });

    return Response.success(data);
}
