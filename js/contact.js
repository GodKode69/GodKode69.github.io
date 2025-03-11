// contact.js

document
  .getElementById("contactForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:2044/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await response.json();
      if (response.ok) {
        document.getElementById("thankYouMessage").style.display = "block";
        setTimeout(() => {
          document.getElementById("thankYouMessage").style.display = "none";
          document.getElementById("contactForm").reset();
        }, 3000);
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      alert("Error connecting to the server.");
      console.error(error);
    }
  });
