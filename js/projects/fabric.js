document.addEventListener("DOMContentLoaded", () => {
  // Get the floating search button element (assumed already present in your HTML)
  const searchBtn = document.querySelector(".search-button");
  if (!searchBtn) {
    console.warn("No .search-button found.");
    return;
  }

  // Create the search modal container dynamically
  let searchModal = document.createElement("div");
  searchModal.id = "searchModal";
  searchModal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <div class="search-popup">
            <img src="/asset/search.png" alt="Search Icon" class="search-icon" />
            <input type="text" placeholder="Search commands..." />
            <button class="popup-search-btn">Search</button>
          </div>
        </div>
      </div>
    `;
  document.body.appendChild(searchModal);

  // Initially hide the modal
  searchModal.style.display = "none";

  // Open modal on search button click
  searchBtn.addEventListener("click", () => {
    searchModal.style.display = "block";
    // Optionally add a CSS class for a fade-in/scale effect:
    searchModal.classList.add("show");
  });

  // Close modal when close icon is clicked
  const closeModal = searchModal.querySelector(".close-modal");
  closeModal.addEventListener("click", () => {
    searchModal.style.display = "none";
    searchModal.classList.remove("show");
  });

  // Also close modal if clicking outside the modal content
  window.addEventListener("click", (e) => {
    if (e.target === searchModal) {
      searchModal.style.display = "none";
      searchModal.classList.remove("show");
    }
  });

  // Handle search inside the modal
  const popupSearchBtn = searchModal.querySelector(".popup-search-btn");
  popupSearchBtn.addEventListener("click", () => {
    const query = searchModal.querySelector("input").value.trim();
    if (query) {
      // Replace the alert with your actual search functionality
      alert("Searching for: " + query);
    } else {
      alert("Please enter a search term.");
    }
  });

  console.log("Fabric search popup JS loaded.");
});
