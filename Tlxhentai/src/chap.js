load("utils.js");

function execute(url) {
    var doc = getDoc(url);
    var imgs = [];
    var used = {};

    // 1) Nhanh nhất: lấy ảnh thumbnail/gallery ngay trên trang detail, rồi đổi về ảnh gốc WordPress.
    var selectors = [
        "a[href*='/galery'][href*='img='] img",
        ".listaImagens img",
        ".post-fotos img",
        ".galeriaHtml img"
    ];
    for (var s = 0; s < selectors.length; s++) {
        var nodes = doc.select(selectors[s]);
        for (var i = 0; i < nodes.size(); i++) {
            var img = imageFrom(nodes.get(i));
            if (img.indexOf("/wp-content/uploads/") >= 0) uniquePush(imgs, used, img);
        }
        if (imgs.length > 1) break;
    }

    // 2) Nếu input là trang /galery/?id=...&img=1 thì lấy ảnh đọc trực tiếp.
    if (imgs.length === 0) {
        var readerImgs = doc.select(".galeriaHtml img, .paginaGaleria img, .meio-conteudo img");
        for (var r = 0; r < readerImgs.size(); r++) {
            var u = imageFrom(readerImgs.get(r));
            if (u.indexOf("/wp-content/uploads/") >= 0) uniquePush(imgs, used, u);
        }
    }

    return Response.success(imgs);
}
