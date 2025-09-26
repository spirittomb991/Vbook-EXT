load('config.js');

function execute() {
    return Response.success([
        {
            title: "New uploads",
            input: BASE_URL + "/",
            script: "gen.js"
        }
       
    ]);
}
