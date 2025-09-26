function execute(url) {
    try {
        // Thêm https nếu url chưa có
        if (url.indexOf("http") !== 0) url = "https:" + url;

        // Lấy HTML với header chuẩn để tránh SSL handshake aborted
        let html = Http.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
            }
        }).string();

        // Chọn tất cả img trong thumbnail-container
        let regex = /<div class="thumb-container">[\s\S]*?<img[^>]+data-src="([^"]+)"/g;
        let data = [];
        let m;
        while ((m = regex.exec(html)) !== null) {
            let src = m[1]; // URL gốc từ data-src

            // Thêm https:
            if (src.indexOf("http") !== 0) src = "https:" + src;

            // Chuyển tX -> iX
            src = src.replace(/\/\/t(\d+)\.nhentai\.net/, "//i$1.nhentai.net");

            // Xóa t cuối cùng trước phần mở rộng
            src = src.replace(/(\d+)t(\.\w+)$/, "$1$2");

            // Xóa đuôi kép nếu có (.jpg.webp -> .jpg)
            src = src.replace(/(\.\w+)\.(\w+)$/, "$1");

            // Loại bỏ thumb.jpg / cover.jpg
            if (src.match(/\/thumb\.|\/cover\./)) continue;

            data.push(src);
        }

        if (!data.length) return Response.error("Không tìm thấy ảnh trong gallery");

        return Response.success(data);
    } catch (err) {
        return Response.error("chap.js error: " + err);
    }
}
