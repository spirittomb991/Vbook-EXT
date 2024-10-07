function execute(url) {
    let response = fetch(url, {
    headers: {
        'referer': 'https://nettruyenww.com/'
    }
    });
    if (response.ok) {
        return Graphics.createImage(response.base64())
    }

    return null;
}