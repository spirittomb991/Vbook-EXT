function execute(url) {
    // Gửi yêu cầu HTTP GET tới URL và nhận nội dung trang web dưới dạng chuỗi
    var htm = Http.get(url).string();
    
    if (htm) {
        // Phân tích cú pháp HTML thành một đối tượng Document
        var doc = Html.parse(htm);
        
        // Lấy nội dung của thẻ <div> với id "chapter-c" và class "chapter-c"
        var contentElement = doc.select("div#chapter-c.chapter-c[itemprop=articleBody]").first();
        
        if (contentElement) {
            // Trả về nội dung bên trong thẻ <div>
            var content = contentElement.html();
            return Response.success(content);
        }
    }
    
    return null;
}