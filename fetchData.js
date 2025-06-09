const fetch = require('node-fetch');

class FetchData {
    async getRepositories(owner) {
        const url = `https://api.github.com/users/${owner}/repos`;
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch repositories: ${response.status} ${response.statusText}`);
            }

            const repositories = await response.json();
            return repositories;
        } catch (error) {
            console.error(`Error fetching repositories from GitHub: ${error.message}`);
            throw error;
        }
    }

    async getGithubStatistics(owner, repo) {
        const url = `https://api.github.com/repos/${owner}/${repo}`;
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to fetch statistics for ${repo}: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const statistics = {
                Stars: data.stargazers_count,
                Forks: data.forks_count,
                'Open Issues': data.open_issues_count,
                Watchers: data.subscribers_count,
            };
            return statistics;
        } catch (error) {
            console.error(`Error fetching statistics for ${repo}: ${error.message}`);
            throw error;
        }
    }
}

module.exports = FetchData;
