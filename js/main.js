// ===== Authentication System =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on login page or home page
    const isLoginPage = document.querySelector('.login-page');
    
    if (isLoginPage) {
        initLoginPage();
    } else {
        initHomePage();
    }
});

// ===== Login Page Functions =====
function initLoginPage() {
    // Check if already logged in
    const currentUser = localStorage.getItem('careerPathUser');
    if (currentUser) {
        window.location.href = 'home.html';
        return;
    }

    // Seed demo user if not exists
    const users = JSON.parse(localStorage.getItem('careerPathUsers') || '[]');
    if (!users.find(u => u.email === 'demo@careerpath.com')) {
        users.push({ name: 'Demo Student', email: 'demo@careerpath.com', classLevel: '12th', password: 'demo123' });
        localStorage.setItem('careerPathUsers', JSON.stringify(users));
    }

    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const switchForms = document.querySelectorAll('.switch-form');
    const messageDiv = document.getElementById('message');

    // Toggle between login and signup
    function switchForm(formType) {
        toggleBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.form === formType);
        });
        
        if (formType === 'login') {
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        } else {
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        }
        messageDiv.className = 'message';
    }

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => switchForm(btn.dataset.form));
    });

    switchForms.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchForm(link.dataset.target);
        });
    });

    // Demo login button
    const demoBtn = document.getElementById('demoBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', function() {
            document.getElementById('loginEmail').value = 'demo@careerpath.com';
            document.getElementById('loginPassword').value = 'demo123';
            switchForm('login');
            loginForm.dispatchEvent(new Event('submit'));
        });
    }

    // Show message
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
    }

    // Handle Signup
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const classLevel = document.getElementById('signupClass').value;
        const password = document.getElementById('signupPassword').value;

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters', 'error');
            return;
        }

        // Get existing users or create empty array
        const users = JSON.parse(localStorage.getItem('careerPathUsers') || '[]');
        
        // Check if email already exists
        if (users.find(u => u.email === email)) {
            showMessage('Email already registered. Please login.', 'error');
            return;
        }

        // Add new user
        const newUser = { name, email, classLevel, password };
        users.push(newUser);
        localStorage.setItem('careerPathUsers', JSON.stringify(users));

        showMessage('Account created successfully! Please login.', 'success');
        
        // Switch to login form after delay
        setTimeout(() => switchForm('login'), 1500);
    });

    // Handle Login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        const users = JSON.parse(localStorage.getItem('careerPathUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('careerPathUser', JSON.stringify(user));
            showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        } else {
            showMessage('Invalid email or password', 'error');
        }
    });
}

// ===== Home Page Functions =====
function initHomePage() {
    // Check authentication
    const currentUser = JSON.parse(localStorage.getItem('careerPathUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Display user name
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = `Welcome, ${currentUser.name}`;
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('careerPathUser');
            window.location.href = 'index.html';
        });
    }

    // Initialize tabs, quiz and modals
    initStreamTabs();
    initQuiz();
    initModals();
}

// ===== Stream Tabs =====
function initStreamTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const careerContents = document.querySelectorAll('.career-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const stream = this.dataset.stream;
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            careerContents.forEach(content => {
                content.classList.toggle('active', content.id === stream);
            });
        });
    });
}

// ===== Career Quiz =====
const quizQuestions = [
    {
        question: "What type of activities do you enjoy the most?",
        options: [
            { text: "Solving puzzles and logical problems", type: "analytical" },
            { text: "Creating art, writing, or designing", type: "creative" },
            { text: "Helping and interacting with people", type: "social" },
            { text: "Managing money and business strategies", type: "business" }
        ]
    },
    {
        question: "Which subject do you find most interesting?",
        options: [
            { text: "Mathematics and Science", type: "analytical" },
            { text: "Literature, Art, or Music", type: "creative" },
            { text: "Psychology or Social Studies", type: "social" },
            { text: "Economics and Commerce", type: "business" }
        ]
    },
    {
        question: "How do you prefer to work?",
        options: [
            { text: "Independently on complex problems", type: "analytical" },
            { text: "In a flexible, creative environment", type: "creative" },
            { text: "In teams, collaborating with others", type: "social" },
            { text: "Leading and organizing projects", type: "business" }
        ]
    },
    {
        question: "What's your ideal work environment?",
        options: [
            { text: "Lab or tech company", type: "analytical" },
            { text: "Studio or media house", type: "creative" },
            { text: "Schools, hospitals, or NGOs", type: "social" },
            { text: "Corporate office or own business", type: "business" }
        ]
    },
    {
        question: "What motivates you the most?",
        options: [
            { text: "Discovering new technologies and innovations", type: "analytical" },
            { text: "Expressing myself and inspiring others", type: "creative" },
            { text: "Making a positive impact on society", type: "social" },
            { text: "Financial success and growth", type: "business" }
        ]
    }
];

const careerResults = {
    analytical: {
        title: "Analytical & Technical",
        description: "You have a logical mind and enjoy solving complex problems. Technical and research-oriented careers suit you best.",
        careers: ["Engineering", "Data Science", "Research Scientist", "Doctor", "Architect", "Software Developer"]
    },
    creative: {
        title: "Creative & Artistic",
        description: "You have a creative spirit and love expressing yourself. Careers in arts, design, and media are perfect for you.",
        careers: ["Graphic Designer", "Film Director", "Writer", "Fashion Designer", "Animator", "Interior Designer"]
    },
    social: {
        title: "Social & Humanitarian",
        description: "You care deeply about people and society. Careers focused on helping others and social change are ideal.",
        careers: ["Teacher", "Psychologist", "Social Worker", "Doctor", "Lawyer", "HR Manager"]
    },
    business: {
        title: "Business & Leadership",
        description: "You have strong leadership and business acumen. Careers in management, finance, and entrepreneurship suit you.",
        careers: ["Business Manager", "CA/CFA", "Entrepreneur", "Marketing Director", "Investment Banker", "Consultant"]
    }
};

let currentQuestion = 0;
let answers = [];

function initQuiz() {
    const quizContent = document.getElementById('quizContent');
    const quizResult = document.getElementById('quizResult');
    
    if (!quizContent) return;

    renderQuestion();
}

function renderQuestion() {
    const quizContent = document.getElementById('quizContent');
    const question = quizQuestions[currentQuestion];
    
    let optionsHTML = question.options.map((opt, index) => `
        <div class="quiz-option" data-index="${index}" data-type="${opt.type}">
            ${opt.text}
        </div>
    `).join('');

    quizContent.innerHTML = `
        <div class="quiz-progress">Question ${currentQuestion + 1} of ${quizQuestions.length}</div>
        <div class="quiz-question">
            <h3>${question.question}</h3>
            <div class="quiz-options">
                ${optionsHTML}
            </div>
        </div>
        <div class="quiz-nav">
            <button class="quiz-btn" id="prevBtn" ${currentQuestion === 0 ? 'disabled' : ''}>Previous</button>
            <button class="quiz-btn" id="nextBtn" disabled>
                ${currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next'}
            </button>
        </div>
    `;

    // Add event listeners
    const options = document.querySelectorAll('.quiz-option');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    // Restore previous selection if exists
    if (answers[currentQuestion]) {
        const selectedOption = document.querySelector(`.quiz-option[data-type="${answers[currentQuestion]}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
            nextBtn.disabled = false;
        }
    }

    options.forEach(option => {
        option.addEventListener('click', function() {
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            answers[currentQuestion] = this.dataset.type;
            nextBtn.disabled = false;
        });
    });

    nextBtn.addEventListener('click', function() {
        if (currentQuestion < quizQuestions.length - 1) {
            currentQuestion++;
            renderQuestion();
        } else {
            showResults();
        }
    });

    prevBtn.addEventListener('click', function() {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuestion();
        }
    });
}

function showResults() {
    const quizContent = document.getElementById('quizContent');
    const quizResult = document.getElementById('quizResult');
    
    // Count answer types
    const typeCounts = {};
    answers.forEach(type => {
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    // Find dominant type
    const dominantType = Object.keys(typeCounts).reduce((a, b) => 
        typeCounts[a] > typeCounts[b] ? a : b
    );

    const result = careerResults[dominantType];

    quizContent.classList.add('hidden');
    quizResult.classList.remove('hidden');
    
    quizResult.innerHTML = `
        <h3>🎯 ${result.title}</h3>
        <p>${result.description}</p>
        <div class="result-careers">
            ${result.careers.map(career => `<span class="result-career">${career}</span>`).join('')}
        </div>
        <p style="margin-top: 20px; color: var(--gray);">
            These are suggestions based on your interests. Explore all options before making a decision!
        </p>
        <button class="quiz-btn" onclick="retakeQuiz()" style="margin-top: 25px;">Retake Quiz</button>
    `;
}

function retakeQuiz() {
    currentQuestion = 0;
    answers = [];
    const quizContent = document.getElementById('quizContent');
    const quizResult = document.getElementById('quizResult');
    
    quizContent.classList.remove('hidden');
    quizResult.classList.add('hidden');
    
    renderQuestion();
}

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Detailed Stream & Career Data =====
const streamData = {
    science10: {
        icon: '🔬',
        title: 'Science Stream',
        color: '#6366f1',
        tabs: ['Overview', 'Subjects', 'Career Paths', 'Entrance Exams', 'Top Colleges'],
        content: {
            Overview: `
                <div class="detail-section">
                    <p class="detail-intro">The Science stream is the gateway to some of India's most prestigious and high-earning careers. It equips students with analytical thinking, problem-solving, and a deep understanding of the natural world.</p>
                    <div class="detail-two-col">
                        <div class="detail-pros">
                            <h4>✅ Why Choose Science?</h4>
                            <ul>
                                <li>Highest number of career options</li>
                                <li>Access to premium govt. jobs (ISRO, DRDO, BARC)</li>
                                <li>Can switch to Commerce/Arts after 12th</li>
                                <li>Strong earning potential in tech & medicine</li>
                                <li>Global career opportunities</li>
                            </ul>
                        </div>
                        <div class="detail-cons">
                            <h4>⚠️ Things to Consider</h4>
                            <ul>
                                <li>Highly competitive entrance exams (JEE, NEET)</li>
                                <li>Heavy and demanding syllabus</li>
                                <li>Requires consistent hard work for 2 years</li>
                                <li>Not suitable if you dislike Math/Science</li>
                            </ul>
                        </div>
                    </div>
                    <div class="detail-who">
                        <h4>🎯 Who Should Choose Science?</h4>
                        <p>Students who enjoy solving complex problems, have a strong interest in Physics, Chemistry, Math or Biology, and aspire to careers in Engineering, Medicine, Research, Space, or Technology.</p>
                    </div>
                </div>`,
            Subjects: `
                <div class="detail-section">
                    <div class="subject-group">
                        <h4>📘 PCM (Physics, Chemistry, Mathematics)</h4>
                        <p>Ideal for engineering, technology, and architecture aspirants.</p>
                        <div class="subject-tags">
                            <span class="subject-tag">Physics</span><span class="subject-tag">Chemistry</span><span class="subject-tag">Mathematics</span><span class="subject-tag">English</span><span class="subject-tag">Computer Science (Optional)</span>
                        </div>
                    </div>
                    <div class="subject-group mt-20">
                        <h4>📗 PCB (Physics, Chemistry, Biology)</h4>
                        <p>Ideal for medical, pharmacy, and life science aspirants.</p>
                        <div class="subject-tags">
                            <span class="subject-tag">Physics</span><span class="subject-tag">Chemistry</span><span class="subject-tag">Biology</span><span class="subject-tag">English</span><span class="subject-tag">Biotechnology (Optional)</span>
                        </div>
                    </div>
                    <div class="subject-group mt-20">
                        <h4>📙 PCMB (All four)</h4>
                        <p>For students who are undecided between engineering and medical paths.</p>
                        <div class="subject-tags">
                            <span class="subject-tag">Physics</span><span class="subject-tag">Chemistry</span><span class="subject-tag">Mathematics</span><span class="subject-tag">Biology</span><span class="subject-tag">English</span>
                        </div>
                    </div>
                </div>`,
            'Career Paths': `
                <div class="detail-section">
                    <div class="career-path-grid">
                        <div class="career-path-item"><span class="cp-icon">🏗️</span><strong>Engineering</strong><p>B.Tech/B.E. in CS, Mechanical, Civil, Electrical, Electronics, Chemical and 40+ more branches</p></div>
                        <div class="career-path-item"><span class="cp-icon">⚕️</span><strong>Medicine</strong><p>MBBS, BAMS, BHMS, BDS, BUMS — doctors, surgeons, specialists</p></div>
                        <div class="career-path-item"><span class="cp-icon">🚀</span><strong>Space & Defense</strong><p>ISRO, DRDO, Indian Navy, IAF — through NDA/CDS exams</p></div>
                        <div class="career-path-item"><span class="cp-icon">🖥️</span><strong>IT & Software</strong><p>Software Developer, Data Scientist, AI/ML Engineer, Cybersecurity</p></div>
                        <div class="career-path-item"><span class="cp-icon">🧬</span><strong>Research & Science</strong><p>KVPY, IISc, IISER — pure research in physics, chemistry, biology</p></div>
                        <div class="career-path-item"><span class="cp-icon">💊</span><strong>Pharmacy</strong><p>B.Pharm, Pharm.D — drug research, hospital pharmacy, pharma industry</p></div>
                        <div class="career-path-item"><span class="cp-icon">🏛️</span><strong>Architecture</strong><p>B.Arch — designing buildings, interiors, urban planning</p></div>
                        <div class="career-path-item"><span class="cp-icon">✈️</span><strong>Pilot / Aviation</strong><p>Commercial Pilot License (CPL) — airlines, private jets</p></div>
                    </div>
                </div>`,
            'Entrance Exams': `
                <div class="detail-section">
                    <div class="exam-detail-list">
                        <div class="exam-detail-item">
                            <div class="exam-name">JEE Main</div>
                            <div class="exam-info"><span class="exam-badge">Engineering</span> Conducted by NTA, gateway to NITs, IIITs, CFTIs. 2 sessions — Jan & Apr.</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">JEE Advanced</div>
                            <div class="exam-info"><span class="exam-badge">Engineering</span> For IIT admission. Only top 2.5 lakh JEE Main qualifiers can appear.</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">NEET UG</div>
                            <div class="exam-info"><span class="exam-badge">Medical</span> Single national exam for MBBS, BDS, BAMS, BHMS admissions across India.</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">BITSAT</div>
                            <div class="exam-info"><span class="exam-badge">Engineering</span> BITS Pilani entrance exam — one of the top private engineering colleges.</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">KVPY</div>
                            <div class="exam-info"><span class="exam-badge">Research</span> Kishore Vaigyanik Protsahan Yojana — scholarship for research-oriented students.</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">NATA</div>
                            <div class="exam-info"><span class="exam-badge">Architecture</span> National Aptitude Test in Architecture — for B.Arch admissions.</div>
                        </div>
                    </div>
                </div>`,
            'Top Colleges': `
                <div class="detail-section">
                    <div class="college-category">
                        <h4>🏆 Engineering — Top Colleges</h4>
                        <div class="college-list">
                            <span class="college-tag">IIT Bombay</span><span class="college-tag">IIT Delhi</span><span class="college-tag">IIT Madras</span><span class="college-tag">BITS Pilani</span><span class="college-tag">NIT Trichy</span><span class="college-tag">VIT Vellore</span>
                        </div>
                    </div>
                    <div class="college-category mt-20">
                        <h4>🏥 Medical — Top Colleges</h4>
                        <div class="college-list">
                            <span class="college-tag">AIIMS Delhi</span><span class="college-tag">CMC Vellore</span><span class="college-tag">JIPMER</span><span class="college-tag">Maulana Azad</span><span class="college-tag">KGMU Lucknow</span>
                        </div>
                    </div>
                    <div class="college-category mt-20">
                        <h4>🔬 Research — Top Institutes</h4>
                        <div class="college-list">
                            <span class="college-tag">IISc Bangalore</span><span class="college-tag">IISER Pune</span><span class="college-tag">TIFR Mumbai</span><span class="college-tag">NISER Bhubaneswar</span>
                        </div>
                    </div>
                </div>`
        }
    },
    commerce10: {
        icon: '📊',
        title: 'Commerce Stream',
        color: '#ec4899',
        tabs: ['Overview', 'Subjects', 'Career Paths', 'Entrance Exams', 'Top Colleges'],
        content: {
            Overview: `
                <div class="detail-section">
                    <p class="detail-intro">Commerce is the backbone of business and finance. It builds skills in accounting, economics, and management that are in demand across every industry globally.</p>
                    <div class="detail-two-col">
                        <div class="detail-pros">
                            <h4>✅ Why Choose Commerce?</h4>
                            <ul>
                                <li>Strong career in CA, CS, Banking & Finance</li>
                                <li>Entrepreneurship and startup opportunities</li>
                                <li>Relatively less competition than Science</li>
                                <li>Builds business acumen from an early age</li>
                                <li>MBA opens global leadership roles</li>
                            </ul>
                        </div>
                        <div class="detail-cons">
                            <h4>⚠️ Things to Consider</h4>
                            <ul>
                                <li>CA is a highly rigorous multi-year course</li>
                                <li>Math can be challenging in some streams</li>
                                <li>Market-sensitive careers (stock markets)</li>
                                <li>Limited in STEM fields</li>
                            </ul>
                        </div>
                    </div>
                    <div class="detail-who">
                        <h4>🎯 Who Should Choose Commerce?</h4>
                        <p>Students interested in how businesses and economies work, who enjoy numbers, analysis, and management. Great for aspiring entrepreneurs, accountants, bankers, and financial analysts.</p>
                    </div>
                </div>`,
            Subjects: `
                <div class="detail-section">
                    <div class="subject-group">
                        <h4>📘 Core Subjects</h4>
                        <div class="subject-tags">
                            <span class="subject-tag">Accountancy</span><span class="subject-tag">Business Studies</span><span class="subject-tag">Economics</span><span class="subject-tag">English</span>
                        </div>
                    </div>
                    <div class="subject-group mt-20">
                        <h4>📗 Optional Subjects (choose one)</h4>
                        <div class="subject-tags">
                            <span class="subject-tag">Mathematics</span><span class="subject-tag">Informatics Practices</span><span class="subject-tag">Statistics</span><span class="subject-tag">Entrepreneurship</span>
                        </div>
                    </div>
                    <div class="subject-group mt-20">
                        <h4>💡 Pro Tip</h4>
                        <p>Taking <strong>Mathematics</strong> as an optional subject opens doors to B.Com Honours, Statistics, and even Economics (Hons) at top DU colleges. Highly recommended!</p>
                    </div>
                </div>`,
            'Career Paths': `
                <div class="detail-section">
                    <div class="career-path-grid">
                        <div class="career-path-item"><span class="cp-icon">📈</span><strong>Chartered Accountant (CA)</strong><p>One of India's most prestigious qualifications. Auditing, taxation, and financial advisory.</p></div>
                        <div class="career-path-item"><span class="cp-icon">🏢</span><strong>Company Secretary (CS)</strong><p>Corporate governance, legal compliance, and company law specialist.</p></div>
                        <div class="career-path-item"><span class="cp-icon">📊</span><strong>Cost Accountant (CMA)</strong><p>Cost management, financial analysis, management accounting.</p></div>
                        <div class="career-path-item"><span class="cp-icon">🏦</span><strong>Banking & Finance</strong><p>RBI, SBI, IBPS PO — bank manager, financial analyst, credit officer.</p></div>
                        <div class="career-path-item"><span class="cp-icon">💼</span><strong>MBA</strong><p>After BBA or B.Com — management roles in top MNCs through CAT/XAT.</p></div>
                        <div class="career-path-item"><span class="cp-icon">📉</span><strong>Stock Market & Investment</strong><p>CFA, NISM certification — investment banking, wealth management.</p></div>
                        <div class="career-path-item"><span class="cp-icon">🚀</span><strong>Entrepreneur</strong><p>Start your own business with commercial knowledge and market understanding.</p></div>
                        <div class="career-path-item"><span class="cp-icon">📱</span><strong>Digital Marketing</strong><p>Growing field — brand management, social media, e-commerce marketing.</p></div>
                    </div>
                </div>`,
            'Entrance Exams': `
                <div class="detail-section">
                    <div class="exam-detail-list">
                        <div class="exam-detail-item">
                            <div class="exam-name">CA Foundation</div>
                            <div class="exam-info"><span class="exam-badge">Accountancy</span> ICAI exam — first step to becoming a Chartered Accountant. Twice a year.</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">CS Foundation</div>
                            <div class="exam-info"><span class="exam-badge">Company Law</span> ICSI exam — first step towards Company Secretary qualification.</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">CUET</div>
                            <div class="exam-info"><span class="exam-badge">Undergraduate</span> Central University admission — for B.Com, BBA, Economics Honours at top universities.</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">IPM (IIM)</div>
                            <div class="exam-info"><span class="exam-badge">Management</span> 5-year integrated BBA+MBA at IIM Indore, Rohtak, and Ranchi.</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">IBPS PO / SBI PO</div>
                            <div class="exam-info"><span class="exam-badge">Banking</span> After graduation — entry into public sector banks as probationary officer.</div>
                        </div>
                    </div>
                </div>`,
            'Top Colleges': `
                <div class="detail-section">
                    <div class="college-category">
                        <h4>🏆 B.Com / BBA — Top Colleges</h4>
                        <div class="college-list">
                            <span class="college-tag">SRCC Delhi</span><span class="college-tag">St. Xavier's Mumbai</span><span class="college-tag">Christ University</span><span class="college-tag">Narsee Monjee</span><span class="college-tag">Shaheed Sukhdev</span>
                        </div>
                    </div>
                    <div class="college-category mt-20">
                        <h4>🎓 MBA — Top Institutes (post graduation)</h4>
                        <div class="college-list">
                            <span class="college-tag">IIM Ahmedabad</span><span class="college-tag">IIM Bangalore</span><span class="college-tag">FMS Delhi</span><span class="college-tag">XLRI Jamshedpur</span>
                        </div>
                    </div>
                    <div class="college-category mt-20">
                        <h4>🏅 Integrated BBA+MBA</h4>
                        <div class="college-list">
                            <span class="college-tag">IIM Indore (IPM)</span><span class="college-tag">IIM Rohtak</span><span class="college-tag">NMIMS Mumbai</span>
                        </div>
                    </div>
                </div>`
        }
    },
    arts10: {
        icon: '🎨',
        title: 'Arts / Humanities',
        color: '#06b6d4',
        tabs: ['Overview', 'Subjects', 'Career Paths', 'Entrance Exams', 'Top Colleges'],
        content: {
            Overview: `
                <div class="detail-section">
                    <p class="detail-intro">Arts and Humanities is the most diverse and underrated stream. It develops critical thinking, communication, creativity, and an understanding of human society — skills valued in every field.</p>
                    <div class="detail-two-col">
                        <div class="detail-pros">
                            <h4>✅ Why Choose Arts?</h4>
                            <ul>
                                <li>Gateway to Civil Services (IAS, IPS)</li>
                                <li>Best for Law, Journalism, Design, Psychology</li>
                                <li>Creative freedom in career choices</li>
                                <li>Growing demand for content creators & writers</li>
                                <li>Less stressful syllabus than Science</li>
                            </ul>
                        </div>
                        <div class="detail-cons">
                            <h4>⚠️ Things to Consider</h4>
                            <ul>
                                <li>Some careers (UPSC) take many years</li>
                                <li>Needs self-discipline in reading/writing</li>
                                <li>Entry-level salaries can be lower in some roles</li>
                                <li>Less awareness among parents & students</li>
                            </ul>
                        </div>
                    </div>
                    <div class="detail-who">
                        <h4>🎯 Who Should Choose Arts?</h4>
                        <p>Students who enjoy reading, debating, creating, and understanding society. Perfect for future lawyers, journalists, civil servants, designers, psychologists, and social workers.</p>
                    </div>
                </div>`,
            Subjects: `
                <div class="detail-section">
                    <div class="subject-group">
                        <h4>📘 Common Core Subjects</h4>
                        <div class="subject-tags">
                            <span class="subject-tag">English</span><span class="subject-tag">History</span><span class="subject-tag">Political Science</span><span class="subject-tag">Geography</span>
                        </div>
                    </div>
                    <div class="subject-group mt-20">
                        <h4>📗 Elective Subjects (choose based on career)</h4>
                        <div class="subject-tags">
                            <span class="subject-tag">Psychology</span><span class="subject-tag">Sociology</span><span class="subject-tag">Economics</span><span class="subject-tag">Philosophy</span><span class="subject-tag">Fine Arts</span><span class="subject-tag">Home Science</span><span class="subject-tag">Legal Studies</span><span class="subject-tag">Media Studies</span>
                        </div>
                    </div>
                    <div class="subject-group mt-20">
                        <h4>💡 Smart Combinations</h4>
                        <p><strong>For Law:</strong> History + Political Science + Legal Studies<br>
                        <strong>For Psychology:</strong> Psychology + Sociology + English<br>
                        <strong>For Civil Services:</strong> History + Political Science + Geography</p>
                    </div>
                </div>`,
            'Career Paths': `
                <div class="detail-section">
                    <div class="career-path-grid">
                        <div class="career-path-item"><span class="cp-icon">⚖️</span><strong>Law (LLB)</strong><p>Lawyer, Judge, Legal Advisor, Corporate Counsel, Public Prosecutor.</p></div>
                        <div class="career-path-item"><span class="cp-icon">🏛️</span><strong>Civil Services</strong><p>IAS, IPS, IFS, IRS — UPSC exam, most prestigious govt. career.</p></div>
                        <div class="career-path-item"><span class="cp-icon">📰</span><strong>Journalism & Media</strong><p>Reporter, Editor, News Anchor, Digital Content Creator, PR Manager.</p></div>
                        <div class="career-path-item"><span class="cp-icon">🎨</span><strong>Design</strong><p>Fashion, Graphic, Interior, UX/UI Design — NID, NIFT institutes.</p></div>
                        <div class="career-path-item"><span class="cp-icon">🧠</span><strong>Psychology</strong><p>Clinical Psychologist, Counsellor, HR Specialist, Child Psychologist.</p></div>
                        <div class="career-path-item"><span class="cp-icon">🎬</span><strong>Film & Media</strong><p>Director, Screenwriter, Producer, Video Editor, Documentary Filmmaker.</p></div>
                        <div class="career-path-item"><span class="cp-icon">📚</span><strong>Teaching & Academia</strong><p>Professor, Researcher, Policy Analyst, Education Consultant.</p></div>
                        <div class="career-path-item"><span class="cp-icon">🌍</span><strong>Social Work & NGO</strong><p>Development worker, Policy Advocate, UNICEF/WHO Roles.</p></div>
                    </div>
                </div>`,
            'Entrance Exams': `
                <div class="detail-section">
                    <div class="exam-detail-list">
                        <div class="exam-detail-item">
                            <div class="exam-name">CLAT</div>
                            <div class="exam-info"><span class="exam-badge">Law</span> Common Law Admission Test — for 5-year LLB at NLUs (National Law Universities).</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">NID DAT</div>
                            <div class="exam-info"><span class="exam-badge">Design</span> National Institute of Design — premier design entrance exam in India.</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">NIFT Entrance</div>
                            <div class="exam-info"><span class="exam-badge">Fashion</span> National Institute of Fashion Technology — fashion design & management.</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">CUET</div>
                            <div class="exam-info"><span class="exam-badge">Undergraduate</span> Central Universities — for BA History, Political Science, Psychology, etc.</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">IIMC Entrance</div>
                            <div class="exam-info"><span class="exam-badge">Journalism</span> Indian Institute of Mass Communication — top journalism institute.</div>
                        </div>
                        <div class="exam-detail-item">
                            <div class="exam-name">UPSC CSE</div>
                            <div class="exam-info"><span class="exam-badge">Civil Services</span> After graduation — 3-stage exam (Prelims, Mains, Interview) for IAS/IPS.</div>
                        </div>
                    </div>
                </div>`,
            'Top Colleges': `
                <div class="detail-section">
                    <div class="college-category">
                        <h4>⚖️ Law — Top Colleges</h4>
                        <div class="college-list">
                            <span class="college-tag">NLSIU Bangalore</span><span class="college-tag">NLU Delhi</span><span class="college-tag">NALSAR Hyderabad</span><span class="college-tag">Symbiosis Law</span>
                        </div>
                    </div>
                    <div class="college-category mt-20">
                        <h4>🎨 Design — Top Institutes</h4>
                        <div class="college-list">
                            <span class="college-tag">NID Ahmedabad</span><span class="college-tag">NIFT Delhi</span><span class="college-tag">MIT Institute of Design</span><span class="college-tag">Srishti Manipal</span>
                        </div>
                    </div>
                    <div class="college-category mt-20">
                        <h4>📖 Humanities — Top Universities</h4>
                        <div class="college-list">
                            <span class="college-tag">JNU Delhi</span><span class="college-tag">Delhi University</span><span class="college-tag">Jadavpur University</span><span class="college-tag">Ashoka University</span><span class="college-tag">Hyderabad University</span>
                        </div>
                    </div>
                </div>`
        }
    }
};

const careerDetailData = {
    engineering: {
        icon: '🏗️', title: 'Engineering (B.Tech / B.E.)',
        duration: '4 Years', exam: 'JEE Main / Advanced', color: '#6366f1',
        tabs: ['About', 'Specialisations', 'Top Colleges', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">Engineering is India's most popular undergraduate degree. B.Tech/B.E. programs train students in applying scientific and mathematical principles to design, build, and improve systems and structures.</p><div class="detail-who"><h4>📋 Eligibility</h4><p>12th with PCM (Physics, Chemistry, Mathematics). Minimum 75% marks for IIT/NIT admission. JEE Main score is mandatory.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>B.Tech (4 yrs) → Job / M.Tech (2 yrs) / MBA → Senior Engineer / Manager / Entrepreneur. Top engineers in India earn ₹20L–₹1Cr+ annually.</p></div></div>`,
            Specialisations: `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">💻</span><strong>Computer Science (CSE)</strong><p>Software, AI, ML, Cybersecurity — highest paying branch</p></div><div class="career-path-item"><span class="cp-icon">⚙️</span><strong>Mechanical</strong><p>Automobiles, manufacturing, robotics, aerospace</p></div><div class="career-path-item"><span class="cp-icon">⚡</span><strong>Electrical</strong><p>Power systems, electronics, EV industry</p></div><div class="career-path-item"><span class="cp-icon">🏗️</span><strong>Civil</strong><p>Infrastructure, construction, urban planning</p></div><div class="career-path-item"><span class="cp-icon">📡</span><strong>Electronics (ECE)</strong><p>Semiconductors, telecom, VLSI design</p></div><div class="career-path-item"><span class="cp-icon">🧪</span><strong>Chemical</strong><p>Petrochemicals, pharmaceuticals, process industries</p></div></div></div>`,
            'Top Colleges': `<div class="detail-section"><div class="college-category"><h4>🥇 Govt — IITs</h4><div class="college-list"><span class="college-tag">IIT Bombay</span><span class="college-tag">IIT Delhi</span><span class="college-tag">IIT Madras</span><span class="college-tag">IIT Kanpur</span><span class="college-tag">IIT Kharagpur</span><span class="college-tag">IIT Roorkee</span></div></div><div class="college-category mt-20"><h4>🥈 Govt — NITs</h4><div class="college-list"><span class="college-tag">NIT Trichy</span><span class="college-tag">NIT Warangal</span><span class="college-tag">NIT Surathkal</span><span class="college-tag">NIT Calicut</span></div></div><div class="college-category mt-20"><h4>🏅 Private</h4><div class="college-list"><span class="college-tag">BITS Pilani</span><span class="college-tag">VIT Vellore</span><span class="college-tag">Thapar University</span><span class="college-tag">Manipal Institute</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>5–8 Years</span></div><div class="salary-row"><span>Software Engineer</span><span>₹4–12 LPA</span><span>₹15–40 LPA</span></div><div class="salary-row"><span>Data Scientist</span><span>₹6–14 LPA</span><span>₹20–50 LPA</span></div><div class="salary-row"><span>Civil Engineer</span><span>₹3–6 LPA</span><span>₹8–20 LPA</span></div><div class="salary-row"><span>Mechanical Engineer</span><span>₹3–7 LPA</span><span>₹10–25 LPA</span></div><div class="salary-row"><span>AI/ML Engineer</span><span>₹8–18 LPA</span><span>₹25–80 LPA</span></div></div></div>`
        }
    },
    medical: {
        icon: '⚕️', title: 'Medical (MBBS / BDS / BAMS)',
        duration: '5.5 Years (MBBS)', exam: 'NEET UG', color: '#ec4899',
        tabs: ['About', 'Courses Available', 'Top Colleges', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">A medical degree is one of the most respected and noble careers. MBBS (Bachelor of Medicine and Bachelor of Surgery) is the primary medical degree in India, followed by specialisation (MD/MS).</p><div class="detail-who"><h4>📋 Eligibility</h4><p>12th with PCB (Physics, Chemistry, Biology). Minimum 50% marks (45% for reserved categories). Must clear NEET UG — the single national medical entrance test.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>MBBS (5.5 yrs including internship) → MD/MS Specialisation (3 yrs) → DM/MCh Super-specialisation → Consultant / Surgeon. Doctors in India earn ₹8L–₹2Cr+ depending on specialisation.</p></div></div>`,
            'Courses Available': `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">🩺</span><strong>MBBS</strong><p>Modern medicine — the most sought-after medical degree. 5.5 years.</p></div><div class="career-path-item"><span class="cp-icon">🦷</span><strong>BDS</strong><p>Bachelor of Dental Surgery. Dentist, orthodontist, oral surgeon. 5 years.</p></div><div class="career-path-item"><span class="cp-icon">🌿</span><strong>BAMS</strong><p>Ayurvedic medicine — traditional Indian medicine. Growing career. 5.5 years.</p></div><div class="career-path-item"><span class="cp-icon">💊</span><strong>BHMS</strong><p>Homoeopathic medicine. 5.5 years including internship.</p></div><div class="career-path-item"><span class="cp-icon">👶</span><strong>B.Sc Nursing</strong><p>Nursing degree — hospital care, ICU, community health. 4 years.</p></div><div class="career-path-item"><span class="cp-icon">🔬</span><strong>BMLT / B.Sc MLT</strong><p>Medical Lab Technology — diagnostic testing. 3 years.</p></div></div></div>`,
            'Top Colleges': `<div class="detail-section"><div class="college-category"><h4>🥇 AIIMS Institutes</h4><div class="college-list"><span class="college-tag">AIIMS Delhi</span><span class="college-tag">AIIMS Jodhpur</span><span class="college-tag">AIIMS Bhopal</span><span class="college-tag">AIIMS Rishikesh</span></div></div><div class="college-category mt-20"><h4>🥈 Premier Govt. Medical Colleges</h4><div class="college-list"><span class="college-tag">CMC Vellore</span><span class="college-tag">JIPMER Puducherry</span><span class="college-tag">KGMU Lucknow</span><span class="college-tag">Grant Medical Mumbai</span></div></div><div class="college-category mt-20"><h4>🏅 Top Private Medical Colleges</h4><div class="college-list"><span class="college-tag">Manipal College of Medical Sciences</span><span class="college-tag">JSS Medical College</span><span class="college-tag">Kasturba Medical College</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>After Specialisation</span></div><div class="salary-row"><span>General Physician</span><span>₹5–10 LPA</span><span>₹15–40 LPA</span></div><div class="salary-row"><span>Surgeon</span><span>₹10–20 LPA</span><span>₹30–1Cr+ LPA</span></div><div class="salary-row"><span>Dentist</span><span>₹4–8 LPA</span><span>₹15–30 LPA</span></div><div class="salary-row"><span>Government Doctor</span><span>₹8–15 LPA</span><span>₹20–50 LPA</span></div><div class="salary-row"><span>Medical Researcher</span><span>₹6–12 LPA</span><span>₹18–35 LPA</span></div></div></div>`
        }
    },
    pharmacy: {
        icon: '💊', title: 'Pharmacy (B.Pharm / Pharm.D)',
        duration: '4 Years (B.Pharm)', exam: 'State CETs / GPAT', color: '#22c55e',
        tabs: ['About', 'Courses Available', 'Top Colleges', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">Pharmacy is the science and practice of discovering, producing, preparing, and dispensing medicines. Pharmacists are essential in hospitals, research labs, and the pharma industry.</p><div class="detail-who"><h4>📋 Eligibility</h4><p>12th with PCB or PCM. Admission via state-level CETs or NEET scores (some states). B.Pharm is 4 years; Pharm.D is 6 years (Doctor of Pharmacy).</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>B.Pharm (4 yrs) → M.Pharm / MBA Pharma → Research / Drug Regulatory / Hospital Pharmacist. Indian pharma industry is world's 3rd largest by volume.</p></div></div>`,
            'Courses Available': `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">💊</span><strong>B.Pharm</strong><p>4-year degree. Covers pharmacology, medicinal chemistry, drug formulation.</p></div><div class="career-path-item"><span class="cp-icon">🏥</span><strong>Pharm.D</strong><p>6-year program (Doctor of Pharmacy) — clinical pharmacy, patient care in hospitals.</p></div><div class="career-path-item"><span class="cp-icon">🔬</span><strong>M.Pharm</strong><p>Postgraduate specialisation — pharmaceutics, pharmacology, quality assurance.</p></div><div class="career-path-item"><span class="cp-icon">📊</span><strong>MBA Pharma</strong><p>Business management for pharmaceutical industry — marketing, supply chain.</p></div></div></div>`,
            'Top Colleges': `<div class="detail-section"><div class="college-category"><h4>🥇 Top Pharmacy Institutes</h4><div class="college-list"><span class="college-tag">Jamia Hamdard, Delhi</span><span class="college-tag">NIPER Mohali</span><span class="college-tag">JSS College of Pharmacy</span><span class="college-tag">Manipal College of Pharmaceutical Sciences</span><span class="college-tag">Al-Ameen College, Bangalore</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>5+ Years</span></div><div class="salary-row"><span>Hospital Pharmacist</span><span>₹3–6 LPA</span><span>₹8–15 LPA</span></div><div class="salary-row"><span>Drug Regulatory Affairs</span><span>₹4–8 LPA</span><span>₹12–25 LPA</span></div><div class="salary-row"><span>Pharma Research</span><span>₹5–10 LPA</span><span>₹15–30 LPA</span></div><div class="salary-row"><span>Medical Representative</span><span>₹3–6 LPA</span><span>₹8–18 LPA</span></div></div></div>`
        }
    },
    'pure-sciences': {
        icon: '🧬', title: 'Pure Sciences (B.Sc)',
        duration: '3 Years', exam: 'CUET / University Entrance', color: '#8b5cf6',
        tabs: ['About', 'Specialisations', 'Top Colleges', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">A B.Sc in pure sciences builds deep knowledge in fundamental disciplines like Physics, Chemistry, Biology, or Mathematics. It's the foundation for research, teaching, and emerging tech careers.</p><div class="detail-who"><h4>📋 Eligibility</h4><p>12th with Science stream (PCM or PCB). Admission through CUET, university-level entrance, or merit.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>B.Sc (3 yrs) → M.Sc (2 yrs) → Ph.D (3–5 yrs) → Scientist / Professor / Researcher. INSPIRE fellowship and GATE help in funding advanced studies.</p></div></div>`,
            Specialisations: `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">⚛️</span><strong>Physics</strong><p>Astrophysics, quantum computing, semiconductor research, ISRO/BARC careers.</p></div><div class="career-path-item"><span class="cp-icon">🧪</span><strong>Chemistry</strong><p>Drug discovery, materials science, polymer research, food science.</p></div><div class="career-path-item"><span class="cp-icon">🧬</span><strong>Biology / Biotechnology</strong><p>Genomics, medical research, agriculture biotech, bioinformatics.</p></div><div class="career-path-item"><span class="cp-icon">📐</span><strong>Mathematics / Statistics</strong><p>Data science, actuarial science, financial modelling, AI research.</p></div></div></div>`,
            'Top Colleges': `<div class="detail-section"><div class="college-category"><h4>🥇 Research institutes</h4><div class="college-list"><span class="college-tag">IISc Bangalore</span><span class="college-tag">IISER Pune / Kolkata</span><span class="college-tag">NISER Bhubaneswar</span><span class="college-tag">TIFR Mumbai</span></div></div><div class="college-category mt-20"><h4>🥈 Top B.Sc Colleges</h4><div class="college-list"><span class="college-tag">St. Stephen's Delhi</span><span class="college-tag">Presidency College Kolkata</span><span class="college-tag">Loyola Chennai</span><span class="college-tag">Fergusson Pune</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>Senior Level</span></div><div class="salary-row"><span>Research Scientist</span><span>₹4–8 LPA</span><span>₹15–35 LPA</span></div><div class="salary-row"><span>Data Analyst</span><span>₹4–10 LPA</span><span>₹15–30 LPA</span></div><div class="salary-row"><span>University Professor</span><span>₹6–12 LPA</span><span>₹15–30 LPA</span></div><div class="salary-row"><span>ISRO / DRDO Scientist</span><span>₹8–12 LPA</span><span>₹18–35 LPA</span></div></div></div>`
        }
    },
    'it-cs': {
        icon: '🖥️', title: 'IT & Computer Science (BCA / B.Sc CS)',
        duration: '3 Years', exam: 'CUET / University', color: '#06b6d4',
        tabs: ['About', 'Specialisations', 'Top Colleges', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">BCA (Bachelor of Computer Applications) and B.Sc Computer Science are undergraduate degrees focused on programming, database management, networking, and software development. They're stepping stones to India's booming IT industry.</p><div class="detail-who"><h4>📋 Eligibility</h4><p>12th with any stream — Science preferred but not mandatory. Some colleges accept Commerce/Arts students with Mathematics at 10+2 level.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>BCA/B.Sc CS (3 yrs) → MCA or M.Sc CS (2 yrs) / MBA → Software Engineer / IT Manager. India's IT sector employs 5+ million professionals.</p></div></div>`,
            Specialisations: `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">🤖</span><strong>Artificial Intelligence & ML</strong><p>Build intelligent systems — self-driving cars, recommendation engines, chatbots.</p></div><div class="career-path-item"><span class="cp-icon">🛡️</span><strong>Cybersecurity</strong><p>Protect digital assets — ethical hacking, penetration testing, SOC analyst.</p></div><div class="career-path-item"><span class="cp-icon">☁️</span><strong>Cloud Computing</strong><p>AWS, Azure, Google Cloud — highly in-demand certifications.</p></div><div class="career-path-item"><span class="cp-icon">📱</span><strong>Mobile App Development</strong><p>iOS, Android development — app stores, gaming, fintech.</p></div><div class="career-path-item"><span class="cp-icon">🗃️</span><strong>Data Science</strong><p>Data analysis, visualization, machine learning model building.</p></div><div class="career-path-item"><span class="cp-icon">🌐</span><strong>Web Development</strong><p>Full-stack development — React, Node.js, Django, e-commerce platforms.</p></div></div></div>`,
            'Top Colleges': `<div class="detail-section"><div class="college-category"><h4>🥇 Top BCA/B.Sc CS Colleges</h4><div class="college-list"><span class="college-tag">Christ University, Bangalore</span><span class="college-tag">Symbiosis, Pune</span><span class="college-tag">Amity University</span><span class="college-tag">VIT Vellore</span><span class="college-tag">Manipal University</span></div></div><div class="college-category mt-20"><h4>💻 Top for MCA</h4><div class="college-list"><span class="college-tag">NIT Trichy</span><span class="college-tag">Delhi University (JNU)</span><span class="college-tag">BIT Mesra</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>5+ Years</span></div><div class="salary-row"><span>Software Developer</span><span>₹4–12 LPA</span><span>₹15–40 LPA</span></div><div class="salary-row"><span>Data Scientist</span><span>₹6–15 LPA</span><span>₹20–60 LPA</span></div><div class="salary-row"><span>Cybersecurity Analyst</span><span>₹5–12 LPA</span><span>₹18–45 LPA</span></div><div class="salary-row"><span>Cloud Architect</span><span>₹8–18 LPA</span><span>₹25–70 LPA</span></div></div></div>`
        }
    },
    architecture: {
        icon: '🏛️', title: 'Architecture (B.Arch)',
        duration: '5 Years', exam: 'NATA / JEE Main Paper 2', color: '#f59e0b',
        tabs: ['About', 'Specialisations', 'Top Colleges', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">Architecture combines art, science, and engineering to design buildings, spaces, and cities. B.Arch is a 5-year professional degree recognized by the Council of Architecture, India.</p><div class="detail-who"><h4>📋 Eligibility</h4><p>12th with Mathematics (PCM). Must score 50% aggregate and qualify NATA (National Aptitude Test in Architecture) or JEE Main Paper 2.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>B.Arch (5 yrs) → Internship (2 yrs) → Council of Architecture registration → Licensed Architect. Can pursue M.Arch for academic/specialist roles.</p></div></div>`,
            Specialisations: `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">🏙️</span><strong>Urban Planning</strong><p>Design cities, townships, and smart urban infrastructure.</p></div><div class="career-path-item"><span class="cp-icon">🏡</span><strong>Interior Design</strong><p>Residential and commercial interiors — furniture, lighting, space planning.</p></div><div class="career-path-item"><span class="cp-icon">🌿</span><strong>Sustainable / Green Architecture</strong><p>Eco-friendly buildings, LEED certification, net-zero design.</p></div><div class="career-path-item"><span class="cp-icon">🏗️</span><strong>Structural Architecture</strong><p>High-rise buildings, bridges, industrial structures.</p></div></div></div>`,
            'Top Colleges': `<div class="detail-section"><div class="college-category"><h4>🥇 Top Architecture Colleges</h4><div class="college-list"><span class="college-tag">IIT Kharagpur</span><span class="college-tag">SPA Delhi</span><span class="college-tag">CEPT University, Ahmedabad</span><span class="college-tag">Chandigarh College of Architecture</span><span class="college-tag">NIT Calicut</span><span class="college-tag">BITS Pilani</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>Senior Level</span></div><div class="salary-row"><span>Architect</span><span>₹3–7 LPA</span><span>₹15–40 LPA</span></div><div class="salary-row"><span>Urban Planner</span><span>₹4–8 LPA</span><span>₹12–30 LPA</span></div><div class="salary-row"><span>Interior Designer</span><span>₹3–6 LPA</span><span>₹10–25 LPA</span></div><div class="salary-row"><span>Landscape Architect</span><span>₹3–6 LPA</span><span>₹10–22 LPA</span></div></div></div>`
        }
    },
    ca: {
        icon: '📈', title: 'Chartered Accountancy (CA)',
        duration: '3–5 Years (after 12th)', exam: 'ICAI — CA Foundation', color: '#ec4899',
        tabs: ['About', 'Exam Structure', 'Top Firms', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">CA is one of India's most prestigious and well-paying qualifications. Chartered Accountants handle auditing, taxation, financial reporting, and advisory services. It's a self-regulated profession under ICAI.</p><div class="detail-who"><h4>📋 Eligibility & Route</h4><p>12th passed (any stream) → CA Foundation → CA Intermediate → Articleship (3 yrs) → CA Final → Qualified CA. The complete journey takes about 4–5 years.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>Article Assistant → CA → Senior CA → Partner in Big 4 / CFO / Own Practice. Annual income ranges from ₹7L to ₹50L+ depending on experience and specialization.</p></div></div>`,
            'Exam Structure': `<div class="detail-section"><div class="exam-detail-list"><div class="exam-detail-item"><div class="exam-name">CA Foundation</div><div class="exam-info"><span class="exam-badge">Level 1</span> 4 papers: Accounting, Maths/Statistics, Business Economics, Business Laws. Twice a year.</div></div><div class="exam-detail-item"><div class="exam-name">CA Intermediate</div><div class="exam-info"><span class="exam-badge">Level 2</span> 8 papers in 2 groups covering auditing, taxation, cost accounting, corporate law.</div></div><div class="exam-detail-item"><div class="exam-name">Articleship</div><div class="exam-info"><span class="exam-badge">Practical</span> 3-year mandatory training under a practising CA — real-world accounting experience.</div></div><div class="exam-detail-item"><div class="exam-name">CA Final</div><div class="exam-info"><span class="exam-badge">Level 3</span> 8 papers covering advanced financial reporting, strategic management, and direct/indirect taxes.</div></div></div></div>`,
            'Top Firms': `<div class="detail-section"><div class="college-category"><h4>🏆 Big 4 Accounting Firms</h4><div class="college-list"><span class="college-tag">Deloitte</span><span class="college-tag">EY (Ernst & Young)</span><span class="college-tag">KPMG</span><span class="college-tag">PricewaterhouseCoopers (PwC)</span></div></div><div class="college-category mt-20"><h4>🏅 Top Indian CA Firms</h4><div class="college-list"><span class="college-tag">S.R. Batliboi</span><span class="college-tag">Grant Thornton</span><span class="college-tag">BDO India</span><span class="college-tag">Lodha & Co.</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>Senior Level</span></div><div class="salary-row"><span>CA (Fresher)</span><span>₹7–12 LPA</span><span>₹20–50 LPA</span></div><div class="salary-row"><span>CFO</span><span>₹20–40 LPA</span><span>₹50L–2Cr LPA</span></div><div class="salary-row"><span>Tax Consultant</span><span>₹5–10 LPA</span><span>₹15–40 LPA</span></div><div class="salary-row"><span>Audit Partner (Big 4)</span><span>—</span><span>₹50L–2Cr+</span></div></div></div>`
        }
    },
    cs: {
        icon: '🏢', title: 'Company Secretary (CS)',
        duration: '3–4 Years', exam: 'ICSI — CS Foundation', color: '#6366f1',
        tabs: ['About', 'Exam Structure', 'Top Employers', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">A Company Secretary is a senior corporate professional responsible for corporate governance, compliance, and legal advisory. CS is regulated by ICSI (Institute of Company Secretaries of India).</p><div class="detail-who"><h4>📋 Eligibility</h4><p>12th (any stream) → CS Foundation → CS Executive → CS Professional + 15 months training → Qualified CS. Can be done alongside B.Com/BBA degree.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>CS Trainee → Company Secretary → Group Company Secretary → Board-level role (CFO/COO/Board Advisor). Mandatory position in public and listed companies.</p></div></div>`,
            'Exam Structure': `<div class="detail-section"><div class="exam-detail-list"><div class="exam-detail-item"><div class="exam-name">CS Foundation</div><div class="exam-info"><span class="exam-badge">Level 1</span> 4 subjects: Business Environment & Entrepreneurship, Legal Aptitude, Economic & Business Environment, Fundamentals of Accounting.</div></div><div class="exam-detail-item"><div class="exam-name">CS Executive</div><div class="exam-info"><span class="exam-badge">Level 2</span> 7 subjects across 2 modules — Company Law, Tax Laws, Economic & Commercial Laws, Capital Markets.</div></div><div class="exam-detail-item"><div class="exam-name">CS Professional</div><div class="exam-info"><span class="exam-badge">Level 3</span> Advanced modules — Governance, Risk & Compliance, Drafting, Corporate Restructuring, Insolvency.</div></div></div></div>`,
            'Top Employers': `<div class="detail-section"><div class="college-category"><h4>🏆 Where CS Professionals Work</h4><div class="college-list"><span class="college-tag">Tata Group</span><span class="college-tag">Reliance Industries</span><span class="college-tag">Infosys</span><span class="college-tag">SEBI</span><span class="college-tag">MCA (Ministry of Corporate Affairs)</span><span class="college-tag">NSE / BSE</span><span class="college-tag">Law Firms</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>Senior Level</span></div><div class="salary-row"><span>Company Secretary</span><span>₹5–9 LPA</span><span>₹15–35 LPA</span></div><div class="salary-row"><span>Compliance Officer</span><span>₹5–10 LPA</span><span>₹18–40 LPA</span></div><div class="salary-row"><span>Legal Advisor</span><span>₹6–12 LPA</span><span>₹20–50 LPA</span></div></div></div>`
        }
    },
    'bcom-bba': {
        icon: '💼', title: 'B.Com / BBA',
        duration: '3 Years', exam: 'CUET / DU / IPMAT', color: '#f59e0b',
        tabs: ['About', 'Specialisations', 'Top Colleges', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">B.Com (Bachelor of Commerce) and BBA (Bachelor of Business Administration) are 3-year undergraduate programs that build foundational knowledge in business, finance, and management.</p><div class="detail-who"><h4>📋 B.Com vs BBA</h4><p><strong>B.Com</strong> — focuses on accounting, finance, and commerce. Ideal for CA/CS aspirants.<br><strong>BBA</strong> — focuses on management, marketing, and HR. Ideal for MBA aspirants and entrepreneurs.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>B.Com/BBA (3 yrs) → CA/CS/MBA/MCA → Senior roles in Finance, Marketing, Operations. IIM Indore's IPM is a 5-year integrated BBA+MBA program.</p></div></div>`,
            Specialisations: `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">📊</span><strong>B.Com (Honours)</strong><p>Deep dive into accounting and finance — best for CA/CS track.</p></div><div class="career-path-item"><span class="cp-icon">🏦</span><strong>B.Com Banking & Insurance</strong><p>Specialized for banking sector and insurance industry.</p></div><div class="career-path-item"><span class="cp-icon">📱</span><strong>BBA Marketing</strong><p>Brand management, digital marketing, sales strategy.</p></div><div class="career-path-item"><span class="cp-icon">🌐</span><strong>BBA International Business</strong><p>Trade, exports, global supply chains, multinational careers.</p></div><div class="career-path-item"><span class="cp-icon">👥</span><strong>BBA Human Resources</strong><p>Talent acquisition, employee relations, organizational behaviour.</p></div><div class="career-path-item"><span class="cp-icon">💻</span><strong>BBA IT/Systems</strong><p>Business IT systems, ERP, digital transformation.</p></div></div></div>`,
            'Top Colleges': `<div class="detail-section"><div class="college-category"><h4>🥇 Top B.Com Colleges</h4><div class="college-list"><span class="college-tag">SRCC, Delhi</span><span class="college-tag">Hans Raj College</span><span class="college-tag">St. Xavier's Mumbai</span><span class="college-tag">Loyola Chennai</span></div></div><div class="college-category mt-20"><h4>🥈 Top BBA Colleges</h4><div class="college-list"><span class="college-tag">Christ University, Bangalore</span><span class="college-tag">Symbiosis, Pune</span><span class="college-tag">NMIMS Mumbai</span><span class="college-tag">FLAME University</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>After MBA/Senior</span></div><div class="salary-row"><span>Marketing Executive</span><span>₹3–6 LPA</span><span>₹10–25 LPA</span></div><div class="salary-row"><span>Finance Analyst</span><span>₹4–8 LPA</span><span>₹12–30 LPA</span></div><div class="salary-row"><span>HR Manager</span><span>₹4–7 LPA</span><span>₹12–25 LPA</span></div><div class="salary-row"><span>Business Consultant</span><span>₹6–12 LPA</span><span>₹18–50 LPA</span></div></div></div>`
        }
    },
    banking: {
        icon: '🏦', title: 'Banking & Finance',
        duration: '3–4 Years (B.Com + Exams)', exam: 'IBPS / SBI PO / RBI', color: '#06b6d4',
        tabs: ['About', 'Career Routes', 'Preparation Tips', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">The Indian banking and finance sector is one of the largest employers in the country. From public sector banks (PSBs) to private banks, NBFCs, RBI, and SEBI — the opportunities are vast and stable.</p><div class="detail-who"><h4>📋 Entry Routes</h4><p>Complete B.Com/BBA/B.Sc → Appear for IBPS PO, IBPS Clerk, SBI PO, RBI Grade B, or NABARD Officer exams after graduation.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>Bank PO → Branch Manager → Regional Manager → General Manager → Executive Director. Government bank jobs are highly secure with excellent perks.</p></div></div>`,
            'Career Routes': `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">🏦</span><strong>IBPS PO / Clerk</strong><p>Common exam for 11+ nationalized banks — one of India's most applied exams.</p></div><div class="career-path-item"><span class="cp-icon">💰</span><strong>SBI PO / Clerk</strong><p>State Bank of India — most prestigious public sector bank job.</p></div><div class="career-path-item"><span class="cp-icon">📈</span><strong>RBI Grade B Officer</strong><p>Reserve Bank of India — economist, regulator, policy-making roles.</p></div><div class="career-path-item"><span class="cp-icon">🌾</span><strong>NABARD Officer</strong><p>National Bank for Agriculture — rural finance and development roles.</p></div><div class="career-path-item"><span class="cp-icon">🏙️</span><strong>Private Banks</strong><p>HDFC, ICICI, Axis, Kotak — management trainee (MT) programs, higher salary.</p></div><div class="career-path-item"><span class="cp-icon">📊</span><strong>Investment Banking</strong><p>After MBA (IIM/ISB) — mergers & acquisitions, IPOs, capital markets.</p></div></div></div>`,
            'Preparation Tips': `<div class="detail-section"><div class="detail-section"><ul style="list-style:none;"><li style="padding:10px 0;border-bottom:1px solid #e2e8f0">✅ Start with NCERT Math & Reasoning books for foundation</li><li style="padding:10px 0;border-bottom:1px solid #e2e8f0">✅ Practice daily — Quantitative Aptitude is key in IBPS/SBI</li><li style="padding:10px 0;border-bottom:1px solid #e2e8f0">✅ Current affairs and banking awareness are tested extensively</li><li style="padding:10px 0;border-bottom:1px solid #e2e8f0">✅ Solve previous year papers — patterns repeat in PSU bank exams</li><li style="padding:10px 0">✅ Join an online test series (Gradeup, Adda247, Oliveboard)</li></ul></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>Senior Level</span></div><div class="salary-row"><span>Bank PO (Govt)</span><span>₹5–8 LPA</span><span>₹15–25 LPA</span></div><div class="salary-row"><span>Private Bank MT</span><span>₹6–10 LPA</span><span>₹20–40 LPA</span></div><div class="salary-row"><span>RBI Grade B</span><span>₹12–15 LPA</span><span>₹25–50 LPA</span></div><div class="salary-row"><span>Investment Banker</span><span>₹15–25 LPA</span><span>₹50L–2Cr+</span></div></div></div>`
        }
    },
    cma: {
        icon: '📊', title: 'Cost Accountancy (CMA)',
        duration: '3–4 Years', exam: 'ICMAI — CMA Foundation', color: '#22c55e',
        tabs: ['About', 'Exam Structure', 'Top Employers', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">CMA (Cost and Management Accountant) is a specialized qualification focused on cost management, financial planning, and performance management. Regulated by ICMAI.</p><div class="detail-who"><h4>📋 Route</h4><p>12th (Commerce) → CMA Foundation → CMA Intermediate → CMA Final + Practical Training → Qualified CMA. Often done alongside B.Com.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>CMA reduces costs and improves financial efficiency in organizations. Career growth: Cost Accountant → Financial Controller → CFO. Salary ranges from ₹5–50 LPA.</p></div></div>`,
            'Exam Structure': `<div class="detail-section"><div class="exam-detail-list"><div class="exam-detail-item"><div class="exam-name">CMA Foundation</div><div class="exam-info"><span class="exam-badge">Level 1</span> 4 papers: Fundamentals of Economics & Management, Accounting, Laws & Ethics, Business Math & Statistics.</div></div><div class="exam-detail-item"><div class="exam-name">CMA Intermediate</div><div class="exam-info"><span class="exam-badge">Level 2</span> 8 papers in 2 groups — Financial Accounting, Cost Accounting, Taxation, Company Accounts.</div></div><div class="exam-detail-item"><div class="exam-name">CMA Final</div><div class="exam-info"><span class="exam-badge">Level 3</span> 8 papers — Strategic Financial Management, Cost & Management Audit, Indirect Tax.</div></div></div></div>`,
            'Top Employers': `<div class="detail-section"><div class="college-category"><h4>🏆 Where CMAs Work</h4><div class="college-list"><span class="college-tag">Manufacturing Companies</span><span class="college-tag">Steel / Cement Industry</span><span class="college-tag">Public Sector Undertakings</span><span class="college-tag">FMCG Companies</span><span class="college-tag">Government Auditing (CAG)</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>Senior Level</span></div><div class="salary-row"><span>Cost Accountant</span><span>₹5–8 LPA</span><span>₹15–30 LPA</span></div><div class="salary-row"><span>Financial Controller</span><span>₹10–20 LPA</span><span>₹25–50 LPA</span></div><div class="salary-row"><span>Management Consultant</span><span>₹8–15 LPA</span><span>₹20–50 LPA</span></div></div></div>`
        }
    },
    'digital-marketing': {
        icon: '📱', title: 'Digital Marketing',
        duration: '3 Years (BBA) + Certifications', exam: 'University Entrance / Certifications', color: '#f59e0b',
        tabs: ['About', 'Skills & Tools', 'Top Certifications', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">Digital Marketing is one of the fastest-growing careers globally. As businesses shift online, demand for digital marketers who understand SEO, social media, paid ads, and analytics has skyrocketed.</p><div class="detail-who"><h4>📋 How to Enter</h4><p>BBA/B.Com + Google/Meta Certifications → Entry-level Digital Marketing role → Specialise in SEO, PPC, Content, or Social Media → Senior roles.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>Digital Marketing Executive → Digital Marketing Manager → Head of Digital → CMO (Chief Marketing Officer). Freelance and remote work is widely available in this field.</p></div></div>`,
            'Skills & Tools': `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">🔍</span><strong>SEO</strong><p>Search Engine Optimization — rank websites on Google organically.</p></div><div class="career-path-item"><span class="cp-icon">💰</span><strong>Google Ads (PPC)</strong><p>Pay-per-click advertising on Google, YouTube, Shopping.</p></div><div class="career-path-item"><span class="cp-icon">📘</span><strong>Social Media Marketing</strong><p>Facebook Ads, Instagram, LinkedIn — B2C and B2B campaigns.</p></div><div class="career-path-item"><span class="cp-icon">📧</span><strong>Email Marketing</strong><p>Mailchimp, HubSpot — newsletter, drip campaigns, CRM.</p></div><div class="career-path-item"><span class="cp-icon">📊</span><strong>Analytics</strong><p>Google Analytics, Meta Pixel — measure and optimize campaigns.</p></div><div class="career-path-item"><span class="cp-icon">✍️</span><strong>Content Marketing</strong><p>Blogs, video scripts, reels — brand storytelling and audience building.</p></div></div></div>`,
            'Top Certifications': `<div class="detail-section"><div class="college-category"><h4>🏆 Free / Paid Certifications</h4><div class="college-list"><span class="college-tag">Google Digital Garage</span><span class="college-tag">Meta Blueprint</span><span class="college-tag">HubSpot Academy</span><span class="college-tag">SEMrush SEO Certification</span><span class="college-tag">Coursera — Digital Marketing Specialization</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>Senior Level</span></div><div class="salary-row"><span>Digital Marketing Executive</span><span>₹3–6 LPA</span><span>₹10–20 LPA</span></div><div class="salary-row"><span>SEO Specialist</span><span>₹3–7 LPA</span><span>₹12–25 LPA</span></div><div class="salary-row"><span>Performance Marketing Manager</span><span>₹6–12 LPA</span><span>₹18–40 LPA</span></div><div class="salary-row"><span>Chief Marketing Officer</span><span>—</span><span>₹30L–1Cr+</span></div></div></div>`
        }
    },
    law: {
        icon: '⚖️', title: 'Law (LLB / BA LLB)',
        duration: '5 Years (Integrated) / 3 Years (LLB)', exam: 'CLAT / AILET / LSAT India', color: '#8b5cf6',
        tabs: ['About', 'Specialisations', 'Top Colleges', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">Law is one of the oldest and most respected professions. Lawyers defend rights, draft legislation, advise corporations, and uphold justice. India has a 5-year integrated BA LLB or 3-year LLB programme.</p><div class="detail-who"><h4>📋 Eligibility</h4><p>5-year B.A./B.Sc/B.Com LLB: 12th passed with 45–50% marks. Admission through CLAT (NLUs) or AILET (NLU Delhi). 3-year LLB: After any undergraduate degree.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>Law Graduate → Junior Associate (Law Firm) or Junior Advocate → Senior Associate → Partner / Senior Advocate / Judge / Legal Counsel. Judiciary is one of the most respected career paths.</p></div></div>`,
            Specialisations: `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">🏛️</span><strong>Constitutional Law</strong><p>Fundamental rights, public interest litigation (PIL), Supreme Court cases.</p></div><div class="career-path-item"><span class="cp-icon">🏢</span><strong>Corporate Law</strong><p>Mergers, IPOs, contracts, compliance — in-house counsel at MNCs.</p></div><div class="career-path-item"><span class="cp-icon">💻</span><strong>Cyber Law</strong><p>Data privacy, intellectual property, IT Act — fastest growing legal field.</p></div><div class="career-path-item"><span class="cp-icon">🌍</span><strong>International Law</strong><p>Trade treaties, human rights, UN, diplomatic immunities.</p></div><div class="career-path-item"><span class="cp-icon">👨‍👩‍👧</span><strong>Criminal Law</strong><p>Criminal defence, prosecution, forensic evidence, bail applications.</p></div><div class="career-path-item"><span class="cp-icon">⚖️</span><strong>Judiciary</strong><p>Judicial services exams — District Judge, High Court Judge, Supreme Court.</p></div></div></div>`,
            'Top Colleges': `<div class="detail-section"><div class="college-category"><h4>🥇 National Law Universities (NLUs)</h4><div class="college-list"><span class="college-tag">NLSIU Bangalore</span><span class="college-tag">NLU Delhi (AILET)</span><span class="college-tag">NALSAR Hyderabad</span><span class="college-tag">NUJS Kolkata</span><span class="college-tag">NLU Jodhpur</span></div></div><div class="college-category mt-20"><h4>🥈 Other Premier Law Colleges</h4><div class="college-list"><span class="college-tag">Symbiosis Law Pune</span><span class="college-tag">Amity Law School</span><span class="college-tag">Christ University Law School</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>Senior Level</span></div><div class="salary-row"><span>Associate (Law Firm)</span><span>₹6–15 LPA</span><span>₹25–80 LPA</span></div><div class="salary-row"><span>In-House Counsel (MNC)</span><span>₹8–15 LPA</span><span>₹25–60 LPA</span></div><div class="salary-row"><span>Government Lawyer</span><span>₹5–10 LPA</span><span>₹15–30 LPA</span></div><div class="salary-row"><span>Supreme Court Advocate</span><span>Varies</span><span>₹50L–5Cr+</span></div></div></div>`
        }
    },
    journalism: {
        icon: '📰', title: 'Journalism & Mass Communication',
        duration: '3 Years', exam: 'IIMC / CUET / ACJ Entrance', color: '#06b6d4',
        tabs: ['About', 'Specialisations', 'Top Colleges', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">Journalism and Mass Communication trains students to report, write, broadcast, and communicate information to the public through print, digital, TV, and radio media.</p><div class="detail-who"><h4>📋 Eligibility</h4><p>12th passed (any stream). Admission through IIMC entrance test, CUET, or university-level tests. BA Journalism is 3 years; BJMC (Bachelor of Journalism & Mass Communication) is also widely offered.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>Reporter/Intern → Sub-Editor → Senior Journalist → Editor → Editor-in-Chief. Digital journalism and content creation are the fastest-growing segments today.</p></div></div>`,
            Specialisations: `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">📺</span><strong>TV Journalism</strong><p>News anchoring, field reporting, documentary making — NDTV, ABP, Aaj Tak.</p></div><div class="career-path-item"><span class="cp-icon">📰</span><strong>Print Journalism</strong><p>Newspaper and magazine reporting, feature writing, investigative journalism.</p></div><div class="career-path-item"><span class="cp-icon">🌐</span><strong>Digital Journalism</strong><p>Online news portals, newsletters, YouTube journalism — The Wire, Scroll, TheQuint.</p></div><div class="career-path-item"><span class="cp-icon">📣</span><strong>Public Relations (PR)</strong><p>Brand communication, press releases, crisis management for companies.</p></div><div class="career-path-item"><span class="cp-icon">📊</span><strong>Advertising</strong><p>Creative ad campaigns, media planning — agencies like Ogilvy, JWT, Grey.</p></div><div class="career-path-item"><span class="cp-icon">🎙️</span><strong>Radio / Podcasting</strong><p>Radio jockeying, podcast hosting — growing digital audio sector.</p></div></div></div>`,
            'Top Colleges': `<div class="detail-section"><div class="college-category"><h4>🥇 Top Journalism Institutes</h4><div class="college-list"><span class="college-tag">IIMC, Delhi</span><span class="college-tag">ACJ, Chennai</span><span class="college-tag">Symbiosis Media, Pune</span><span class="college-tag">Jamia Millia Islamia</span><span class="college-tag">Xavier's Institute of Communications (Mumbai)</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>Senior Level</span></div><div class="salary-row"><span>Reporter / Journalist</span><span>₹2–5 LPA</span><span>₹10–25 LPA</span></div><div class="salary-row"><span>TV News Anchor</span><span>₹3–8 LPA</span><span>₹15–50 LPA</span></div><div class="salary-row"><span>PR / Communications Manager</span><span>₹4–8 LPA</span><span>₹15–35 LPA</span></div><div class="salary-row"><span>Content Creator / YouTuber</span><span>Variable</span><span>₹10L–5Cr+</span></div></div></div>`
        }
    },
    design: {
        icon: '🎨', title: 'Design (B.Des)',
        duration: '4 Years', exam: 'NID DAT / NIFT / UCEED', color: '#ec4899',
        tabs: ['About', 'Specialisations', 'Top Colleges', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">Design is one of the most exciting and rapidly growing fields. From product design to fashion, UX/UI, graphic, and interior design — creative professionals shape how the world looks and feels.</p><div class="detail-who"><h4>📋 Eligibility</h4><p>12th passed (any stream). Most design colleges require passing a design entrance test like NID DAT, NIFT Entrance, or UCEED (for IIT design programs). A creative portfolio is often required.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>Junior Designer → Senior Designer → Design Lead → Creative Director / Design Head. Freelance design is a thriving global career. Top designers earn ₹20–80 LPA.</p></div></div>`,
            Specialisations: `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">💻</span><strong>UX/UI Design</strong><p>Design apps and websites — most in-demand design skill in tech companies.</p></div><div class="career-path-item"><span class="cp-icon">👗</span><strong>Fashion Design</strong><p>Clothing, textiles, fashion shows — NIFT and NID are the premier institutes.</p></div><div class="career-path-item"><span class="cp-icon">🖼️</span><strong>Graphic Design</strong><p>Branding, logos, posters, print and digital visual communication.</p></div><div class="career-path-item"><span class="cp-icon">🏠</span><strong>Interior Design</strong><p>Residential and commercial interiors — furniture, lighting, spatial design.</p></div><div class="career-path-item"><span class="cp-icon">🎮</span><strong>Game Design</strong><p>Video game art, level design, character design — fast-growing gaming industry.</p></div><div class="career-path-item"><span class="cp-icon">📦</span><strong>Product / Industrial Design</strong><p>Physical product design — furniture, electronics, automobiles, household goods.</p></div></div></div>`,
            'Top Colleges': `<div class="detail-section"><div class="college-category"><h4>🥇 Top Design Institutes</h4><div class="college-list"><span class="college-tag">NID Ahmedabad</span><span class="college-tag">NIFT Delhi / Mumbai</span><span class="college-tag">IIT Bombay (IDC)</span><span class="college-tag">IIT Delhi (DSC)</span><span class="college-tag">Srishti Manipal Institute</span><span class="college-tag">Pearl Academy</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>Senior Level</span></div><div class="salary-row"><span>UX/UI Designer</span><span>₹5–12 LPA</span><span>₹20–50 LPA</span></div><div class="salary-row"><span>Fashion Designer</span><span>₹3–7 LPA</span><span>₹15–40 LPA</span></div><div class="salary-row"><span>Graphic Designer</span><span>₹3–6 LPA</span><span>₹10–25 LPA</span></div><div class="salary-row"><span>Creative Director</span><span>—</span><span>₹25–80 LPA</span></div></div></div>`
        }
    },
    'civil-services': {
        icon: '🏛️', title: 'Civil Services (IAS / IPS / IFS)',
        duration: 'Graduation + 1–3 Years Prep', exam: 'UPSC CSE', color: '#1e1b4b',
        tabs: ['About', 'Exam Structure', 'Preparation Strategy', 'Job Roles & Perks'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">Civil Services is India's most prestigious career. IAS, IPS, IFS, IRS officers shape national policy, maintain law & order, and represent India internationally. Selected through the UPSC Civil Services Examination (CSE).</p><div class="detail-who"><h4>📋 Eligibility</h4><p>Any undergraduate degree from a recognized university. Age: 21–32 years (relaxation for OBC/SC/ST). Maximum 6 attempts (General category).</p></div><div class="detail-who mt-20"><h4>🗺️ After Selection</h4><p>2-year foundation training at LBSNAA (IAS), SVPNPA (IPS), or NAAA (IFS). Posted as SDM, SP, or IFS Officer at entry-level. Power, respect, and public impact are unmatched.</p></div></div>`,
            'Exam Structure': `<div class="detail-section"><div class="exam-detail-list"><div class="exam-detail-item"><div class="exam-name">Prelims</div><div class="exam-info"><span class="exam-badge">Stage 1</span> 2 papers (GS + CSAT) — objective type. Qualifying in nature. Usually in June.</div></div><div class="exam-detail-item"><div class="exam-name">Mains</div><div class="exam-info"><span class="exam-badge">Stage 2</span> 9 written papers including Essay, GS Papers 1–4, and Optional Subject (e.g., History, Geography, Sociology, PSIR).</div></div><div class="exam-detail-item"><div class="exam-name">Personality Test (Interview)</div><div class="exam-info"><span class="exam-badge">Stage 3</span> 275-mark interview by UPSC board — tests personality, leadership, and general awareness.</div></div></div></div>`,
            'Preparation Strategy': `<div class="detail-section"><ul style="list-style:none;"><li style="padding:12px 0;border-bottom:1px solid #e2e8f0">📚 <strong>NCERT First</strong> — Read Class 6–12 History, Geography, Polity, Economics thoroughly</li><li style="padding:12px 0;border-bottom:1px solid #e2e8f0">📰 <strong>The Hindu / Indian Express</strong> — Daily newspaper reading is non-negotiable</li><li style="padding:12px 0;border-bottom:1px solid #e2e8f0">✍️ <strong>Answer Writing Practice</strong> — UPSC tests expression, not just knowledge</li><li style="padding:12px 0;border-bottom:1px solid #e2e8f0">📝 <strong>Optional Subject</strong> — Choose wisely based on interest and overlap with GS</li><li style="padding:12px 0">🕐 <strong>Consistency</strong> — 8–10 hours of focused daily study for 12–18 months minimum</li></ul></div>`,
            'Job Roles & Perks': `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">📋</span><strong>IAS Officer</strong><p>District Magistrate → Divisional Commissioner → Secretary to Govt. → Chief Secretary.</p></div><div class="career-path-item"><span class="cp-icon">👮</span><strong>IPS Officer</strong><p>DSP → SP → DIG → IG → DGP. Law enforcement and national security.</p></div><div class="career-path-item"><span class="cp-icon">🌍</span><strong>IFS Officer</strong><p>India's diplomats — Embassies, High Commissions, UN postings worldwide.</p></div><div class="career-path-item"><span class="cp-icon">💰</span><strong>IRS Officer</strong><p>Income Tax and Customs — revenue collection, financial investigation.</p></div></div><div class="detail-who mt-20"><h4>🎁 Perks</h4><p>Government bungalow, car with driver, domestic helps, LTC (travel), children's education allowance, pension, and enormous social respect.</p></div></div>`
        }
    },
    psychology: {
        icon: '🧠', title: 'Psychology',
        duration: '3 Years (BA / B.Sc)', exam: 'CUET / University Entrance', color: '#06b6d4',
        tabs: ['About', 'Specialisations', 'Top Colleges', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">Psychology is the scientific study of the mind and behaviour. It covers emotions, cognition, personality, social interactions, and mental health. It's one of the most relevant fields in today's stress-filled world.</p><div class="detail-who"><h4>📋 Eligibility</h4><p>12th (any stream). B.A./B.Sc Psychology → M.Sc Psychology → Ph.D or M.Phil (for clinical practice). RCI registration required to practice as a clinical psychologist.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>Psychology is a postgraduate-heavy field. M.Sc or M.A. Psychology is almost mandatory for clinical and counselling careers. Ph.D opens academic and research doors.</p></div></div>`,
            Specialisations: `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">🏥</span><strong>Clinical Psychology</strong><p>Diagnose and treat mental health disorders — depression, anxiety, OCD, trauma.</p></div><div class="career-path-item"><span class="cp-icon">🏫</span><strong>School Psychology</strong><p>Support students' emotional and academic needs in schools.</p></div><div class="career-path-item"><span class="cp-icon">👥</span><strong>Organisational (I/O) Psychology</strong><p>Workplace well-being, HR strategy, talent management in corporates.</p></div><div class="career-path-item"><span class="cp-icon">🧪</span><strong>Research Psychology</strong><p>Conduct studies on behaviour, neuroscience, and cognitive processes.</p></div><div class="career-path-item"><span class="cp-icon">⚖️</span><strong>Forensic Psychology</strong><p>Criminal profiling, court-ordered evaluations, prison rehabilitation.</p></div><div class="career-path-item"><span class="cp-icon">🏋️</span><strong>Sports Psychology</strong><p>Mental coaching for elite athletes — focus, confidence, performance.</p></div></div></div>`,
            'Top Colleges': `<div class="detail-section"><div class="college-category"><h4>🥇 Top Psychology Colleges</h4><div class="college-list"><span class="college-tag">NIMHANS, Bangalore</span><span class="college-tag">Delhi University (DU)</span><span class="college-tag">TISS Mumbai</span><span class="college-tag">JNU Delhi</span><span class="college-tag">Christ University</span><span class="college-tag">Fergusson College Pune</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting Salary</span><span>Senior Level</span></div><div class="salary-row"><span>Clinical Psychologist</span><span>₹4–8 LPA</span><span>₹15–30 LPA</span></div><div class="salary-row"><span>Counsellor / Therapist</span><span>₹3–6 LPA</span><span>₹10–25 LPA</span></div><div class="salary-row"><span>HR / I-O Psychologist</span><span>₹5–10 LPA</span><span>₹15–35 LPA</span></div><div class="salary-row"><span>UX Researcher</span><span>₹6–12 LPA</span><span>₹18–40 LPA</span></div></div></div>`
        }
    },
    'film-media': {
        icon: '🎬', title: 'Film & Media Studies',
        duration: '3–4 Years', exam: 'FTII / SRFTI / IIMC / University', color: '#f59e0b',
        tabs: ['About', 'Specialisations', 'Top Institutes', 'Job Roles & Salary'],
        content: {
            About: `<div class="detail-section"><p class="detail-intro">Film and Media is one of India's most creative and exciting industries. With the rise of OTT platforms (Netflix, Amazon Prime, Hotstar) and YouTube, there has never been a better time to enter this field.</p><div class="detail-who"><h4>📋 Eligibility</h4><p>12th (any stream). FTII and SRFTI are the most prestigious government film institutes in India. Several private universities offer B.A./B.Sc Film Studies, Filmmaking, and Media & Communication.</p></div><div class="detail-who mt-20"><h4>🗺️ Career Path</h4><p>Intern / Assistant Director → Director / Producer → Established Filmmaker. Alternatively: Editor → Senior Editor → Post-Production Supervisor. OTT streaming has created thousands of new opportunities.</p></div></div>`,
            Specialisations: `<div class="detail-section"><div class="career-path-grid"><div class="career-path-item"><span class="cp-icon">🎥</span><strong>Direction & Screenwriting</strong><p>Write and direct films, web series, documentaries, ads.</p></div><div class="career-path-item"><span class="cp-icon">🎬</span><strong>Film Editing</strong><p>Post-production editing for films, ads, YouTube channels, OTT.</p></div><div class="career-path-item"><span class="cp-icon">📸</span><strong>Cinematography</strong><p>Camera operation, lighting, visual storytelling — DOP (Director of Photography).</p></div><div class="career-path-item"><span class="cp-icon">🎵</span><strong>Sound Design</strong><p>Background score, sound effects, audio mixing for films and ads.</p></div><div class="career-path-item"><span class="cp-icon">🎭</span><strong>Acting</strong><p>Film, theatre, TV, web series, brand endorsements.</p></div><div class="career-path-item"><span class="cp-icon">🖥️</span><strong>VFX & Animation</strong><p>Visual effects, CGI, animation for films and OTT content.</p></div></div></div>`,
            'Top Institutes': `<div class="detail-section"><div class="college-category"><h4>🥇 Premier Film & Media Institutes</h4><div class="college-list"><span class="college-tag">FTII, Pune</span><span class="college-tag">SRFTI, Kolkata</span><span class="college-tag">AJK MCRC, Jamia (Delhi)</span><span class="college-tag">WWI (Whistling Woods), Mumbai</span><span class="college-tag">Symbiosis Media, Pune</span></div></div></div>`,
            'Job Roles & Salary': `<div class="detail-section"><div class="salary-table"><div class="salary-row header"><span>Role</span><span>Starting</span><span>Established</span></div><div class="salary-row"><span>Film Director</span><span>Variable</span><span>₹20L–10Cr+</span></div><div class="salary-row"><span>Video Editor</span><span>₹3–7 LPA</span><span>₹12–30 LPA</span></div><div class="salary-row"><span>VFX Artist</span><span>₹4–8 LPA</span><span>₹15–40 LPA</span></div><div class="salary-row"><span>Content Creator (YouTube)</span><span>Variable</span><span>₹10L–5Cr+</span></div></div></div>`
        }
    }
};

// ===== Modal System =====
function initModals() {
    const modal = document.getElementById('detailModal');
    const modalClose = document.getElementById('modalClose');

    // Close modal
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    // Bind stream card buttons (After 10th)
    document.querySelectorAll('.stream-card').forEach(card => {
        const btn = card.querySelector('.explore-btn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const key = card.dataset.streamKey;
                openModal(streamData[key]);
            });
        }
    });

    // Bind career item buttons (After 12th)
    document.querySelectorAll('.career-item').forEach(item => {
        const btn = item.querySelector('.learn-more-btn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const key = item.dataset.careerKey;
                openModal(careerDetailData[key]);
            });
        }
    });
}

function openModal(data) {
    if (!data) return;
    const modal = document.getElementById('detailModal');
    const header = document.getElementById('modalHeader');
    const tabsEl = document.getElementById('modalTabs');
    const body = document.getElementById('modalBody');

    header.innerHTML = `
        <span class="modal-icon">${data.icon}</span>
        <div class="modal-title-info">
            <h2>${data.title}</h2>
            ${data.duration ? `<span class="modal-badge">⏱ ${data.duration}</span>` : ''}
            ${data.exam ? `<span class="modal-badge">📝 ${data.exam}</span>` : ''}
        </div>
    `;
    header.style.borderBottom = `4px solid ${data.color}`;

    // Render tabs
    tabsEl.innerHTML = data.tabs.map((tab, i) =>
        `<button class="modal-tab-btn ${i === 0 ? 'active' : ''}" data-tab="${tab}">${tab}</button>`
    ).join('');

    // Render first tab content
    body.innerHTML = data.content[data.tabs[0]];

    // Tab switching
    tabsEl.querySelectorAll('.modal-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            tabsEl.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            body.innerHTML = data.content[this.dataset.tab];
        });
    });

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('detailModal').classList.add('hidden');
    document.body.style.overflow = '';
}

