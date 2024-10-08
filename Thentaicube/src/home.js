function execute() {
    return Response.success([
        {title: "Cập nhật", input: "https://hentaicb.lol", script: "gen.js"},
        {title: "Truyện Mới", input: "https://hentaicb.lol/read/?m_orderby=new-manga", script: "gen.js"},
        {title: "Trending", input: "https://hentaicb.lol/read/?m_orderby=trending", script: "gen.js"},
        {title: "Đọc nhiều", input: "hhttps://hentaicb.lol/read/?m_orderby=views", script: "gen.js"},
        {title: "Hoàn Thành", input: "https://hentaicb.lol/?s=&post_type=wp-manga&genre%5B%5D=series&op=1&author=&status%5B%5D=end", script: "gen.js"},
    ]);
}