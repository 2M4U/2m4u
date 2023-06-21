const fs = require('fs');
const FetchData = require('./fetchData');
const CountLanguages = require('./countLanguages');
const GenerateContent = require('./generateContent');

const owner = '2M4U'; // Replace with your GitHub username

async function generateReadme() {
    const fetchData = new FetchData();
    const countLanguages = new CountLanguages();
    const generateContent = new GenerateContent();

    try {
        // Fetch repositories
        const repositories = await fetchData.getRepositories(owner);

        // Count language usage
        const languageCount = countLanguages.countLanguageUsage(repositories);

        // Generate README content
        const readmeContent = generateContent.generateReadmeContent(repositories, owner, fetchData.getGithubStatistics, languageCount);

        // Write README.md file
        fs.writeFileSync('README.md', readmeContent);
        console.log('README.md file generated successfully.');
    } catch (error) {
        console.error('Error generating README.md:', error.message);
    }
}

generateReadme();
