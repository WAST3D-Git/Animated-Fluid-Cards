// Create background particles
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random properties
    const size = Math.random() * 3 + 1;
    const posX = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 10 + 10;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;

    particlesContainer.appendChild(particle);
  }
}

// Create interactive particles on click
function createInteractiveParticles(x, y, color) {
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "card-particle";

    // Random direction and distance
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const size = Math.random() * 8 + 4;
    const duration = Math.random() * 1 + 1;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color || "rgba(255, 255, 255, 0.6)";
    particle.style.setProperty("--tx", `${tx}px`);
    particle.style.setProperty("--ty", `${ty}px`);
    particle.style.animationDuration = `${duration}s`;

    document.body.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
      particle.remove();
    }, duration * 1000);
  }
}

// Update connection lines
function updateConnections(expandedCard) {
  const cards = document.querySelectorAll(".card");
  const expandedIndex = Array.from(cards).indexOf(expandedCard);

  // Update each connection line
  for (let i = 0; i < 3; i++) {
    const connection = document.getElementById(`connection${i + 1}`);
    const startCard = cards[i];
    const endCard = cards[i + 1];

    if (startCard && endCard) {
      const startRect = startCard.getBoundingClientRect();
      const endRect = endCard.getBoundingClientRect();

      const x1 = startRect.right;
      const y1 = startRect.top + startRect.height / 2;
      const x2 = endRect.left;
      const y2 = endRect.top + endRect.height / 2;

      const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

      connection.style.width = `${length}px`;
      connection.style.left = `${x1}px`;
      connection.style.top = `${y1}px`;
      connection.style.transform = `rotate(${angle}deg)`;

      // Highlight connections to expanded card
      if (i === expandedIndex - 1 || i === expandedIndex) {
        connection.style.background = `linear-gradient(90deg, 
                    rgba(255, 255, 255, 0.8), 
                    rgba(255, 255, 255, 0.3))`;
        connection.style.opacity = "0.8";
      } else {
        connection.style.background = `linear-gradient(90deg, 
                    rgba(255, 255, 255, 0.3), 
                    transparent)`;
        connection.style.opacity = "0.5";
      }
    }
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  createParticles();
  const cards = document.querySelectorAll(".card");
  let expandedCard = null;

  // Set initial connections
  updateConnections(null);

  // Card interaction
  cards.forEach((card) => {
    // Click to expand/collapse
    card.addEventListener("click", (e) => {
      // Create particles at click location
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Get background color from computed style
      const bgColor = "rgba(255, 255, 255, 0.6)";

      createInteractiveParticles(x + rect.left, y + rect.top, bgColor);

      // Toggle expansion
      if (card === expandedCard) {
        card.classList.remove("expanded");
        expandedCard = null;
      } else {
        cards.forEach((c) => c.classList.remove("expanded"));
        card.classList.add("expanded");
        expandedCard = card;
      }

      updateConnections(expandedCard);
    });

    // Hover effect
    card.addEventListener("mouseenter", () => {
      if (card !== expandedCard) {
        card.style.transform = "translateY(-30px) rotateX(10deg) scale(1.05)";
      }
    });

    card.addEventListener("mouseleave", () => {
      if (card !== expandedCard) {
        card.style.transform = "";
      }
    });
  });

  // Auto-rotate cards when none are expanded
  setInterval(() => {
    if (!expandedCard) {
      cards.forEach((card, index) => {
        const delay = index * 0.5;
        card.style.animationDelay = `${delay}s`;
      });
    }
  }, 8000);

  // Update connections on resize
  window.addEventListener("resize", () => {
    updateConnections(expandedCard);
  });

  // Auto-expand first card on load
  setTimeout(() => {
    cards[0].classList.add("expanded");
    expandedCard = cards[0];
    updateConnections(expandedCard);

    // Create initial particles
    const rect = cards[0].getBoundingClientRect();
    createInteractiveParticles(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      "rgba(255, 255, 255, 0.6)"
    );
  }, 1000);
});

// Parallax effect on mouse move
document.addEventListener("mousemove", (e) => {
  const cards = document.querySelectorAll(".card:not(.expanded)");
  const mouseX = e.clientX / window.innerWidth;
  const mouseY = e.clientY / window.innerHeight;

  cards.forEach((card, index) => {
    const depth = (index + 1) * 0.1;
    const x = (mouseX - 0.5) * 20 * depth;
    const y = (mouseY - 0.5) * 20 * depth;

    card.style.transform = `translate(${x}px, ${y}px) rotateY(${
      x * 0.5
    }deg) rotateX(${-y * 0.5}deg)`;
  });
});
