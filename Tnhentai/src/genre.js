load('config.js');

function _normalizeUrl(u) {
    if (!u) return BASE_URL + "/";
    u = ("" + u).trim();
    if (u.startsWith("http")) return u;
    if (u.startsWith("//")) return "https:" + u;
    if (u.startsWith("/")) return BASE_URL + u;
    return BASE_URL + "/" + u;
}

function execute() {
    try {
        let url = BASE_URL + "/tags/popular";
        let doc = fetch(url).html();
        if (!doc) return Response.error("Không lấy được HTML tags");

        let tags = [];
        let tagNodes = doc.select("#tag-container a");
        if (!tagNodes || tagNodes.size() === 0) {
            tagNodes = doc.select(".tag-container a"); // fallback
        }

        tagNodes.forEach(e => {
            let tagName = e.select("span.name").text().trim();
            let tagLink = e.attr("href");

            if (tagName && tagLink) {
                // Normalize path
                tagLink = _normalizeUrl(tagLink).replace(BASE_URL, "");

                // Popular tab
                tags.push({
                    title: tagName + " - Popular",
                    input: BASE_URL + tagLink + "/popular",
                    script: "gen.js"
                });

                // New tab (default)
                tags.push({
                    title: tagName + " - New",
                    input: BASE_URL + tagLink + "/",
                    script: "gen.js"
                });
            }
        });

        return Response.success(tags);
    } catch (err) {
        return Response.error("genre.js error: " + err);
    }
}
