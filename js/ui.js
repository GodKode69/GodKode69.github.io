/**
 * ui.js - UI Rendering Module
 * Handles rendering of search results and UI updates
 */

class PortfolioUI {
    constructor() {
        this.resultsContainer = document.getElementById('resultsContainer');
        this.resultsContent = document.getElementById('resultsContent');
        this.resultTabsContainer = document.getElementById('resultTabsContainer');
        this.activeTabs = new Map(); // Track active tabs by type
    }

    /**
     * Render results based on search query
     * @param {array} results - Array of search results
     * @param {string} query - Original search query
     */
    renderResults(results, query) {
        if (results.length === 0) {
            this.resultsContent.innerHTML = this.getNoResultsTemplate(query);
            this.resultTabsContainer.innerHTML = '';
            return;
        }

        const groupedResults = this.groupResults(results);
        
        // Render tabs
        this.renderTabs(groupedResults);
        
        // Show all results
        let html = '';
        Object.entries(groupedResults).forEach(([type, items]) => {
            html += this.renderResultSection(type, items);
        });

        this.resultsContent.innerHTML = html;
    }

    /**
     * Render tabs for each result type
     */
    renderTabs(groupedResults) {
        let tabsHtml = '';
        
        Object.entries(groupedResults).forEach(([type, items]) => {
            const count = items.length;
            const typeLabel = this.getTypeLabel(type);
            const isActive = this.activeTabs.get(type) || false;
            
            tabsHtml += `
                <div class="result-tab ${isActive ? 'active' : ''}" data-type="${type}">
                    <span>${typeLabel} (${count})</span>
                    <span class="result-tab__close" data-type="${type}">×</span>
                </div>
            `;
        });

        this.resultTabsContainer.innerHTML = tabsHtml;

        // Attach tab event listeners
        this.attachTabListeners();
    }

    /**
     * Attach event listeners to tabs
     */
    attachTabListeners() {
        const tabs = this.resultTabsContainer.querySelectorAll('.result-tab');
        const closeButtons = this.resultTabsContainer.querySelectorAll('.result-tab__close');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                if (e.target.closest('.result-tab__close')) {
                    return; // Don't trigger tab click if close button was clicked
                }
                const type = tab.getAttribute('data-type');
                this.toggleTab(type, tab);
            });
        });

        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const type = btn.getAttribute('data-type');
                this.closeTab(type);
            });
        });
    }

    /**
     * Toggle tab active state and filter results
     */
    toggleTab(type, tabElement) {
        const isCurrentlyActive = this.activeTabs.get(type);
        const newState = !isCurrentlyActive;
        
        this.activeTabs.set(type, newState);
        
        if (newState) {
            tabElement.classList.add('active');
        } else {
            tabElement.classList.remove('active');
        }

        this.filterAndDisplayResults();
    }

    /**
     * Close a tab
     */
    closeTab(type) {
        this.activeTabs.delete(type);
        const tabElement = this.resultTabsContainer.querySelector(`[data-type="${type}"]`);
        if (tabElement) {
            tabElement.style.display = 'none';
        }
        this.filterAndDisplayResults();
    }

    /**
     * Filter and display results based on active tabs
     */
    filterAndDisplayResults() {
        const allCards = this.resultsContent.querySelectorAll('.result-card');
        let visibleCount = 0;

        allCards.forEach(card => {
            const type = card.getAttribute('data-type');
            if (this.activeTabs.has(type) && this.activeTabs.get(type)) {
                card.style.display = 'block';
                visibleCount++;
            } else if (this.activeTabs.size === 0) {
                // Show all if no filters active
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0 && this.activeTabs.size > 0) {
            this.resultsContent.innerHTML = '<div class="no-results"><p>No results match the selected filters</p></div>';
        }
    }

    /**
     * Group results by type
     */
    groupResults(results) {
        const grouped = {};

        results.forEach(result => {
            if (!grouped[result.type]) {
                grouped[result.type] = [];
            }
            grouped[result.type].push(result.data);
        });

        return grouped;
    }

    /**
     * Get label for result type
     */
    getTypeLabel(type) {
        const labels = {
            'project': '📁 Projects',
            'skill': '⚡ Skills',
            'experience': '💼 Experience',
            'category': '📂 Categories'
        };
        return labels[type] || type;
    }

    /**
     * Render a section of results
     */
    renderResultSection(type, items) {
        let html = '';

        switch (type) {
            case 'project':
                items.forEach(project => {
                    html += this.renderProjectCard(project, type);
                });
                break;

            case 'skill':
                html += '<div class="skills-section">';
                items.forEach(skill => {
                    html += `<span class="skill-badge" data-type="${type}">${this.escapeHtml(skill)}</span>`;
                });
                html += '</div>';
                break;

            case 'experience':
                items.forEach(exp => {
                    html += this.renderExperienceCard(exp, type);
                });
                break;

            case 'category':
                html += '<div class="category-section">';
                items.forEach(category => {
                    html += `
                        <a href="#${category}" class="category-link" data-type="${type}">
                            ${this.escapeHtml(category.charAt(0).toUpperCase() + category.slice(1))}
                        </a>
                    `;
                });
                html += '</div>';
                break;
        }

        return html;
    }

    /**
     * Render a project card
     */
    renderProjectCard(project, type) {
        return `
            <div class="result-card project-card" data-type="${type}">
                <h3 class="result-card__title">${this.escapeHtml(project.title)}</h3>
                <p class="result-card__description">${this.escapeHtml(project.description)}</p>
                <div class="result-card__tags">
                    ${project.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render an experience card
     */
    renderExperienceCard(exp, type) {
        return `
            <div class="result-card experience-card" data-type="${type}">
                <h3 class="result-card__title">${this.escapeHtml(exp.title)}</h3>
                <p class="result-card__company">${this.escapeHtml(exp.company)} • ${this.escapeHtml(exp.period)}</p>
                <p class="result-card__description">${this.escapeHtml(exp.description)}</p>
            </div>
        `;
    }

    /**
     * Get no results template
     */
    getNoResultsTemplate(query) {
        return `
            <div class="no-results">
                <h2>No results found for "${this.escapeHtml(query)}"</h2>
                <p>Try searching for: projects, skills, experience, or contact</p>
            </div>
        `;
    }

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Show results container
     */
    showResults() {
        this.resultsContainer.style.display = 'flex';
    }

    /**
     * Hide results container
     */
    hideResults() {
        this.resultsContainer.style.display = 'none';
        this.activeTabs.clear();
    }
}

// Create global UI instance
const portfolioUI = new PortfolioUI();