function execute(url) {
  var response = fetch(url);
  var doc = response.html();
  var list = [];
  doc.select('.list-chap ul li a').forEach(function(a) {
    list.push({
      name: a.text(),
      url: a.attr('href'),
      host: 'metruyenhot.vn'
    });
  });
  return Response.success(list);
}
