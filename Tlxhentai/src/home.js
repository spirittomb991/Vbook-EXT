load("utils.js");

function execute() {
    return Response.success([
        { title: "Truyện Mới", input: BASE_URL + "/moi-cap-nhat", script: "homecontent.js" },
        { title: "Hot Nhất", input: BASE_URL + "/truyen-tranh-hot", script: "homecontent.js" },
        { title: "Top Đánh Giá", input: BASE_URL + "/moi-cap-nhat?sort=top_rated", script: "homecontent.js" },
        { title: "Xem Nhiều", input: BASE_URL + "/moi-cap-nhat?sort=most_viewed", script: "homecontent.js" },
        { title: "Hoàn Thành", input: BASE_URL + "/da-hoan-thanh", script: "homecontent.js" },
        { title: "Trang Chủ", input: BASE_URL + "/", script: "homecontent.js" }
    ]);
}
