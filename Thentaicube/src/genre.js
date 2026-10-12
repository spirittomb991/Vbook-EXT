load('config.js');
function execute() {
    var doc = fetch(BASE_URL + "/the-loai-genres").html();
    var el = doc.select(".genres a");
    var data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        data.push({
           title: e.text(),
           input: e.attr('href'),
           script: 'gen.js'
        });
    }
    return Response.success(data);
}