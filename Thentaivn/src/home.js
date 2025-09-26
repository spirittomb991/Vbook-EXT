load('config.js');
function execute() {
    return Response.success([
        {title: "Trang chủ", input: "https://www.hentaivnx.us", script: "gen.js"},
        {title: "Truyện mới", input: "https://www.hentaivnx.us/tim-truyen", script: "gen.js"},
        {title: "Không che", input: "https://www.hentaivnx.us/tim-truyen/khong-che", script: "gen.js"},
        {title: "Truyện màu", input: "https://www.hentaivnx.us/tim-truyen/truyen-mau", script: "gen.js"},
        {title: "Series", input: "https://www.hentaivnx.us/tim-truyen/series", script: "gen.js"}
    ]);
}