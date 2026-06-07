load("utils.js");

function execute(url) {
    return Response.success([{
        name: "Full",
        url: url,
        host: BASE_URL
    }]);
}