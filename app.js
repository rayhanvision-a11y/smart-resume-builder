/* ==========================================================================
   SMART RESUME BUILDER & ATS CHECKER - APPLICATION LOGIC
   ========================================================================== */

// --- Default Sample Resume State ---
const sampleResumeData = {
    personalInfo: {
        fullName: "Tanvir Hossain",
        jobTitle: "Senior Full Stack Engineer",
        email: "tanvir.dev@example.com",
        phone: "+880 1712-345678",
        location: "Dhaka, Bangladesh",
        linkedin: "linkedin.com/in/tanvir-hossain",
        github: "github.com/tanvir-dev",
        summary: "Results-driven Senior Full Stack Developer with 5+ years of experience building high-performance web applications using JavaScript, React, Node.js, and Cloud Infrastructure. Proven track record of scaling modern SaaS platforms, optimizing REST/GraphQL APIs, and mentoring cross-functional engineering teams."
    },
    experiences: [
        {
            id: 1,
            title: "Senior Full Stack Developer",
            company: "TechNova Solutions",
            location: "Dhaka, BD",
            startDate: "2022 - Present",
            bullets: "Architected microservices architecture serving 500k+ active monthly users using React, Node.js, and AWS.\nReduced database query latency by 45% through Redis caching and PostgreSQL indexing.\nMentored 6 junior developers and established CI/CD pipelines using GitHub Actions."
        },
        {
            id: 2,
            title: "Frontend Software Engineer",
            company: "Apex Digital Cloud",
            location: "Remote",
            startDate: "2020 - 2022",
            bullets: "Built responsive web portals using Next.js, TypeScript, and Tailwind CSS.\nImproved Core Web Vitals (LCP/INP) score by 35%, boosting user retention by 20%.\nIntegrated Stripe payment gateways and OAuth2 authentication workflows."
        }
    ],
    education: [
        {
            id: 1,
            degree: "B.Sc. in Computer Science & Engineering",
            institution: "Dhaka University of Engineering & Technology",
            location: "Dhaka, BD",
            startDate: "2016 - 2020",
            gpa: "CGPA 3.85 / 4.00"
        }
    ],
    skills: {
        technical: "JavaScript (ES6+), TypeScript, React.js, Next.js, Node.js, Express, Python, PostgreSQL, MongoDB, Redis, GraphQL, Docker, AWS",
        soft: "System Architecture, Agile/Scrum, Code Review, Team Leadership, Problem Solving",
        tools: "Git, GitHub Actions, VS Code, Postman, Linux, Figma, Vercel"
    },
    projects: [
        {
            id: 1,
            name: "Smart Resume & ATS Optimizer",
            link: "github.com/tanvir-dev/smart-resume-builder",
            tech: "JavaScript, HTML5, CSS3, LocalStorage API",
            desc: "Open-source web application for real-time ATS keyword matching and single-click A4 PDF export with multi-template styling."
        },
        {
            id: 2,
            name: "Cloud Taskmaster Platform",
            link: "taskmaster-demo.app",
            tech: "React, Node.js, Socket.io, Docker",
            desc: "Real-time collaborative workspace supporting Kanban boards, live chat, and automated notifications."
        }
    ],
    certifications: [
        {
            id: 1,
            title: "AWS Certified Solutions Architect – Associate",
            issuer: "Amazon Web Services",
            year: "2023"
        },
        {
            id: 2,
            title: "Meta Certified Front-End Developer",
            issuer: "Coursera / Meta",
            year: "2022"
        }
    ],
    coverLetter: {
        recipient: "Hiring Manager",
        company: "TechNova Solutions Inc.",
        salutation: "Dear Hiring Manager at TechNova Solutions,",
        opening: "I am writing to express my enthusiastic interest in the Senior Full Stack Engineer role at TechNova Solutions Inc. With over 5 years of experience architecting high-performance web applications and cloud infrastructure, I am eager to bring my expertise in React, Node.js, and system scalability to your engineering team.",
        body: "In my previous position as Senior Full Stack Developer, I successfully architected microservices serving over 500,000 active monthly users and optimized web applications to reduce query latency by 45%. My background in establishing CI/CD pipelines, mentoring engineers, and executing clean code practices aligns directly with TechNova's vision for technical excellence.",
        closing: "Thank you for reviewing my application. I welcome the opportunity to discuss how my skill set and technical background can drive immediate value for TechNova Solutions. I am available for an interview at your earliest convenience."
    },
    settings: {
        template: "template-modern",
        color: "#3b82f6",
        font: "'Inter', sans-serif",
        fontSize: "14px"
    }
};

// Application State
let state = JSON.parse(localStorage.getItem('smart_resume_data')) || JSON.parse(JSON.stringify(sampleResumeData));
let zoomFactor = 1.0;

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initAccordions();
    initEventListeners();
    populateFormFromState();
    renderResumePreview();
    updateATSAnalysis();
});

// --- Tab System ---
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetElem = document.getElementById(targetId);
            if (targetElem) {
                targetElem.classList.add('active');
            }

            // Sync Preview Canvas with Tab Selection
            const docBtnCover = document.getElementById('doc-btn-cover');
            const docBtnResume = document.getElementById('doc-btn-resume');
            if (targetId === 'cover-letter-tab') {
                if (docBtnCover) docBtnCover.click();
            } else {
                if (docBtnResume) docBtnResume.click();
            }
        });
    });
}

// --- Accordion System ---
function initAccordions() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('open');
        });
    });
}

// --- Populate Form Controls from State ---
function populateFormFromState() {
    // Personal Info
    document.getElementById('fullName').value = state.personalInfo.fullName || '';
    document.getElementById('jobTitle').value = state.personalInfo.jobTitle || '';
    document.getElementById('email').value = state.personalInfo.email || '';
    document.getElementById('phone').value = state.personalInfo.phone || '';
    document.getElementById('location').value = state.personalInfo.location || '';
    document.getElementById('linkedin').value = state.personalInfo.linkedin || '';
    document.getElementById('github').value = state.personalInfo.github || '';
    document.getElementById('summary').value = state.personalInfo.summary || '';

    // Photo Controls
    document.getElementById('photoShape').value = state.personalInfo.photoShape || 'photo-circle';
    document.getElementById('photoSize').value = state.personalInfo.photoSize || '80px';
    const removeBtn = document.getElementById('btnRemovePhoto');
    const editorPhotoImg = document.getElementById('editorPhotoImg');
    const editorPhotoPlaceholder = document.getElementById('editorPhotoPlaceholder');

    if (state.personalInfo.photo) {
        removeBtn.style.display = 'inline-flex';
        editorPhotoImg.src = state.personalInfo.photo;
        editorPhotoImg.style.display = 'block';
        if (editorPhotoPlaceholder) editorPhotoPlaceholder.style.display = 'none';
    } else {
        removeBtn.style.display = 'none';
        editorPhotoImg.style.display = 'none';
        editorPhotoImg.src = '';
        if (editorPhotoPlaceholder) editorPhotoPlaceholder.style.display = 'block';
    }

    // Cover Letter
    if (!state.coverLetter) state.coverLetter = JSON.parse(JSON.stringify(sampleResumeData.coverLetter));
    document.getElementById('clRecipient').value = state.coverLetter.recipient || '';
    document.getElementById('clCompany').value = state.coverLetter.company || '';
    document.getElementById('clSalutation').value = state.coverLetter.salutation || '';
    document.getElementById('clOpening').value = state.coverLetter.opening || '';
    document.getElementById('clBody').value = state.coverLetter.body || '';
    document.getElementById('clClosing').value = state.coverLetter.closing || '';

    // Skills
    document.getElementById('skillsTechnical').value = state.skills.technical || '';
    document.getElementById('skillsSoft').value = state.skills.soft || '';
    document.getElementById('skillsTools').value = state.skills.tools || '';

    // Dynamic Lists
    renderDynamicExperienceForm();
    renderDynamicEducationForm();
    renderDynamicProjectsForm();
    renderDynamicCertificationsForm();

    // Settings
    document.getElementById('themeColor').value = state.settings.color || '#3b82f6';
    document.getElementById('colorHex').textContent = state.settings.color || '#3b82f6';
    document.getElementById('fontFamily').value = state.settings.font || "'Inter', sans-serif";
    document.getElementById('fontSize').value = state.settings.fontSize || "14px";

    // Swatches Highlight
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        if (swatch.getAttribute('data-color') === state.settings.color) {
            swatch.classList.add('active');
        } else {
            swatch.classList.remove('active');
        }
    });

    // Radio Template
    const templateRadios = document.querySelectorAll('input[name="template"]');
    templateRadios.forEach(radio => {
        const optionLabel = radio.closest('.template-option');
        if (radio.value === state.settings.template) {
            radio.checked = true;
            optionLabel.classList.add('active');
        } else {
            optionLabel.classList.remove('active');
        }
    });
}

// --- Event Listeners Setup ---
function initEventListeners() {
    // Input Fields Binding
    const bindInput = (id, section, key) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', (e) => {
                state[section][key] = e.target.value;
                saveStateAndRender();
            });
        }
    };

    bindInput('fullName', 'personalInfo', 'fullName');
    bindInput('jobTitle', 'personalInfo', 'jobTitle');
    bindInput('email', 'personalInfo', 'email');
    bindInput('phone', 'personalInfo', 'phone');
    bindInput('location', 'personalInfo', 'location');
    bindInput('linkedin', 'personalInfo', 'linkedin');
    bindInput('github', 'personalInfo', 'github');
    bindInput('summary', 'personalInfo', 'summary');

    bindInput('skillsTechnical', 'skills', 'technical');
    bindInput('skillsSoft', 'skills', 'soft');
    bindInput('skillsTools', 'skills', 'tools');

    // Cover Letter Bindings
    bindInput('clRecipient', 'coverLetter', 'recipient');
    bindInput('clCompany', 'coverLetter', 'company');
    bindInput('clSalutation', 'coverLetter', 'salutation');
    bindInput('clOpening', 'coverLetter', 'opening');
    bindInput('clBody', 'coverLetter', 'body');
    bindInput('clClosing', 'coverLetter', 'closing');

    // AI Cover Letter Draft Generator Button
    document.getElementById('btn-generate-cl-ai').addEventListener('click', () => {
        generateAICoverLetter();
    });

    // Action Chips Click Handler (Copy/Insert Verb)
    document.querySelectorAll('.action-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const verb = chip.textContent;
            navigator.clipboard.writeText(verb);
            alert(`Copied action verb "${verb}" to clipboard! Paste it into your bullet points.`);
        });
    });

    // Document Switcher Toolbar (Resume vs Cover Letter Canvas)
    const btnDocResume = document.getElementById('doc-btn-resume');
    const btnDocCover = document.getElementById('doc-btn-cover');
    const resumeCanvas = document.getElementById('resume-canvas');
    const coverCanvas = document.getElementById('cover-letter-canvas');

    btnDocResume.addEventListener('click', () => {
        btnDocResume.classList.add('active');
        btnDocCover.classList.remove('active');
        resumeCanvas.style.display = 'block';
        coverCanvas.style.display = 'none';
    });

    btnDocCover.addEventListener('click', () => {
        btnDocCover.classList.add('active');
        btnDocResume.classList.remove('active');
        resumeCanvas.style.display = 'none';
        coverCanvas.style.display = 'block';
        renderCoverLetterPreview();
    });

    // Photo Controls Listeners
    const photoInput = document.getElementById('photoInput');
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                state.personalInfo.photo = event.target.result;
                document.getElementById('btnRemovePhoto').style.display = 'inline-flex';
                document.getElementById('editorPhotoImg').src = event.target.result;
                document.getElementById('editorPhotoImg').style.display = 'block';
                document.getElementById('editorPhotoPlaceholder').style.display = 'none';
                saveStateAndRender();
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('btnRemovePhoto').addEventListener('click', () => {
        state.personalInfo.photo = null;
        document.getElementById('btnRemovePhoto').style.display = 'none';
        document.getElementById('photoInput').value = '';
        document.getElementById('editorPhotoImg').style.display = 'none';
        document.getElementById('editorPhotoImg').src = '';
        document.getElementById('editorPhotoPlaceholder').style.display = 'block';
        saveStateAndRender();
    });

    document.getElementById('photoShape').addEventListener('change', (e) => {
        state.personalInfo.photoShape = e.target.value;
        saveStateAndRender();
    });

    document.getElementById('photoSize').addEventListener('change', (e) => {
        state.personalInfo.photoSize = e.target.value;
        saveStateAndRender();
    });

    // Swatch Color Presets
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            const chosenColor = swatch.getAttribute('data-color');
            state.settings.color = chosenColor;
            document.getElementById('themeColor').value = chosenColor;
            document.getElementById('colorHex').textContent = chosenColor;

            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            saveStateAndRender();
        });
    });

    // Dynamic Add Buttons
    document.getElementById('add-experience-btn').addEventListener('click', () => {
        state.experiences.push({
            id: Date.now(),
            title: "Job Title / Role",
            company: "Company Name",
            location: "City, Country",
            startDate: "2022 - Present",
            bullets: "Accomplishment bullet point with metrics..."
        });
        saveStateAndRender();
        renderDynamicExperienceForm();
    });

    document.getElementById('add-education-btn').addEventListener('click', () => {
        state.education.push({
            id: Date.now(),
            degree: "Degree / Qualification",
            institution: "University / Institution",
            location: "City, Country",
            startDate: "2018 - 2022",
            gpa: "CGPA 3.8"
        });
        saveStateAndRender();
        renderDynamicEducationForm();
    });

    document.getElementById('add-project-btn').addEventListener('click', () => {
        state.projects.push({
            id: Date.now(),
            name: "Project Name",
            link: "github.com/username/project",
            tech: "Technologies used",
            desc: "Key results achieved and core features..."
        });
        saveStateAndRender();
        renderDynamicProjectsForm();
    });

    document.getElementById('add-cert-btn').addEventListener('click', () => {
        state.certifications.push({
            id: Date.now(),
            title: "Certification Title",
            issuer: "Issuing Organization",
            year: "2023"
        });
        saveStateAndRender();
        renderDynamicCertificationsForm();
    });

    // Template Radio Switcher
    const templateRadios = document.querySelectorAll('input[name="template"]');
    templateRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            state.settings.template = e.target.value;
            document.querySelectorAll('.template-option').forEach(opt => opt.classList.remove('active'));
            e.target.closest('.template-option').classList.add('active');
            saveStateAndRender();
        });
    });

    // Design Controls
    const colorInput = document.getElementById('themeColor');
    colorInput.addEventListener('input', (e) => {
        state.settings.color = e.target.value;
        document.getElementById('colorHex').textContent = e.target.value;
        saveStateAndRender();
    });

    document.getElementById('fontFamily').addEventListener('change', (e) => {
        state.settings.font = e.target.value;
        saveStateAndRender();
    });

    document.getElementById('fontSize').addEventListener('change', (e) => {
        state.settings.fontSize = e.target.value;
        saveStateAndRender();
    });

    // ATS Job Description Input
    document.getElementById('job-description-input').addEventListener('input', () => {
        updateATSAnalysis();
    });

    // Action Header Buttons
    document.getElementById('btn-load-sample').addEventListener('click', () => {
        state = JSON.parse(JSON.stringify(sampleResumeData));
        populateFormFromState();
        saveStateAndRender();
        updateATSAnalysis();
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
        if (confirm("Are you sure you want to clear all data?")) {
            state = {
                personalInfo: {},
                experiences: [],
                education: [],
                skills: {},
                projects: [],
                certifications: [],
                settings: state.settings
            };
            populateFormFromState();
            saveStateAndRender();
            updateATSAnalysis();
        }
    });

    // Export JSON
    document.getElementById('btn-export-json').addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `resume_${state.personalInfo.fullName || 'data'}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // Import JSON
    document.getElementById('input-import-json').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);
                    state = importedData;
                    populateFormFromState();
                    saveStateAndRender();
                    updateATSAnalysis();
                    alert("Resume data imported successfully!");
                } catch (err) {
                    alert("Invalid JSON file format.");
                }
            };
            reader.readAsText(file);
        }
    });

    // Export PDF (Print)
    document.getElementById('btn-export-pdf').addEventListener('click', () => {
        window.print();
    });

    // Preview Zoom Controls
    document.getElementById('zoom-in-btn').addEventListener('click', () => {
        if (zoomFactor < 1.4) {
            zoomFactor += 0.1;
            applyZoom();
        }
    });

    document.getElementById('zoom-out-btn').addEventListener('click', () => {
        if (zoomFactor > 0.6) {
            zoomFactor -= 0.1;
            applyZoom();
        }
    });
}

function applyZoom() {
    const canvas = document.getElementById('resume-canvas');
    canvas.style.transform = `scale(${zoomFactor})`;
    document.getElementById('zoom-level').textContent = `${Math.round(zoomFactor * 100)}%`;
}

// --- Dynamic Form Renderers ---
function renderDynamicExperienceForm() {
    const list = document.getElementById('experience-list');
    list.innerHTML = '';

    state.experiences.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'dynamic-item';
        card.innerHTML = `
            <div class="item-header">
                <span class="item-title-preview">${item.title || 'Job Title'}</span>
                <button class="btn-danger-text" onclick="removeExperience(${index})"><i class="fa-solid fa-trash"></i> Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" value="${item.title || ''}" oninput="updateExpField(${index}, 'title', this.value)">
                </div>
                <div class="form-group">
                    <label>Company Name</label>
                    <input type="text" value="${item.company || ''}" oninput="updateExpField(${index}, 'company', this.value)">
                </div>
                <div class="form-group">
                    <label>Dates (e.g. 2021 - Present)</label>
                    <input type="text" value="${item.startDate || ''}" oninput="updateExpField(${index}, 'startDate', this.value)">
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <input type="text" value="${item.location || ''}" oninput="updateExpField(${index}, 'location', this.value)">
                </div>
                <div class="form-group full-width">
                    <label>Key Accomplishments (One per line)</label>
                    <textarea rows="3" oninput="updateExpField(${index}, 'bullets', this.value)">${item.bullets || ''}</textarea>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function updateExpField(index, field, value) {
    state.experiences[index][field] = value;
    saveStateAndRender();
}

function removeExperience(index) {
    state.experiences.splice(index, 1);
    saveStateAndRender();
    renderDynamicExperienceForm();
}

function renderDynamicEducationForm() {
    const list = document.getElementById('education-list');
    list.innerHTML = '';

    state.education.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'dynamic-item';
        card.innerHTML = `
            <div class="item-header">
                <span class="item-title-preview">${item.degree || 'Degree'}</span>
                <button class="btn-danger-text" onclick="removeEducation(${index})"><i class="fa-solid fa-trash"></i> Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Degree / Field of Study</label>
                    <input type="text" value="${item.degree || ''}" oninput="updateEduField(${index}, 'degree', this.value)">
                </div>
                <div class="form-group">
                    <label>Institution Name</label>
                    <input type="text" value="${item.institution || ''}" oninput="updateEduField(${index}, 'institution', this.value)">
                </div>
                <div class="form-group">
                    <label>Dates / Year</label>
                    <input type="text" value="${item.startDate || ''}" oninput="updateEduField(${index}, 'startDate', this.value)">
                </div>
                <div class="form-group">
                    <label>GPA / Honors (Optional)</label>
                    <input type="text" value="${item.gpa || ''}" oninput="updateEduField(${index}, 'gpa', this.value)">
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function updateEduField(index, field, value) {
    state.education[index][field] = value;
    saveStateAndRender();
}

function removeEducation(index) {
    state.education.splice(index, 1);
    saveStateAndRender();
    renderDynamicEducationForm();
}

function renderDynamicProjectsForm() {
    const list = document.getElementById('projects-list');
    list.innerHTML = '';

    state.projects.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'dynamic-item';
        card.innerHTML = `
            <div class="item-header">
                <span class="item-title-preview">${item.name || 'Project Name'}</span>
                <button class="btn-danger-text" onclick="removeProject(${index})"><i class="fa-solid fa-trash"></i> Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Project Title</label>
                    <input type="text" value="${item.name || ''}" oninput="updateProjField(${index}, 'name', this.value)">
                </div>
                <div class="form-group">
                    <label>Link / URL</label>
                    <input type="text" value="${item.link || ''}" oninput="updateProjField(${index}, 'link', this.value)">
                </div>
                <div class="form-group full-width">
                    <label>Tech Stack Used</label>
                    <input type="text" value="${item.tech || ''}" oninput="updateProjField(${index}, 'tech', this.value)">
                </div>
                <div class="form-group full-width">
                    <label>Description & Features</label>
                    <textarea rows="2" oninput="updateProjField(${index}, 'desc', this.value)">${item.desc || ''}</textarea>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function updateProjField(index, field, value) {
    state.projects[index][field] = value;
    saveStateAndRender();
}

function removeProject(index) {
    state.projects.splice(index, 1);
    saveStateAndRender();
    renderDynamicProjectsForm();
}

function renderDynamicCertificationsForm() {
    const list = document.getElementById('certifications-list');
    list.innerHTML = '';

    state.certifications.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'dynamic-item';
        card.innerHTML = `
            <div class="item-header">
                <span class="item-title-preview">${item.title || 'Certification'}</span>
                <button class="btn-danger-text" onclick="removeCert(${index})"><i class="fa-solid fa-trash"></i> Remove</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Certification Name</label>
                    <input type="text" value="${item.title || ''}" oninput="updateCertField(${index}, 'title', this.value)">
                </div>
                <div class="form-group">
                    <label>Issuing Body</label>
                    <input type="text" value="${item.issuer || ''}" oninput="updateCertField(${index}, 'issuer', this.value)">
                </div>
                <div class="form-group">
                    <label>Year / Date</label>
                    <input type="text" value="${item.year || ''}" oninput="updateCertField(${index}, 'year', this.value)">
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function updateCertField(index, field, value) {
    state.certifications[index][field] = value;
    saveStateAndRender();
}

function removeCert(index) {
    state.certifications.splice(index, 1);
    saveStateAndRender();
    renderDynamicCertificationsForm();
}

// --- Live Resume Canvas Rendering ---
function renderResumePreview() {
    const canvas = document.getElementById('resume-canvas');
    
    // Apply Settings
    canvas.className = `resume-paper ${state.settings.template}`;
    canvas.style.setProperty('--accent-color', state.settings.color || '#3b82f6');
    canvas.style.setProperty('--resume-font', state.settings.font || "'Inter', sans-serif");
    canvas.style.setProperty('--resume-base-size', state.settings.fontSize || "14px");

    // Personal Info
    document.getElementById('pv-name').textContent = state.personalInfo.fullName || 'Your Full Name';
    document.getElementById('pv-title').textContent = state.personalInfo.jobTitle || 'Target Job Title';

    // Profile Photo Rendering
    const photoContainer = document.getElementById('pv-photo-container');
    const photoImg = document.getElementById('pv-photo');
    if (state.personalInfo.photo) {
        photoContainer.style.display = 'block';
        photoImg.src = state.personalInfo.photo;
        const shapeClass = state.personalInfo.photoShape || 'photo-circle';
        photoImg.className = shapeClass;
        const photoSize = state.personalInfo.photoSize || '80px';
        photoImg.style.width = photoSize;
        photoImg.style.height = photoSize;
    } else {
        photoContainer.style.display = 'none';
    }

    const contactContainer = document.getElementById('pv-contact');
    contactContainer.innerHTML = '';
    const contacts = [
        { icon: 'fa-envelope', val: state.personalInfo.email },
        { icon: 'fa-phone', val: state.personalInfo.phone },
        { icon: 'fa-location-dot', val: state.personalInfo.location },
        { icon: 'fa-brands fa-linkedin', val: state.personalInfo.linkedin },
        { icon: 'fa-brands fa-github', val: state.personalInfo.github }
    ];

    contacts.forEach(c => {
        if (c.val && c.val.trim() !== '') {
            const span = document.createElement('span');
            span.className = 'contact-item';
            span.innerHTML = `<i class="fa-solid ${c.icon}"></i> ${c.val}`;
            contactContainer.appendChild(span);
        }
    });

    // Summary
    const summarySec = document.getElementById('pv-sec-summary');
    if (state.personalInfo.summary && state.personalInfo.summary.trim() !== '') {
        summarySec.style.display = 'block';
        document.getElementById('pv-summary').textContent = state.personalInfo.summary;
    } else {
        summarySec.style.display = 'none';
    }

    // Work Experience
    const expSec = document.getElementById('pv-sec-experience');
    const expContainer = document.getElementById('pv-experience');
    expContainer.innerHTML = '';
    if (state.experiences && state.experiences.length > 0) {
        expSec.style.display = 'block';
        state.experiences.forEach(exp => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            
            const bulletsArr = exp.bullets ? exp.bullets.split('\n').filter(b => b.trim() !== '') : [];
            let bulletsHtml = '';
            if (bulletsArr.length > 0) {
                bulletsHtml = `<ul class="bullet-list">${bulletsArr.map(b => `<li>${b}</li>`).join('')}</ul>`;
            }

            item.innerHTML = `
                <div class="item-row">
                    <span class="role-title">${exp.title || ''}</span>
                    <span class="date-badge">${exp.startDate || ''}</span>
                </div>
                <div class="item-row">
                    <span class="company-name">${exp.company || ''}${exp.location ? ' • ' + exp.location : ''}</span>
                </div>
                ${bulletsHtml}
            `;
            expContainer.appendChild(item);
        });
    } else {
        expSec.style.display = 'none';
    }

    // Projects
    const projSec = document.getElementById('pv-sec-projects');
    const projContainer = document.getElementById('pv-projects');
    projContainer.innerHTML = '';
    if (state.projects && state.projects.length > 0) {
        projSec.style.display = 'block';
        state.projects.forEach(p => {
            const item = document.createElement('div');
            item.className = 'project-item';
            item.innerHTML = `
                <div class="item-row">
                    <span class="role-title">${p.name || ''}</span>
                    <span class="date-badge">${p.link || ''}</span>
                </div>
                <div style="font-size:12px; color:#64748b; margin-top:2px;"><strong>Tech:</strong> ${p.tech || ''}</div>
                <p style="font-size:13px; color:#334155; margin-top:4px;">${p.desc || ''}</p>
            `;
            projContainer.appendChild(item);
        });
    } else {
        projSec.style.display = 'none';
    }

    // Education
    const eduSec = document.getElementById('pv-sec-education');
    const eduContainer = document.getElementById('pv-education');
    eduContainer.innerHTML = '';
    if (state.education && state.education.length > 0) {
        eduSec.style.display = 'block';
        state.education.forEach(edu => {
            const item = document.createElement('div');
            item.className = 'edu-item';
            item.innerHTML = `
                <div class="item-row">
                    <span class="role-title">${edu.degree || ''}</span>
                    <span class="date-badge">${edu.startDate || ''}</span>
                </div>
                <div class="item-row">
                    <span class="company-name">${edu.institution || ''}${edu.location ? ' • ' + edu.location : ''}</span>
                    ${edu.gpa ? `<span style="font-size:12px; color:#475569;">${edu.gpa}</span>` : ''}
                </div>
            `;
            eduContainer.appendChild(item);
        });
    } else {
        eduSec.style.display = 'none';
    }

    // Skills
    const skillsSec = document.getElementById('pv-sec-skills');
    const skillsContainer = document.getElementById('pv-skills');
    skillsContainer.innerHTML = '';
    const hasSkills = state.skills.technical || state.skills.soft || state.skills.tools;
    if (hasSkills) {
        skillsSec.style.display = 'block';
        if (state.skills.technical) {
            skillsContainer.innerHTML += `<div class="skills-group"><strong>Technical Skills:</strong> ${state.skills.technical}</div>`;
        }
        if (state.skills.soft) {
            skillsContainer.innerHTML += `<div class="skills-group"><strong>Soft Skills & Methodologies:</strong> ${state.skills.soft}</div>`;
        }
        if (state.skills.tools) {
            skillsContainer.innerHTML += `<div class="skills-group"><strong>Tools & Environments:</strong> ${state.skills.tools}</div>`;
        }
    } else {
        skillsSec.style.display = 'none';
    }

    // Certifications
    const certSec = document.getElementById('pv-sec-certifications');
    const certContainer = document.getElementById('pv-certifications');
    certContainer.innerHTML = '';
    if (state.certifications && state.certifications.length > 0) {
        certSec.style.display = 'block';
        state.certifications.forEach(c => {
            const item = document.createElement('div');
            item.style.marginBottom = '6px';
            item.style.fontSize = '13px';
            item.innerHTML = `<strong>${c.title || ''}</strong> – ${c.issuer || ''} (${c.year || ''})`;
            certContainer.appendChild(item);
        });
    } else {
        certSec.style.display = 'none';
    }
}

function saveStateAndRender() {
    localStorage.setItem('smart_resume_data', JSON.stringify(state));
    renderResumePreview();
    renderCoverLetterPreview();
}

// --- Live Cover Letter Canvas Rendering ---
function renderCoverLetterPreview() {
    const canvas = document.getElementById('cover-letter-canvas');
    if (!canvas) return;

    canvas.className = `resume-paper ${state.settings.template}`;
    canvas.style.setProperty('--accent-color', state.settings.color || '#3b82f6');
    canvas.style.setProperty('--resume-font', state.settings.font || "'Inter', sans-serif");
    canvas.style.setProperty('--resume-base-size', state.settings.fontSize || "14px");

    document.getElementById('cl-pv-name').textContent = state.personalInfo.fullName || 'Your Full Name';
    document.getElementById('cl-pv-title').textContent = state.personalInfo.jobTitle || 'Target Job Title';
    document.getElementById('cl-pv-sign-name').textContent = state.personalInfo.fullName || 'Your Full Name';

    const contactContainer = document.getElementById('cl-pv-contact');
    contactContainer.innerHTML = '';
    const contacts = [
        { icon: 'fa-envelope', val: state.personalInfo.email },
        { icon: 'fa-phone', val: state.personalInfo.phone },
        { icon: 'fa-location-dot', val: state.personalInfo.location }
    ];

    contacts.forEach(c => {
        if (c.val && c.val.trim() !== '') {
            const span = document.createElement('span');
            span.className = 'contact-item';
            span.innerHTML = `<i class="fa-solid ${c.icon}"></i> ${c.val}`;
            contactContainer.appendChild(span);
        }
    });

    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('cl-pv-date').textContent = `Date: ${new Date().toLocaleDateString('en-US', options)}`;

    document.getElementById('cl-pv-rec-name').textContent = state.coverLetter.recipient || 'Hiring Manager';
    document.getElementById('cl-pv-rec-company').textContent = state.coverLetter.company || 'Target Company';
    document.getElementById('cl-pv-salutation').textContent = state.coverLetter.salutation || 'Dear Hiring Team,';

    document.getElementById('cl-pv-opening').textContent = state.coverLetter.opening || '';
    document.getElementById('cl-pv-body').textContent = state.coverLetter.body || '';
    document.getElementById('cl-pv-closing').textContent = state.coverLetter.closing || '';
}

// --- AI Cover Letter Generator ---
function generateAICoverLetter() {
    const name = state.personalInfo.fullName || 'Candidate';
    const role = state.personalInfo.jobTitle || 'Software Engineer';
    const company = state.coverLetter.company || 'TechNova Solutions';
    const recipient = state.coverLetter.recipient || 'Hiring Manager';
    const skills = state.skills.technical || 'JavaScript, React, Node.js, System Architecture';

    state.coverLetter.salutation = `Dear ${recipient} at ${company},`;
    state.coverLetter.opening = `I am writing to express my enthusiastic interest in the ${role} position at ${company}. Having followed your team's innovative work, I am eager to bring my expertise in ${skills} and track record of delivering high-impact solutions to your engineering team.`;
    state.coverLetter.body = `Throughout my career, I have specialized in building scalable, reliable applications and optimizing technical performance. My background in technical leadership, clean code principles, and cross-functional team collaboration directly aligns with ${company}'s commitment to engineering excellence.`;
    state.coverLetter.closing = `Thank you for taking the time to review my application. I welcome the opportunity to discuss how my skill set and technical background can drive immediate results for ${company}. I look forward to connecting with you soon.`;

    document.getElementById('clSalutation').value = state.coverLetter.salutation;
    document.getElementById('clOpening').value = state.coverLetter.opening;
    document.getElementById('clBody').value = state.coverLetter.body;
    document.getElementById('clClosing').value = state.coverLetter.closing;

    saveStateAndRender();
    
    // Switch preview to cover letter
    document.getElementById('doc-btn-cover').click();
}

// --- ATS KEYWORD MATCHING & SCORING ALGORITHM ---
function updateATSAnalysis() {
    const jdText = document.getElementById('job-description-input').value.toLowerCase().trim();
    if (!jdText) {
        document.getElementById('ats-badge').textContent = '0%';
        document.getElementById('ats-percentage-text').textContent = '0%';
        document.getElementById('ats-circle-path').setAttribute('stroke-dasharray', '0, 100');
        document.getElementById('count-matched').textContent = '0';
        document.getElementById('count-missing').textContent = '0';
        document.getElementById('list-matched-keywords').innerHTML = '<span style="font-size:12px; color:var(--text-muted)">Paste JD to calculate</span>';
        document.getElementById('list-missing-keywords').innerHTML = '<span style="font-size:12px; color:var(--text-muted)">Paste JD to calculate</span>';
        document.getElementById('list-ats-feedback').innerHTML = '<li>Paste a job description above to generate AI key-term matching feedback.</li>';
        return;
    }

    // Extract Words & Stop Words Filtering
    const stopWords = new Set([
        'a', 'an', 'the', 'and', 'or', 'but', 'is', 'if', 'then', 'else', 'when',
        'at', 'from', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
        'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from',
        'up', 'upon', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
        'further', 'then', 'once', 'here', 'there', 'where', 'why', 'how', 'all',
        'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
        'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
        's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'you', 'your',
        'our', 'we', 'they', 'their', 'must', 'have', 'has', 'had', 'having',
        'do', 'does', 'did', 'doing', 'be', 'been', 'being', 'am', 'are', 'was',
        'were', 'work', 'working', 'experience', 'ability', 'years', 'role'
    ]);

    const sanitizeWords = (text) => {
        return text
            .replace(/[^\w\s\+#]/g, ' ')
            .split(/\s+/)
            .map(w => w.trim())
            .filter(w => w.length > 2 && !stopWords.has(w));
    };

    const jdKeywords = Array.from(new Set(sanitizeWords(jdText)));

    // Extract all resume text into single string
    let resumeText = [
        state.personalInfo.fullName,
        state.personalInfo.jobTitle,
        state.personalInfo.summary,
        state.skills.technical,
        state.skills.soft,
        state.skills.tools,
        state.experiences.map(e => `${e.title} ${e.company} ${e.bullets}`).join(' '),
        state.projects.map(p => `${p.name} ${p.tech} ${p.desc}`).join(' '),
        state.education.map(e => `${e.degree} ${e.institution}`).join(' ')
    ].join(' ').toLowerCase();

    const matched = [];
    const missing = [];

    jdKeywords.forEach(kw => {
        if (resumeText.includes(kw)) {
            matched.push(kw);
        } else {
            missing.push(kw);
        }
    });

    const matchPercent = jdKeywords.length > 0 ? Math.round((matched.length / jdKeywords.length) * 100) : 0;

    // Update UI Indicators
    document.getElementById('ats-badge').textContent = `${matchPercent}%`;
    document.getElementById('ats-percentage-text').textContent = `${matchPercent}%`;
    document.getElementById('ats-circle-path').setAttribute('stroke-dasharray', `${matchPercent}, 100`);

    document.getElementById('count-matched').textContent = matched.length;
    document.getElementById('count-missing').textContent = missing.length;

    // Render Tags
    document.getElementById('list-matched-keywords').innerHTML = matched.slice(0, 20).map(k => `<span class="tag tag-matched">${k}</span>`).join('');
    document.getElementById('list-missing-keywords').innerHTML = missing.slice(0, 25).map(k => `<span class="tag tag-missing">${k}</span>`).join('');

    // Generate Feedback Checklist
    const feedbackUl = document.getElementById('list-ats-feedback');
    feedbackUl.innerHTML = '';

    const addFeedback = (isGood, text) => {
        const li = document.createElement('li');
        const icon = isGood ? 'fa-check-circle color-success' : 'fa-triangle-exclamation color-warning';
        li.innerHTML = `<i class="fa-solid ${icon}"></i> ${text}`;
        feedbackUl.appendChild(li);
    };

    if (matchPercent >= 75) {
        addFeedback(true, "Excellent keyword alignment with job description requirements.");
    } else if (matchPercent >= 50) {
        addFeedback(false, "Moderate match. Consider embedding missing highlighted keywords into your skills or project bullets.");
    } else {
        addFeedback(false, "Low keyword match score. Add relevant industry terms from the JD to clear ATS screening filters.");
    }

    // Check for Action Verbs & Metrics
    const actionVerbs = ['architected', 'built', 'developed', 'optimized', 'scaled', 'implemented', 'reduced', 'improved', 'increased', 'led', 'mentored', 'designed'];
    const hasActionVerbs = actionVerbs.some(v => resumeText.includes(v));
    if (hasActionVerbs) {
        addFeedback(true, "Strong action verbs detected (e.g. Architected, Built, Optimized, Reduced).");
    } else {
        addFeedback(false, "Include strong impact action verbs at the beginning of experience bullet points.");
    }

    const hasNumbers = /\d+%|\$\d+|\d+\s?k|\d+\s?million/i.test(resumeText);
    if (hasNumbers) {
        addFeedback(true, "Measurable impact metrics (% numbers, latency drops, revenue/user counts) found.");
    } else {
        addFeedback(false, "Quantify your achievements with numbers (e.g. 'Improved performance by 35%', 'Served 100k users').");
    }
}
