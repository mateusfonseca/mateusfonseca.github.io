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
            } else if (id === 'footer-placeholder') {
                const yearEl = document.getElementById('current-year');
                if (yearEl) yearEl.textContent = new Date().getFullYear();
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

// Category Color Theme Definitions (Dark mode default, .dark class = Light mode)
const CATEGORY_COLORS = {
    context: {
        hoverBorder: ['hover:border-lime-500', 'dark:hover:border-lime-500'],
        activeSummary: ['border-lime-500', 'dark:border-lime-500', 'text-lime-400', 'dark:text-lime-600', 'font-semibold'],
        badgeBg: ['bg-lime-600'],
        peerCheckedBg: 'peer-checked:bg-lime-600',
        labelHover: 'hover:text-lime-400 dark:hover:text-lime-600',
        tagClasses: 'bg-lime-950/60 dark:bg-lime-50 border border-lime-700/70 dark:border-lime-300 text-lime-300 dark:text-lime-700'
    },
    domain: {
        hoverBorder: ['hover:border-purple-500', 'dark:hover:border-purple-500'],
        activeSummary: ['border-purple-500', 'dark:border-purple-500', 'text-purple-400', 'dark:text-purple-600', 'font-semibold'],
        badgeBg: ['bg-purple-600'],
        peerCheckedBg: 'peer-checked:bg-purple-600',
        labelHover: 'hover:text-purple-400 dark:hover:text-purple-600',
        tagClasses: 'bg-purple-950/60 dark:bg-purple-50 border border-purple-700/70 dark:border-purple-300 text-purple-300 dark:text-purple-700'
    },
    programming: {
        hoverBorder: ['hover:border-emerald-500', 'dark:hover:border-emerald-500'],
        activeSummary: ['border-emerald-500', 'dark:border-emerald-500', 'text-emerald-400', 'dark:text-emerald-600', 'font-semibold'],
        badgeBg: ['bg-emerald-600'],
        peerCheckedBg: 'peer-checked:bg-emerald-600',
        labelHover: 'hover:text-emerald-400 dark:hover:text-emerald-600',
        tagClasses: 'bg-emerald-950/60 dark:bg-emerald-50 border border-emerald-700/70 dark:border-emerald-300 text-emerald-300 dark:text-emerald-700'
    },
    framework: {
        hoverBorder: ['hover:border-amber-500', 'dark:hover:border-amber-500'],
        activeSummary: ['border-amber-500', 'dark:border-amber-500', 'text-amber-400', 'dark:text-amber-600', 'font-semibold'],
        badgeBg: ['bg-amber-600'],
        peerCheckedBg: 'peer-checked:bg-amber-600',
        labelHover: 'hover:text-amber-400 dark:hover:text-amber-600',
        tagClasses: 'bg-amber-950/60 dark:bg-amber-50 border border-amber-700/70 dark:border-amber-300 text-amber-300 dark:text-amber-700'
    },
    database: {
        hoverBorder: ['hover:border-rose-500', 'dark:hover:border-rose-500'],
        activeSummary: ['border-rose-500', 'dark:border-rose-500', 'text-rose-400', 'dark:text-rose-600', 'font-semibold'],
        badgeBg: ['bg-rose-600'],
        peerCheckedBg: 'peer-checked:bg-rose-600',
        labelHover: 'hover:text-rose-400 dark:hover:text-rose-600',
        tagClasses: 'bg-rose-950/60 dark:bg-rose-50 border border-rose-700/70 dark:border-rose-300 text-rose-300 dark:text-rose-700'
    },
    infrastructure: {
        hoverBorder: ['hover:border-cyan-500', 'dark:hover:border-cyan-500'],
        activeSummary: ['border-cyan-500', 'dark:border-cyan-500', 'text-cyan-400', 'dark:text-cyan-600', 'font-semibold'],
        badgeBg: ['bg-cyan-600'],
        peerCheckedBg: 'peer-checked:bg-cyan-600',
        labelHover: 'hover:text-cyan-400 dark:hover:text-cyan-600',
        tagClasses: 'bg-cyan-950/60 dark:bg-cyan-50 border border-cyan-700/70 dark:border-cyan-300 text-cyan-300 dark:text-cyan-700'
    },
    data_science: {
        hoverBorder: ['hover:border-indigo-500', 'dark:hover:border-indigo-500'],
        activeSummary: ['border-indigo-500', 'dark:border-indigo-500', 'text-indigo-400', 'dark:text-indigo-600', 'font-semibold'],
        badgeBg: ['bg-indigo-600'],
        peerCheckedBg: 'peer-checked:bg-indigo-600',
        labelHover: 'hover:text-indigo-400 dark:hover:text-indigo-600',
        tagClasses: 'bg-indigo-950/60 dark:bg-indigo-50 border border-indigo-700/70 dark:border-indigo-300 text-indigo-300 dark:text-indigo-700'
    },
    others: {
        hoverBorder: ['hover:border-zinc-400', 'dark:hover:border-zinc-500'],
        activeSummary: ['border-zinc-400', 'dark:border-zinc-500', 'text-zinc-200', 'dark:text-zinc-700', 'font-semibold'],
        badgeBg: ['bg-zinc-600'],
        peerCheckedBg: 'peer-checked:bg-zinc-600',
        labelHover: 'hover:text-zinc-300 dark:hover:text-zinc-600',
        tagClasses: 'bg-zinc-800/80 dark:bg-zinc-200/80 border border-zinc-600 dark:border-zinc-400 text-zinc-300 dark:text-zinc-700'
    }
};

const DEFAULT_TAG_CLASSES = 'bg-slate-800 dark:bg-slate-100 border border-slate-700 dark:border-slate-300 text-slate-300 dark:text-slate-700';

// Function to update active states and selection count badges for dropdown filters
function updateDropdownActiveStates() {
    const inactiveClasses = ['border-slate-700', 'dark:border-slate-300', 'text-slate-200', 'dark:text-slate-800'];

    document.querySelectorAll('details.relative.group').forEach(details => {
        const category = details.getAttribute('data-category') || 'context';
        const theme = CATEGORY_COLORS[category] || CATEGORY_COLORS.context;
        const summary = details.querySelector('.filter-summary');
        const badge = details.querySelector('.filter-badge');

        summary.classList.add(...theme.hoverBorder);
        if (badge) {
            badge.classList.add(...theme.badgeBg);
        }

        const checkboxes = details.querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length === 0) return;

        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

        if (checkedCount > 0) {
            summary.classList.remove(...inactiveClasses);
            summary.classList.add(...theme.activeSummary);
            if (badge) {
                badge.textContent = checkedCount;
                badge.classList.remove('hidden');
            }
        } else {
            summary.classList.remove(...theme.activeSummary);
            summary.classList.add(...inactiveClasses);
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

// Image Gallery Modal State & Controls
let currentGalleryImages = [];
let currentGalleryIndex = 0;
let galleryScale = 1;
let galleryTranslateX = 0;
let galleryTranslateY = 0;
let isDraggingGallery = false;
let startDragX = 0;
let startDragY = 0;

function openImageGallery(images) {
    if (!images || images.length === 0) return;
    currentGalleryImages = images.map(img => {
        if (typeof img === 'string') {
            const parts = img.split('/');
            const filename = parts[parts.length - 1].split('?')[0];
            const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
            const title = nameWithoutExt.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            return { url: img, title: title };
        }
        return img;
    });
    currentGalleryIndex = 0;
    resetZoom();
    updateGalleryView();
    document.getElementById('image-gallery-modal')?.classList.remove('hidden');
}

function updateGalleryView() {
    const imgEl = document.getElementById('gallery-active-image');
    const counterEl = document.getElementById('gallery-counter');
    const titleEl = document.getElementById('gallery-image-title');
    
    const activeImage = currentGalleryImages[currentGalleryIndex];
    if (imgEl && activeImage) imgEl.src = activeImage.url;
    if (counterEl) counterEl.textContent = `Image ${currentGalleryIndex + 1} of ${currentGalleryImages.length}`;
    if (titleEl && activeImage) titleEl.textContent = activeImage.title || '';
    
    resetZoom();
}

function resetZoom() {
    galleryScale = 1;
    galleryTranslateX = 0;
    galleryTranslateY = 0;
    applyTransform();
    updateZoomLevelDisplay();
}

function applyTransform() {
    const wrapper = document.getElementById('gallery-image-wrapper');
    if (wrapper) {
        wrapper.style.transform = `translate(${galleryTranslateX}px, ${galleryTranslateY}px) scale(${galleryScale})`;
    }
}

function updateZoomLevelDisplay() {
    const zoomLevelEl = document.getElementById('zoom-level');
    if (zoomLevelEl) {
        zoomLevelEl.textContent = `${Math.round(galleryScale * 100)}%`;
    }
}

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

    document.querySelectorAll('.project-card[data-filtered-out="true"]').forEach(card => {
        card.style.display = 'none';
        card.classList.remove('is-visible');
    });

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

function updateFilterButtonStates() {
    const applyBtn = document.getElementById('apply-filters-btn');
    const clearBtn = document.getElementById('clear-filters-btn');

    const checkedCount = document.querySelectorAll('input[name^="filter-"][type="checkbox"]:checked').length;

    if (clearBtn) {
        clearBtn.disabled = checkedCount === 0;
    }

    if (applyBtn) {
        const hasChanges = getFilterStateSnapshot() !== appliedStateSnapshot;
        applyBtn.disabled = !hasChanges;
    }
}

function populateDynamicFilters(projects) {
    const categories = [
        { key: 'context', name: 'context', containerId: 'context-menu' },
        { key: 'programming', name: 'programming', containerId: 'programming-menu' },
        { key: 'framework', name: 'framework', containerId: 'framework-menu' },
        { key: 'database', name: 'database', containerId: 'database-menu' },
        { key: 'domain', name: 'domain', containerId: 'domain-menu' },
        { key: 'infrastructure', name: 'infrastructure', containerId: 'infrastructure-menu' },
        { key: 'data_science', name: 'datascience', containerId: 'datascience-menu' },
        { key: 'others', name: 'others', containerId: 'others-menu' }
    ];

    categories.forEach(cat => {
        const container = document.getElementById(cat.containerId);
        if (!container) return;

        const theme = CATEGORY_COLORS[cat.key] || CATEGORY_COLORS.context;

        const uniqueValues = new Set();
        projects.forEach(project => {
            const taxList = (project.taxonomy && project.taxonomy[cat.key]) || [];
            taxList.forEach(val => uniqueValues.add(val));
        });

        const sortedValues = Array.from(uniqueValues).sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: 'base' })
        );

        container.innerHTML = '';
        if (sortedValues.length === 0) {
            container.innerHTML = `<span class="text-slate-400 px-2">No items available</span>`;
            return;
        }

        sortedValues.forEach(val => {
            const lowerVal = val.toLowerCase();
            const label = document.createElement('label');
            label.className = `whitespace-nowrap flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 text-slate-200 dark:text-slate-800 cursor-pointer select-none transition ${theme.labelHover}`;
            label.innerHTML = `
                <input type="checkbox" name="filter-${cat.name}" value="${lowerVal}" class="peer sr-only">
                <span class="w-4 h-4 rounded flex items-center justify-center border border-slate-600 dark:border-slate-300 peer-checked:border-transparent ${theme.peerCheckedBg} text-transparent peer-checked:text-white shrink-0 text-[10px] font-bold transition">✓</span>
                <span>${val}</span>
            `;
            container.appendChild(label);
        });
    });

    updateDropdownActiveStates();

    document.querySelectorAll('input[name^="filter-"]:not([name="filter-sort"])').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateDropdownActiveStates();
            updateFilterButtonStates();
        });
    });
}

function initFilterSearch() {
    const searchContainer = document.getElementById('filter-search-container');
    const searchInput = document.getElementById('filter-search-input');
    const clearSearchBtn = document.getElementById('filter-search-clear');
    const resultsMenu = document.getElementById('filter-search-results');

    if (!searchContainer || !searchInput || !resultsMenu) return;

    const CATEGORY_LABELS = {
        context: 'Context',
        domain: 'Domain',
        programming: 'Programming',
        framework: 'Framework',
        database: 'Database',
        infrastructure: 'Infrastructure',
        data_science: 'Data Science',
        others: 'Others'
    };

    const getAllFilterOptions = () => {
        const items = [];
        document.querySelectorAll('details.filter-dropdown').forEach(details => {
            const catKey = details.getAttribute('data-category') || 'others';
            const catLabel = CATEGORY_LABELS[catKey] || catKey;

            details.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                const labelText = checkbox.closest('label')?.querySelector('span:last-of-type')?.textContent?.trim() || checkbox.value;
                items.push({
                    categoryKey: catKey,
                    categoryLabel: catLabel,
                    label: labelText,
                    value: checkbox.value,
                    checkbox
                });
            });
        });
        return items;
    };

    const renderResults = (query) => {
        const trimmed = query.trim().toLowerCase();

        if (!trimmed) {
            resultsMenu.classList.add('hidden');
            resultsMenu.innerHTML = '';
            clearSearchBtn?.classList.add('hidden');
            return;
        }

        clearSearchBtn?.classList.remove('hidden');

        const matches = getAllFilterOptions().filter(item =>
            item.label.toLowerCase().includes(trimmed) ||
            item.categoryLabel.toLowerCase().includes(trimmed)
        );

        resultsMenu.innerHTML = '';

        if (matches.length === 0) {
            resultsMenu.innerHTML = `<div class="px-3 py-2 text-slate-400 text-xs">No matching filters found</div>`;
            resultsMenu.classList.remove('hidden');
            return;
        }

        matches.forEach(item => {
            const theme = CATEGORY_COLORS[item.categoryKey] || CATEGORY_COLORS.others;
            const isChecked = item.checkbox.checked;

            const row = document.createElement('button');
            row.type = 'button';
            row.className = `w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 text-slate-200 dark:text-slate-800 text-left transition ${theme.labelHover}`;
            row.innerHTML = `
                <span class="flex items-center gap-2.5 min-w-0">
                    <span class="w-4 h-4 rounded flex items-center justify-center border ${isChecked ? `${theme.badgeBg[0]} border-transparent text-white` : 'border-slate-600 dark:border-slate-300'} shrink-0 text-[10px] font-bold">
                        ${isChecked ? '✓' : ''}
                    </span>
                    <span class="truncate">${item.label}</span>
                </span>
                <span class="${theme.tagClasses} px-2 py-0.5 rounded text-[11px] font-medium shrink-0">
                    ${item.categoryLabel}
                </span>
            `;

            row.addEventListener('click', (e) => {
                e.stopPropagation();
                item.checkbox.checked = !item.checkbox.checked;
                item.checkbox.dispatchEvent(new Event('change', { bubbles: true }));

                renderResults(searchInput.value);
                searchInput.focus();
            });

            resultsMenu.appendChild(row);
        });

        resultsMenu.classList.remove('hidden');
    };

    searchInput.addEventListener('input', (e) => {
        renderResults(e.target.value);
    });

    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            renderResults(searchInput.value);
        }
    });

    clearSearchBtn?.addEventListener('click', () => {
        searchInput.value = '';
        renderResults('');
        searchInput.focus();
    });

    document.addEventListener('click', (event) => {
        if (!searchContainer.contains(event.target)) {
            resultsMenu.classList.add('hidden');
        }
    });
}

async function loadProjectsGrid() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    const skeletonCardHtml = `
        <div class="project-card bg-slate-800/40 dark:bg-white p-6 md:p-8 rounded-2xl border border-slate-700/50 dark:border-slate-200 shadow-sm space-y-4 animate-pulse">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div class="h-8 bg-slate-700 dark:bg-slate-300 rounded-lg w-2/3"></div>
                <div class="h-6 bg-slate-700 dark:bg-slate-300 rounded-full w-28"></div>
            </div>
            <div class="space-y-2 pt-2">
                <div class="h-4 bg-slate-700 dark:bg-slate-300 rounded w-full"></div>
                <div class="h-4 bg-slate-700 dark:bg-slate-300 rounded w-5/6"></div>
            </div>
        </div>
    `;
    grid.innerHTML = skeletonCardHtml.repeat(3);

    try {
        const response = await fetch('assets/data/repos.json');
        if (!response.ok) throw new Error('Failed to load repository metadata.');
        const projects = await response.json();

        populateDynamicFilters(projects);

        grid.innerHTML = '';

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card bg-slate-800/40 dark:bg-white p-6 md:p-8 rounded-2xl border border-slate-700/50 dark:border-slate-200 shadow-sm space-y-4';
            
            const tax = project.taxonomy || {};
            
            card.setAttribute('data-context', (tax.context || []).join(',').toLowerCase());
            card.setAttribute('data-programming', (tax.programming || []).join(',').toLowerCase());
            card.setAttribute('data-framework', (tax.framework || []).join(',').toLowerCase());
            card.setAttribute('data-database', (tax.database || []).join(',').toLowerCase());
            card.setAttribute('data-domain', (tax.domain || []).join(',').toLowerCase());
            card.setAttribute('data-infrastructure', (tax.infrastructure || []).join(',').toLowerCase());
            card.setAttribute('data-datascience', (tax.data_science || []).join(',').toLowerCase());
            card.setAttribute('data-others', (tax.others || []).join(',').toLowerCase());
            
            const subDateStr = project.created_at ? project.created_at.split('T')[0] : '2026-01-01';
            const upDateStr = project.updated_at ? project.updated_at.split('T')[0] : subDateStr;
            card.setAttribute('data-date', subDateStr);
            card.setAttribute('data-updated', upDateStr);

            const formattedSubDate = new Date(subDateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            const formattedUpDate = new Date(upDateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

            const categoryOrder = [
                'context',
                'domain',
                'programming',
                'framework',
                'database',
                'infrastructure',
                'data_science',
                'others'
            ];

            const orderedTags = [];
            const seenTags = new Set();

            categoryOrder.forEach(catKey => {
                const sortedItems = [...(tax[catKey] || [])].sort((a, b) =>
                    a.localeCompare(b, undefined, { sensitivity: 'base' })
                );

                sortedItems.forEach(item => {
                    const normalized = item.toLowerCase().trim();
                    if (!seenTags.has(normalized)) {
                        seenTags.add(normalized);
                        orderedTags.push({ label: item, category: catKey });
                    }
                });
            });

            const tagsHtml = orderedTags.map(({ label, category }) => {
                const tagStyle = CATEGORY_COLORS[category]
                    ? CATEGORY_COLORS[category].tagClasses
                    : DEFAULT_TAG_CLASSES;

                return `<span class="${tagStyle} px-2.5 py-1 rounded text-xs font-medium">${label}</span>`;
            }).join('');

            let bulletsHtml = '';
            if (project.description && project.description.bullet_points && project.description.bullet_points.length > 0) {
                const liItems = project.description.bullet_points.map(bp => `<li>${bp}</li>`).join('');
                bulletsHtml = `<ul class="list-disc list-inside text-sm text-slate-300 dark:text-slate-600 space-y-1 pl-2">${liItems}</ul>`;
            }

            const introText = (project.description && project.description.intro) ? project.description.intro : (typeof project.description === 'string' ? project.description : '');

            // Conditional Gallery Button
            const hasImages = project.images && project.images.length > 0;
            const galleryBtnHtml = hasImages ? `
                <button type="button" onclick='openImageGallery(${JSON.stringify(project.images)})' class="p-2 bg-slate-700/50 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300 rounded-xl text-slate-200 dark:text-slate-800 transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer" title="View Image Gallery">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Gallery (${project.images.length})
                </button>` : '';

            card.innerHTML = `
                <div class="flex flex-col md:flex-row justify-between items-start gap-3">
                    <h2 class="text-2xl font-bold leading-snug">${project.title}</h2>
                    <div class="flex flex-wrap items-center gap-2 text-xs shrink-0 md:mt-1">
                        <span class="submitted-chip whitespace-nowrap bg-slate-800 dark:bg-slate-100 border border-slate-700 dark:border-slate-300 text-slate-300 dark:text-slate-700 px-3 py-1 rounded-full font-medium">Created: ${formattedSubDate}</span>
                        <span class="updated-chip whitespace-nowrap bg-slate-800 dark:bg-slate-100 border border-slate-700 dark:border-slate-300 text-slate-300 dark:text-slate-700 px-3 py-1 rounded-full font-medium">Updated: ${formattedUpDate}</span>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 text-xs">
                    ${tagsHtml}
                </div>
                <p class="text-slate-300 dark:text-slate-600 text-sm leading-relaxed">
                    ${introText}
                </p>
                ${bulletsHtml}
                <div class="pt-2 flex items-center gap-2">
                    <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" class="p-2 bg-slate-700/50 hover:bg-slate-700 dark:bg-slate-200 dark:hover:bg-slate-300 rounded-xl text-slate-200 dark:text-slate-800 transition flex items-center gap-1.5 text-xs font-semibold" title="View GitHub Repository">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                        Repository
                    </a>
                    ${galleryBtnHtml}
                </div>
            `;

            grid.appendChild(card);
        });

        applySorting();
        appliedStateSnapshot = getFilterStateSnapshot();
        updateFilterButtonStates();

    } catch (error) {
        console.error('Error fetching or rendering projects:', error);
        grid.innerHTML = `<p class="text-red-400 text-center py-8">Failed to load project repositories.</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('navbar-placeholder', 'assets/components/navbar.html');
    loadComponent('footer-placeholder', 'assets/components/footer.html');

    if (document.body.getAttribute('data-page') === 'projects') {
        loadProjectsGrid();
    } else {
        applySorting();
    }

    const applyBtn = document.getElementById('apply-filters-btn');
    const clearBtn = document.getElementById('clear-filters-btn');
    const loadMoreBtn = document.getElementById('load-more-btn');

    appliedStateSnapshot = getFilterStateSnapshot();
    updateFilterButtonStates();
    initFilterSearch();

    document.addEventListener('click', (event) => {
        document.querySelectorAll('details.relative.group').forEach((details) => {
            if (!details.contains(event.target)) {
                details.removeAttribute('open');
            }
        });
    });

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

        document.addEventListener('click', (event) => {
            if (!sortContainer.contains(event.target)) {
                sortMenu.classList.add('hidden');
                sortChevron?.classList.remove('rotate-180');
            }
        });
    }

    document.querySelectorAll('input[name^="filter-"]:not([name="filter-sort"])').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateDropdownActiveStates();
            updateFilterButtonStates();
        });
    });

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

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const selectedContexts = Array.from(document.querySelectorAll('input[name="filter-context"]:checked')).map(cb => cb.value);
            const selectedProgramming = Array.from(document.querySelectorAll('input[name="filter-programming"]:checked')).map(cb => cb.value);
            const selectedFrameworks = Array.from(document.querySelectorAll('input[name="filter-framework"]:checked')).map(cb => cb.value);
            const selectedDatabases = Array.from(document.querySelectorAll('input[name="filter-database"]:checked')).map(cb => cb.value);
            const selectedDomains = Array.from(document.querySelectorAll('input[name="filter-domain"]:checked')).map(cb => cb.value);
            const selectedInfrastructure = Array.from(document.querySelectorAll('input[name="filter-infrastructure"]:checked')).map(cb => cb.value);
            const selectedDataScience = Array.from(document.querySelectorAll('input[name="filter-datascience"]:checked')).map(cb => cb.value);
            const selectedOthers = Array.from(document.querySelectorAll('input[name="filter-others"]:checked')).map(cb => cb.value);

            const splitTags = (attr) => (attr || '').split(',').map(s => s.trim()).filter(Boolean);

            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                const cardContext = splitTags(card.getAttribute('data-context'));
                const cardProgramming = splitTags(card.getAttribute('data-programming'));
                const cardFrameworks = splitTags(card.getAttribute('data-framework'));
                const cardDatabases = splitTags(card.getAttribute('data-database'));
                const cardDomains = splitTags(card.getAttribute('data-domain'));
                const cardInfrastructure = splitTags(card.getAttribute('data-infrastructure'));
                const cardDataScience = splitTags(card.getAttribute('data-datascience'));
                const cardOthers = splitTags(card.getAttribute('data-others'));

                const matchesContext = selectedContexts.length === 0 || selectedContexts.some(val => cardContext.includes(val));
                const matchesProgramming = selectedProgramming.length === 0 || selectedProgramming.some(val => cardProgramming.includes(val));
                const matchesFramework = selectedFrameworks.length === 0 || selectedFrameworks.some(val => cardFrameworks.includes(val));
                const matchesDatabase = selectedDatabases.length === 0 || selectedDatabases.some(val => cardDatabases.includes(val));
                const matchesDomain = selectedDomains.length === 0 || selectedDomains.some(val => cardDomains.includes(val));
                const matchesInfrastructure = selectedInfrastructure.length === 0 || selectedInfrastructure.some(val => cardInfrastructure.includes(val));
                const matchesDataScience = selectedDataScience.length === 0 || selectedDataScience.some(val => cardDataScience.includes(val));
                const matchesOther = selectedOthers.length === 0 || selectedOthers.some(val => cardOthers.includes(val));

                if (matchesContext && matchesProgramming && matchesFramework && matchesDatabase && matchesDomain && matchesInfrastructure && matchesDataScience && matchesOther) {
                    card.removeAttribute('data-filtered-out');
                } else {
                    card.setAttribute('data-filtered-out', 'true');
                }
            });

            visibleCount = 5; 
            applySorting();
            updateDropdownActiveStates();
            
            appliedStateSnapshot = getFilterStateSnapshot();
            updateFilterButtonStates();

            document.querySelectorAll('details').forEach(d => d.removeAttribute('open'));
            sortMenu?.classList.add('hidden');
            sortChevron?.classList.remove('rotate-180');
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.querySelectorAll('input[name^="filter-"]:not([name="filter-sort"])[type="checkbox"]').forEach(cb => cb.checked = false);

            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                card.removeAttribute('data-filtered-out');
            });

            visibleCount = 5; 
            applySorting();
            updateDropdownActiveStates();
            
            appliedStateSnapshot = getFilterStateSnapshot();
            updateFilterButtonStates();

            document.querySelectorAll('details').forEach(d => d.removeAttribute('open'));
            sortMenu?.classList.add('hidden');
            sortChevron?.classList.remove('rotate-180');
        });
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += 5;
            applySorting();
        });
    }

    // Image Gallery Pan, Zoom & Modal Event Listeners
    const galleryModal = document.getElementById('image-gallery-modal');
    const closeGalleryBtn = document.getElementById('close-gallery-modal');
    const galleryPrevBtn = document.getElementById('gallery-prev');
    const galleryNextBtn = document.getElementById('gallery-next');
    const galleryViewport = document.getElementById('gallery-viewport');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');

    closeGalleryBtn?.addEventListener('click', () => galleryModal?.classList.add('hidden'));
    galleryModal?.addEventListener('click', (e) => {
        if (e.target === galleryModal) galleryModal.classList.add('hidden');
    });

    galleryPrevBtn?.addEventListener('click', () => {
        currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        updateGalleryView();
    });

    galleryNextBtn?.addEventListener('click', () => {
        currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryImages.length;
        updateGalleryView();
    });

    zoomInBtn?.addEventListener('click', () => {
        galleryScale = Math.min(galleryScale + 0.25, 4);
        applyTransform();
        updateZoomLevelDisplay();
    });

    zoomOutBtn?.addEventListener('click', () => {
        galleryScale = Math.max(galleryScale - 0.25, 1);
        if (galleryScale === 1) {
            galleryTranslateX = 0;
            galleryTranslateY = 0;
        }
        applyTransform();
        updateZoomLevelDisplay();
    });

    zoomResetBtn?.addEventListener('click', () => {
        resetZoom();
    });

    galleryViewport?.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomIntensity = 0.1;
        if (e.deltaY < 0) {
            galleryScale = Math.min(galleryScale + zoomIntensity, 4);
        } else {
            galleryScale = Math.max(galleryScale - zoomIntensity, 1);
            if (galleryScale === 1) {
                galleryTranslateX = 0;
                galleryTranslateY = 0;
            }
        }
        applyTransform();
        updateZoomLevelDisplay();
    }, { passive: false });

    galleryViewport?.addEventListener('mousedown', (e) => {
        if (galleryScale > 1) {
            isDraggingGallery = true;
            startDragX = e.clientX - galleryTranslateX;
            startDragY = e.clientY - galleryTranslateY;
            galleryViewport.style.cursor = 'grabbing';
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDraggingGallery) return;
        galleryTranslateX = e.clientX - startDragX;
        galleryTranslateY = e.clientY - startDragY;
        applyTransform();
    });

    window.addEventListener('mouseup', () => {
        isDraggingGallery = false;
        if (galleryViewport) galleryViewport.style.cursor = 'grab';
    });
});