function execute(url, page) {
  var response = fetch(url);
  var doc = response.html();
  var list = [];
  doc.select('.table-update tr').forEach(function(tr) {
    var name = tr.select('.name a').text() || '';
    var link = tr.select('.name a').attr('href') || '';
    if (link && link.indexOf('http') !== 0) link = 'https://metruyenhot.me' + link;
    var cover = '';
    // Tìm cover từ trang chi tiết nếu có
    var detailLink = link;
    if (detailLink) {
      try {
        var detailRes = fetch(detailLink);
        var detailDoc = detailRes.html();
        cover = detailDoc.select('.wrap-detail img').attr('data-src') || detailDoc.select('.wrap-detail img').attr('src') || '';
      } catch (e) {
        cover = '';
      }
    }
    list.push({
      name: name,
      link: link,
      host: 'metruyenhot.vn',
      cover: cover,
      description: ''
    });
  });
  return Response.success(list);
}
