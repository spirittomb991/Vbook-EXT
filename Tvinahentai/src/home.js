load('config.js');

function execute() {
    return Response.success([
        { title: "Truyện mới", input: "https://vinahentai.life/danh-sach", script: "gen.js" },
        { title: "Truyện xem nhiều", input: "https://vinahentai.life/leaderboard/manga?period=all-time", script: "gen.js" },
        { title: "Truyện top ngày", input: "https://vinahentai.life/leaderboard/manga", script: "gen.js" }
    ]);
}
