function execute(url) {
    // Gửi yêu cầu HTTP GET tới URL và nhận nội dung trang web dưới dạng chuỗi
    var htm = Http.get(url).string();
    
    if (htm) {
        // Phân tích cú pháp HTML thành một đối tượng Document
        var doc = Html.parse(htm);
        
        // Tìm phần tử <div> với class "col-xs-12" và id "list-chapter"
        var listChapterDiv = doc.select("div.col-xs-12#list-chapter").first();
        
        if (listChapterDiv) {
            // Chuyển đổi phần tử này thành một đối tượng Document mới
            var doc = Html.parse(listChapterDiv.html());

            // Mảng để lưu danh sách các chương
            var chapters = [];
            
            // Lấy tất cả các phần tử <ul> với class là 'list-chapter' và 'l-chapters'
            var chapterLists = doc.select("ul.list-chapter, ul.l-chapters");
            
            // Duyệt qua từng phần tử <ul> và lấy các phần tử <li> bên trong
            chapterLists.forEach(function(list) {
                var items = list.select("li");
                items.forEach(function(item) {
                    var linkElement = item.select("a").first();
                    if (linkElement) {
                        // Trích xuất thông tin chương
                        var name = linkElement.text().trim(); // Tên chương
                        var url = linkElement.attr("href"); // URL của chương
                        var title = linkElement.attr("title"); // Tiêu đề của chương
                        
                        chapters.push({
                            name: name,
                            url: url,
                            title: title
                        });
                    }
                });
            });
            
            // Trả về danh sách các chương
            return Response.success(chapters);
        }
    }
    
    return null;
}