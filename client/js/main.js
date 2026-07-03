/**
 * Main application controller.
 * Fetches data from the backend and renders it into the page,
 * then initializes dependent UI (typing effect, loading screen).
 */
(() => {
  /**
   * Escapes HTML to prevent XSS when injecting API data into innerHTML.
   * Even though the backend sanitizes contact form input, profile/skills/
   * projects data could theoretically contain unsafe characters too —
   * better safe than sorry when using innerHTML.
   */
  const escapeHtml = (str = '') =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  // ==============================
  // PROFILE / HERO / ABOUT RENDERING
  // ==============================
  const renderProfile = (profile) => {
    // Hero
    document.getElementById('hero-name').textContent = profile.name;
    document.getElementById('hero-bio').textContent = profile.bio;
    document.title = `${profile.name} | ${profile.role}`;

    // Typing effect uses the role, plus any extra taglines you want to add here
    const typingTarget = document.getElementById('typing-text');
    TypingEffect.start(typingTarget, [profile.role, 'Full Stack Developer', 'Java Enthusiast']);

    // Hero socials
    const socialsEl = document.getElementById('hero-socials');
    const heroSocialLinks = [];
    if (profile.github) heroSocialLinks.push({ url: profile.github, label: 'GitHub', icon: '🔗' });
    if (profile.linkedin) heroSocialLinks.push({ url: profile.linkedin, label: 'LinkedIn', icon: '💼' });
    if (profile.email) heroSocialLinks.push({ url: `mailto:${profile.email}`, label: 'Email', icon: '✉️' });

    socialsEl.innerHTML = heroSocialLinks
      .map(
        (s) =>
          `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(s.label)}">${s.icon}</a>`
      )
      .join('');

    // Footer socials (same links, footer context)
    document.getElementById('footer-socials').innerHTML =
      '<h4>Connect</h4>' +
      heroSocialLinks
        .map((s) => `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.label)}</a>`)
        .join('');

    // About section
    document.getElementById('about-bio').textContent = profile.bio;

    if (profile.profileImage) {
      const img = document.getElementById('profile-image');
      img.src = profile.profileImage;
      img.alt = `${profile.name} profile photo`;
    }

    if (profile.resume) {
      const resumeBtn = document.getElementById('resume-download');
      resumeBtn.href = profile.resume;
    }

    // Education list
    const eduList = document.getElementById('education-list');
    if (profile.education?.length) {
      eduList.innerHTML = profile.education
        .map(
          (edu) =>
            `<li><strong>${escapeHtml(edu.degree)}</strong><br>${escapeHtml(edu.institution)} &middot; ${escapeHtml(edu.year)}</li>`
        )
        .join('');
    } else {
      eduList.innerHTML = '<li>No education entries yet.</li>';
    }

    // Experience list
    const expList = document.getElementById('experience-list');
    if (profile.experience?.length) {
      expList.innerHTML = profile.experience
        .map(
          (exp) =>
            `<li><strong>${escapeHtml(exp.title)}</strong> — ${escapeHtml(exp.company)}<br><span>${escapeHtml(exp.duration)}</span></li>`
        )
        .join('');
    } else {
      expList.innerHTML = '<li>No experience entries yet.</li>';
    }

    // Mark About section content for reveal animation
    const aboutGrid = document.querySelector('.about-grid');
if (aboutGrid) {
  aboutGrid.setAttribute('data-reveal', '');
  setTimeout(() => aboutGrid.classList.add('revealed'), 600);
}
  };

  // ==============================
  // SKILLS RENDERING
  // ==============================
  const renderSkills = (skills) => {
    const grid = document.getElementById('skills-grid');

    if (!skills.length) {
      grid.innerHTML = '<p class="empty-state">Skills coming soon.</p>';
      return;
    }

    grid.setAttribute('data-reveal-group', '');
// Safety net: if the IntersectionObserver doesn't catch this element
// (e.g. it's already in the viewport when rendered), force reveal anyway.
setTimeout(() => grid.classList.add('revealed'), 600);
    grid.innerHTML = skills
      .map(
        (skill) => `
        <div class="skill-card">
          <div class="skill-card-header">
            <span class="skill-icon">${escapeHtml(skill.icon)}</span>
            <span class="skill-name">${escapeHtml(skill.name)}</span>
          </div>
          <div class="skill-bar-track">
            <div class="skill-bar-fill" data-level="${skill.level}"></div>
          </div>
          <div class="skill-level-label">${skill.level}%</div>
        </div>
      `
      )
      .join('');

    // Animate skill bars filling up after a short delay (lets the reveal happen first)
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.querySelectorAll('.skill-bar-fill').forEach((bar) => {
          bar.style.width = `${bar.dataset.level}%`;
        });
      }, 300);
    });
  };

  // ==============================
  // PROJECTS RENDERING
  // ==============================
  const renderProjects = (projects) => {
    const grid = document.getElementById('projects-grid');

    if (!projects.length) {
      grid.innerHTML = '<p class="empty-state">Projects coming soon.</p>';
      return;
    }

    grid.setAttribute('data-reveal-group', '');
// Safety net: if the IntersectionObserver doesn't catch this element
// (e.g. it's already in the viewport when rendered), force reveal anyway.
setTimeout(() => grid.classList.add('revealed'), 600);
    grid.innerHTML = projects
      .map(
        (project) => `
        <article class="project-card">
          <div class="project-image-wrap">
            ${project.featured ? '<span class="project-card-badge">Featured</span>' : ''}
            <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} screenshot" loading="lazy" />
          </div>
          <div class="project-content">
            <h3 class="project-title">${escapeHtml(project.title)}</h3>
            <p class="project-description">${escapeHtml(project.description)}</p>
            <div class="project-tech-list">
              ${project.technologies.map((tech) => `<span class="tech-pill">${escapeHtml(tech)}</span>`).join('')}
            </div>
            <div class="project-links">
              ${project.githubLink ? `<a href="${escapeHtml(project.githubLink)}" target="_blank" rel="noopener noreferrer">GitHub →</a>` : ''}
              ${project.liveDemo ? `<a href="${escapeHtml(project.liveDemo)}" target="_blank" rel="noopener noreferrer">Live Demo →</a>` : ''}
            </div>
          </div>
        </article>
      `
      )
      .join('');
  };

  // ==============================
  // LOADING SCREEN
  // ==============================
  const hideLoadingScreen = () => {
    const loader = document.getElementById('loading-screen');
    if (loader) loader.classList.add('hidden');
  };

  // ==============================
  // FOOTER YEAR
  // ==============================
  const setFooterYear = () => {
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  };

  // ==============================
  // INITIALIZATION
  // ==============================
  const init = async () => {
    setFooterYear();

    try {
      const [profile, skills, projects] = await Promise.all([
        API.getProfile(),
        API.getSkills(),
        API.getProjects(),
      ]);

      renderProfile(profile);
      renderSkills(skills);
      renderProjects(projects);
    } catch (error) {
      console.error('Failed to load portfolio data:', error.message);
      document.getElementById('hero-name').textContent = 'Unable to load profile';
      document.getElementById('hero-bio').textContent =
        'Please make sure the backend server is running and try refreshing the page.';
    } finally {
      // Small delay so the loader doesn't just flash instantly on fast connections
      setTimeout(hideLoadingScreen, 400);

      // Re-run reveal observer setup for freshly-injected elements,
      // since scroll-animations.js already ran on DOMContentLoaded
      // before this async data arrived.
      if (typeof ScrollAnimations !== 'undefined') {
        document.dispatchEvent(new Event('content-rendered'));
      }
    }
  };

  document.addEventListener('DOMContentLoaded', init);
})();