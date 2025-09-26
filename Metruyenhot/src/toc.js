function execute(url) {
  var list = [];
  var baseUrl = url.replace(/([?&])page=\d+/, '');

  // Fetch trang đầu tiên để lấy url gốc và phân trang
  var response = fetch(url);
  var doc = response.html();

  // Xác định số trang lớn nhất từ nút nexts
  var maxPage = 1;
  var nexts = doc.select('.pagination ul li.nexts a');
  if (nexts.length > 0) {
    var match = nexts.attr('href').match(/page=(\d+)/);
    if (match) {
      maxPage = parseInt(match[1]);
    }
  } else {
    // Nếu không có nexts, lấy số lớn nhất trong các trang số
    var pageNumbers = doc.select('.pagination ul li a').map(function(a){
      var t = a.text();
      return (/^\d+$/.test(t)) ? parseInt(t) : null;
    }).filter(function(x){return x});
    if (pageNumbers.length > 0) {
      maxPage = Math.max.apply(null, pageNumbers);
    }
  }

  // Lấy url chap đầu tiên ở trang đầu để làm mẫu
  var firstChapA = null;
  var chapRootFirst = doc.select('.row.list-chap.book-list.story-details');
  chapRootFirst.select('.list-chap ul li a').forEach(function(a) {
    if (!firstChapA) firstChapA = a;
  });

  // Fetch trang cuối để lấy url chap cuối cùng
  var lastPageUrl = baseUrl;
  if (lastPageUrl.indexOf('?') > -1) {
    lastPageUrl += '&page=' + maxPage;
  } else {
    lastPageUrl += '?page=' + maxPage;
  }
  var lastResp = fetch(lastPageUrl);
  var lastDoc = lastResp.html();
  var lastChapA = null;
  var chapRoot = lastDoc.select('.row.list-chap.book-list.story-details');
  chapRoot.select('.list-chap ul li a').forEach(function(a) {
    lastChapA = a;
  });

  // Nếu tìm được url chap đầu và cuối
  if (firstChapA && lastChapA) {
    var firstUrl = firstChapA.attr('href');
    var lastUrl = lastChapA.attr('href');
    var matchNum = lastUrl.match(/chuong-(\d+)/);
    if (matchNum) {
      var lastNum = parseInt(matchNum[1]);
      // Tìm tiền tố url
      var urlPrefix = firstUrl.replace(/chuong-\d+\/$/, '');
      for (var i = 1; i <= lastNum; i++) {
        list.push({
          name: 'Chương ' + i,
          url: urlPrefix + 'chuong-' + i + '/',
          host: 'metruyenhot.vn'
        });
      }
    }
  }

  return Response.success(list);
}
