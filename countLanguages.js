class CountLanguages {
    countLanguageUsage(repositories) {
        const languageCount = {};

        for (const repo of repositories) {
            const language = repo.language;

            if (language) {
                languageCount[language] = (languageCount[language] ?? 0) + 1;
            }
        }

        return languageCount;
    }
}

module.exports = CountLanguages;
