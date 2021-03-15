function validateHomePageURL(url: any) {
	if (!url) {
		return false;
	}

	let draft = url;

	if (!draft.startsWith('/')) {
		draft = `/${draft}`;
	}

	if (!draft.endsWith('/')) {
		draft = `${draft}/`;
	}

	return draft;
}

export default validateHomePageURL;
