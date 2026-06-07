load("utils.js");

function execute(key, page) {
    page = page || 1;
    var q = encodeURIComponent(key || "");
    var url = page === 1
        ? BASE_URL + "/?s=" + q
        : BASE_URL + "/page/" + page + "/?s=" + q;

    var doc = getDoc(url);
    if (!doc) return Response.error("Không tải được tìm kiếm");
    return Response.success(parseList(doc));
}