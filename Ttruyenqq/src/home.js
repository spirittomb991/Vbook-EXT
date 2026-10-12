function execute() {
    return Response.success([
        { title: "Top Ngày", input: "/top-ngay", script: "search.js" },
        { title: "Top Tuần", input: "/top-tuan", script: "search.js" },
        { title: "Top Tháng", input: "/top-thang", script: "search.js" },
        { title: "Yêu Thích", input: "/truyen-yeu-thich", script: "search.js" },
        { title: "Mới Cập Nhật", input: "/truyen-moi-cap-nhat", script: "search.js" },
        { title: "Truyện Mới", input: "/truyen-tranh-moi", script: "search.js" },
        { title: "Truyện Full", input: "/truyen-hoan-thanh", script: "search.js" },
        { title: "Truyện Ngẫu Nhiên", input: "/truyen-ngau-nhien", script: "search.js" }
    ]);
}
