var BASE_URL = "https://www.hentaivnx.vip";
try {
    if (typeof CONFIG_URL !== "undefined" && CONFIG_URL) {
        BASE_URL = normalizeBaseUrl(CONFIG_URL);
    }
} catch (error) {
}

function normalizeBaseUrl(url) {
    return String(url || "").trim().replace(/\/+$/, "");
}
