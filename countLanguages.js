class CountLanguages {
    countLanguageUsage(repositories) {
        const languageCount = {};

        for (const repo of repositories) {
            const language = repo.language;

            if (language) {
                if (languageCount[language]) {
                    languageCount[language]++;
                } else {
                    languageCount[language] = 1;
                }
            }
        }

        return languageCount;
    }
}

module.exports = CountLanguages;
