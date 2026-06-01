load("utils.js");

function execute() {
    var doc = getDoc(BASE_URL + "/genres");

    if (!doc) {
        return Response.error("Không tải được danh sách thể loại");
    }

    var out = [];
    var used = {};

    var links = doc.select("a[href]");

    for (var i = 0; i < links.size(); i++) {
        var a = links.get(i);

        var href = removeEndSlash(getAttr(a, "href"));

        if (href === "") continue;

        if (href.indexOf("http") !== 0) {
            href = BASE_URL + href;
        }

        href = removeEndSlash(href);

        if (used[href]) continue;

        if (
            href.indexOf(BASE_URL + "/genres/") !== 0 &&
            href.indexOf(BASE_URL + "/the-loai/") !== 0 &&
            href.indexOf(BASE_URL + "/tag/") !== 0
        ) {
            continue;
        }

        if (href === BASE_URL + "/genres") continue;

        var title = "";
        var description = "";

        var titleEl = a.select("div.text-txt-primary");

        if (titleEl.size() > 0) {
            title = trimText(titleEl.get(0).text());
        }

        if (title === "") {
            var divs = a.select("div");

            for (var j = 0; j < divs.size(); j++) {
                var t = trimText(divs.get(j).text());

                if (t === "") continue;
                if (t === "Xem") continue;
                if (isBadTitle(t)) continue;

                title = t;
                break;
            }
        }

        var descEl = a.select("p");

        if (descEl.size() > 0) {
            description = trimText(descEl.get(0).text());
        }

        if (title === "") {
            title = trimText(getText(a));
        }

        if (description !== "") {
            title = title.replace(description, "");
            title = trimText(title);
        }

        title = title.replace("Xem", "");
        title = trimText(title);

        if (title === "") continue;
        if (isBadTitle(title)) continue;

        var displayTitle = title;

        if (description !== "") {
            displayTitle = title + "\n\n- " + description;
        }

        out.push({
            title: displayTitle,
            input: href,
            script: "genrecontent.js"
        });

        used[href] = true;
    }

    return Response.success(out);
}