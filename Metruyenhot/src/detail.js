function execute(url) {
  var response = fetch(url);
  var doc = response.html();
  var name = doc.select('.wrap-detail .title h1').text();
  var cover = doc.select('.wrap-detail img').attr('data-src');
  var author = doc.select('.info [itemprop="author"]').text();
  var description = doc.select('.content1').text();
  var detail = doc.select('.content1').html();
  var ongoing = doc.select('.info .status').text().toLowerCase().indexOf('full') === -1;
  var genres = [];
  doc.select('.info [itemprop="genre"]').forEach(function(e) {
    genres.push({
      title: e.text(),
      input: '',
      script: ''
    });
  });
  return Response.success({
    name: name,
    cover: cover,
    host: 'metruyenhot.vn',
    author: author,
    description: description,
    detail: detail,
    ongoing: ongoing,
    genres: genres
  });
}
