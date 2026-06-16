load('config.js');

function safeText(sel) { return sel && sel.text ? sel.text().trim() : ''; }

function normalizeUrl(href) {
    if (!href) return '';
    if (href.indexOf('//') === 0) return 'https:' + href;
    if (href.indexOf('http') === 0) return href;
    if (href.indexOf('/') === 0) return BASE_URL + href;
    return BASE_URL + '/' + href;
}

function execute(url, page) {
    page = parseInt(page) || 1;
    if (!url || url === BASE_URL || url === BASE_URL + '/') {
        url = BASE_URL + '/danh-sach';
    }
    var listUrl = url.indexOf('?') === -1 ? url + '?page=' + page : url + '&page=' + page;

    var response = Http.get(listUrl);
    if (!response) return Response.error('Không lấy được trang danh sách');
    var doc = response.html();
    if (!doc) return Response.error('Không lấy được HTML danh sách');

    var items = [];
    var cards = doc.select('div.grid a[href^="/truyen-hentai/"]');
    var seen = {};
    for (var i = 0; i < cards.size(); i++) {
        var card = cards.get(i);
        var href = card.attr('href');
        if (!href) continue;
        var fullHref = normalizeUrl(href);
        if (fullHref.indexOf(BASE_URL + '/truyen-hentai/') !== 0) continue;
        if (fullHref.indexOf(BASE_URL + '/truyen-hentai/manage') === 0) continue;
        if (seen[fullHref]) continue;

        var img = card.select('img').first();
        if (!img) continue;

        var titleNode = card.select('h3').first();
        if (!titleNode) titleNode = card.select('.text-txt-primary').first();
        var name = safeText(titleNode) || img.attr('alt') || card.attr('aria-label') || '';
        if (!name) continue;

        var cover = img.attr('src') || img.attr('data-src') || img.attr('data-original') || img.attr('srcset') || '';
        if (cover.indexOf(',') > -1) cover = cover.split(',')[0].trim().split(' ')[0];
        cover = normalizeUrl(cover);

        items.push({ name: name, url: fullHref, cover: cover, host: BASE_URL });
        seen[fullHref] = true;
    }

    var next = null;
    var nextPage = page + 1;

    var pageLinks = doc.select('a[href*="?page="]');
    for (var j = 0; pageLinks && j < pageLinks.size(); j++) {
        var link = pageLinks.get(j);
        var href = link.attr('href');
        if (!href) continue;
        var m = href.match(/[?&]page=(\d+)/);
        if (m && parseInt(m[1]) === nextPage) {
            next = nextPage.toString();
            break;
        }
    }

    if (!next) {
        var pageButtons = doc.select('button');
        for (var j = 0; pageButtons && j < pageButtons.size(); j++) {
            var btn = pageButtons.get(j);
            var label = btn.attr('title') || btn.attr('aria-label') || safeText(btn);
            if (!label) continue;
            var m = label.match(/Trang\s*(\d+)/i);
            if (m && parseInt(m[1]) === nextPage) {
                next = nextPage.toString();
                break;
            }
        }

        if (!next) {
            for (var k = 0; pageButtons && k < pageButtons.size(); k++) {
                var btn = pageButtons.get(k);
                var label = btn.attr('title') || btn.attr('aria-label') || safeText(btn);
                if (!label) continue;
                if (label.indexOf('Cuối') !== -1 && !btn.attr('disabled')) {
                    next = nextPage.toString();
                    break;
                }
            }
        }
    }

    if (!next && items.length > 0) {
        next = nextPage.toString();
    }

    return Response.success(items, next);
}
