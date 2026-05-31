var BASE_URL = 'https://vinahentai.life';
try {
	if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
		BASE_URL = CONFIG_URL;
	}
} catch (e) {}