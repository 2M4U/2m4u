/**
 * A utility class for analyzing programming language usage across GitHub repositories.
 */
class CountLanguages {
    /**
     * Counts the number of repositories that use each programming language.
     * 
     * @param {Array<Object>} repositories - An array of repository objects with a 'language' property
     * @returns {Object} An object mapping language names to their usage count
     * @example
     * // Returns { JavaScript: 3, Python: 2 }
     * countLanguageUsage([
     *   { language: 'JavaScript' },
     *   { language: 'JavaScript' },
     *   { language: 'Python' },
     *   { language: 'JavaScript' },
     *   { language: 'Python' }
     * ]);
     */
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
