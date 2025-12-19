/**
 * app.js - Main Application Module
 * Orchestrates all modules and handles event listeners
 */

class PortfolioApp {
  constructor() {
    // DOM Elements
    this.searchInput = document.getElementById("searchInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.luckyBtn = document.getElementById("luckyBtn");
    this.backBtn = document.getElementById("backBtn");
    this.resultsSearchInput = document.getElementById("resultsSearchInput");
    this.suggestionsContainer = document.getElementById("searchSuggestions");

    // State
    this.currentQuery = "";

    // Initialize
    this.init();
  }

  /**
   * Initialize the app
   */
  init() {
    this.attachEventListeners();
  }

  /**
   * Attach all event listeners
   */
  attachEventListeners() {
    // Main search input
    this.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.performSearch();
      }
    });

    this.searchInput.addEventListener("input", (e) => {
      this.handleInputChange(e.target.value);
    });

    // Search button
    this.searchBtn.addEventListener("click", () => {
      this.performSearch();
    });

    // I'm Feeling Lucky button
    this.luckyBtn.addEventListener("click", () => {
      this.handleLucky();
    });

    // Back button
    this.backBtn.addEventListener("click", () => {
      this.goBack();
    });

    // Results search input
    this.resultsSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.performSearch(e.target.value);
      }
    });

    this.resultsSearchInput.addEventListener("input", (e) => {
      this.handleResultsInputChange(e.target.value);
    });

    // Suggestion clicks
    document.addEventListener("click", (e) => {
      if (e.target.closest(".suggestion-item")) {
        const query = e.target
          .closest(".suggestion-item")
          .getAttribute("data-query");
        this.searchInput.value = query;
        this.performSearch(query);
      }
    });
  }

  /**
   * Handle input changes (show suggestions)
   */
  handleInputChange(value) {
    if (!value.trim()) {
      this.suggestionsContainer.innerHTML = `
                <div class="suggestion-item" data-query="projects">Projects</div>
                <div class="suggestion-item" data-query="skills">Skills</div>
                <div class="suggestion-item" data-query="experience">Experience</div>
                <div class="suggestion-item" data-query="contact">Contact</div>
            `;
      return;
    }

    const suggestions = portfolioSearch.getSuggestions(value);
    if (suggestions.length > 0) {
      this.suggestionsContainer.innerHTML = suggestions
        .map(
          (suggestion) => `
                    <div class="suggestion-item" data-query="${suggestion}">
                        ${this.escapeHtml(suggestion)}
                    </div>
                `
        )
        .join("");
    }
  }

  /**
   * Handle results input changes for live search
   */
  handleResultsInputChange(value) {
    if (value.trim() === "") {
      this.performSearch(this.currentQuery);
    } else {
      this.performSearch(value);
    }
  }

  /**
   * Perform search
   */
  performSearch(query = null) {
    const searchQuery = query || this.searchInput.value;

    if (!searchQuery.trim()) {
      return;
    }

    // Store current query
    this.currentQuery = searchQuery;

    // Get results
    const results = portfolioSearch.search(searchQuery);

    // Render results
    portfolioUI.renderResults(results, searchQuery);
    portfolioUI.showResults();

    // Update results search input
    this.resultsSearchInput.value = searchQuery;

    // Log to console for debugging
    console.log(`Search: "${searchQuery}"`, results);
  }

  /**
   * Handle "I'm Feeling Lucky"
   */
  handleLucky() {
    const randomResult = portfolioSearch.getRandomResult();

    if (randomResult) {
      let query = "";

      if (randomResult.type === "project") {
        query = randomResult.data.title;
      } else if (randomResult.type === "skill") {
        query = randomResult.data;
      } else if (randomResult.type === "experience") {
        query = randomResult.data.title;
      } else if (randomResult.type === "category") {
        query = randomResult.data;
      }

      if (query) {
        this.searchInput.value = query;
        this.performSearch(query);
      }
    }
  }

  /**
   * Go back to home
   */
  goBack() {
    this.searchInput.value = "";
    this.searchInput.focus();
    portfolioUI.hideResults();
    this.handleInputChange("");
    this.currentQuery = "";
  }

  /**
   * Escape HTML special characters
   */
  escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new PortfolioApp();
  console.log("Portfolio app initialized!");
});
