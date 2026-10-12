function execute() {
  // Trả về các tab hiển thị ở phần khám phá
  return Response.success([
    {
      title: "Truyện đề cử",
      input: "https://metruyenhot.vn/",
      script: "homecontent.js"
    },
    {
      title: "Truyện mới cập nhật",
      input: "https://metruyenhot.vn/",
      script: "homecontent_newest.js"
    },
    {
      title: "Truyện đã hoàn thành",
      input: "https://metruyenhot.vn/",
      script: "homecontent_full.js"
    }
  ]);
}
