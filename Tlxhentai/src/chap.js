load('config.js');
function execute(url) {
    url = absUrl(url);
    Console.log("chap: " + url);
    var doc = getDoc(url);
    if (!doc) return Response.success([]);
    var imgs = [];
    var used = {};
    var els = doc.select("#viewer img, .chapter-content img, .reading-content img, article img, img");
    for (var i = 0; i < els.size(); i++) {
        var u = imgUrl(els.get(i));
        if (!u) continue;
        var low = u.toLowerCase();
        if (low.indexOf("noimage") >= 0 || low.indexOf("logo") >= 0 || low.indexOf("avatar") >= 0 || low.indexOf("icon") >= 0) continue;
        if (used[u]) continue;
        used[u] = true;
        imgs.push({link: u, fallback: u});
    }
    return Response.success(imgs);
}
