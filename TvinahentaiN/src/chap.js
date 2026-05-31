load("utils.js");

function execute(url) {
  try {
    var doc = getDoc(url);
    var imgs = doc.select('img[src], img[data-src], img[data-original], img[data-lazy-src]');
    var html = "";
    var exists = {};

    for (var i = 0; i < imgs.size(); i++) {
      var img = imgs.get(i);
      var src = absUrl(attrOf(img, "src"));
      if (!src || exists[src]) continue;
      if (src.indexOf("logo") >= 0 || src.indexOf("avatar") >= 0 || src.indexOf("favicon") >= 0) continue;
      html += '<p><img src="' + src + '" /></p>';
      exists[src] = true;
    }

    if (!html) return Response.error("Không tìm thấy ảnh chương");
    return Response.success(html);
  } catch (e) {
    return Response.error(String(e));
  }
}
