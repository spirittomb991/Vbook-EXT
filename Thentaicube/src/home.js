load('config.js');
function execute() {
    return Response.success([
        {title: "Cập nhật", input: BASE_URL, script: "gen.js"},
        // Sắp xếp
        {title: "Trending", input: BASE_URL + "/read/?m_orderby=trending", script: "gen.js"},
        {title: "Đọc nhiều nhất", input: BASE_URL + "/read/?m_orderby=views", script: "gen.js"},
        // Thể loại
        {title: "Truyện Ngắn", input: BASE_URL + "/theloai/oneshot/", script: "gen.js"},
        {title: "Truyện dài", input: BASE_URL + "/theloai/series/", script: "gen.js"},
        {title: "Truyện Màu", input: BASE_URL + "/theloai/full-color/", script: "gen.js"},
        {title: "Không Che", input: BASE_URL + "/theloai/khong-che/", script: "gen.js"},
        {title: "Webtoon", input: BASE_URL + "/theloai/webtoon/", script: "gen.js"},
        {title: "Manhwa", input: BASE_URL + "/theloai/manhwa/", script: "gen.js"},
    ]);
}