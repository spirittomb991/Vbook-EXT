load("utils.js");

function execute(url) {
  try {
    var doc = getDoc(url);
    var name = textOf(doc.select("h1").first());
    var coverEl = doc.select('img[alt*="Bìa"], img[alt*="bìa"], img').first();
    var cover = absUrl(attrOf(coverEl, "src"));
    var body = textOf(doc.body());

    var author = "";
    var authorLink = doc.select('a[href*="tac-gia"], a[href*="author"], a[href*="artist"]').first();
    if (authorLink) author = textOf(authorLink);

    var desc = "";
    var intro = doc.select("h2:contains(Giới Thiệu), h2:contains(Giới thiệu)").first();
    if (intro) {
      var p = intro.nextElementSibling();
      if (p) desc = textOf(p);
    }
    if (!desc) desc = body.substring(0, 300);

    var genres = [];
    var gs = doc.select('a[href*="/the-loai/"], a[href*="/genres/"]');
    for (var i = 0; i < gs.size(); i++) {
      var g = gs.get(i);
      var title = textOf(g).replace(/\s*Xem\s*.*/i, "").trim();
      if (title) genres.push({ title: title, input: absUrl(g.attr("href")), script: "homecontent.js" });
    }

    return Response.success({
      name: name,
      cover: cover,
      host: BASE_URL,
      author: author,
      description: desc,
      detail: body,
      ongoing: body.indexOf("Chưa hoàn thành") >= 0,
      genres: genres
    });
  } catch (e) {
    return Response.error(String(e));
  }
}
