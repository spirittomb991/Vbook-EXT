load("utils.js");

function execute() {
    var doc = getDoc(BASE_URL + "/tags/");
    if (!doc) return Response.error("Không tải được tags");

    var out = [];
    var used = {};
    var links = doc.select("a[href*='/tag/']");

    for (var i = 0; i < links.size(); i++) {
        var a = links.get(i);
        var href = abs(attr(a, "href"));
        var title = text(a).replace(/\s+\d+$/, "");

        if (!title || used[href]) continue;

        out.push({
            title: title,
            input: href,
            script: "gen.js"
        });

        used[href] = true;
    }

    return Response.success(out);
}