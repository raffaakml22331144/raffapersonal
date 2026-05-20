// =============================================
// MAIN.JS - UI Interactions
// =============================================

// --- HAMBURGER MENU ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// --- SKILL BAR ANIMATION ---
function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  fills.forEach(fill => {
    const target = fill.getAttribute('data-width');
    if (target) {
      setTimeout(() => {
        fill.style.width = target + '%';
      }, 300);
    }
  });
}

// Intersection Observer for skill bars
const skillSection = document.querySelector('.skills-grid, .cv-skills-grid');
if (skillSection) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkillBars();
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });
  observer.observe(skillSection);
} else {
  // Fallback: animate on load
  window.addEventListener('load', animateSkillBars);
}

// Also trigger on page load for CV page
window.addEventListener('load', () => {
  setTimeout(animateSkillBars, 400);
});

// --- PIXEL CARD HOVER SOUND EFFECT (visual only) ---
document.querySelectorAll('.about-card, .skill-card, .portfolio-card, .stat-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'all 0.1s';
  });
});

// --- SMOOTH SCROLL ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// --- PIXEL TYPING EFFECT for hero tagline ---
const tagline = document.querySelector('.hero-tagline');
if (tagline) {
  const text = 'Interested in Coding';
  const prefix = tagline.innerHTML.split('>')[0] + '> ';
  tagline.innerHTML = prefix;
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      tagline.innerHTML = prefix + text.substring(0, i + 1) + '<span class="cursor-blink">_</span>';
      i++;
      setTimeout(typeChar, 80 + Math.random() * 40);
    } else {
      tagline.innerHTML = prefix + text + '<span class="cursor-blink">_</span>';
    }
  }
  setTimeout(typeChar, 800);
}

// --- ACTIVE NAV HIGHLIGHT ---
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});
