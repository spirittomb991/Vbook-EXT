function execute(url) {
    var response = fetch(url);
    if (response.ok) {
        var doc = response.html();
        var content = doc.select(".chapter-content").html();
        return Response.success(content);
    }
    return null;
}