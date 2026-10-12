function execute() {
  return Response.success([
    { title: "Danh sách", input: "https://vinahentai.click/danh-sach", script: "homecontent.js" },
    { title: "Trang chủ", input: "https://vinahentai.click/", script: "homecontent.js" },
    { title: "Mới Cập Nhập", input: "https://vinahentai.click/danh-sach?sort=updatedAt", script: "homecontent.js" },
    { title: "Mới Tạo", input: "https://vinahentai.click/danh-sach?sort=createdAt", script: "homecontent.js" },
    { title: "Cũ Nhất", input: "https://vinahentai.click/danh-sach?sort=oldest", script: "homecontent.js" },
    { title: "Xem Nhiều", input: "https://vinahentai.click/danh-sach?sort=views", script: "homecontent.js" },
    { title: "Hoàn Thành", input: "https://vinahentai.click/danh-sach?sort=views&status=completed", script: "homecontent.js" }
  ]);
}
