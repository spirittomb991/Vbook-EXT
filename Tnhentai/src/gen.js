load("utils.js");

function execute(url, page) {
    page = page || 1;
    url = url || BASE_URL + "/";

    if (page > 1) {
        url = url.replace(/\/$/, "") + "/page/" + page + "/";
    }

    var doc = getDoc(url);
    if (!doc) return Response.error("Không tải được danh sách");
    return Response.success(parseList(doc));
}