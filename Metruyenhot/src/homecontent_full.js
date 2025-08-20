function execute(url, page) {
  var response = fetch(url);
  var doc = response.html();
  var list = [];
  doc.select('.list-full-books .book-item').forEach(function(item) {
    var name = item.select('.name-book').text() || '';
    var link = item.select('a.thumb').attr('href') || '';
    var cover = item.select('img').attr('data-src') || item.select('img').attr('src') || '';
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
