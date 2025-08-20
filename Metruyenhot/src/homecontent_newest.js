function execute(url, page) {
  var response = fetch(url);
  var doc = response.html();
  var list = [];
  doc.select('.table-update tr').forEach(function(tr) {
    var name = tr.select('.name a').text() || '';
    var link = tr.select('.name a').attr('href') || '';
    var cover = '';
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
