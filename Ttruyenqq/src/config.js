let BASE_URL = "https://truyenqqko.com";
try {
    if (DOMAIN) {
        BASE_URL = DOMAIN;
    }
} catch (error) {
}
BASE_URL = BASE_URL.replace(/\/+$/, "");

function normalizeUrl(url) {
    return url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
}

function absUrl(url) {
    if (!url) return "";
    if (url.indexOf("//") === 0) return "https:" + url;
    if (url.indexOf("http") === 0) return url;
    return BASE_URL + (url.indexOf("/") === 0 ? "" : "/") + url;
}

// The site occasionally serves a tiny page that sets a cookie via inline JS
// before showing real content; replay that cookie once.
function fetchDoc(url) {
    let response = fetch(url);
    if (!response.ok) return null;
    let text = response.text();
    let cookie = text.match(/document\.cookie\s*=\s*"(.*?)"/);
    if (cookie && text.length < 5000) {
        response = fetch(url, { headers: { "Cookie": cookie[1] } });
        if (!response.ok) return null;
        text = response.text();
    }
    return Html.parse(text);
}
