load('config.js');

function execute() {
    return Response.success([
        { title: "Truyện hentai mới", input: "https://vinahentai.life/danh-sach", script: "gen.js" }
    ]);
}
