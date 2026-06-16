load("utils.js");

function execute(page) {
    page = page || 1;
    var url = page === 1 ? BASE_URL + "/" : BASE_URL + "/page/" + page + "/";
    var doc = getDoc(url);
    if (!doc) return Response.error("Không tải được trang chủ");
    return Response.success(parseList(doc));
}