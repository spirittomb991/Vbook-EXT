load("utils.js");

function execute(key, page) {
  try {
    var pageNum = page ? parseInt(page) : 1;
    var q = encodeURIComponent(key || "");
    var urls = [
      BASE_URL + "/search?keyword=" + q + "&page=" + pageNum,
      BASE_URL + "/tim-kiem?keyword=" + q + "&page=" + pageNum,
      BASE_URL + "/danh-sach?keyword=" + q + "&page=" + pageNum
    ];
    var list = [];
    for (var i = 0; i < urls.length; i++) {
      var doc = getDoc(urls[i]);
      list = parseList(doc);
      if (list.length > 0) break;
    }
    return Response.success(list, list.length > 0 ? String(pageNum + 1) : null);
  } catch (e) {
    return Response.error(String(e));
  }
}
