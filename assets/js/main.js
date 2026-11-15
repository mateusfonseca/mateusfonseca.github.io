async function loadComponent(id, filePath) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const html = await response.text();
            document.getElementById(id).innerHTML = html;
            
            if (id === 'navbar-placeholder') {
                initThemeToggle();
                initCVModal();
                initActiveNav(); 
            }
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Highlight Active Nav Link and update terminal directory based on Body Data Attribute
function initActiveNav() {
    const page = document.body.getAttribute('data-page');
    const homeLink = document.getElementById('nav-home');
    const projectsLink = document.getElementById('nav-projects');
    const navbarDir = document.getElementById('navbar-dir');

    if (page === 'projects') {
        projectsLink?.classList.add('text-blue-400', 'dark:text-blue-600', 'font-semibold');
        projectsLink?.classList.remove('text-slate-300', 'dark:text-slate-700');
        
        homeLink?.classList.remove('text-blue-400', 'dark:text-blue-600', 'font-semibold');
        homeLink?.classList.add('text-slate-300', 'dark:text-slate-700');

        if (navbarDir) navbarDir.textContent = '~/projects';
    } else if (page === 'home') {
        homeLink?.classList.add('text-blue-400', 'dark:text-blue-600', 'font-semibold');
        homeLink?.classList.remove('text-slate-300', 'dark:text-slate-700');
        
        projectsLink?.classList.remove('text-blue-400', 'dark:text-blue-600', 'font-semibold');
        projectsLink?.classList.add('text-slate-300', 'dark:text-slate-700');

        if (navbarDir) navbarDir.textContent = '~';
    }
}

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');

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
        if (checkboxes.length === 0) return; 

        const summary = details.querySelector('.filter-summary');
        const badge = details.querySelector('.filter-badge');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

        if (checkedCount > 0) {
            summary.classList.add('border-blue-500', 'text-blue-400', 'dark:text-blue-600', 'font-semibold');
            summary.classList.remove('border-slate-700', 'dark:border-slate-300', 'text-slate-200', 'dark:text-slate-800');
            if (badge) {
                badge.textContent = checkedCount;
                badge.classList.remove('hidden');
            }
        } else {
            summary.classList.remove('border-blue-500', 'text-blue-400', 'dark:text-blue-600', 'font-semibold');
            summary.classList.add('border-slate-700', 'dark:border-slate-300', 'text-slate-200', 'dark:text-slate-800');
            if (badge) {
                badge.classList.add('hidden');
            }
        }
    });
}

// Global variables for sorting and pagination
let currentSortField = 'date';
let currentSortOrder = 'desc'; 
let visibleCount = 5;

// Function to update active/inactive styling on project date chips based on active sort field
function updateDateChips() {
    const grayClasses = ['bg-slate-800', 'dark:bg-slate-100', 'border', 'border-slate-700', 'dark:border-slate-300', 'text-slate-300', 'dark:text-slate-700'];
    const blueClasses = ['bg-blue-950', 'dark:bg-blue-100', 'border', 'border-blue-800', 'dark:border-blue-300', 'text-blue-300', 'dark:text-blue-800'];

    document.querySelectorAll('.project-card').forEach(card => {
        const submittedChip = card.querySelector('.submitted-chip');
        const updatedChip = card.querySelector('.updated-chip');
        if (!submittedChip || !updatedChip) return;

        if (currentSortField === 'date') {
            submittedChip.classList.remove(...grayClasses);
            submittedChip.classList.add(...blueClasses);
            updatedChip.classList.remove(...blueClasses);
            updatedChip.classList.add(...grayClasses);
        } else if (currentSortField === 'updated') {
            updatedChip.classList.remove(...grayClasses);
            updatedChip.classList.add(...blueClasses);
            submittedChip.classList.remove(...blueClasses);
            submittedChip.classList.add(...grayClasses);
        }
    });
}

// Function to manage visibility of cards based on pagination limits
function updatePaginationDisplay(visibleCards) {
    const loadMoreContainer = document.getElementById('load-more-container');

    visibleCards.forEach((card, index) => {
        if (index < visibleCount) {
            card.style.display = '';
            card.classList.add('is-visible');
        } else {
            card.style.display = 'none';
            card.classList.remove('is-visible');
        }
    });

    if (loadMoreContainer) {
        if (visibleCards.length > visibleCount) {
            loadMoreContainer.classList.remove('hidden');
        } else {
            loadMoreContainer.classList.add('hidden');
        }
    }
}

// Updated applySorting function including pagination support
function applySorting() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;
    const allCards = Array.from(grid.querySelectorAll('.project-card'));
    
    const visibleCards = allCards.filter(card => card.getAttribute('data-filtered-out') !== 'true');
    const hiddenFilteredCards = allCards.filter(card => card.getAttribute('data-filtered-out') === 'true');

    visibleCards.sort((a, b) => {
        const valA = a.getAttribute(`data-${currentSortField}`) || '';
        const valB = b.getAttribute(`data-${currentSortField}`) || '';

        if (currentSortOrder === 'asc') {
            return valA.localeCompare(valB);
        } else {
            return valB.localeCompare(valA);
        }
    });

    [...visibleCards, ...hiddenFilteredCards].forEach(card => grid.appendChild(card));
    updatePaginationDisplay(visibleCards);
    updateDateChips();
}

function getFilterStateSnapshot() {
    const checkedBoxes = Array.from(document.querySelectorAll('input[name^="filter-"][type="checkbox"]:checked'))
        .map(cb => `${cb.name}:${cb.value}`)
        .sort();
    return JSON.stringify({ checkedBoxes });
}

let appliedStateSnapshot = '';

// Function to update the disabled state of both Apply and Clear buttons
function updateFilterButtonStates() {
    const applyBtn = document.getElementById('apply-filters-btn');
    const clearBtn = document.getElementById('clear-filters-btn');

    // Count currently checked filter checkboxes
    const checkedCount = document.querySelectorAll('input[name^="filter-"][type="checkbox"]:checked').length;

    // Clear Filters is disabled if no filters are checked
    if (clearBtn) {
        clearBtn.disabled = checkedCount === 0;
    }

    // Apply Filters is disabled if there are no unapplied changes
    if (applyBtn) {
        const hasChanges = getFilterStateSnapshot() !== appliedStateSnapshot;
        applyBtn.disabled = !hasChanges;
    }
}

// SINGLE UNIFIED DOMContentLoaded LISTENER
document.addEventListener('DOMContentLoaded', () => {
    // 1. Load components (Navbar & Footer)
    loadComponent('navbar-placeholder', 'assets/components/navbar.html');
    loadComponent('footer-placeholder', 'assets/components/footer.html');

    // 2. Initialize project sorting and filter states if on projects page
    applySorting();

    const applyBtn = document.getElementById('apply-filters-btn');
    const clearBtn = document.getElementById('clear-filters-btn');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const projectCards = document.querySelectorAll('.project-card');

    appliedStateSnapshot = getFilterStateSnapshot();
    updateFilterButtonStates();

    // 3. Close open standard dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        document.querySelectorAll('details.relative.group').forEach((details) => {
            if (!details.contains(event.target)) {
                details.removeAttribute('open');
            }
        });
    });

    // 4. Dynamic Dropdown Positioner (Left vs Right Half Screen Check) for standard filters
    document.querySelectorAll('.filter-dropdown:not(#sort-container)').forEach(dropdown => {
        const summary = dropdown.querySelector('summary');
        const menu = dropdown.querySelector('.dropdown-menu');

        summary?.addEventListener('click', () => {
            setTimeout(() => {
                if (!dropdown.hasAttribute('open')) return;

                const rect = summary.getBoundingClientRect();
                const screenWidth = window.innerWidth;
                const isRightHalf = rect.left > (screenWidth / 2);

                if (isRightHalf) {
                    menu.classList.remove('left-0');
                    menu.classList.add('right-0');
                } else {
                    menu.classList.remove('right-0');
                    menu.classList.add('left-0');
                }
            }, 10);
        });
    });

    // 5. Handle Sort Dropdown Manual State & Position Alignment
    const sortTrigger = document.getElementById('sort-trigger');
    const sortMenu = document.getElementById('sort-dropdown-menu');
    const sortChevron = document.getElementById('sort-chevron');
    const sortContainer = document.getElementById('sort-container');

    if (sortTrigger && sortMenu && sortContainer) {
        const updateSortMenuPosition = () => {
            const rect = sortContainer.getBoundingClientRect();
            const screenWidth = window.innerWidth;
            const isRightHalf = rect.left > (screenWidth / 2);

            if (isRightHalf) {
                sortMenu.classList.remove('left-0');
                sortMenu.classList.add('right-0');
            } else {
                sortMenu.classList.remove('right-0');
                sortMenu.classList.add('left-0');
            }
        };

        updateSortMenuPosition();
        window.addEventListener('resize', updateSortMenuPosition);

        sortTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !sortMenu.classList.contains('hidden');
            
            // Close other details dropdowns
            document.querySelectorAll('details').forEach(d => d.removeAttribute('open'));

            if (isOpen) {
                sortMenu.classList.add('hidden');
                sortChevron?.classList.remove('rotate-180');
            } else {
                updateSortMenuPosition();
                sortMenu.classList.remove('hidden');
                sortChevron?.classList.add('rotate-180');
            }
        });

        // Close sort menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!sortContainer.contains(event.target)) {
                sortMenu.classList.add('hidden');
                sortChevron?.classList.remove('rotate-180');
            }
        });
    }

    // 6. Watch filter checkboxes for changes
    document.querySelectorAll('input[name^="filter-"]:not([name="filter-sort"])').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateDropdownActiveStates();
            updateFilterButtonStates();
        });
    });

    // 7. Sort options selection logic
    const sortSummaryText = document.getElementById('sort-summary-text');
    const sortOrderBtn = document.getElementById('sort-order-btn');
    const sortIcon = document.getElementById('sort-icon');

    document.querySelectorAll('input[name="filter-sort"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentSortField = e.target.value;
            if (sortSummaryText) {
                sortSummaryText.textContent = 'Sort by';
            }
            updateFilterButtonStates();
            // Close menu on selection
            sortMenu?.classList.add('hidden');
            sortChevron?.classList.remove('rotate-180');
            applySorting();
        });
    });

    sortOrderBtn?.addEventListener('click', () => {
        currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        if (currentSortOrder === 'asc') {
            sortIcon?.classList.remove('scale-y-[-1]');
        } else {
            sortIcon?.classList.add('scale-y-[-1]');
        }
        applySorting();
    });

    // 8. Apply Filters logic
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
                    card.removeAttribute('data-filtered-out');
                } else {
                    card.setAttribute('data-filtered-out', 'true');
                }
            });

            visibleCount = 5; // Reset pagination count on filter application
            applySorting();
            updateDropdownActiveStates();
            
            appliedStateSnapshot = getFilterStateSnapshot();
            updateFilterButtonStates();

            document.querySelectorAll('details').forEach(d => d.removeAttribute('open'));
            sortMenu?.classList.add('hidden');
            sortChevron?.classList.remove('rotate-180');
        });
    }

    // 9. Clear Filters logic (Does NOT touch sorting)
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            // Uncheck only filter checkboxes
            document.querySelectorAll('input[name^="filter-"]:not([name="filter-sort"])[type="checkbox"]').forEach(cb => cb.checked = false);

            // Reset project card filter exclusion attributes
            projectCards.forEach(card => {
                card.removeAttribute('data-filtered-out');
            });

            visibleCount = 5; // Reset pagination count on clear
            // Re-apply current sorting without changing sort parameters
            applySorting();
            updateDropdownActiveStates();
            
            appliedStateSnapshot = getFilterStateSnapshot();
            updateFilterButtonStates();

            document.querySelectorAll('details').forEach(d => d.removeAttribute('open'));
            sortMenu?.classList.add('hidden');
            sortChevron?.classList.remove('rotate-180');
        });
    }

    // 10. Load More Projects Button Logic
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += 5;
            applySorting();
        });
    }
});