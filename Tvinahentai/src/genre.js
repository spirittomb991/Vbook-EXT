load('config.js');

function safeText(sel) { return sel && sel.text ? sel.text().trim() : ''; }

function normalizeUrl(href) {
    if (!href) return '';
    if (href.indexOf('//') === 0) return 'https:' + href;
    if (href.indexOf('http') === 0) return href;
    if (href.indexOf('/') === 0) return BASE_URL + href;
    return BASE_URL + '/' + href;
}

function execute(url) {
    var listUrl = url || BASE_URL + '/genres';
    var doc = Http.get(listUrl).html();
    if (!doc) return Response.error('Không lấy được danh sách thể loại');

    var categories = [];
    var anchors = doc.select('a[href^="/genres/"]');
    var seen = {};
    for (var i = 0; i < anchors.size(); i++) {
        var a = anchors.get(i);
        var href = a.attr('href');
        if (!href) continue;
        href = href.replace(/\?.*$/, '').replace(/\/$/, '');
        if (href === '/genres') continue;

        var fullHref = normalizeUrl(href);
        if (fullHref.indexOf(BASE_URL + '/genres/') !== 0) continue;
        var slug = fullHref.substring((BASE_URL + '/genres/').length);
        if (!slug || slug.indexOf('/') !== -1) continue;

        var titleNode = a.select('.text-txt-primary').first();
        if (!titleNode) titleNode = a.select('h3').first();
        if (!titleNode) titleNode = a.select('.title').first();
        var name = safeText(titleNode) || safeText(a);
        if (!name) continue;
        if (seen[fullHref]) continue;

        categories.push({ title: name, input: fullHref, script: 'gen.js' });
        seen[fullHref] = true;
    }

    return Response.success(categories);
}
