function execute() {
    return Response.success([
        {title: "Tiên Hiệp", input: "https://tangthuvien.net/genre/tien-hiep", script: "genrecontent.js"},
        {title: "Huyền Huyễn", input: "https://tangthuvien.net/genre/huyen-huyen", script: "genrecontent.js"}
    ]);
}