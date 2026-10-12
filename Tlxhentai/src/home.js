load("utils.js");

function execute() {
    return Response.success([
        { title: "Mới cập nhật", input: BASE_URL + "/", script: "homecontent.js" },
        { title: "English", input: BASE_URL + "/language/hentai-english/", script: "homecontent.js" },
        { title: "Tiếng Việt", input: BASE_URL + "/language/hentai-tieng-viet/", script: "homecontent.js" },
        { title: "Doujinshi", input: BASE_URL + "/category/doujinshi/", script: "homecontent.js" },
        { title: "Hentai", input: BASE_URL + "/category/hentai/", script: "homecontent.js" },
        { title: "Hentai Uncensored", input: BASE_URL + "/category/hentai-uncensored/", script: "homecontent.js" },
        { title: "Comics", input: BASE_URL + "/category/comics/", script: "homecontent.js" }
    ]);
}
