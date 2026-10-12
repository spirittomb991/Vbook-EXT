load('config.js');

function firstNode(doc, selectors) {
    for (let i = 0; i < selectors.length; i++) {
        let node = doc.select(selectors[i]).first();
        if (node && node.text && (node.text().trim() || node.attr("src") || node.attr("content") || node.attr("href"))) {
            return node;
        }
    }
    return null;
}

function nodeText(doc, selectors) {
    let node = firstNode(doc, selectors);
    return node ? node.text().replace(/\s+/g, " ").trim() : "";
}

function nodeAttr(doc, selectors, attr) {
    let node = firstNode(doc, selectors);
    return node ? (node.attr(attr) || "").trim() : "";
}

function cleanHref(href) {
    if (!href) return "";
    return href.replace(/^https?:\/\/[^\/]+/i, "");
}

function buildDetail(doc) {
    let lines = [];
    let seen = {};
    let items = doc.select(".book_info .list-info li");
    if (!items || items.size() === 0) items = doc.select(".book-detail .list-info li");
    if (!items || items.size() === 0) items = doc.select(".book_info li");

    items.forEach(function (item) {
        let label = item.select(".name").text().replace(/\s+/g, " ").trim();
        let value = item.select("p").last().text().replace(/\s+/g, " ").trim();

        if (!label) {
            let strong = item.select("strong").first();
            label = strong ? strong.text().replace(/\s+/g, " ").trim() : "";
        }
        if (!value) {
            value = item.text().replace(/\s+/g, " ").trim();
            if (label && value.indexOf(label) === 0) value = value.substring(label.length).replace(/^[\s:：-]+/, "").trim();
        }

        if (!label || !value || label === value) return;
        let key = label.toLowerCase() + "|" + value.toLowerCase();
        if (seen[key]) return;
        seen[key] = true;
        lines.push(label + ": " + value);
    });
    return lines.join("<br>");
}

function execute(url) {
    url = normalizeUrl(url);
    let doc = fetchDoc(url);
    if (!doc) return Response.error("Không tải được trang truyện: " + url);

    let name = nodeText(doc, [
        "h1[itemprop=name]",
        ".book_info h1",
        ".book-detail h1",
        ".book_info .book_name",
        ".book_name h1",
        "h1"
    ]);

    let author = nodeText(doc, [
        ".book_info .list-info .author a",
        ".book_info .author a",
        ".book-detail .author a",
        "a[itemprop=author]",
        ".author a"
    ]);

    let cover = nodeAttr(doc, [
        ".book_avatar img",
        ".book_info .book_avatar img",
        ".book-detail .book_avatar img",
        ".book_info img[itemprop=image]",
        "img[itemprop=image]",
        ".book_detail img"
    ], "data-src");
    if (!cover) {
        cover = nodeAttr(doc, [
            ".book_avatar img",
            ".book_info .book_avatar img",
            ".book-detail .book_avatar img",
            ".book_info img[itemprop=image]",
            "img[itemprop=image]",
            ".book_detail img"
        ], "src");
    }
    if (!cover) {
        cover = nodeAttr(doc, [".book_avatar img", ".book_info img", ".book-detail img"], "data-original");
    }

    let descriptionNode = firstNode(doc, [
        ".story-detail-info",
        ".book_info .story-detail-info",
        ".book-detail .story-detail-info",
        ".detail-content",
        ".book_description",
        "[itemprop=description]"
    ]);
    let description = descriptionNode ? descriptionNode.html() : "";

    let tags = [];
    let tagSelectors = [
        ".book_info .list01 a",
        ".book_info .book_tags a",
        ".book-detail .list01 a",
        ".book_tags a",
        ".book_tags_content a"
    ];
    let seenTags = {};
    for (let s = 0; s < tagSelectors.length; s++) {
        let links = doc.select(tagSelectors[s]);
        links.forEach(function (el) {
            let title = el.text().replace(/\s+/g, " ").trim();
            let href = cleanHref(el.attr("href") || "");
            if (!title || !href || seenTags[href]) return;
            seenTags[href] = true;
            tags.push({ title: title, input: href, script: "search.js" });
        });
        if (tags.length > 0) break;
    }

    let status = nodeText(doc, [
        ".book_info .list-info .status",
        ".book_info .status",
        ".book-detail .status",
        ".book_info .book_status",
        ".book_status"
    ]);
    if (!status) {
        let infoText = doc.select(".book_info .list-info").text();
        if (!infoText) infoText = doc.select(".book-detail").text();
        if (infoText.indexOf("Hoàn Thành") !== -1 || infoText.indexOf("Hoàn thành") !== -1) {
            status = "Hoàn Thành";
        } else if (infoText.indexOf("Đang Cập Nhật") !== -1 || infoText.indexOf("Đang cập nhật") !== -1) {
            status = "Đang Cập Nhật";
        }
    }

    if (!name) {
        name = nodeAttr(doc, ["meta[property='og:title']", "meta[name='twitter:title']"], "content");
        name = name.replace(/\s*[-|]\s*(Truyện QQ|TruyenQQ).*$/i, "").trim();
    }
    if (!cover) {
        cover = nodeAttr(doc, ["meta[property='og:image']", "meta[name='twitter:image']"], "content");
    }
    if (!description) {
        description = nodeAttr(doc, ["meta[name='description']", "meta[property='og:description']"], "content");
    }

    if (!name) return Response.error("Không tìm thấy tên truyện. Website có thể đã thay đổi cấu trúc trang.");

    return Response.success({
        name: name,
        author: author,
        cover: absUrl(cover),
        description: description,
        detail: buildDetail(doc),
        url: url,
        type: "comic",
        format: "comic",
        ongoing: !(status.indexOf("Hoàn Thành") !== -1 || status.indexOf("Hoàn thành") !== -1 || status.indexOf("Full") !== -1),
        tags: tags,
        genres: tags.length > 0 ? [{ title: "Cùng thể loại", input: tags[0].input, script: "search.js" }] : []
    });
}
