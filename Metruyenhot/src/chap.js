function execute(url) {
  var response = fetch(url);
  var doc = response.html();
  var content = doc.select('.book-list.full-story.content.chapter-c').html();
  return Response.success(content);
}
