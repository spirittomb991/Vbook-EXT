var BASE_URL = "https://vinahentai.life";

function absUrl(url) {
  if (!url) return "";
  url = (url + "").trim();
  if (url.startsWith("//")) return "https:" + url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return BASE_URL + url;
  return BASE_URL + "/" + url;
}

function textOf(el) {
  if (!el) return "";
  return (el.text ? el.text() : "").replace(/\s+/g, " ").trim();
}

function attrOf(el, name) {
  if (!el) return "";
  var v = el.attr(name);
  if (!v && name === "src") v = el.attr("data-src");
  if (!v && name === "src") v = el.attr("data-original");
  if (!v && name === "src") v = el.attr("data-lazy-src");
  return v || "";
}

function getDoc(url) {
  var res = fetch(absUrl(url), {
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36",
      "Referer": BASE_URL + "/"
    }
  });
  if (!res.ok) throw "HTTP " + res.status + " - " + url;
  return res.html();
}

function parseList(doc) {
  var list = [];
  var links = doc.select('a[href*="/truyen-hentai/"]');
  var exists = {};

  for (var i = 0; i < links.size(); i++) {
    var a = links.get(i);
    var href = absUrl(a.attr("href"));
    if (!href || exists[href]) continue;
    if (href.split("/truyen-hentai/")[1].split("/").length > 1) continue; // bỏ link chương

    var name = textOf(a);
    if (!name || name.length < 2) {
      var img = a.select("img").first();
      name = attrOf(img, "alt") || attrOf(img, "title");
    }
    if (!name || name.length < 2) continue;

    var box = a.parent();
    var img2 = a.select("img").first();
    if (!img2 || !img2.attr("src")) img2 = box.select("img").first();

    list.push({
      name: name,
      link: href,
      cover: absUrl(attrOf(img2, "src")),
      description: textOf(box)
    });
    exists[href] = true;
  }
  return list;
}
