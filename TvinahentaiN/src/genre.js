load("utils.js");

function execute() {
  try {
    var doc = getDoc("https://vinahentai.life/genres");
    var out = [];
    var links = doc.select('a[href*="/the-loai/"], a[href*="/genres/"]');
    var exists = {};
    for (var i = 0; i < links.size(); i++) {
      var a = links.get(i);
      var title = textOf(a).replace(/\s*Xem\s*.*/i, "").trim();
      var href = absUrl(a.attr("href"));
      if (!title || exists[href] || href === "https://vinahentai.life/genres") continue;
      out.push({ title: title, input: href, script: "homecontent.js" });
      exists[href] = true;
    }
    return Response.success(out);
  } catch (e) {
    return Response.error(String(e));
  }
}
