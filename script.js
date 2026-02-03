const lightPointer = document.getElementById('light-pointer');
const iconCards = Array.from(document.querySelectorAll('.icon-card'));

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let scrollY = 0;

const sensitivity = 6;
const lerpFactor = 0.05;

// Track mouse for interactive effects
window.addEventListener('mousemove', (e) => {
    const mouseXPercent = (e.clientX / window.innerWidth) * 100;
    const mouseYPercent = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${mouseXPercent}%`);
    document.documentElement.style.setProperty('--mouse-y', `${mouseYPercent}%`);

    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;
    targetY = x * sensitivity;
    targetX = -y * sensitivity;

    if (lightPointer) {
        lightPointer.style.left = `${e.clientX}px`;
        lightPointer.style.top = `${e.clientY}px`;
        lightPointer.style.opacity = '0.6';
    }
});

// Track scroll for parallax
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-y', scrollY);
});

function updateIconParallax() {
    if (!iconCards.length) return;

    const viewportH = window.innerHeight;
    const viewportW = window.innerWidth;

    iconCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewportH) return;

        const progress = (viewportH - rect.top) / (viewportH + rect.height);
        const clamped = Math.min(1, Math.max(0, progress));
        const centerX = rect.left + rect.width / 2;
        const xRatio = (centerX / viewportW) - 0.5;

        const rotateX = (0.5 - clamped) * 18;
        const rotateY = xRatio * 16;
        const lift = clamped * 14;

        card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
        card.style.setProperty('--lift', `${lift.toFixed(2)}px`);
    });
}

function animate() {
    currentX += (targetX - currentX) * lerpFactor;
    currentY += (targetY - currentY) * lerpFactor;

    document.documentElement.style.setProperty('--rotate-x', `${currentX}deg`);
    document.documentElement.style.setProperty('--rotate-y', `${currentY}deg`);
    updateIconParallax();

    requestAnimationFrame(animate);
}

function onWindowResize() {
    targetX = 0;
    targetY = 0;
    currentX = 0;
    currentY = 0;
    updateIconParallax();
}

window.onload = () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';

                animate();
                window.addEventListener('resize', onWindowResize);

                if (lightPointer) {
                    document.addEventListener('mouseleave', () => {
                        lightPointer.style.opacity = '0';
                    });

                    document.addEventListener('mouseenter', () => {
                        lightPointer.style.opacity = '0.6';
                    });
                }
            }, 800);
        }
    }, 1000);
};
