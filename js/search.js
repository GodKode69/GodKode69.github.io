/**
 * search.js - Search Logic Module
 * Handles search functionality and filtering
 */

class PortfolioSearch {
    constructor(data) {
        this.data = data;
        this.searchIndex = this.buildSearchIndex();
    }

    /**
     * Build search index from all portfolio data
     */
    buildSearchIndex() {
        const index = {};

        // Index projects
        this.data.projects.forEach(project => {
            const keywords = [
                project.title.toLowerCase(),
                project.description.toLowerCase(),
                ...project.tags
            ];
            keywords.forEach(keyword => {
                if (!index[keyword]) {
                    index[keyword] = [];
                }
                index[keyword].push({
                    type: 'project',
                    data: project
                });
            });
        });

        // Index skills
        Object.values(this.data.skills).forEach(skillGroup => {
            if (Array.isArray(skillGroup)) {
                skillGroup.forEach(skill => {
                    const keyword = skill.toLowerCase();
                    if (!index[keyword]) {
                        index[keyword] = [];
                    }
                    index[keyword].push({
                        type: 'skill',
                        data: skill
                    });
                });
            }
        });

        // Index experience
        this.data.experience.forEach(exp => {
            const keywords = [
                exp.title.toLowerCase(),
                exp.company.toLowerCase(),
                exp.description.toLowerCase()
            ];
            keywords.forEach(keyword => {
                if (!index[keyword]) {
                    index[keyword] = [];
                }
                index[keyword].push({
                    type: 'experience',
                    data: exp
                });
            });
        });

        // Index categories
        const categories = ['projects', 'skills', 'experience', 'contact', 'about'];
        categories.forEach(category => {
            if (!index[category]) {
                index[category] = [];
            }
            index[category].push({
                type: 'category',
                data: category
            });
        });

        return index;
    }

    /**
     * Search query in the index
     * @param {string} query - Search query
     * @returns {array} - Array of results
     */
    search(query) {
        if (!query || query.trim() === '') {
            return [];
        }

        const normalizedQuery = query.toLowerCase().trim();
        const results = [];
        const seen = new Set();

        // Direct keyword match
        if (this.searchIndex[normalizedQuery]) {
            this.searchIndex[normalizedQuery].forEach(result => {
                const key = JSON.stringify(result);
                if (!seen.has(key)) {
                    results.push(result);
                    seen.add(key);
                }
            });
        }

        // Partial matches
        Object.keys(this.searchIndex).forEach(keyword => {
            if (keyword.includes(normalizedQuery) && keyword !== normalizedQuery) {
                this.searchIndex[keyword].forEach(result => {
                    const key = JSON.stringify(result);
                    if (!seen.has(key)) {
                        results.push(result);
                        seen.add(key);
                    }
                });
            }
        });

        return results;
    }

    /**
     * Get suggestions based on partial query
     * @param {string} query - Partial query
     * @returns {array} - Array of suggestions
     */
    getSuggestions(query) {
        if (!query || query.trim() === '') {
            return [];
        }

        const normalizedQuery = query.toLowerCase().trim();
        const suggestions = new Set();

        Object.keys(this.searchIndex).forEach(keyword => {
            if (keyword.startsWith(normalizedQuery)) {
                suggestions.add(keyword);
            }
        });

        return Array.from(suggestions).slice(0, 5);
    }

    /**
     * Get random result for "I'm Feeling Lucky"
     * @returns {object} - Random result
     */
    getRandomResult() {
        const allResults = [];

        Object.values(this.searchIndex).forEach(results => {
            allResults.push(...results);
        });

        if (allResults.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * allResults.length);
        return allResults[randomIndex];
    }
}

// Create global search instance
const portfolioSearch = new PortfolioSearch(portfolioData);