function execute() {
    return Response.success([
        {title: "Cập nhật", input: "https://hentaicb.help", script: "gen.js"},
        {title: "Truyện Mới", input: "https://hentaicb.help/read/?m_orderby=new-manga", script: "gen.js"},
        {title: "Truyện Update", input: "https://hentaicb.help/read/?m_orderby=latest", script: "gen.js"},
        {title: "Trending", input: "https://hentaicb.help/read/?m_orderby=trending", script: "gen.js"},
        {title: "Đọc nhiều", input: "https://hentaicb.help/read/?m_orderby=views", script: "gen.js"},
        {title: "Hoàn Thành", input: "https://hentaicb.help/?s=&post_type=wp-manga&genre%5B%5D=series&op=1&author=&status%5B%5D=end", script: "gen.js"},
    ]);
}