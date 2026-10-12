function execute(url) {
  try {
    var response = Http.get(url);
    var htm = response.string();
    
    if (htm) {
      var doc = Html.parse(htm);
      if (doc) {
        var main = doc.select("div.book-list.full-story.content.chapter-c");
        if (main != null && main.length > 0) {
          main.select("div#content-metruyenhot").remove();
          main.select("div[id^='show_ads']").remove();
          main.select("script").remove();
          main.select("style").remove();
          var content = main.html();
          if (content && content.trim()) {
            return Response.success([content]);
          }
        }
      }
    }
    return Response.success(["Không tìm thấy nội dung chương"]);
  } catch (err) {
    return Response.success(["Lỗi khi lấy nội dung: " + err.message]); 
  }
}