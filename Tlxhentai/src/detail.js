load('config.js');
function execute(url) {
    url = absUrl(url);
    Console.log("detail: " + url);
    var doc = getDoc(url);
    if (!doc) return Response.success({name:"", cover:"", host:HOST, author:"", description:"", detail:"", ongoing:true, genres:[], nsfw:true});

    var name = "";
    var h1 = doc.select("h1.comic-title, h1.title, .comic-title, h1").first();
    if (h1) name = cleanText(h1.text());
    if (name === "") {
        var mt = doc.select("meta[property=og:title]").first();
        if (mt) name = cleanText(mt.attr("content"));
    }
    if (name === "") {
        var title = doc.select(".detail-title, .story-title, .book-title, [class*='title']").first();
        if (title) name = cleanText(title.text());
    }

    var cover = "";
    var og = doc.select("meta[property=og:image]").first();
    if (og) cover = absUrl(og.attr("content"));
    if (cover === "") {
        // Thử nhiều selectors khác nhau cho cover
        var coverSelectors = [
            "#comic-section img",
            ".comic-detail img",
            ".book-cover img",
            ".manga-cover img",
            ".cover img",
            ".poster img",
            ".detail-image img",
            ".detail-cover img",
            ".card img.card-img-top",
            ".card img[class*='image']",
            "img.cover",
            "img[class*='cover']",
            "img[class*='poster']",
            ".main-image img",
            ".thumbnail img"
        ];
        
        for (var c = 0; c < coverSelectors.length; c++) {
            var coverImg = doc.select(coverSelectors[c]).first();
            if (coverImg) {
                cover = imgUrl(coverImg);
                if (cover) {
                    Console.log("Found cover using selector: " + coverSelectors[c]);
                    break;
                }
            }
        }
    }

    var desc = "";
    var md = doc.select("meta[name=description]").first();
    if (md) desc = cleanText(md.attr("content"));
    if (desc === "") {
        var pdesc = doc.select("#post-decription p, .summary__content p, .entry-content p, .description p, .detail-desc p").first();
        if (pdesc) desc = cleanText(pdesc.text());
    }

    var detail = [];
    var genres = [];
    var usedGenre = {};
    var author = "";

    var items = doc.select(".comic-details__item, .detail-item, .info-item, [class*='detail'][class*='item']");
    for (var i = 0; i < items.size(); i++) {
        var item = items.get(i);
        var label = cleanText(item.select(".comic-details__label, .label, [class*='label']").text()).replace(/:$/, "");
        if (label === "") label = cleanText(item.text().split(":")[0]);
        if (label === "") continue;
        var val = cleanText(item.select(".comic-details__item_links, [class*='links']").text());
        if (val === "") val = cleanText(item.text()).replace(label, "").trim();
        if (val !== "") detail.push(label + ": " + val);

        if (label.toLowerCase().indexOf("tác giả") >= 0 || label.toLowerCase().indexOf("author") >= 0) author = val;

        var as = item.select("a[href]");
        for (var j = 0; j < as.size(); j++) {
            var a = as.get(j);
            var href = absUrl(a.attr("href"));
            if (href.indexOf("/genre/") < 0 && href.indexOf("/category/") < 0 && href.indexOf("/country/") < 0 && href.indexOf("/tag/") < 0) continue;
            var title = cleanText(a.attr("title"));
            if (title === "") title = cleanText(a.text());
            if (title === "") continue;
            if (usedGenre[href]) continue;
            usedGenre[href] = true;
            genres.push({title: title, input: href, script: "gen.js"});
        }
    }

    var statusText = cleanText(doc.select(".baka-status-completed, .baka-status-ongoing, h5[class*=status], .status, [class*='status']").text()).toLowerCase();
    var ongoing = true;
    if (statusText.indexOf("hoàn thành") >= 0 || statusText.indexOf("completed") >= 0) ongoing = false;

    return Response.success({
        name: name,
        cover: cover,
        host: HOST,
        author: author,
        description: desc,
        detail: detail.join("\n"),
        ongoing: ongoing,
        genres: genres,
        nsfw: true
    });
}
