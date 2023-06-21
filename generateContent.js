class GenerateContent {
    generateRepositorySection(repositories, owner, getStatisticsContent) {
        let content = '';

        repositories.sort((repoA, repoB) => repoB.stargazers_count - repoA.stargazers_count);

        for (const repo of repositories) {
            const repoName = repo.name;
            const repoDescription = repo.description || '';
            const repoTopics = repo.topics ? repo.topics.join(', ') : '';

            content += `## ${repoName}\n\n`;
            content += `**Owner**: ${owner}\n\n`;
            content += `**Description**: ${repoDescription}\n\n`;
            content += `**Topics**: ${repoTopics}\n\n`;

            content += '### Statistics\n\n';
            content += `- **Stars**: ${repo.stargazers_count}\n`;
            content += `- **Forks**: ${repo.forks_count}\n`;
            content += `- **Open Issues**: ${repo.open_issues_count}\n`;
            content += `- **Watchers**: ${repo.subscribers_count}\n\n`;

            content += `![Stars](https://img.shields.io/github/stars/${owner}/${repoName}) `;
            content += `![Forks](https://img.shields.io/github/forks/${owner}/${repoName}) `;
            content += `![Open Issues](https://img.shields.io/github/issues/${owner}/${repoName})\n\n`;

            content += '\n';
        }

        return content;
    }

    generateLanguageSection(languageCount) {
        let content = '';

        if (Object.keys(languageCount).length > 0) {
            content += '## Most Used Languages\n\n';

            const sortedLanguages = Object.keys(languageCount).sort(
                (a, b) => languageCount[b] - languageCount[a]
            );

            for (const language of sortedLanguages) {
                content += `- ${language}: ${languageCount[language]}\n`;
            }

            content += '\n';
        }

        return content;
    }

    generateReadmeContent(repositories, owner, getStatisticsContent, languageCount) {
        let content = '';

        let tableOfContents = '';
        for (const repo of repositories) {
            tableOfContents += `- [${repo.name}](#${repo.name.toLowerCase()})\n`;
        }

        content += `# GitHub Repository Statistics\n\n${tableOfContents}\n---\n\n`;
        content += this.generateLanguageSection(languageCount);
        content += this.generateRepositorySection(repositories, owner, getStatisticsContent);

        return content;
    }
}

module.exports = GenerateContent;
