function execute(url) {
    url = url.replace("truyentuan.xyz", "truyentuan.xyz");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let el = doc.select("#manga-chapter").select(".chapter-name a")
        const data = [];
        for (let i = 0;i < el.size(); i++) {
            var e = el.get(i);
            data.push({
                name: e.select("a").text(),
                url: e.attr("href"),
                host: "http://truyentuan.xyz"
            })
        }
        data.reverse()
        return Response.success(data);
    }
    return null;
}