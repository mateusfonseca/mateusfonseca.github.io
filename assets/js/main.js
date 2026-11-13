async function loadComponent(id, filePath) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const html = await response.text();
            document.getElementById(id).innerHTML = html;
            
            if (id === 'navbar-placeholder') {
                initThemeToggle();
                initCVModal();
                initActiveNav(); // <-- Runs active link check right after insertion
            }
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Load navbar and footer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('navbar-placeholder', 'assets/components/navbar.html');
    loadComponent('footer-placeholder', 'assets/components/footer.html');
});

// Highlight Active Nav Link based on Body Data Attribute
function initActiveNav() {
    const page = document.body.getAttribute('data-page');
    const homeLink = document.getElementById('nav-home');
    const projectsLink = document.getElementById('nav-projects');

    if (page === 'projects') {
        projectsLink?.classList.add('text-blue-400', 'dark:text-blue-600', 'font-semibold');
        projectsLink?.classList.remove('text-slate-300', 'dark:text-slate-700');
        
        homeLink?.classList.remove('text-blue-400', 'dark:text-blue-600', 'font-semibold');
        homeLink?.classList.add('text-slate-300', 'dark:text-slate-700');
    } else if (page === 'home') {
        homeLink?.classList.add('text-blue-400', 'dark:text-blue-600', 'font-semibold');
        homeLink?.classList.remove('text-slate-300', 'dark:text-slate-700');
        
        projectsLink?.classList.remove('text-blue-400', 'dark:text-blue-600', 'font-semibold');
        projectsLink?.classList.add('text-slate-300', 'dark:text-slate-700');
    }
}

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }

    themeToggleBtn?.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        }
    });
}

// CV Modal & Tailored Print Logic
function initCVModal() {
    const modal = document.getElementById('cv-modal');
    const openBtn = document.getElementById('open-cv-modal');
    const closeBtn = document.getElementById('close-cv-modal');

    openBtn?.addEventListener('click', () => {
        modal?.classList.remove('hidden');
    });

    closeBtn?.addEventListener('click', () => {
        modal?.classList.add('hidden');
    });

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

// Tailored CV Generator & Printer
function generateTailoredPDF(track) {
    document.getElementById('cv-modal')?.classList.add('hidden');

    const tailoredProjects = {
        cloud: `
            <div style="margin-bottom: 8px;">
                <p style="font-size: 10pt; font-weight: bold; margin: 0;">BFV-Based Searchable Cloud Encryption System (MSc Applied Research Project)</p>
                <p style="font-size: 9.5pt; margin: 2px 0; font-style: italic;">Tech Stack: Python, TenSEAL, FastAPI, AWS (EC2), Terraform, Nginx, Pytest</p>
                <ul style="font-size: 9.5pt; margin: 0; padding-left: 15px;">
                    <li>Engineered a three-layer hybrid cryptographic architecture combining BFV (Homomorphic Encryption for data in-use), AES-128 (data at-rest), and TLS/HTTPS via Nginx for zero-trust DNF queries over encrypted cloud storage.</li>
                    <li>Provisioned memory-optimized AWS EC2 infrastructure using Terraform and built an asynchronous FastAPI backend supporting parallel homomorphic matrix-vector dot products with 100% Pytest code coverage.</li>
                </ul>
            </div>
            <div>
                <p style="font-size: 10pt; font-weight: bold; margin: 0;">Automated CI/CD Pipeline (MSc DevOps Project)</p>
                <p style="font-size: 9.5pt; margin: 2px 0; font-style: italic;">Tech Stack: Terraform, Docker, Ansible, GitHub Actions, AWS</p>
                <ul style="font-size: 9.5pt; margin: 0; padding-left: 15px;">
                    <li>Designed automated deployment workflows using Terraform for stateful infrastructure management and Ansible for automated configuration management.</li>
                </ul>
            </div>
        `,
        dev: `
            <div style="margin-bottom: 8px;">
                <p style="font-size: 10pt; font-weight: bold; margin: 0;">Enterprise Operations Automation & Software Tooling</p>
                <p style="font-size: 9.5pt; margin: 2px 0; font-style: italic;">Tech Stack: TypeScript, Python, HotSoft 8 PMS, ERP/PMS Integration</p>
                <ul style="font-size: 9.5pt; margin: 0; padding-left: 15px;">
                    <li>Engineered a custom TypeScript automation tool reducing multi-hour financial reconciliations to sub-minute executions in enterprise hospitality operations.</li>
                    <li>Acted as Subject Matter Expert for PMS/ERP software support, onboarding staff and standardizing system operations.</li>
                </ul>
            </div>
        `,
        ai: `
            <div style="margin-bottom: 8px;">
                <p style="font-size: 10pt; font-weight: bold; margin: 0;">AI-Driven Nanoparticle Analysis Tool (BSc Hons Thesis)</p>
                <p style="font-size: 9.5pt; margin: 2px 0; font-style: italic;">Tech Stack: Python, Django, TensorFlow, OpenCV</p>
                <ul style="font-size: 9.5pt; margin: 0; padding-left: 15px;">
                    <li>Developed a full-stack computer vision application to automate detection and sizing of nanoparticles in Transmission Electron Microscopy (TEM) scans, eliminating manual errors.</li>
                    <li>Rigorously compared traditional Circle Hough Transforms in OpenCV against a custom Convolutional Neural Network (CNN) in TensorFlow/Keras.</li>
                </ul>
            </div>
        `,
        general: `
            <div style="margin-bottom: 8px;">
                <p style="font-size: 10pt; font-weight: bold; margin: 0;">BFV-Based Searchable Cloud Encryption System (MSc Project)</p>
                <p style="font-size: 9.5pt; margin: 2px 0; font-style: italic;">Tech Stack: Python, TenSEAL, FastAPI, AWS, Terraform</p>
                <p style="font-size: 9.5pt; margin: 2px 0;">Engineered a three-layer hybrid cryptographic architecture enabling zero-trust queries over encrypted cloud storage on optimized AWS infrastructure.</p>
            </div>
            <div style="margin-bottom: 8px;">
                <p style="font-size: 10pt; font-weight: bold; margin: 0;">AI-Driven Nanoparticle Analysis Tool (BSc Thesis)</p>
                <p style="font-size: 9.5pt; margin: 2px 0; font-style: italic;">Tech Stack: Python, Django, TensorFlow, OpenCV</p>
                <p style="font-size: 9.5pt; margin: 2px 0;">Developed full-stack computer vision application automating TEM scan sizing using CNNs and OpenCV.</p>
            </div>
        `
    };

    const container = document.getElementById('pdf-projects-container');
    if (container) {
        container.innerHTML = tailoredProjects[track] || tailoredProjects['general'];
    }

    const element = document.getElementById('traditional-cv-template');
    element.style.display = 'block';

    const options = {
        margin:       10,
        filename:     `Mateus_Campos_CV_${track.toUpperCase()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).save().then(() => {
        element.style.display = 'none';
    });
}

// Function to update active states and selection count badges for dropdown filters
function updateDropdownActiveStates() {
    document.querySelectorAll('details.relative.group').forEach(details => {
        const checkboxes = details.querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length === 0) return; // Skip non-checkbox details (like Sort)

        const summary = details.querySelector('.filter-summary');
        const badge = details.querySelector('.filter-badge');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

        if (checkedCount > 0) {
            summary.classList.add('border-blue-500', 'text-blue-400', 'dark:text-blue-600', 'font-semibold');
            if (badge) {
                badge.textContent = checkedCount;
                badge.classList.remove('hidden');
            }
        } else {
            summary.classList.remove('border-blue-500', 'text-blue-400', 'dark:text-blue-600', 'font-semibold');
            if (badge) {
                badge.classList.add('hidden');
            }
        }
    });
}

// Global variables for sorting
let currentSortField = null;
let currentSortOrder = 'asc'; // 'asc' or 'desc'

// Initialize multi-dropdown filtering, sorting, outside-click collapses, and active states
document.addEventListener('DOMContentLoaded', () => {
    const applyBtn = document.getElementById('apply-filters-btn');
    const clearBtn = document.getElementById('clear-filters-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // 1. Close open dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        document.querySelectorAll('details.relative.group').forEach((details) => {
            if (!details.contains(event.target)) {
                details.removeAttribute('open');
            }
        });
    });

    // 2. Watch all filter checkboxes for changes to update active indicator badges
    document.querySelectorAll('input[name^="filter-"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateDropdownActiveStates);
    });

    // 3. Sort options selection logic
    const sortSummaryText = document.getElementById('sort-summary-text');
    const sortOrderBtn = document.getElementById('sort-order-btn');
    const sortIcon = document.getElementById('sort-icon');
    const sortDropdownDetails = sortSummaryText?.closest('details');

    document.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', (e) => {
            currentSortField = e.target.getAttribute('data-sort');
            sortSummaryText.textContent = e.target.textContent;
            sortSummaryText.classList.add('text-blue-400', 'dark:text-blue-600', 'font-semibold');
            if (sortDropdownDetails) sortDropdownDetails.removeAttribute('open');
        });
    });

    // Sort order toggler (ascending / descending)
    sortOrderBtn?.addEventListener('click', () => {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        if (currentSortOrder === 'asc') {
            sortIcon?.classList.remove('scale-y-[-1]');
        } else {
            sortIcon?.classList.add('scale-y-[-1]');
        }
    });

    // 4. Apply Filters logic (Filtering + Sorting)
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const selectedDegrees = Array.from(document.querySelectorAll('input[name="filter-degree"]:checked')).map(cb => cb.value);
            const selectedLangs = Array.from(document.querySelectorAll('input[name="filter-lang"]:checked')).map(cb => cb.value);
            const selectedFrameworks = Array.from(document.querySelectorAll('input[name="filter-framework"]:checked')).map(cb => cb.value);
            const selectedAreas = Array.from(document.querySelectorAll('input[name="filter-area"]:checked')).map(cb => cb.value);
            const selectedOthers = Array.from(document.querySelectorAll('input[name="filter-others"]:checked')).map(cb => cb.value);

            projectCards.forEach(card => {
                const cardDegree = card.getAttribute('data-degree') || '';
                const cardLangs = card.getAttribute('data-lang') || '';
                const cardFrameworks = card.getAttribute('data-framework') || '';
                const cardAreas = card.getAttribute('data-area') || '';
                const cardOthers = card.getAttribute('data-others') || '';

                const matchesDegree = selectedDegrees.length === 0 || selectedDegrees.some(val => cardDegree.includes(val));
                const matchesLang = selectedLangs.length === 0 || selectedLangs.some(val => cardLangs.includes(val));
                const matchesFramework = selectedFrameworks.length === 0 || selectedFrameworks.some(val => cardFrameworks.includes(val));
                const matchesArea = selectedAreas.length === 0 || selectedAreas.some(val => cardAreas.includes(val));
                const matchesOther = selectedOthers.length === 0 || selectedOthers.some(val => cardOthers.includes(val));

                if (matchesDegree && matchesLang && matchesFramework && matchesArea && matchesOther) {
                    card.style.display = '';
                    card.classList.add('is-visible');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('is-visible');
                }
            });

            // Handle sorting of visible cards
            if (currentSortField) {
                const grid = document.getElementById('projects-grid');
                const visibleCards = Array.from(projectCards).filter(card => card.classList.contains('is-visible'));

                visibleCards.sort((a, b) => {
                    const valA = a.getAttribute(`data-${currentSortField}`) || '';
                    const valB = b.getAttribute(`data-${currentSortField}`) || '';

                    if (currentSortOrder === 'asc') {
                        return valA.localeCompare(valB);
                    } else {
                        return valB.localeCompare(valA);
                    }
                });

                visibleCards.forEach(card => grid.appendChild(card));
            }

            updateDropdownActiveStates();
            document.querySelectorAll('details').forEach(d => d.removeAttribute('open'));
        });
    }

    // 5. Clear Filters logic
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            projectCards.forEach(card => {
                card.style.display = '';
                card.classList.remove('is-visible');
            });

            // Reset sort states
            currentSortField = null;
            currentSortOrder = 'asc';
            if (sortSummaryText) {
                sortSummaryText.textContent = 'Sort by';
                sortSummaryText.classList.remove('text-blue-400', 'dark:text-blue-600', 'font-semibold');
            }
            sortIcon?.classList.remove('scale-y-[-1]');

            updateDropdownActiveStates();
            document.querySelectorAll('details').forEach(d => d.removeAttribute('open'));
        });
    }
});