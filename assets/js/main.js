async function loadComponent(id, filePath) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const html = await response.text();
            document.getElementById(id).innerHTML = html;
            
            if (id === 'navbar-placeholder') {
                initThemeToggle();
                initCVModal();
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
    
    document.addEventListener('click', (e) => {
        if (e.target.id === 'open-cv-modal') {
            modal?.classList.remove('hidden');
        }
        if (e.target.id === 'close-cv-modal' || e.target === modal) {
            modal?.classList.add('hidden');
        }
    });
}

// Tailored CV Generator & Printer
function generateTailoredPDF(track) {
    // 1. Close modal
    document.getElementById('cv-modal')?.classList.add('hidden');

    // 2. Define track-specific content for the traditional PDF resume
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

    // 3. Inject data into template
    const container = document.getElementById('pdf-projects-container');
    if (container) {
        container.innerHTML = tailoredProjects[track] || tailoredProjects['general'];
    }

    // 4. Temporarily show element so html2pdf can read its dimensions
    const element = document.getElementById('traditional-cv-template');
    element.style.display = 'block';

    // 5. Configure html2pdf options & trigger direct download
    const options = {
        margin:       10, // mm
        filename:     `Mateus_Campos_CV_${track.toUpperCase()}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).save().then(() => {
        // Hide element again after download triggers
        element.style.display = 'none';
    });
}