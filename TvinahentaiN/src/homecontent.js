load("utils.js");

function execute(url, page) {
  var pageNo = 1;
  if (page !== null && page !== undefined && String(page) !== "") pageNo = parseInt(page, 10);
  if (!pageNo || pageNo < 1) pageNo = 1;

  var target = safeUrl(url);
  if (pageNo > 1) {
    target = target + (target.indexOf("?") >= 0 ? "&" : "?") + "page=" + pageNo;
  }

  var doc = getDoc(target);
  if (!doc) return Response.error("Không tải được danh sách truyện");

  var list = parseComicList(doc);
  var next = null;
  if (list.length >= 18) next = String(pageNo + 1);
  return Response.success(list, next);
}
