load('config.js');
function execute(url) {
    url = absUrl(url);
    Console.log("toc: " + url);
    var doc = getDoc(url);
    if (!doc) return Response.success([]);
    var data = [];
    var used = {};

    // Try multiple selector patterns for robustness
    var selectors = [
        "ul.chapter-list a[href]",
        ".chapter-list a[href]",
        "#result-for-action a[href]",
        ".current-reading a[href]",
        "a.btn-danger[href]",
        "a[href*='/chap-']",
        "a[href*='/oneshot']",
        "a[href*='-chap-']",
        "a[href*='/chapter']",
        ".chapter-item a[href]",
        ".chapter a[href]",
        "[class*='chapter'] a[href]"
    ];
    
    var links = null;
    for (var s = 0; s < selectors.length; s++) {
        links = doc.select(selectors[s]);
        if (links && links.size() > 0) {
            Console.log("Found " + links.size() + " chapters using selector: " + selectors[s]);
            break;
        }
    }
    
    if (!links || links.size() === 0) {
        Console.log("No chapters found");
        return Response.success([]);
    }
    
    for (var i = 0; i < links.size(); i++) {
        var a = links.get(i);
        var href = absUrl(a.attr("href"));
        if (href.indexOf(BASE_URL) !== 0) continue;
        if (href === url) continue;
        if (href.indexOf(".html") < 0 && href.indexOf("/oneshot") < 0) continue;
        if (href.indexOf("/genre/") >= 0 || href.indexOf("/category/") >= 0) continue;
        if (used[href]) continue;
        var name = cleanText(a.attr("title"));
        if (name === "") name = cleanText(a.text());
        if (name === "" || name === "ĐỌC NGAY") {
            var slug = href.split("?")[0].split("#")[0].split("/").pop().replace(/\.html$/i, "");
            name = slug.replace(/-/g, " ").replace(/chap/i, "Chap").replace(/_/g, " ");
        }
        if (name === "") continue;
        used[href] = true;
        data.push({name: name, url: href, host: HOST});
    }
    
    Console.log("chapters count: " + data.length);
    return Response.success(data.reverse());
}
