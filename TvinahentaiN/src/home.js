function execute() {
  return Response.success([
    { title: "Danh sách", input: "https://vinahentai.bond/danh-sach", script: "homecontent.js" },
    { title: "Trang chủ", input: "https://vinahentai.bond/", script: "homecontent.js" },
    { title: "Mới Cập Nhập", input: "https://vinahentai.bond/danh-sach?page=1&sort=updatedAt", script: "homecontent.js" }, 
    { title: "Mới Tạo", input: "https://vinahentai.bond/danh-sach?page=1&sort=createdAt", script: "homecontent.js" }, 
    { title: "Cũ Nhất", input: "https://vinahentai.bond/danh-sach?page=1&sort=oldest", script: "homecontent.js" }, 
    { title: "Xem Nhiều", input: "https://vinahentai.bond/danh-sach?page=1&sort=views", script: "homecontent.js" }, 
    { title: "Hoàn Thành", input: "https://vinahentai.bond/danh-sach?page=1&sort=views&status=completed", script: "homecontent.js" } 
  ]);
}
