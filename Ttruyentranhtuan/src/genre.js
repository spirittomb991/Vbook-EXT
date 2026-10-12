function execute() {
    let response = fetch("https://truyentuan.xyz/danh-sach-category");
    if (response.ok) {
        let doc = response.html();
        let menu = doc.select("section#category-list li a")
        var nav = []
        menu.forEach(e => {
            let input = "http://truyentuan.xyz" + e.select('a').attr("href");
            nav.push({ 
                title: e.text(), 
                input: input, 
                script: "zen.js" 
            })
        })
        return Response.success(nav)
    }
    return null;
}