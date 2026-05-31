load("utils.js");

function execute(url, page) {
  try {
    var pageNum = page ? parseInt(page) : 1;
    var target = url;
    if (pageNum > 1) {
      target = url.indexOf("?") >= 0 ? url + "&page=" + pageNum : url + "?page=" + pageNum;
    }
    var doc = getDoc(target);
    var list = parseList(doc);
    var next = list.length > 0 ? String(pageNum + 1) : null;
    return Response.success(list, next);
  } catch (e) {
    return Response.error(String(e));
  }
}
