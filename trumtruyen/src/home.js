load("config.js");

function execute() {
    return Response.success([
        {title: "Truyện mới cập nhật", script: "gen.js", input: BASE_URL + "/danh-sach/truyen-moi"},
        {title: "Truyện Hot", script: "gen.js", input: BASE_URL + "/danh-sach/truyen-hot"},
        {title: "Truyện Full", script: "gen.js", input: BASE_URL + "/danh-sach/truyen-full"}
    ]);
}