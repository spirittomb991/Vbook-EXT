function execute() {
    return Response.success([
        {title: "Hot", input: "https://tangthuvien.net/tong-hop?rank=vw&time=m", script: "homecontent.js"},
        {title: "New", input: "https://tangthuvien.net/tong-hop?ord=new", script: "homecontent.js"}
    ]);
}