load("utils.js");

function execute(url) {
  var pageUrl = removeEndSlash(safeUrl(url));
  var doc = getDoc(pageUrl);
  if (!doc) return Response.error("Không tải được trang chi tiết");

  var name = "";
  var h1 = getFirst(doc, "h1");
  if (h1) name = getText(h1);
  if (name === "") {
    var titleTag = getFirst(doc, "title");
    if (titleTag) name = getText(titleTag);
    var bar = name.indexOf("|");
    if (bar >= 0) name = name.substring(0, bar);
    var dash = name.indexOf("-");
    if (dash >= 0) name = name.substring(0, dash);
    name = trimText(name);
  }
  if (name === "" || isBadTitle(name)) name = makeNameFromUrl(pageUrl);

  var cover = "";
  var ogImage = getFirst(doc, "meta[property='og:image']");
  if (ogImage) {
    cover = absUrl(getAttr(ogImage, "content"));
    if (cover) cover = safeUrl(cover);
  }

  if (!cover) {
    var coverImg = getFirst(doc, "img[alt*='Bìa truyện'], img[alt*='Bia truyện'], img[alt*='cover'], img[alt*='poster'], img[src*='/manga-posters/'], img[src*='/story-images/']");
    if (coverImg) {
      cover = safeUrl(getImageSrc(coverImg));
    }
  }

  if (!cover) {
    var imgs = doc.select("img");
    for (var i = 0; i < imgs.size(); i++) {
      var img = imgs.get(i);
      var src = getImageSrc(img);
      var alt = getAttr(img, "alt");
      var low = (src + " " + alt).toLowerCase();
      if (src === "") continue;
      if (low.indexOf("logo") >= 0 || low.indexOf("avatar") >= 0 || low.indexOf("favicon") >= 0) continue;
      if (low.indexOf("banner") >= 0 || low.indexOf("ads") >= 0 || low.indexOf("advert") >= 0) continue;
      cover = safeUrl(src);
      break;
    }
  }

  var author = "";
  var authorLinks = doc.select('a[href*="tac-gia"], a[href*="author"], a[href*="artist"]');
  if (authorLinks && authorLinks.size() > 0) author = getText(authorLinks.get(0));

  var description = "";
  var ps = doc.select("p");
  for (var p = 0; p < ps.size(); p++) {
    var pt = getText(ps.get(p));
    if (pt.length > 40) {
      description = pt;
      break;
    }
  }

  var detail = description;
  if (detail === "") detail = name;

  var genreList = [];
  var usedGenre = {};
  var gs = doc.select('a[href*="/genres/"], a[href*="/the-loai/"], a[href*="/tag/"]');
  for (var g = 0; g < gs.size(); g++) {
    var ga = gs.get(g);
    var gt = getText(ga);
    var gh = removeEndSlash(safeUrl(getAttr(ga, "href")));
    if (gt === "" || usedGenre[gh]) continue;
    if (isBadTitle(gt)) continue;
    genreList.push({ title: gt, input: gh, script: "genrecontent.js" });
    usedGenre[gh] = true;
  }

  return Response.success({
    name: name,
    cover: cover,
    host: BASE_URL,
    author: author,
    description: description,
    detail: detail,
    ongoing: false,
    genres: genreList
  });
}
