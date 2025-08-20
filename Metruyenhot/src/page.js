function execute(url) {
  var response = fetch(url);
  var doc = response.html();
  var pages = [];
  doc.select('.pagination ul li a').forEach(function(a) {
    var pageUrl = a.attr('href');
    if (pageUrl && pageUrl !== '#') {
      pages.push(pageUrl);
    }
  });
  return Response.success(pages);
}
