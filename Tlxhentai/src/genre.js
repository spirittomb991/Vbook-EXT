load('config.js');
function execute() {
    var doc = getDoc(BASE_URL + "/the-loai");
    var data = [];
    var used = {};
    if (doc) {
        var links = doc.select("a[href*='/genre/'], a[href*='/category/']");
        Console.log("genre links found: " + links.size());
        for (var i = 0; i < links.size(); i++) {
            var a = links.get(i);
            var href = absUrl(a.attr("href"));
            if (used[href]) continue;
            if (href.indexOf("/genre/") < 0 && href.indexOf("/category/") < 0) continue;
            var title = cleanText(a.attr("title"));
            if (title.indexOf("Tất Cả Truyện ") === 0) title = title.replace("Tất Cả Truyện ", "");
            if (title === "") title = cleanText(a.text());
            title = title.replace(/^Tất Cả Truyện\s+/i, "");
            if (title === "" || title === "Đọc ngay" || title.length < 2) continue;
            used[href] = true;
            data.push({title: title, input: href, script: "gen.js"});
        }
    }
    
    Console.log("genres count: " + data.length);
    
    if (data.length === 0) {
        Console.log("Using fallback genres");
        data = [
            {title: "Không Che", input: BASE_URL + "/category/khong-che", script: "gen.js"},
            {title: "Có Che", input: BASE_URL + "/category/co-che", script: "gen.js"},
            {title: "One Shot", input: BASE_URL + "/category/one-shot", script: "gen.js"},
            {title: "Milf", input: BASE_URL + "/genre/milf", script: "gen.js"},
            {title: "NTR", input: BASE_URL + "/genre/ntr", script: "gen.js"},
            {title: "School Girl", input: BASE_URL + "/genre/school-girl", script: "gen.js"},
            {title: "Orgy", input: BASE_URL + "/genre/orgy", script: "gen.js"}
        ];
    }
    return Response.success(data);
}
