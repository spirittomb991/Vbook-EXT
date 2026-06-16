load("utils.js");

function execute(url) {
  var chapUrl = removeEndSlash(url);
  chapUrl = safeUrl(chapUrl);

  // Không chặn Coming soon bằng chữ/URL nữa, vì một số chap Coming soon vẫn có ảnh.
  // Nguyên tắc mới: cứ mở trang chương và chỉ trả lỗi mềm khi thật sự không tìm thấy ảnh.
  var html = getTextResponse(chapUrl);
  var list = imagesFromRawHtml(html);

  // Nếu chưa đủ ảnh thì parse DOM bằng fetch thường.
  if (list.length <= 1) {
    var doc = getDoc(chapUrl);
    list = mergeImageLists(list, imagesToList(doc, chapUrl));
  }

  // Nếu vẫn chỉ có 0-1 ảnh thì dùng browser để đợi lazy-load.
  if (list.length <= 1) {
    var browser = Engine.newBrowser();
    browser.setUserAgent(UserAgent.android());
    try {
      browser.launch(chapUrl, 25000);
      sleep(3000);
      try { browser.callJs("window.scrollTo(0, document.body.scrollHeight);", 1500); } catch (e0) {}
      try { browser.callJs("window.scrollTo(0, 0);", 800); } catch (e1) {}
      try { browser.callJs("window.scrollTo(0, document.body.scrollHeight);", 1500); } catch (e2) {}
      var doc2 = browser.html();
      list = mergeImageLists(list, imagesToList(doc2, chapUrl));
      try { list = mergeImageLists(list, imagesFromRawHtml(S(doc2.html ? doc2.html() : ""))); } catch (e3) {}
    } catch (e) {
      // bỏ qua, phía dưới trả rỗng nếu không có ảnh
    }
    try { browser.close(); } catch (e4) {}
  }

  // Nếu chap chưa có ảnh thật, trả rỗng để Vbook không văng lỗi.
  if (list.length === 0) return Response.success([]);

  var data = [];
  var used = {};
  for (var i = 0; i < list.length; i++) {
    var img = safeUrl(list[i]);
    if (!isValidHttpUrl(img)) continue;
    if (used[img]) continue;
    data.push(makeImageItem(img));
    used[img] = true;
  }

  if (data.length === 0) return Response.success([]);
  return Response.success(data);
}
