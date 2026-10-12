load('config.js');
function execute(url) {
    url = url.replace(/^https?:\/\/[^\/]+/, BASE_URL);
    var doc = fetch(url).html();
    var selectors = [
        ".wp-manga-chapter li a",
        ".listing-chapters_wrap li a",
        ".chapter-list li a",
        ".chapters li a",
        "ul.version-chap > li > a",
        ".chapter-listing a",
        ".chapter-list .chapter a",
        ".list-chap a",
        ".chapters-list a",
        ".chapter a"
    ];
    var el = null;
    for (var i = 0; i < selectors.length; i++) {
        el = doc.select(selectors[i]);
        if (el.size() > 0) break;
    }
    if (!el || el.size() === 0) {
        el = doc.select("a");
    }
    var data = [];
    var seen = {};
    var chapRegex = /\/chap(?:ter)?-?\d+\/?$|\/chap-?\d+\/?$|\/oneshot\/?$/i;
    for (var j = el.size() - 1; j >= 0; j--) {
        var e = el.get(j);
        var href = e.attr("href");
        if (!href) continue;
        href = href.trim();
        // normalize relative links
        if (href.indexOf('http') !== 0) {
            if (href.charAt(0) === '/') href = BASE_URL + href;
            else href = BASE_URL + '/' + href;
        }
        // filter only chapter-like urls or links whose text contains 'chap'
        var text = (e.text() || '').trim();
        if (!chapRegex.test(href) && !/\bchap(?:ter)?\b/i.test(text) && !/\bchap-?\d+\b/i.test(text)) continue;
        if (href.indexOf('#') !== -1) continue;
        if (seen[href]) continue;
        seen[href] = true;
        var name = text || href;
        data.push({
            name: name,
            url: href,
            host: BASE_URL
        });
    }
    return Response.success(data);
}