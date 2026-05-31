load("utils.js");

function execute(url) {
  try {
    var doc = getDoc(url);
    var storyPath = absUrl(url).replace(BASE_URL, "").replace(/\/$/, "");
    var links = doc.select('a[href^="' + storyPath + '/"], a[href^="' + BASE_URL + storyPath + '/"]');
    if (links.size() === 0) links = doc.select('a[href*="/truyen-hentai/"]');

    var list = [];
    var exists = {};
    for (var i = 0; i < links.size(); i++) {
      var a = links.get(i);
      var href = absUrl(a.attr("href")).replace(/\/$/, "");
      if (href === absUrl(url).replace(/\/$/, "")) continue;
      if (href.indexOf(storyPath + "/") < 0) continue;
      if (exists[href]) continue;
      var name = textOf(a) || "Chương " + (list.length + 1);
      list.push({ name: name, url: href, host: BASE_URL });
      exists[href] = true;
    }
    return Response.success(list.reverse());
  } catch (e) {
    return Response.error(String(e));
  }
}
