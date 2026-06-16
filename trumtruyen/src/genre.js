load("config.js");

function execute() {
    // Gửi yêu cầu HTTP GET tới URL và nhận nội dung trang web dưới dạng chuỗi
    var htm = Http.get("https://trumtruyen.live/").string();
    
    if (htm) {
        // Phân tích cú pháp HTML thành một đối tượng Document
        var doc = Html.parse(htm);
        
        // Mảng để lưu danh sách các thể loại
        var genres = [];
        
        // Lấy phần tử <div> với class "dropdown-menu multi-column"
        var dropdownMenu = doc.select("div.dropdown-menu.multi-column").first();
        
        if (dropdownMenu) {
            // Lấy tất cả các phần tử <li> bên trong thẻ <div> này
            var genreItems = dropdownMenu.select("li");
            
            // Duyệt qua từng phần tử <li> và lấy thông tin bên trong
            genreItems.forEach(function(item) {
                var linkElement = item.select("a").first();
                if (linkElement) {
                    genres.push({
                        title: linkElement.attr("title").trim(), // Tiêu đề của thể loại
                        input: linkElement.attr("href"), // URL của thể loại
                        script: "gen.js" // Tên script liên quan
                    });
                }
            });
        }
        
        // Trả về danh sách các thể loại
        return Response.success(genres);
    }
    
    return null;
}