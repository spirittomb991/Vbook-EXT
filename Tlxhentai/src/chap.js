load("utils.js");

function cleanImageUrl(src) {
    try {
        if (!src) return "";
        src = trimText(src);
        src = src.replace(/\\\//g, "/");
        src = src.replace(/&amp;/g, "&");
        if (src.indexOf("//") === 0) src = "https:" + src;
        if (src.indexOf("/_next/image") === 0) src = BASE_URL + src;
        src = decodeNextImage(toAbsoluteUrl(src));
        return src;
    } catch (e) {
        return src;
    }
}

function addImage(list, used, src) {
    try {
        src = cleanImageUrl(src);
        if (!isGoodImage(src)) return;
        if (used[src]) return;
        used[src] = true;
        list.push({ link: src, fallback: src });
    } catch (e) {}
}

function addFromImgElement(list, used, img) {
    try {
        var attrs = ["data-src", "data-original", "data-lazy-src", "data-url", "data-full", "data-image", "src"];
        for (var i = 0; i < attrs.length; i++) {
            var src = getAttr(img, attrs[i]);
            addImage(list, used, src);
        }
        var srcset = getAttr(img, "srcset");
        if (srcset !== "") {
            var arr = srcset.split(",");
            for (var s = 0; s < arr.length; s++) addImage(list, used, trimText(arr[s]).split(" ")[0]);
        }
    } catch (e) {}
}

function scanImagesFromText(list, used, html) {
    try {
        if (!html) return;
        html = "" + html;
        html = html.replace(/&amp;/g, "&");

        var reNext = /(?:https?:)?\/\/[^"'\s<>]*\/_next\/image\?url=([^"'&<>\s]+)[^"'<>\s]*/ig;
        var m;
        while ((m = reNext.exec(html)) !== null) {
            try { addImage(list, used, decodeURIComponent(m[1])); } catch (e) {}
        }

        var reNext2 = /\/_next\/image\?url=([^"'&<>\s]+)[^"'<>\s]*/ig;
        while ((m = reNext2.exec(html)) !== null) {
            try { addImage(list, used, decodeURIComponent(m[1])); } catch (e2) {}
        }

        var reAbs = /https?:\\?\/\\?\/[^"'\\\s<>]+?\.(?:jpg|jpeg|png|webp|avif)(?:\?[^"'\\\s<>]*)?/ig;
        while ((m = reAbs.exec(html)) !== null) {
            addImage(list, used, m[0].replace(/\\\//g, "/"));
        }

        var reEsc = /https?%3A%2F%2F[^"'\s<>]+?\.(?:jpg|jpeg|png|webp|avif)(?:%3F[^"'\s<>]*)?/ig;
        while ((m = reEsc.exec(html)) !== null) {
            try { addImage(list, used, decodeURIComponent(m[0])); } catch (e3) {}
        }
    } catch (e) {}
}

function execute(url) {
    try {
        url = toAbsoluteUrl(url);
        Console.log("chap url: " + url);
        var doc = getDoc(url);
        if (!doc) return Response.success([]);

        var images = [];
        var used = {};

        var roots = doc.select("#viewer img, section#viewer img, .chapter-content img, .reading-content img, .entry-content img, article img, img");
        for (var i = 0; i < roots.size(); i++) addFromImgElement(images, used, roots.get(i));

        scanImagesFromText(images, used, "" + doc);

        Console.log("image count: " + images.length);
        return Response.success(images);
    } catch (e) {
        Console.log("chap error: " + e);
        return Response.success([]);
    }
}
