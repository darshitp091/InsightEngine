// Modal Functions
function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideLogin() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showSignup() {
    document.getElementById('signupModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideSignup() {
    document.getElementById('signupModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (event.target === loginModal) {
        hideLogin();
    }
    if (event.target === signupModal) {
        hideSignup();
    }
});

// Scroll Reveal Animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

// Smooth scrolling for navigation links
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 15, 0.98)';
        header.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(10, 10, 15, 0.95)';
        header.style.boxShadow = 'none';
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Scroll reveal
    window.addEventListener('scroll', revealOnScroll);
    window.addEventListener('scroll', handleHeaderScroll);
    revealOnScroll(); // Initial check
    
    // Navigation links smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            smoothScroll(target);
        });
    });
    
    // Tab navigation
    const navTabs = document.querySelectorAll('.nav-tab');
    const resultSections = document.querySelectorAll('.result-section');
    
    function scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight - 20,
                behavior: 'smooth'
            });
        }
    }
    
    function updateActiveTab() {
        let currentActiveSectionId = '';
        for (let i = resultSections.length - 1; i >= 0; i--) {
            const section = resultSections[i];
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentActiveSectionId = section.id;
                break;
            }
        }

        navTabs.forEach(tab => {
            if (tab.dataset.target === `#${currentActiveSectionId}`) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    navTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.dataset.target;
            scrollToSection(targetId);
        });
    });

    window.addEventListener('scroll', updateActiveTab);
    window.addEventListener('resize', updateActiveTab);
    window.addEventListener('load', updateActiveTab);
    
    // Form handling
    const loginForm = document.querySelector('#loginModal .auth-form');
    const signupForm = document.querySelector('#signupModal .auth-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your login logic here
            console.log('Login form submitted');
            showNotification('Login functionality will be connected to backend', 'info');
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your signup logic here
            console.log('Signup form submitted');
            showNotification('Signup functionality will be connected to backend', 'info');
        });
    }
});

// Analysis functionality (ready for backend integration)
const inputText = document.getElementById('inputText');
const analyzeButton = document.getElementById('analyzeButton');
const analysisSpinner = document.getElementById('analysisSpinner');
const analysisError = document.getElementById('analysisError');

// Result elements
const summaryResult = document.getElementById('summaryResult');
const executiveSummaryResult = document.getElementById('executiveSummaryResult');
const technicalSummaryResult = document.getElementById('technicalSummaryResult');
const nonExpertSummaryResult = document.getElementById('nonExpertSummaryResult');
const sentimentResult = document.getElementById('sentimentResult');
const entitiesResult = document.getElementById('entitiesResult');
const biasDetectionResult = document.getElementById('biasDetectionResult');
const tweetResult = document.getElementById('tweetResult');
const blogIdeaResult = document.getElementById('blogIdeaResult');
const headlineResult = document.getElementById('headlineResult');
const topicsResult = document.getElementById('topicsResult');
const languageResult = document.getElementById('languageResult');
const questionsResult = document.getElementById('questionsResult');

// Q&A elements
const questionInput = document.getElementById('questionInput');
const askQuestionButton = document.getElementById('askQuestionButton');
const qaSpinner = document.getElementById('qaSpinner');
const qaError = document.getElementById('qaError');
const answerResult = document.getElementById('answerResult');

function resetResults() {
    const defaultText = 'Ready for analysis...';
    summaryResult.textContent = defaultText;
    executiveSummaryResult.textContent = defaultText;
    technicalSummaryResult.textContent = defaultText;
    nonExpertSummaryResult.textContent = defaultText;
    sentimentResult.textContent = defaultText;
    entitiesResult.textContent = defaultText;
    biasDetectionResult.textContent = defaultText;
    tweetResult.textContent = defaultText;
    blogIdeaResult.textContent = defaultText;
    headlineResult.textContent = defaultText;
    topicsResult.textContent = defaultText;
    languageResult.textContent = defaultText;
    questionsResult.textContent = defaultText;
    answerResult.textContent = 'Answer will appear here...';
    
    if (analysisError) analysisError.style.display = 'none';
    if (qaError) qaError.style.display = 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--glass);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        padding: 16px 20px;
        color: var(--text-primary);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 30px var(--shadow);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Demo analysis functionality (placeholder for backend integration)
if (analyzeButton) {
    analyzeButton.addEventListener('click', async function(event) {
        event.preventDefault();
        resetResults();

        if (!inputText || inputText.value.trim() === '') {
            showNotification('Please enter some text to analyze.', 'error');
            return;
        }

        analyzeButton.disabled = true;
        if (analysisSpinner) analysisSpinner.style.display = 'block';

        // Simulate analysis (replace with actual backend call)
        try {
            showNotification('Analysis started! This is a demo - connect your backend for real analysis.', 'info');
            
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Demo results
            const demoResults = {
                summary: "This is a demo summary. Your text analysis would appear here when connected to the backend.",
                sentiment: "Demo: Positive sentiment detected with 85% confidence.",
                entities: "Demo entities: Technology, AI, Analysis, Backend",
                executive_summary: "Demo executive summary for business stakeholders.",
                technical_summary: "Demo technical summary with implementation details.",
                non_expert_summary: "Demo simplified explanation for general audience.",
                bias_detection: "Demo: No obvious bias detected in the provided text.",
                tweet: "🚀 Demo tweet: Amazing AI analysis results! #AI #TextAnalysis",
                blog_idea: "Demo Blog Idea: 'How AI is Revolutionizing Text Analysis'",
                headline: "Demo Headline: Revolutionary AI Analysis Delivers Instant Insights",
                topics: "Demo topics: AI, Machine Learning, Text Processing, Analytics",
                language: "Demo: English (detected)",
                questions: "Demo questions:\n1. What is the main topic?\n2. How accurate is the analysis?\n3. What are the key insights?"
            };
            
            // Update results
            summaryResult.textContent = demoResults.summary;
            executiveSummaryResult.textContent = demoResults.executive_summary;
            technicalSummaryResult.textContent = demoResults.technical_summary;
            nonExpertSummaryResult.textContent = demoResults.non_expert_summary;
            sentimentResult.textContent = demoResults.sentiment;
            entitiesResult.textContent = demoResults.entities;
            biasDetectionResult.textContent = demoResults.bias_detection;
            tweetResult.textContent = demoResults.tweet;
            blogIdeaResult.textContent = demoResults.blog_idea;
            headlineResult.textContent = demoResults.headline;
            topicsResult.textContent = demoResults.topics;
            languageResult.textContent = demoResults.language;
            questionsResult.textContent = demoResults.questions;
            
            // Scroll to results
            smoothScroll('#summarySection');
            showNotification('Demo analysis completed! Connect backend for real results.', 'success');
            
        } catch (error) {
            showNotification(`Demo error: ${error.message}`, 'error');
            console.error('Demo error:', error);
        } finally {
            analyzeButton.disabled = false;
            if (analysisSpinner) analysisSpinner.style.display = 'none';
        }
    });
}

// Q&A functionality (placeholder for backend integration)
if (askQuestionButton) {
    askQuestionButton.addEventListener('click', async function() {
        if (qaError) qaError.style.display = 'none';
        
        if (!inputText || inputText.value.trim() === '') {
            showNotification('Please analyze text first before asking a question.', 'error');
            return;
        }
        
        if (!questionInput || questionInput.value.trim() === '') {
            showNotification('Please enter a question.', 'error');
            return;
        }

        askQuestionButton.disabled = true;
        if (qaSpinner) qaSpinner.style.display = 'block';
        answerResult.textContent = 'Thinking...';

        try {
            // Simulate Q&A processing
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const demoAnswer = `Demo Answer: This is a simulated response to your question "${questionInput.value}". When connected to the backend, you'll get intelligent, contextual answers based on your analyzed text.`;
            
            answerResult.textContent = demoAnswer;
            showNotification('Demo Q&A completed! Connect backend for real answers.', 'success');
            
        } catch (error) {
            showNotification(`Demo Q&A error: ${error.message}`, 'error');
            console.error('Demo Q&A error:', error);
        } finally {
            askQuestionButton.disabled = false;
            if (qaSpinner) qaSpinner.style.display = 'none';
        }
    });
}

// Initialize
window.scrollTo(0, 0);