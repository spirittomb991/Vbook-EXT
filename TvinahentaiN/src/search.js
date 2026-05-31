load("utils.js");

function execute(key, page) {
  var pageNo = 1;
  if (page !== null && page !== undefined && String(page) !== "") pageNo = parseInt(page, 10);
  if (!pageNo || pageNo < 1) pageNo = 1;

  var q = encodeURIComponent(String(key || ""));
  var urls = [
    BASE_URL + "/tim-kiem?keyword=" + q + "&page=" + pageNo,
    BASE_URL + "/search?keyword=" + q + "&page=" + pageNo,
    BASE_URL + "/danh-sach?keyword=" + q + "&page=" + pageNo,
    BASE_URL + "/?keyword=" + q + "&page=" + pageNo
  ];

  var list = [];
  for (var i = 0; i < urls.length; i++) {
    var doc = getDoc(urls[i]);
    list = parseComicList(doc);
    if (list.length > 0) break;
  }

  var next = null;
  if (list.length >= 18) next = String(pageNo + 1);
  return Response.success(list, next);
}
