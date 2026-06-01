load('config.js');
function execute(url) {
    url = absUrl(url);
    Console.log("chap: " + url);
    var doc = getDoc(url);
    if (!doc) return Response.success([]);
    var imgs = [];
    var used = {};
    
    // Try multiple selectors for different website layouts
    var selectors = [
        "#viewer img",
        ".chapter-content img",
        ".reading-content img",
        ".comic-chapter img",
        ".page-break img",
        ".comic-content img",
        ".chapter img",
        "article img",
        ".content img",
        ".post-content img",
        "[class*='chapter'] img",
        "[class*='page'] img",
        "img"
    ];
    
    var els = null;
    for (var s = 0; s < selectors.length; s++) {
        els = doc.select(selectors[s]);
        if (els && els.size() > 0) {
            Console.log("Found " + els.size() + " images using selector: " + selectors[s]);
            if (els.size() >= 3) break;
        }
    }
    
    if (!els || els.size() === 0) {
        Console.log("No images found at all");
        return Response.success([]);
    }
    
    Console.log("Processing " + els.size() + " images...");
    for (var i = 0; i < els.size(); i++) {
        var u = imgUrl(els.get(i), true); // useProxy=true for chapter images
        if (!u) {
            Console.log("Image " + i + ": empty URL");
            continue;
        }
        var low = u.toLowerCase();
        if (low.indexOf("noimage") >= 0 || low.indexOf("logo") >= 0 || low.indexOf("avatar") >= 0 || 
            low.indexOf("icon") >= 0 || low.indexOf("banner") >= 0 || low.indexOf("ad") >= 0 ||
            low.indexOf("navigate") >= 0 || low.indexOf("button") >= 0) {
            Console.log("Image " + i + ": filtered by keyword");
            continue;
        }
        if (used[u]) {
            Console.log("Image " + i + ": duplicate URL");
            continue;
        }
        used[u] = true;
        Console.log("Image " + i + ": added - " + u.substring(0, 80) + "...");
        imgs.push({link: u, fallback: u});
    }
    
    Console.log("total images extracted: " + imgs.length);
    return Response.success(imgs);
}
