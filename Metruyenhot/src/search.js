function execute(key, page) {
  var url = 'https://metruyenhot.vn/tim-truyen?q=' + encodeURIComponent(key);
  var response = fetch(url);
  var doc = response.html();
  var list = [];
  doc.select('.list-story-homepage .book-item a.thumb').forEach(function(a) {
    var parent = a.parent();
    var name = parent.select('.name-book').text();
    var link = a.attr('href');
    var cover = a.select('img').attr('data-src');
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
