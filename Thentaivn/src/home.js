load('config.js');
function execute() {
    return Response.success([
        {title: "Trang chủ", input: "https://www.hentaivnx.com", script: "gen.js"},
        {title: "Truyện mới", input: "https://www.hentaivnx.com/tim-truyen", script: "gen.js"},
        {title: "Không che", input: "https://www.hentaivnx.com/tim-truyen/khong-che", script: "gen.js"},
        {title: "Truyện màu", input: "https://www.hentaivnx.com/tim-truyen/truyen-mau", script: "gen.js"},
        {title: "Series", input: "https://www.hentaivnx.com/tim-truyen/series", script: "gen.js"}
    ]);
}