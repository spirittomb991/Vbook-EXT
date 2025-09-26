var BASE_URL = 'https://nhentai.net';
try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (e) {}
