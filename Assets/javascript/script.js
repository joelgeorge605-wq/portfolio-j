
// ========================================
// JOELLABS - MULTI-PAGE JAVASCRIPT
// ========================================


// 1. TYPING ANIMATION
// Runs only on homepage.

const typingText = document.getElementById("typing-text");

if (typingText) {

    const roles = [
        "Software Developer",
        "Web Developer",
        "Creative Thinker",
        "Problem Solver"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {

        const currentRole = roles[roleIndex];

        if (deleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typingText.textContent =
            currentRole.substring(0, charIndex);

        let speed = deleting ? 45 : 90;

        if (!deleting && charIndex === currentRole.length) {
            deleting = true;
            speed = 1500;
        }

        if (deleting && charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }

    typeEffect();

}


// 2. 3D MOUSE MOVEMENT
// Runs only when the homepage scene exists.

const scene = document.getElementById("scene");
const sphere = document.getElementById("sphere");

const canUseMouse = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

if (scene && sphere && canUseMouse) {

    scene.addEventListener("mousemove", function(event) {

        const rect = scene.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * 18;
        const rotateX = (0.5 - y) * 18;

        scene.style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    });

    scene.addEventListener("mouseleave", function() {

        scene.style.transform =
            "rotateX(0deg) rotateY(0deg)";

    });

}


// 3. COPYRIGHT YEAR

const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// 4. MOBILE NAVIGATION

const navLinks = document.querySelectorAll(
    ".navbar-nav .nav-link"
);

navLinks.forEach(function(link) {

    link.addEventListener("click", function() {

        const menu = document.getElementById("navbarMenu");

        if (menu && menu.classList.contains("show")) {

            bootstrap.Collapse
                .getOrCreateInstance(menu)
                .hide();

        }

    });

});


// 5. AUTOMATIC ACTIVE NAVIGATION

const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase() || "index.html";

navLinks.forEach(function(link) {

    const linkPage = link.getAttribute("href")
        .split("/")
        .pop()
        .toLowerCase();

    link.classList.remove("active");

    if (linkPage === currentPage) {
        link.classList.add("active");
    }

});



/* ==================================
   SCROLL REVEAL ANIMATION
================================== */

const revealElements = document.querySelectorAll(
    ".section-title, .about-visual, .about-details, " +
    ".glass-card, .project-card, .journey-card, " +
    ".contact-info-card, .contact-message-card"
);

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (reduceMotion) {

    revealElements.forEach(element => {
        element.classList.add("visible");
    });

} else {

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

}
