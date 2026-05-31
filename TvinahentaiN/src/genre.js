load("utils.js");

function execute() {
  var doc = getDoc(BASE_URL + "/genres");
  if (!doc) return Response.error("Không tải được danh sách thể loại");

  var out = [];
  var used = {};
  var links = doc.select("a[href]");
  for (var i = 0; i < links.size(); i++) {
    var a = links.get(i);
    var href = removeEndSlash(getAttr(a, "href"));
    var title = trimText(getText(a));
    if (title === "" || used[href]) continue;
    if (isBadTitle(title)) continue;
    if (href === BASE_URL + "/genres") continue;
    if (href.indexOf(BASE_URL + "/genres/") !== 0 && href.indexOf(BASE_URL + "/the-loai/") !== 0 && href.indexOf(BASE_URL + "/tag/") !== 0) continue;

    out.push({ title: title, input: href, script: "genrecontent.js" });
    used[href] = true;
  }
  return Response.success(out);
}
