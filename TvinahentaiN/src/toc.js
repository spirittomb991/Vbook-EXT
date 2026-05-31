load("utils.js");

function startsWithText(value, prefix) {
  return S(value).indexOf(prefix) === 0;
}

function firstTextIn(el, selector) {
  if (!el) return "";
  var xs = el.select(selector);
  if (xs && xs.size && xs.size() > 0) return getText(xs.get(0));
  return "";
}

// Chỉ dùng để so sánh URL, không dùng để fetch.
// Lý do: slug tiếng Việt có thể ở dạng raw hoặc %E1..., nếu encode lại rồi so với URL raw sẽ mất chap.
function decodeForCompare(v) {
  var s = removeEndSlash(absUrl(v));
  s = s.replace(/&amp;/g, "&");
  try { s = decodeURIComponent(s); } catch (e) {}
  return s;
}

function cleanHrefForReturn(v) {
  var s = absUrl(v);
  s = s.replace(/\\\//g, "/");
  s = s.replace(/&amp;/g, "&");
  s = s.replace(/\\u0026/g, "&");
  s = s.replace(/[\"'<>\s]/g, "");

  // Vbook có thể tự encode chữ đ thành %C4%91.
  // Ở toc chỉ trả URL để hiển thị/chuyển tiếp, nên decode lại phần slug tiếng Việt.
  // Khi fetch ở chap.js/getDoc, safeUrl() sẽ encodeURI lại đúng chuẩn.
  try { s = decodeURIComponent(s); } catch (e) {}

  return removeEndSlash(s);
}

function directChildTail(storyUrl, href) {
  var story = decodeForCompare(storyUrl);
  var h = decodeForCompare(href);
  if (h === story) return "";
  if (h.indexOf(story + "/") !== 0) return "";
  var tail = h.substring(story.length + 1);
  if (tail === "") return "";
  if (tail.indexOf("/") >= 0) return "";
  return tail;
}

function chapterTitleFromLink(a, href, index) {
  var name = firstTextIn(a, "span.text-txt-primary");
  if (name === "") name = firstTextIn(a, "span.text-base");
  if (name === "") name = firstTextIn(a, "span.font-medium");
  if (name === "") name = getText(a);
  name = trimText(name);

  if (name === "" || isBadTitle(name)) {
    var h = removeEndSlash(absUrl(href));
    var parts = h.split("/");
    var tail = parts.length > 0 ? parts[parts.length - 1] : "";
    try { tail = decodeURIComponent(tail); } catch (e) {}
    name = trimText(tail.replace(/-/g, " "));
  }

  if (name === "") name = "Chương " + index;
  return name;
}

function pushChapter(out, used, storyUrl, a, index) {
  var rawHref = getAttr(a, "href");
  var href = cleanHrefForReturn(rawHref);
  if (href === "") return;

  var tail = directChildTail(storyUrl, href);
  if (tail === "") return;

  var key = decodeForCompare(href).toLowerCase();
  if (used[key]) return;

  // Không lọc theo chap-1 nữa. Trang có slug chương tự do như cunny-ma-fap-uogghhh, coming-soon, hoặc slug tiếng Việt có dấu.
  var name = chapterTitleFromLink(a, href, index);
  if (isBadTitle(name)) return;

  out.push({ name: name, url: href, host: BASE_URL });
  used[key] = true;
}

function execute(url) {
  var storyUrl = removeEndSlash(absUrl(url));
  var doc = getDoc(storyUrl);
  if (!doc) return Response.success([]);

  var out = [];
  var used = {};
  var index = 1;

  // Selector chính theo HTML thực tế: <a aria-label="Đọc chương 1/2/3...">
  var links = doc.select("a[aria-label]");
  for (var i = 0; i < links.size(); i++) {
    var a = links.get(i);
    var label = trimText(getAttr(a, "aria-label"));
    var low = label.toLowerCase();
    if (startsWithText(label, "Đọc chương") || startsWithText(low, "doc chuong")) {
      pushChapter(out, used, storyUrl, a, index);
      index++;
    }
  }

  // Fallback: lấy mọi link con trực tiếp của truyện, không bắt buộc dạng chap-1.
  if (out.length === 0) {
    links = doc.select('a[href*="/truyen-hentai/"]');
    for (var j = 0; j < links.size(); j++) {
      pushChapter(out, used, storyUrl, links.get(j), index);
      index++;
    }
  }

  // Nếu site hiển thị mới nhất trước, đảo lại để Vbook đọc từ chương cũ đến mới.
  var reversed = [];
  for (var k = out.length - 1; k >= 0; k--) reversed.push(out[k]);

  return Response.success(reversed);
}
