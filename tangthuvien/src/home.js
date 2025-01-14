function execute() {
    return Response.success([
        {title: "Hot", input: "https://tangthuvien.net/hot", script: "homecontent.js"},
        {title: "New", input: "https://tangthuvien.net/new", script: "homecontent.js"}
    ]);
}