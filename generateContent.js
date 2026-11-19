class GenerateContent {
  generateRepositorySection(repositories, owner, getStatisticsContent) {
    let content = '';

    repositories.sort((repoA, repoB) => repoB.stargazers_count - repoA.stargazers_count);

    content += '## Repositories\n\n';
    content += '| Repository | Owner | Description | Topics | Stars | Forks | Open Issues | Watchers |\n';
    content += '| --- | --- | --- | --- | --- | --- | --- | --- |\n';

    for (const repo of repositories) {
      const repoName = repo.name;
      const repoDescription = repo.description || '';
      const repoTopics = repo.topics ? repo.topics.join(', ') : '';
      const statistics = getStatisticsContent(owner, repoName) || {}; 

      // Ensure the necessary stats are available, fallback to 0 if not present
      const stars = statistics.Stars || 0;
      const forks = statistics.Forks || 0;
      const openIssues = statistics['Open Issues'] || 0;
      const watchers = statistics.Watchers || 0;

      content += `| [${repoName}](https://github.com/${owner}/${repoName}) `;
      content += `| ${owner} `;
      content += `| ${repoDescription} `;
      content += `| ${repoTopics} `;
      content += `| ${stars} `;
      content += `| ${forks} `;
      content += `| ${openIssues} `;
      content += `| ${watchers} |\n`;
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

      content += '---\n\n';
    }

    return content;
  }

  generateReadmeContent(repositories, owner, getStatisticsContent, languageCount) {
    let content = '';

    let tableOfContents = '';
    for (const repo of repositories) {
      tableOfContents += `- [${repo.name}](#${repo.name.toLowerCase().replace(/ /g, '-')})\n`;
    }

    content += '# GitHub Repository Statistics\n\n';
    content += tableOfContents + '\n';
    content += '---\n\n';
    content += this.generateLanguageSection(languageCount);
    content += this.generateRepositorySection(repositories, owner, getStatisticsContent);

    return content;
  }
}

module.exports = GenerateContent;
