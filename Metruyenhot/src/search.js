function execute(key, page) {
  var url = 'https://metruyenhot.vn/tim-truyen?q=' + encodeURIComponent(key);
  var response = fetch(url);
  var doc = response.html();
  var list = [];
  doc.select('.list-story-homepage .book-item a.thumb').forEach(function(a) {
    var parent = a.parent();
    var name = parent.select('.name-book').text() || '';
    var link = a.attr('href') || '';
    if (link && link.indexOf('http') !== 0) link = 'https://metruyenhot.me' + link;
    var cover = a.select('img').attr('data-src') || a.select('img').attr('src') || '';
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
