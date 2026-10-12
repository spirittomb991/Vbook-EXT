load('config.js');
function execute(key, page) {
    if (!page) page = '1';
    var url = BASE_URL + "/tim-kiem-truyen.html?key=" + encodeURIComponent(key || "");
    var response = fetch(buildPageUrl(url, page), {
        headers: {
            "referer": BASE_URL + "/",
            "user-agent": UserAgent.android()
        }
    });

    if (response.ok) {

        var doc = response.html();

        var next = getNextPage(doc);

        var el = doc.select(".items .item, .main .block-item li.item");

        var data = [];
        for (var i = 0; i < el.size(); i++) {
            var e = el.get(i);

            var titleElement = first(e, "figcaption h3 a, .box-description a, .box-description-2 a");
            var imageElement = first(e, "figure .image a img, .box-cover img, .box-cover-2 img");

            if (titleElement && imageElement) {
                data.push({
                    name: cleanText(titleElement.text()),
                    link: absolutize(titleElement.attr("href")),
                    cover: absolutize(pickImage(imageElement)),
                    host: BASE_URL
                });
            }
        }
        return Response.success(data, next)
    }
    return null;
}

function buildPageUrl(url, page) {
    page = String(page || "1");
    if (page === "1") return url;
    return url + (url.indexOf("?") >= 0 ? "&" : "?") + "page=" + encodeURIComponent(page);
}

function getNextPage(doc) {
    var next = first(doc, ".pagination a[rel=next]");
    if (!next) return null;
    var href = next.attr("href");
    var match = href ? href.match(/[?&]page=(\d+)/) : null;
    if (match) return match[1];
    var text = cleanText(next.text());
    if (/^\d+$/.test(text)) return text;
    return null;
}

function first(node, selector) {
    var elements = node.select(selector);
    return elements && elements.size() > 0 ? elements.get(0) : null;
}

function pickImage(img) {
    return img.attr("data-original") || img.attr("data-src") || img.attr("src") || img.attr("data-lazy-src");
}

function cleanText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
}

function absolutize(url) {
    url = String(url || "").trim();
    if (!url) return url;
    if (url.indexOf("//") === 0) return "https:" + url;
    if (url.indexOf("/") === 0) return BASE_URL + url;
    return url;
}
