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
    initModeSwitcher();
    initRecruiterPortal();
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

    // Import JSON Data
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

    // Import & Auto-Parse Uploaded PDF Resume (pdf.js)
    const pdfImportInput = document.getElementById('input-import-pdf');
    if (pdfImportInput) {
        pdfImportInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    const arrayBuffer = await file.arrayBuffer();
                    if (typeof pdfjsLib !== 'undefined') {
                        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                        let extractedText = '';

                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            const pageText = textContent.items.map(item => item.str).join(' ');
                            extractedText += pageText + '\n';
                        }

                        // Auto-extract Email & Phone via Regex
                        const emailMatch = extractedText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
                        const phoneMatch = extractedText.match(/[\+\(]?[0-9][0-9\-\s\(\)]{8,}[0-9]/);

                        if (emailMatch) state.personalInfo.email = emailMatch[0];
                        if (phoneMatch) state.personalInfo.phone = phoneMatch[0].trim();

                        // Set extracted text as summary intro if present
                        state.personalInfo.summary = extractedText.slice(0, 500) + '...';

                        populateFormFromState();
                        saveStateAndRender();
                        updateATSAnalysis();
                        alert("PDF Resume uploaded and parsed successfully! Information extracted to editor fields.");
                    } else {
                        alert("PDF parser library loading, please try again.");
                    }
                } catch (err) {
                    console.error("PDF parse error:", err);
                    alert("Unable to parse text from this PDF file. Please ensure it contains selectable text.");
                }
            }
        });
    }

    // Print Button Handler
    const printBtn = document.getElementById('btn-print');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            const rCanvas = document.getElementById('resume-canvas');
            const cCanvas = document.getElementById('cover-letter-canvas');
            const oldRTransform = rCanvas ? rCanvas.style.transform : '';
            const oldCTransform = cCanvas ? cCanvas.style.transform : '';

            if (rCanvas) rCanvas.style.transform = 'none';
            if (cCanvas) cCanvas.style.transform = 'none';

            window.print();

            setTimeout(() => {
                if (rCanvas) rCanvas.style.transform = oldRTransform;
                if (cCanvas) cCanvas.style.transform = oldCTransform;
                applyZoom();
            }, 300);
        });
    }

    // Direct PDF File Download Handler (html2pdf.js)
    const downloadPdfBtn = document.getElementById('btn-download-pdf');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => {
            downloadDirectPDF();
        });
    }

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

// --- Direct PDF File Downloader (html2pdf.js) ---
function downloadDirectPDF() {
    // Determine active canvas (Resume or Cover Letter)
    const coverCanvas = document.getElementById('cover-letter-canvas');
    const resumeCanvas = document.getElementById('resume-canvas');
    
    let activeCanvas = resumeCanvas;
    let isCover = false;

    if (coverCanvas && coverCanvas.style.display !== 'none') {
        activeCanvas = coverCanvas;
        isCover = true;
    }

    if (!activeCanvas) return;

    // Reset zoom scale during capture for high DPI resolution
    const oldTransform = activeCanvas.style.transform;
    activeCanvas.style.transform = 'none';

    const docType = isCover ? 'Cover_Letter' : 'Resume';
    const rawName = state.personalInfo.fullName || 'Candidate';
    const fileName = `${rawName.trim().replace(/\s+/g, '_')}_${docType}.pdf`;

    const options = {
        margin: [8, 8, 8, 8],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (typeof html2pdf !== 'undefined') {
        html2pdf().set(options).from(activeCanvas).save().then(() => {
            activeCanvas.style.transform = oldTransform;
            applyZoom();
        }).catch(err => {
            console.error("PDF Export error:", err);
            activeCanvas.style.transform = oldTransform;
            applyZoom();
            window.print();
        });
    } else {
        // Fallback to window.print() if CDN offline
        window.print();
        activeCanvas.style.transform = oldTransform;
        applyZoom();
    }
}

// ==========================================================================
// COMPANY ATS CANDIDATE SCREENER LOGIC
// ==========================================================================

let recruiterState = {
    candidates: [],
    minScoreFilter: 0
};

// --- Mode Switcher ---
function initModeSwitcher() {
    const modeBuilderBtn = document.getElementById('mode-builder');
    const modeScreenerBtn = document.getElementById('mode-screener');
    const appContainer = document.querySelector('.app-container');
    const recruiterWorkspace = document.getElementById('recruiter-workspace');

    if (modeBuilderBtn && modeScreenerBtn) {
        modeBuilderBtn.addEventListener('click', () => {
            modeBuilderBtn.classList.add('active');
            modeScreenerBtn.classList.remove('active');
            if (appContainer) appContainer.style.display = 'flex';
            if (recruiterWorkspace) recruiterWorkspace.style.display = 'none';
        });

        modeScreenerBtn.addEventListener('click', () => {
            modeScreenerBtn.classList.add('active');
            modeBuilderBtn.classList.remove('active');
            if (appContainer) appContainer.style.display = 'none';
            if (recruiterWorkspace) recruiterWorkspace.style.display = 'block';
        });
    }
}

// --- Initialize Recruiter Portal Listeners ---
function initRecruiterPortal() {
    const jdInput = document.getElementById('recruiterJD');
    const bulkPdfInput = document.getElementById('bulkPdfInput');
    const dropzone = document.getElementById('bulkUploadDropzone');
    const minScoreSlider = document.getElementById('minScoreFilter');
    const btnLoadDemo = document.getElementById('btn-load-recruiter-demo');
    const btnExportCSV = document.getElementById('btn-export-recruiter-csv');
    const btnCloseModal = document.getElementById('btnCloseModal');

    // JD text change re-computes matches
    if (jdInput) {
        jdInput.addEventListener('input', () => {
            recalculateRecruiterMatches();
        });
    }

    // Min score slider
    if (minScoreSlider) {
        minScoreSlider.addEventListener('input', (e) => {
            recruiterState.minScoreFilter = parseInt(e.target.value) || 0;
            const minScoreVal = document.getElementById('minScoreVal');
            if (minScoreVal) minScoreVal.textContent = recruiterState.minScoreFilter + '%';
            renderRecruiterLeaderboard();
        });
    }

    // Bulk PDF Upload File Input
    if (bulkPdfInput) {
        bulkPdfInput.addEventListener('change', async (e) => {
            if (e.target.files && e.target.files.length > 0) {
                await processBulkPdfFiles(e.target.files);
                e.target.value = '';
            }
        });
    }

    // Drag & Drop Dropzone
    if (dropzone) {
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropzone.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
            }, false);
        });

        dropzone.addEventListener('drop', async (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files && files.length > 0) {
                await processBulkPdfFiles(files);
            }
        });
    }

    // Load Demo Candidates Button
    if (btnLoadDemo) {
        btnLoadDemo.addEventListener('click', () => {
            loadDemoRecruiterCandidates();
        });
    }

    // Export CSV Button
    if (btnExportCSV) {
        btnExportCSV.addEventListener('click', () => {
            exportRecruiterCSVReport();
        });
    }

    // Modal Close Button
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', () => {
            const modal = document.getElementById('candidateModal');
            if (modal) modal.style.display = 'none';
        });
    }
}

// --- Process Bulk Uploaded PDF Files ---
async function processBulkPdfFiles(fileList) {
    const jdText = document.getElementById('recruiterJD').value.trim();

    // Configure PDF.js worker
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) continue;

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            for (let p = 1; p <= pdfDoc.numPages; p++) {
                const page = await pdfDoc.getPage(p);
                const tokenContent = await page.getTextContent();
                const pageText = tokenContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }

            // Extract candidate info
            const parsedInfo = parseCandidateText(fullText, file.name);
            const matchAnalysis = evaluateCandidateAnalysis(fullText, jdText);

            recruiterState.candidates.push({
                id: Date.now() + Math.random(),
                name: parsedInfo.name,
                fileName: file.name,
                email: parsedInfo.email,
                phone: parsedInfo.phone,
                fullText: fullText,
                score: matchAnalysis.score,
                matchedSkills: matchAnalysis.matchedSkills,
                missingSkills: matchAnalysis.missingSkills
            });

        } catch (err) {
            console.error("Error parsing PDF resume:", file.name, err);
        }
    }

    recalculateRecruiterMatches();
}

// --- Parse Candidate Info from Raw Text ---
function parseCandidateText(rawText, fileName) {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    let name = fileName.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
    
    if (lines.length > 0) {
        const firstLine = lines[0];
        if (firstLine.length < 40 && !firstLine.includes('@') && !/\d/.test(firstLine)) {
            name = firstLine;
        }
    }

    // Regex for Email
    const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0] : 'No Email Found';

    // Regex for Phone
    const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/);
    const phone = phoneMatch ? phoneMatch[0] : 'No Phone Found';

    return { name, email, phone };
}

// --- Evaluate Candidate Match Analysis ---
function evaluateCandidateAnalysis(candidateText, jdText) {
    if (!jdText || jdText.trim().length === 0) {
        return { score: 0, matchedSkills: [], missingSkills: [] };
    }

    const stopWords = new Set(['and','the','with','for','you','that','this','have','from','will','are','all','our','we','or','is','in','on','at','to','a','an','of','be','by','as','looking','seeking','required','requirements','experience','years']);
    
    // Extract keywords from JD
    const rawJdTokens = jdText.toLowerCase().match(/[a-z0-9+#.]{2,}/g) || [];
    const uniqueJdKeywords = [...new Set(rawJdTokens.filter(t => !stopWords.has(t) && t.length > 2))];

    if (uniqueJdKeywords.length === 0) {
        return { score: 0, matchedSkills: [], missingSkills: [] };
    }

    const lowerCandidate = candidateText.toLowerCase();
    const matched = [];
    const missing = [];

    uniqueJdKeywords.forEach(kw => {
        if (lowerCandidate.includes(kw)) {
            matched.push(kw);
        } else {
            missing.push(kw);
        }
    });

    const matchRatio = matched.length / uniqueJdKeywords.length;
    const score = Math.min(100, Math.round(matchRatio * 100));

    return {
        score: score,
        matchedSkills: matched.slice(0, 15),
        missingSkills: missing.slice(0, 15)
    };
}

// --- Recalculate all Candidate Scores when JD changes ---
function recalculateRecruiterMatches() {
    const jdText = document.getElementById('recruiterJD') ? document.getElementById('recruiterJD').value.trim() : '';
    recruiterState.candidates.forEach(cand => {
        const analysis = evaluateCandidateAnalysis(cand.fullText, jdText);
        cand.score = analysis.score;
        cand.matchedSkills = analysis.matchedSkills;
        cand.missingSkills = analysis.missingSkills;
    });

    // Sort descending by match score
    recruiterState.candidates.sort((a, b) => b.score - a.score);
    renderRecruiterLeaderboard();
}

// --- Render Candidate Leaderboard Table ---
function renderRecruiterLeaderboard() {
    const tbody = document.getElementById('recruiterTableBody');
    const badgeTotal = document.getElementById('stat-total');
    const badgeQualified = document.getElementById('stat-qualified');
    const badgeAvg = document.getElementById('stat-average');
    const badgeCount = document.getElementById('candidates-count-badge');

    if (!tbody) return;

    const filtered = recruiterState.candidates.filter(c => c.score >= recruiterState.minScoreFilter);

    // Update Stats
    const totalCount = recruiterState.candidates.length;
    const qualifiedCount = recruiterState.candidates.filter(c => c.score >= 70).length;
    const avgScore = totalCount > 0 ? Math.round(recruiterState.candidates.reduce((acc, c) => acc + c.score, 0) / totalCount) : 0;

    if (badgeTotal) badgeTotal.textContent = totalCount;
    if (badgeQualified) badgeQualified.textContent = qualifiedCount;
    if (badgeAvg) badgeAvg.textContent = avgScore + '%';
    if (badgeCount) badgeCount.textContent = `${totalCount} Candidates Processed`;

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center empty-msg">
                    <i class="fa-solid fa-inbox empty-icon"></i>
                    <p>No candidates match the selected criteria (${recruiterState.minScoreFilter}% minimum score).</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = '';

    filtered.forEach((cand, idx) => {
        const tr = document.createElement('tr');

        let rankClass = '';
        if (idx === 0) rankClass = 'top-1';
        else if (idx === 1) rankClass = 'top-2';
        else if (idx === 2) rankClass = 'top-3';

        let statusBadgeHtml = '';
        let fillBg = '#ef4444';
        if (cand.score >= 75) {
            statusBadgeHtml = `<span class="badge badge-top"><i class="fa-solid fa-star"></i> Top Match</span>`;
            fillBg = '#10b981';
        } else if (cand.score >= 50) {
            statusBadgeHtml = `<span class="badge badge-potential"><i class="fa-solid fa-bolt"></i> Potential</span>`;
            fillBg = '#f59e0b';
        } else {
            statusBadgeHtml = `<span class="badge badge-low"><i class="fa-solid fa-triangle-exclamation"></i> Low Match</span>`;
            fillBg = '#ef4444';
        }

        tr.innerHTML = `
            <td>
                <span class="rank-badge ${rankClass}">#${idx + 1}</span>
            </td>
            <td>
                <span class="cand-name">${escapeHtml(cand.name)}</span>
                <span class="cand-filename"><i class="fa-solid fa-file-pdf"></i> ${escapeHtml(cand.fileName || 'Uploaded_CV.pdf')}</span>
            </td>
            <td>
                <div class="cand-contact">
                    <span><i class="fa-solid fa-envelope"></i> ${escapeHtml(cand.email)}</span>
                    <span><i class="fa-solid fa-phone"></i> ${escapeHtml(cand.phone)}</span>
                </div>
            </td>
            <td>
                <div class="score-bar-wrapper">
                    <div class="score-bar-bg">
                        <div class="score-bar-fill" style="width: ${cand.score}%; background: ${fillBg};"></div>
                    </div>
                    <span class="score-text" style="color: ${fillBg}">${cand.score}%</span>
                </div>
            </td>
            <td>${statusBadgeHtml}</td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="openCandidateModal('${cand.id}')">
                    <i class="fa-solid fa-eye"></i> Analysis
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// --- Open Candidate Analysis Modal ---
function openCandidateModal(candId) {
    const cand = recruiterState.candidates.find(c => String(c.id) === String(candId));
    if (!cand) return;

    const modal = document.getElementById('candidateModal');
    const modalName = document.getElementById('modalCandidateName');
    const scoreCircle = document.getElementById('modalScoreCircle');
    const statusBadge = document.getElementById('modalStatusBadge');
    const contactSub = document.getElementById('modalCandidateContact');
    const matchedCloud = document.getElementById('modalMatchedSkills');
    const missingCloud = document.getElementById('modalMissingSkills');
    const rawContent = document.getElementById('modalRawContent');

    if (modalName) modalName.textContent = cand.name + " - Candidate Breakdown";
    if (scoreCircle) {
        scoreCircle.textContent = cand.score + '%';
        scoreCircle.style.background = cand.score >= 75 ? '#10b981' : (cand.score >= 50 ? '#f59e0b' : '#ef4444');
    }

    if (statusBadge) {
        statusBadge.textContent = cand.score >= 75 ? "Top Qualified Candidate" : (cand.score >= 50 ? "Moderate Qualification Match" : "Requires Skill Upgrading");
        statusBadge.style.color = cand.score >= 75 ? '#10b981' : (cand.score >= 50 ? '#f59e0b' : '#ef4444');
    }

    if (contactSub) {
        contactSub.textContent = `Email: ${cand.email} | Phone: ${cand.phone}`;
    }

    if (matchedCloud) {
        matchedCloud.innerHTML = cand.matchedSkills.length > 0 
            ? cand.matchedSkills.map(s => `<span class="tag tag-matched"><i class="fa-solid fa-check"></i> ${escapeHtml(s)}</span>`).join('')
            : '<span class="text-muted">No specific tech skills matched yet.</span>';
    }

    if (missingCloud) {
        missingCloud.innerHTML = cand.missingSkills.length > 0
            ? cand.missingSkills.map(s => `<span class="tag tag-missing"><i class="fa-solid fa-xmark"></i> ${escapeHtml(s)}</span>`).join('')
            : '<span class="text-muted">No key missing skills identified.</span>';
    }

    if (rawContent) {
        rawContent.textContent = cand.fullText || "No raw text extracted.";
    }

    if (modal) modal.style.display = 'flex';
}

// --- Load 5 Realistic Demo Candidate Resumes ---
function loadDemoRecruiterCandidates() {
    const jdInput = document.getElementById('recruiterJD');
    if (jdInput && (!jdInput.value || jdInput.value.trim().length === 0)) {
        jdInput.value = `We are hiring a Senior Full Stack Engineer proficient in React, Node.js, Python, PostgreSQL, Docker, AWS, REST APIs, GraphQL, and Agile methodologies with at least 4 years experience. Strong problem solving, microservices architecture, and CI/CD automation background required.`;
    }

    const jdText = jdInput ? jdInput.value : '';

    const demoCVs = [
        {
            id: 'demo-1',
            name: 'Tanvir Hossain',
            fileName: 'Tanvir_Hossain_Senior_FullStack.pdf',
            email: 'tanvir.dev@example.com',
            phone: '+880 1712-345678',
            fullText: `Tanvir Hossain - Senior Full Stack Engineer\nEmail: tanvir.dev@example.com | Phone: +880 1712-345678\nSkills: React, Node.js, Python, PostgreSQL, Docker, AWS, REST APIs, GraphQL, Microservices, Agile, CI/CD, JavaScript, TypeScript, Redis.\nExperience: 5+ years building scalable SaaS platforms. Architected microservices serving 500k+ active users. Reduced database query latency by 45% using PostgreSQL indexing and Redis.`
        },
        {
            id: 'demo-2',
            name: 'Sharmin Akter',
            fileName: 'Sharmin_Akter_Frontend_Dev.pdf',
            email: 'sharmin.frontend@example.com',
            phone: '+880 1819-876543',
            fullText: `Sharmin Akter - Frontend Developer\nEmail: sharmin.frontend@example.com | Phone: +880 1819-876543\nSkills: React.js, JavaScript, HTML5, CSS3, Tailwind CSS, REST APIs, Git, Figma, Redux.\nExperience: 3 years building responsive web interfaces and user portals using React and Redux.`
        },
        {
            id: 'demo-3',
            name: 'Mahmudur Rahman',
            fileName: 'Mahmudur_Rahman_Data_Eng.pdf',
            email: 'mahmud.data@example.com',
            phone: '+880 1911-223344',
            fullText: `Mahmudur Rahman - Python & Data Engineer\nEmail: mahmud.data@example.com | Phone: +880 1911-223344\nSkills: Python, PostgreSQL, MongoDB, Docker, AWS, Spark, Pandas, SQL, REST APIs.\nExperience: 4 years designing data pipelines and database schemas for financial analytics.`
        },
        {
            id: 'demo-4',
            name: 'Anisur Rahman',
            fileName: 'Anisur_Rahman_Cloud_DevOps.pdf',
            email: 'anisur.cloud@example.com',
            phone: '+880 1677-554433',
            fullText: `Anisur Rahman - DevOps & Cloud Architect\nEmail: anisur.cloud@example.com | Phone: +880 1677-554433\nSkills: AWS, Docker, Kubernetes, CI/CD, Linux, Python, Terraform, Microservices, PostgreSQL.\nExperience: 6 years automating cloud deployments, container orchestration, and infrastructure security.`
        },
        {
            id: 'demo-5',
            name: 'Nadia Islam',
            fileName: 'Nadia_Islam_QA_Tester.pdf',
            email: 'nadia.qa@example.com',
            phone: '+880 1522-998877',
            fullText: `Nadia Islam - Junior QA Automation Engineer\nEmail: nadia.qa@example.com | Phone: +880 1522-998877\nSkills: Manual Testing, Selenium, JavaScript, Postman, Bug Tracking, JIRA.\nExperience: 1.5 years creating automated test suites for web applications.`
        }
    ];

    recruiterState.candidates = demoCVs.map(cand => {
        const analysis = evaluateCandidateAnalysis(cand.fullText, jdText);
        return {
            ...cand,
            score: analysis.score,
            matchedSkills: analysis.matchedSkills,
            missingSkills: analysis.missingSkills
        };
    });

    recruiterState.candidates.sort((a, b) => b.score - a.score);
    renderRecruiterLeaderboard();
}

// --- Export Recruitment Report (CSV) ---
function exportRecruiterCSVReport() {
    if (recruiterState.candidates.length === 0) {
        alert("No candidates available to export.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Rank,Candidate Name,Email,Phone,ATS Match Score (%),Status,Matched Skills,Missing Skills\n";

    recruiterState.candidates.forEach((cand, idx) => {
        const rank = idx + 1;
        const name = `"${cand.name.replace(/"/g, '""')}"`;
        const email = `"${cand.email.replace(/"/g, '""')}"`;
        const phone = `"${cand.phone.replace(/"/g, '""')}"`;
        const score = cand.score + "%";
        const status = cand.score >= 75 ? "Top Match" : (cand.score >= 50 ? "Potential" : "Low Match");
        const matched = `"${cand.matchedSkills.join(', ').replace(/"/g, '""')}"`;
        const missing = `"${cand.missingSkills.join(', ').replace(/"/g, '""')}"`;

        csvContent += `${rank},${name},${email},${phone},${score},${status},${matched},${missing}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Candidate_Recruitment_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

