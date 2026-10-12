function execute() {
  var response = fetch('https://metruyenhot.vn/');
  var doc = response.html();
  var list = [];
  doc.select('.book-category ul li a').forEach(function(a) {
    list.push({
      title: a.text(),
      input: a.attr('href'),
      script: 'genrecontent.js'
    });
  });
  return Response.success(list);
}
