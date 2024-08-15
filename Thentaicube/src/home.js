function execute() {
    return Response.success([
        {title: "Cập nhật", input: "https://hentaicube.net", script: "gen.js"},
        {title: "Truyện Mới", input: "https://hentaicube.net/read/?m_orderby=new-manga", script: "gen.js"},
        {title: "Trending", input: "https://hentaicube.net/read/?m_orderby=trending", script: "gen.js"},
        {title: "Đọc nhiều", input: "hhttps://hentaicube.net/read/?m_orderby=views", script: "gen.js"},
        {title: "Hoàn Thành", input: "https://hentaicube.net/?s=&post_type=wp-manga&genre%5B%5D=series&op=1&author=&status%5B%5D=end", script: "gen.js"},
    ]);
}