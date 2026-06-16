var BASE_URL = "https://vinahentai.bond";

function S(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function trimText(v) {
  return S(v).replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
}

function absUrl(url) {
  var u = trimText(url);
  if (u === "") return "";
  if (u.indexOf("//") === 0) return "https:" + u;
  if (u.indexOf("http://") === 0 || u.indexOf("https://") === 0) return u;
  if (u.indexOf("/") === 0) return BASE_URL + u;
  return BASE_URL + "/" + u;
}

function cleanInputUrl(url) {
  var u = absUrl(url);
  if (u === "") return "";
  u = u.replace(/\\\//g, "/");
  u = u.replace(/&amp;/g, "&");
  u = u.replace(/\\u0026/g, "&");
  u = u.replace(/[\"'<>\s]/g, "");
  return u;
}

// URL trả về cho Vbook: luôn là dạng encoded an toàn.
// Nếu đầu vào đã là %C4%91 thì không được biến thành %25C4%2591.
function encodeUrlForVbook(url) {
  var u = cleanInputUrl(url);
  if (u === "") return "";
  try { u = decodeURIComponent(u); } catch (e) {}
  try { u = encodeURI(u); } catch (e2) {}
  return u;
}

// URL dùng để fetch: nhận cả URL raw có dấu và URL đã encoded từ Vbook.
function safeUrl(url) {
  return encodeUrlForVbook(url);
}

function setPageParam(url, page) {
  var pageNo = parseInt(page, 10);
  if (!pageNo || pageNo < 1) pageNo = 1;

  var u = safeUrl(url);
  if (u === "") return "";

  u = u.replace(/([?&])page=\d+/i, "$1page=" + pageNo);
  if (u.match(/[?&]page=\d+/i)) return u;

  if (pageNo === 1) return u;
  return u + (u.indexOf("?") >= 0 ? "&" : "?") + "page=" + pageNo;
}

// Chỉ dùng để so sánh slug/path, không dùng để trả về Vbook.
function decodeUrlForCompare(url) {
  var u = cleanInputUrl(url);
  try { u = decodeURIComponent(u); } catch (e) {}
  return removeEndSlashRaw(u);
}

function removeEndSlashRaw(url) {
  var u = S(url);
  while (u.length > BASE_URL.length && u.charAt(u.length - 1) === "/") {
    u = u.substring(0, u.length - 1);
  }
  return u;
}

function fetchResponse(url) {
  var variants = [];
  var a = cleanInputUrl(url);
  var b = safeUrl(url);
  var c = a;
  try { c = decodeURIComponent(a); } catch (e) {}

  if (b !== "") variants.push(b);
  if (a !== "" && a !== b) variants.push(a);
  if (c !== "" && c !== a && c !== b) variants.push(c);

  for (var i = 0; i < variants.length; i++) {
    try {
      var res = fetch(variants[i], {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 12; Mobile) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          "Referer": BASE_URL + "/",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
      });
      if (res && res.ok) return res;
    } catch (e2) {}
  }
  return null;
}

function isValidHttpUrl(url) {
  var u = S(url);
  if (u.indexOf("http://") !== 0 && u.indexOf("https://") !== 0) return false;
  if (u.indexOf("null") >= 0 || u.indexOf("undefined") >= 0) return false;
  if (/[\s<>"']/.test(u)) return false;
  return true;
}

function removeEndSlash(url) {
  var u = absUrl(url);
  while (u.length > BASE_URL.length && u.charAt(u.length - 1) === "/") {
    u = u.substring(0, u.length - 1);
  }
  return u;
}

function getAttr(el, name) {
  if (!el) return "";
  var v = S(el.attr(name));
  if (v === "" && name === "src") v = S(el.attr("data-src"));
  if (v === "" && name === "src") v = S(el.attr("data-original"));
  if (v === "" && name === "src") v = S(el.attr("data-lazy-src"));
  if (v === "" && name === "src") v = S(el.attr("data-url"));
  if (v === "" && name === "href") v = S(el.attr("data-href"));
  return v;
}

function getText(el) {
  if (!el) return "";
  return trimText(el.text());
}

function getFirst(doc, selector) {
  var els = doc.select(selector);
  if (!els || els.size() === 0) return null;
  return els.get(0);
}

function getDoc(url) {
  var res = fetchResponse(url);
  if (!res) return null;
  try { return res.html(); } catch (e) { return null; }
}

function slugOf(url) {
  var u = decodeUrlForCompare(url);
  var p = u.replace(BASE_URL, "");
  var arr = p.split("/");
  if (arr.length >= 3) return arr[2];
  return "";
}

function isBadTitle(title) {
  var t = trimText(title).toLowerCase();
  if (t === "") return true;
  if (t === "đăng truyện" || t === "dang truyen") return true;
  if (t === "đăng nhập" || t === "dang nhap") return true;
  if (t === "đăng ký" || t === "dang ky") return true;
  if (t.indexOf("đăng nhập") >= 0 || t.indexOf("dang nhap") >= 0) return true;
  if (t.indexOf("đăng ký") >= 0 || t.indexOf("dang ky") >= 0) return true;
  if (t.indexOf("tài khoản") >= 0 || t.indexOf("tai khoan") >= 0) return true;
  if (t.indexOf("manage") >= 0 || t.indexOf("account") >= 0 || t.indexOf("login") >= 0) return true;
  if (t === "trang chủ" || t === "trang chu") return true;
  if (t === "thể loại" || t === "the loai") return true;
  return false;
}

function isBadStoryUrl(url) {
  var s = slugOf(url).toLowerCase();
  if (s === "") return true;
  if (s === "dang-truyen" || s === "dang-nhap" || s === "dang-ky") return true;
  if (s === "manage" || s === "account" || s === "login" || s === "user") return true;
  if (s.indexOf("dang-nhap") >= 0 || s.indexOf("tai-khoan") >= 0 || s.indexOf("manage") >= 0) return true;
  if (s === "danh-sach" || s === "the-loai" || s === "genres") return true;
  return false;
}

function isStoryUrl(url) {
  var u = removeEndSlash(url);
  if (u.indexOf(BASE_URL + "/truyen-hentai/") !== 0) return false;
  if (isBadStoryUrl(u)) return false;
  var rest = u.substring((BASE_URL + "/truyen-hentai/").length);
  if (rest === "") return false;
  if (rest.indexOf("/") >= 0) return false;
  return true;
}

function isChapterUrl(storyUrl, url) {
  var story = removeEndSlash(storyUrl);
  var u = removeEndSlash(url);
  if (u === story) return false;
  return u.indexOf(story + "/") === 0;
}

function cleanTitle(t) {
  var x = trimText(t);
  x = x.replace(/^Hot\s+/i, "");
  x = x.replace(/^HOT\s+/i, "");
  x = x.replace(/^New\s+/i, "");
  x = x.replace(/^Oneshot\s*/i, "");
  x = x.replace(/^END!\s*/i, "");
  return trimText(x);
}

function imageFromBox(el) {
  if (!el) return "";
  var imgs = el.select("img");
  if (imgs && imgs.size() > 0) return absUrl(getAttr(imgs.get(0), "src"));
  return "";
}

function makeNameFromUrl(url) {
  var s = slugOf(url);
  if (s === "") return "Truyện";
  return trimText(s.replace(/-/g, " "));
}

function parseComicList(doc) {
  var out = [];
  var used = {};
  if (!doc) return out;

  var links = doc.select('a[href*="/truyen-hentai/"]');
  for (var i = 0; i < links.size(); i++) {
    var a = links.get(i);
    var hrefRaw = removeEndSlash(absUrl(getAttr(a, "href")));
    if (!isStoryUrl(hrefRaw)) continue;
    var href = removeEndSlash(encodeUrlForVbook(hrefRaw));
    var key = href.toLowerCase();
    try { key = decodeURIComponent(href).toLowerCase(); } catch (e) {}
    if (used[key]) continue;

    var title = cleanTitle(getText(a));
    if (isBadTitle(title)) {
      var imgs = a.select("img");
      if (imgs && imgs.size() > 0) title = cleanTitle(getAttr(imgs.get(0), "alt"));
    }
    if (isBadTitle(title)) title = makeNameFromUrl(href);
    if (isBadTitle(title)) continue;

    out.push({
      name: title,
      link: href,
      host: BASE_URL,
      cover: imageFromBox(a),
      description: ""
    });
    used[key] = true;
  }
  return out;
}

function isComingSoonText(text) {
  var t = trimText(text).toLowerCase();
  if (t === "") return false;
  if (t.indexOf("coming soon") >= 0) return true;
  if (t.indexOf("sắp ra") >= 0 || t.indexOf("sap ra") >= 0) return true;
  if (t.indexOf("đang cập nhật") >= 0 || t.indexOf("dang cap nhat") >= 0) return true;
  if (t.indexOf("chưa có") >= 0 || t.indexOf("chua co") >= 0) return true;
  return false;
}

function isComingSoonUrl(url) {
  var u = S(url).toLowerCase();
  return u.indexOf("coming-soon") >= 0
    || u.indexOf("comingsoon") >= 0
    || u.indexOf("coming_soon") >= 0
    || u.indexOf("sap-ra") >= 0
    || u.indexOf("chuong-sap") >= 0
    || u.indexOf("chapter-coming") >= 0
    || u.indexOf("dang-cap-nhat") >= 0;
}

function chapterNumber(url) {
  var u = S(url);
  var m = u.match(/\/chap-(\d+)/i);
  if (m && m.length > 1) return parseInt(m[1], 10);
  return 0;
}

function cleanChapterName(title, href) {
  var t = trimText(title);
  var m = S(href).match(/\/chap-(\d+)/i);
  if (m && m.length > 1) return "Chap " + m[1];
  if (t === "" || isBadTitle(t)) return "Chap";
  // Link chương thường có thêm lượt xem/thời gian, chỉ giữ phần Chap xx.
  var m2 = t.match(/Chap\s*\d+/i);
  if (m2 && m2.length > 0) return trimText(m2[0]);
  return t;
}


function decodeImageUrl(src) {
  var s = S(src);
  s = s.replace(/\\\//g, "/");
  s = s.replace(/&amp;/g, "&");
  s = s.replace(/\\u0026/g, "&");
  s = s.replace(/\\u002F/g, "/");
  s = s.replace(/\\\//g, "/");

  // Next/Image thường trả dạng:
  // /_next/image?url=https%3A%2F%2Fcdn.vinahentai.bond%2Fmanga-images%2F...jpg&w=...
  // Vbook đọc ổn hơn khi trả trực tiếp URL gốc trên CDN.
  var pos = s.indexOf("url=");
  if (pos >= 0) {
    var q = s.substring(pos + 4);
    var amp = q.indexOf("&");
    if (amp >= 0) q = q.substring(0, amp);
    try { q = decodeURIComponent(q); } catch (e) {}
    q = q.replace(/\\\//g, "/");
    if (q.indexOf("manga-images") >= 0 || q.indexOf("cdn.vinahentai.bond") >= 0) {
      return absUrl(q);
    }
  }

  // Nếu toàn bộ URL bị encode trong JSON/script thì decode thử để lộ manga-images.
  if (s.indexOf("%2F") >= 0 || s.indexOf("%3A") >= 0) {
    var d = s;
    try { d = decodeURIComponent(s); } catch (e2) {}
    d = d.replace(/\\\//g, "/");
    if (d.indexOf("manga-images") >= 0 || d.indexOf("cdn.vinahentai.bond") >= 0) return absUrl(d);
  }

  return absUrl(s);
}

function getImageSrc(img) {
  var src = getAttr(img, "src");
  if (src === "") src = getAttr(img, "data-src");
  if (src === "") src = getAttr(img, "data-original");
  if (src === "") src = getAttr(img, "data-lazy-src");
  if (src === "") src = getAttr(img, "data-url");

  // Next/image hoặc lazy loader đôi khi để ảnh thật trong srcset.
  if (src === "") {
    var ss = S(img.attr("srcset"));
    if (ss !== "") {
      var parts = ss.split(",");
      if (parts.length > 0) src = trimText(parts[parts.length - 1].split(" ")[0]);
    }
  }
  return decodeImageUrl(src);
}

function isComicImage(src, img, chapUrl) {
  var low = (S(src) + " " + getAttr(img, "alt") + " " + getAttr(img, "class") + " " + getAttr(img, "id")).toLowerCase();
  if (src === "") return false;
  if (low.indexOf("logo") >= 0) return false;
  if (low.indexOf("avatar") >= 0) return false;
  if (low.indexOf("favicon") >= 0) return false;
  if (low.indexOf("banner") >= 0) return false;
  if (low.indexOf("ads") >= 0 || low.indexOf("advert") >= 0) return false;

  // Ảnh chương của site nằm trên cdn.vinahentai.bond/manga-images/...
  var decodedSrc = S(src);
  try { decodedSrc = decodeURIComponent(decodedSrc); } catch (e) {}
  if (decodedSrc.indexOf("cdn.vinahentai.bond/manga-images/") >= 0) return true;
  if (decodedSrc.indexOf("/manga-images/") >= 0) return true;

  // Fallback: giữ ảnh có alt dạng Chapter nếu site đổi domain CDN.
  if (low.indexOf("chapter") >= 0 || low.indexOf("chap") >= 0) return true;
  return false;
}

function imagesToHtml(doc, chapUrl) {
  if (!doc) return "";
  var imgs = doc.select("img");
  var html = "";
  var used = {};

  for (var i = 0; i < imgs.size(); i++) {
    var img = imgs.get(i);
    var src = getImageSrc(img);
    if (!isComicImage(src, img, chapUrl)) continue;
    if (used[src]) continue;
    html += '<p><img src="' + src + '" /></p>';
    used[src] = true;
  }
  return html;
}

function imagesToList(doc, chapUrl) {
  if (!doc) return [];
  var imgs = doc.select("img");
  var out = [];
  var used = {};

  for (var i = 0; i < imgs.size(); i++) {
    var img = imgs.get(i);
    var src = getImageSrc(img);
    if (!isComicImage(src, img, chapUrl)) continue;
    if (used[src]) continue;
    out.push(src);
    used[src] = true;
  }
  return out;
}

function getTextResponse(url) {
  var res = fetchResponse(url);
  if (!res) return "";
  try { return res.text(); } catch (e) { return ""; }
}

function normalizeHtmlUrl(u) {
  var s = S(u);
  s = s.replace(/\\\//g, "/");
  s = s.replace(/&amp;/g, "&");
  s = s.replace(/\\u0026/g, "&");
  s = s.replace(/%5C/g, "");
  return absUrl(s);
}

function imagesFromRawHtml(html) {
  var out = [];
  var used = {};
  var text = S(html);
  if (text === "") return out;

  // Bắt tất cả URL ảnh manga trong HTML/script JSON, kể cả dạng escaped \/.
  var re = /(?:https?:)?\\?\/\\?\/[^"'<>\\\s]+manga-images[^"'<>\\\s]+?\.(?:jpg|jpeg|png|webp)(?:\?[^"'<>\\\s]*)?/ig;
  var m;
  while ((m = re.exec(text)) !== null) {
    var src = normalizeHtmlUrl(m[0]);
    if (src.indexOf("//") === 0) src = "https:" + src;
    if (src.indexOf("http") !== 0) continue;
    if (used[src]) continue;
    out.push(src);
    used[src] = true;
  }

  // Bắt URL CDN bị encode trong Next/Image hoặc JSON: https%3A%2F%2Fcdn...%2Fmanga-images...
  var reEnc = /https?%3A%2F%2F[^"'<>\s]+?(?:manga-images|manga-images%2F)[^"'<>\s]+?\.(?:jpg|jpeg|png|webp)(?:%3F[^"'<>\s]*)?/ig;
  while ((m = reEnc.exec(text)) !== null) {
    var srcEnc = normalizeHtmlUrl(m[0]);
    if (!isImageUrl(srcEnc)) continue;
    if (used[srcEnc]) continue;
    out.push(srcEnc);
    used[srcEnc] = true;
  }

  // Bắt tham số url= trong Next/Image.
  var reNext = /url=([^"'&<>\s]+manga-images[^"'&<>\s]+?\.(?:jpg|jpeg|png|webp)(?:%3F[^"'&<>\s]*)?)/ig;
  while ((m = reNext.exec(text)) !== null) {
    var srcNext = normalizeHtmlUrl(m[1]);
    if (!isImageUrl(srcNext)) continue;
    if (used[srcNext]) continue;
    out.push(srcNext);
    used[srcNext] = true;
  }

  // Fallback: bắt trong các attribute lazy phổ biến.
  var re2 = /(src|data-src|data-original|data-lazy-src|data-url|data-full|data-pswp-src|content)=["']([^"']+)["']/ig;
  while ((m = re2.exec(text)) !== null) {
    var src2 = normalizeHtmlUrl(m[2]);
    if (!isImageUrl(src2)) continue;
    if (src2.indexOf("manga-images") < 0) continue;
    if (used[src2]) continue;
    out.push(src2);
    used[src2] = true;
  }
  return out;
}

function isImageUrl(src) {
  var s = S(src).toLowerCase();
  return s.indexOf(".jpg") >= 0 || s.indexOf(".jpeg") >= 0 || s.indexOf(".png") >= 0 || s.indexOf(".webp") >= 0;
}

function mergeImageLists(a, b) {
  var out = [];
  var used = {};
  for (var i = 0; i < a.length; i++) {
    if (!used[a[i]]) { out.push(a[i]); used[a[i]] = true; }
  }
  for (var j = 0; j < b.length; j++) {
    if (!used[b[j]]) { out.push(b[j]); used[b[j]] = true; }
  }
  return out;
}

function makeImageItem(src) {
  var s = safeUrl(decodeImageUrl(src));
  // Một số bản Vbook đọc link, một số bản đọc url/src; giữ đủ 3 field để tương thích.
  return { link: s, url: s, src: s, fallback: [s] };
}
