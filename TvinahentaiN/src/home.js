function execute() {
  return Response.success([
    { title: "Danh sách", input: "https://vinahentai.life/danh-sach", script: "homecontent.js" },
    { title: "Trang chủ", input: "https://vinahentai.life/", script: "homecontent.js" },
    { title: "Mới Cập Nhập", input: "https://vinahentai.life/danh-sach?page=1&sort=updatedAt", script: "homecontent.js" }, 
    { title: "Mới Tạo", input: "https://vinahentai.life/danh-sach?page=1&sort=createdAt", script: "homecontent.js" }, 
    { title: "Cũ Nhất", input: "https://vinahentai.life/danh-sach?page=1&sort=oldest", script: "homecontent.js" }, 
    { title: "Xem Nhiều", input: "https://vinahentai.life/danh-sach?page=1&sort=views", script: "homecontent.js" }, 
    { title: "Hoàn Thành", input: "https://vinahentai.life/danh-sach?page=1&sort=views&status=completed", script: "homecontent.js" } 
  ]);
}
