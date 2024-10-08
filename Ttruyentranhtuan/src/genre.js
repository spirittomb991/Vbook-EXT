function execute() {
    let response = fetch("http://truyentuan.xyz/danh-sach-truyen/the-loai/truyen-tranh-viet-nam");
    if (response.ok) {
        let doc = response.html();
        let menu = doc.select("section#category-list li a")
        var nav = []
        menu.forEach(e => {
            let input = "http://truyentuan.xyz/" + e.select('a').attr("href");
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