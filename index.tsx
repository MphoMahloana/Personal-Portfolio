import { GoogleGenAI, Chat } from "https://esm.sh/@google/genai";

// --- Preloader ---
const preloader = document.getElementById('preloader');
if (preloader) {
    document.body.classList.add('preloader-active');
    window.addEventListener('load', () => {
        // Use a timeout to ensure the preloader animation is visible.
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('hidden');
                document.body.classList.remove('preloader-active');

                // Remove the preloader from the DOM after the fade-out transition
                preloader.addEventListener('transitionend', () => {
                    preloader.remove();
                }, { once: true });
            }
        }, 2500); // Reduced duration for a faster preloader
    });
}


// --- Mobile Navigation Toggle ---
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const body = document.body;
const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu .nav-link');

if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
        body.classList.toggle('nav-open');
        const isExpanded = body.classList.contains('nav-open');
        mobileNavToggle.setAttribute('aria-expanded', isExpanded.toString());
    });
}

// Close mobile menu when a link is clicked
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (body.classList.contains('nav-open')) {
            body.classList.remove('nav-open');
            mobileNavToggle?.setAttribute('aria-expanded', 'false');
        }
    });
});

// --- Scroll Animation for Content Sections ---
const sections = document.querySelectorAll('.content-section, .hero');
const sectionObserverOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('content-section')) {
                entry.target.classList.add('visible');
            }
            observer.unobserve(entry.target);
        }
    });
}, sectionObserverOptions);

sections.forEach(section => sectionObserver.observe(section));

// --- Scroll Animation for Skill Badges ---
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    const skillBadgeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBadges = entry.target.querySelectorAll('.skill-badge');
                skillBadges.forEach((badge, index) => {
                    (badge as HTMLElement).style.transitionDelay = `${index * 75}ms`;
                    badge.classList.add('visible');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    skillBadgeObserver.observe(skillsSection);
}

// --- Nav Link Active State on Scroll & Gooey Effect ---
const allNavLinks = document.querySelectorAll('.nav-link');
const pageSections = document.querySelectorAll('.hero, .content-section');
const desktopNav = document.querySelector<HTMLElement>('.desktop-nav-links');
let indicator: HTMLElement | null = null;

if (desktopNav) {
    indicator = document.createElement('div');
    indicator.classList.add('nav-indicator');
    desktopNav.appendChild(indicator);
}

function moveIndicator(element: HTMLElement | null) {
    if (!element || !indicator || !desktopNav) return;
    const linkRect = element.getBoundingClientRect();
    const navRect = desktopNav.getBoundingClientRect();

    if (linkRect.width > 0 && linkRect.height > 0) {
        indicator.style.width = `${linkRect.width}px`;
        indicator.style.height = `2px`;
        indicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
    }
}

if (desktopNav) {
    const desktopLinks = desktopNav.querySelectorAll<HTMLAnchorElement>('.nav-link');

    desktopLinks.forEach(link => {
        link.addEventListener('mouseenter', (e) => {
            moveIndicator(e.target as HTMLElement);
        });
    });

    desktopNav.addEventListener('mouseleave', () => {
        const currentActiveLink = desktopNav.querySelector<HTMLElement>('.nav-link.active');
        moveIndicator(currentActiveLink);
    });
}

const navObserverOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            let activeDesktopLink: HTMLElement | null = null;

            allNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                    if (desktopNav && desktopNav.contains(link)) {
                        activeDesktopLink = link as HTMLElement;
                    }
                }
            });

            moveIndicator(activeDesktopLink);
        }
    });
}, navObserverOptions);

pageSections.forEach(section => navObserver.observe(section));

window.addEventListener('load', () => {
    setTimeout(() => {
        const initialActiveLink = document.querySelector<HTMLElement>('.desktop-nav-links .nav-link.active');
        moveIndicator(initialActiveLink);
    }, 150);
});

window.addEventListener('resize', () => {
    const currentActiveLink = document.querySelector<HTMLElement>('.desktop-nav-links .nav-link.active');
    moveIndicator(currentActiveLink);
});

// --- Contact Form Handler ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const button = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;

        if (button) {
            const originalButtonContent = button.innerHTML;
            button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Sent!</span>`;
            button.disabled = true;

            setTimeout(() => {
                button.innerHTML = originalButtonContent;
                button.disabled = false;
                form.reset();
            }, 2500);
        }
    });
}

// --- Read More/Less for Education Section ---
const educationSection = document.getElementById('education');
if (educationSection) {
    const list = educationSection.querySelector<HTMLUListElement>('.education-list');
    if (list) {
        const items = list.querySelectorAll<HTMLLIElement>('.education-item');
        const VISIBLE_ITEMS = 3;

        if (items.length > VISIBLE_ITEMS) {
            items.forEach((item, index) => {
                if (index >= VISIBLE_ITEMS) item.classList.add('collapsible-item');
            });

            const readMoreBtn = document.createElement('button');
            readMoreBtn.classList.add('read-more-btn');
            readMoreBtn.textContent = 'Show All';
            readMoreBtn.setAttribute('aria-expanded', 'false');

            list.insertAdjacentElement('afterend', readMoreBtn);

            readMoreBtn.addEventListener('click', () => {
                const isExpanded = list.classList.toggle('expanded');
                readMoreBtn.textContent = isExpanded ? 'Show Less' : 'Show All';
                readMoreBtn.setAttribute('aria-expanded', String(isExpanded));
            });
        }
    }
}

// --- AI Chat Assistant ---
const chatFab = document.getElementById('chat-fab');
const chatWidget = document.getElementById('chat-widget');
const chatClose = document.getElementById('chat-close');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input') as HTMLInputElement;

if (chatFab && chatWidget && chatClose && chatMessages && chatForm && chatInput) {
    let chat: Chat | null = null;
    let isChatInitialized = false;

    const toggleChat = (isOpen: boolean) => {
        if (isOpen) {
            chatWidget.classList.add('visible');
            chatWidget.setAttribute('aria-hidden', 'false');
            chatInput.focus();

            if (!isChatInitialized) initializeChat();

            if (window.innerWidth < 768) {
                (chatFab as HTMLElement).style.display = 'none';
            }
        } else {
            chatWidget.classList.remove('visible');
            chatWidget.setAttribute('aria-hidden', 'true');

            if (window.innerWidth < 768) {
                (chatFab as HTMLElement).style.display = 'flex';
            }
        }
    };

    chatFab.addEventListener('click', () => {
        const isOpen = chatWidget.classList.contains('visible');
        toggleChat(!isOpen);
    });

    chatClose.addEventListener('click', () => toggleChat(false));

    function getProfileContext(): string {
        const sectionsToScan = ['about', 'skills', 'experience', 'education', 'projects'];
        let context = `Name: Mpho Mahloana. Profession: IT Engineer and aspiring Cloud Engineer.\n`;

        sectionsToScan.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                const title = section.querySelector('h2')?.textContent || '';
                const content = Array.from(section.children)
                    .filter(el => el.tagName.toLowerCase() !== 'h2')
                    .map(el => (el as HTMLElement).innerText.replace(/\s+/g, ' ').trim())
                    .join('\n');

                context += `\nSECTION: ${title.trim()}\n${content}\n`;
            }
        });

        return context;
    }

    async function initializeChat() {
        if (!process.env.API_KEY) {
            appendMessage("The AI service is not configured at the moment. Please contact the site owner for assistance.", 'ai');
            return;
        }

        isChatInitialized = true;

        appendMessage(
            "Hello, I am Ekko, Mpho's virtual assistant. I can help you explore his experience, skills, projects, and professional background. What would you like to know?",
            'ai'
        );

        const profileContext = getProfileContext();

        // SIGNIFICANTLY IMPROVED SYSTEM PROMPT
        const systemInstruction = `
You are Ekko, the virtual assistant for Mpho Mahloana. 
Your role is to communicate professionally, clearly, and naturally.

Writing Style Rules:
• Use correct grammar, punctuation, spacing, and sentence structure.
• Do not use markdown, asterisks, hashtags, bold markers, or emojis.
• Avoid long paragraphs. Prefer concise, polished, human-like responses.
• Maintain a friendly and professional tone.
• Do not hallucinate. Base all answers on the provided portfolio context.
• If information is missing, acknowledge it politely and offer helpful guidance.
• Never include AI disclaimers like “as an AI model.” Respond naturally.

Response Behavior:
• After answering, you may optionally offer a simple follow-up question.
• Keep explanations consistent, clear, and easy to read.
• Avoid overly casual language but stay approachable.

Portfolio Information:
${profileContext}
        `;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction }
            });
        } catch (error) {
            console.error("Chat initialization error:", error);
            appendMessage("I am unable to connect to the AI service right now. Please try again shortly.", 'ai');
        }
    }

    function appendMessage(text: string, sender: 'user' | 'ai', loading = false) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('chat-message', sender);

        const paragraph = document.createElement('p');

        if (loading) {
            wrapper.classList.add('loading');
            paragraph.innerHTML = `
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            `;
        } else {
            paragraph.textContent = text;
        }

        wrapper.appendChild(paragraph);
        chatMessages?.appendChild(wrapper);

        chatMessages!.scrollTop = chatMessages!.scrollHeight;
        return wrapper;
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userInput = chatInput.value.trim();

        if (!userInput || !chat) return;

        chatInput.value = '';
        appendMessage(userInput, 'user');

        const loadingIndicator = appendMessage('', 'ai', true);

        try {
            const responseStream = await chat.sendMessageStream({ message: userInput });

            let firstChunk = true;
            let aiWrapper: HTMLElement | null = null;
            let fullResponse = '';

            for await (const chunk of responseStream) {
                if (firstChunk) {
                    loadingIndicator?.remove();
                    aiWrapper = appendMessage('', 'ai');
                    firstChunk = false;
                }

                fullResponse += chunk.text;

                if (aiWrapper) {
                    const paragraph = aiWrapper.querySelector('p') as HTMLParagraphElement;
                    paragraph.textContent = fullResponse;
                    chatMessages!.scrollTop = chatMessages!.scrollHeight;
                }
            }
        } catch (error) {
            loadingIndicator?.remove();
            appendMessage("Something went wrong while processing that request. Please try again.", 'ai');
            console.error("AI error:", error);
        }
    });
}


// --- Preloader Fix ---
window.addEventListener("load", () => {
    const loader = document.getElementById("preloader");
    if (!loader) return;

    const VISIBLE_DURATION = 1600;
    const FADE_DURATION = 800;

    setTimeout(() => {
        loader.style.transition = `opacity ${FADE_DURATION}ms ease`;
        loader.style.opacity = "0";

        setTimeout(() => {
            loader.style.display = "none";
            document.body.classList.add("page-loaded");
        }, FADE_DURATION);

    }, VISIBLE_DURATION);
});
