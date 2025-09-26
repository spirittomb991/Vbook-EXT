load('config.js');

function execute() {
    let url = BASE_URL + "/tags/popular";
    let doc = fetch(url).html();

    let tags = [];
    doc.select("#tag-container a").forEach(e => {
        let tagName = e.select("span.name").text();
        let tagLink = e.attr("href");

        if (tagName && tagLink) {
            // tab popular
            tags.push({
                title: tagName + " H",
                input: BASE_URL + tagLink + "/popular",
                script: "gen.js"
            });

            // tab new (sort mặc định)
            tags.push({
                title: tagName + " N",
                input: BASE_URL + tagLink + "/",
                script: "gen.js"
            });
        }
    });

    return Response.success(tags);
}
