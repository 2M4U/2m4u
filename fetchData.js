const fetch = require('node-fetch');

class FetchData {
    async getRepositories(owner) {
        const url = `https://api.github.com/users/${owner}/repos`;
        const response = await fetch(url);

        if (response.ok) {
            const repositories = await response.json();
            return repositories;
        } else {
            throw new Error('Failed to retrieve repositories');
        }
    }

    async getGithubStatistics(owner, repo) {
        const url = `https://api.github.com/repos/${owner}/${repo}`;
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            const statistics = {
                Stars: data.stargazers_count,
                Forks: data.forks_count,
                'Open Issues': data.open_issues_count,
                Watchers: data.subscribers_count,
            };
            return statistics;
        } else {
            return null;
        }
    }
}

module.exports = FetchData;
