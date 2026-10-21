window.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Clean Vector Icons
    if (window.lucide) {
    lucide.createIcons();
    }

    // 2. Initialize Lenis Smooth Scroll integrated with GSAP ScrollTrigger
    let lenis;
    if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    }

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 3. Multi-Layer Hero Parallax (Makin belakang makin lambat, makin depan makin terasa dalam)
    const parallaxLayers = document.querySelectorAll('[data-parallax-speed]');
    parallaxLayers.forEach((layer) => {
    const speed = parseFloat(layer.getAttribute('data-parallax-speed') || '0');
    if (speed > 0) {
        gsap.to(layer, {
        y: () => speed * 360,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
        },
        });
    }
    });

    // 4. Dynamic Scroll Reveals: Lateral Left & Right Slides
    gsap.utils.toArray('.reveal-from-left').forEach((el) => {
    gsap.fromTo(
        el,
        { x: -90, opacity: 0 },
        {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            toggleActions: 'play none none reverse',
        },
        }
    );
    });

    gsap.utils.toArray('.reveal-from-right').forEach((el) => {
    gsap.fromTo(
        el,
        { x: 90, opacity: 0 },
        {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 86%',
            toggleActions: 'play none none reverse',
        },
        }
    );
    });

    // 5. Dynamic Scroll Reveals: From Small to Large with Rotation (Scale + Rotation)
    gsap.utils.toArray('.reveal-scale-rotate').forEach((el) => {
    gsap.fromTo(
        el,
        { scale: 0.82, rotation: -4, opacity: 0 },
        {
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'back.out(1.3)',
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
        },
        }
    );
    });

    gsap.utils.toArray('.reveal-scale-rotate-left').forEach((el) => {
    gsap.fromTo(
        el,
        { scale: 0.8, rotation: -5, y: 60, opacity: 0 },
        {
        scale: 1,
        rotation: 0,
        y: 0,
        opacity: 1,
        duration: 1.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 84%',
            toggleActions: 'play none none reverse',
        },
        }
    );
    });

    gsap.utils.toArray('.reveal-scale-rotate-right').forEach((el) => {
    gsap.fromTo(
        el,
        { scale: 0.8, rotation: 5, y: 60, opacity: 0 },
        {
        scale: 1,
        rotation: 0,
        y: 0,
        opacity: 1,
        duration: 1.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: el,
            start: 'top 84%',
            toggleActions: 'play none none reverse',
        },
        }
    );
    });

    // 6. Bento Cards Staggered Pop-Up with Subtle Rotation
    gsap.fromTo(
    '.bento-reveal',
    { y: 65, scale: 0.9, rotation: 2.5, opacity: 0 },
    {
        y: 0,
        scale: 1,
        rotation: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
        trigger: '#craft',
        start: 'top 76%',
        toggleActions: 'play none none reverse',
        },
    }
    );

    // 7. Scroll-Drawn Timeline Progress Line
    const timelineLine = document.getElementById('timelineProgressLine');
    if (timelineLine) {
    gsap.to(timelineLine, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
        trigger: '#journey',
        start: 'top 60%',
        end: 'bottom 70%',
        scrub: 0.5,
        },
    });
    }

    // 8. Web-Scroll Design: Top Progress Bar, Navbar State & Active Chapter Dots
    const progressBar = document.getElementById('scrollProgressBar');
    const topNavbar = document.getElementById('topNavbar');
    const chapterDots = document.querySelectorAll('.chapter-dot');
    const sectionIds = ['#hero', '#trust-about', '#projects', '#craft', '#journey', '#contact'];

    window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    if (topNavbar) {
        if (scrollTop > 60) {
        topNavbar.classList.add('scrolled');
        } else {
        topNavbar.classList.remove('scrolled');
        }
    }

    // Highlight active section dot in right-side scroll navigator
    let currentIdx = 0;
    sectionIds.forEach((id, idx) => {
        const sec = document.querySelector(id);
        if (sec) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45) {
            currentIdx = idx;
        }
        }
    });

    chapterDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIdx);
    });
    });

    // Smooth Scroll on Chapter Dot & Anchor Links Click
    document.querySelectorAll('a[href^="#"], .chapter-dot').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
        const targetId = trigger.getAttribute('href') || trigger.getAttribute('data-target');
        if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            if (lenis) {
            lenis.scrollTo(targetEl, { offset: -20 });
            } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        }
        }
    });
    });

    // 9. Bento Cards Interactive Mouse Spotlight Effect
    document.querySelectorAll('.bento-spotlight-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
    });

    // 10. Custom Cursor Ring & Magnetic Button Micro-Interactions
    const cursorRing = document.getElementById('customCursorRing');
    if (cursorRing && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursorRing, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.18,
        ease: 'power2.out',
        });
    });

    document.querySelectorAll('a, button, .curated-image-frame').forEach((interactiveEl) => {
        interactiveEl.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
        interactiveEl.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
    });
    }

    document.querySelectorAll('.magnetic-btn').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.22, y: y * 0.22, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, 0.4)' });
    });
    });

    // 11. One-Click Copy Email to Clipboard (Uses execCommand for universal compatibility)
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const toastBanner = document.getElementById('toastBanner');
    const toastMessage = document.getElementById('toastMessage');

    function showToast(msg) {
    if (!toastBanner || !toastMessage) return;
    toastMessage.textContent = msg;
    toastBanner.classList.add('show');
    setTimeout(() => {
        toastBanner.classList.remove('show');
    }, 3200);
    }

    if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
        const email = 'sulthanfaaz@gmail.com';
        const tempInput = document.createElement('textarea');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
        document.execCommand('copy');
        showToast('Email sulthanfaaz@gmail.com copied to clipboard!');
        } catch (err) {
        showToast('Email: sulthanfaaz@gmail.com');
        }
        document.body.removeChild(tempInput);
    });
    }

    // 12. Photo & SVG Replacement Guide Modal Toggle
    const openGuideBtn = document.getElementById('openAssetGuideBtn');
    const closeGuideBtn = document.getElementById('closeAssetGuideBtn');
    const guideModal = document.getElementById('assetGuideModal');

    if (openGuideBtn && guideModal && closeGuideBtn) {
    openGuideBtn.addEventListener('click', () => {
        guideModal.classList.remove('hidden');
        guideModal.classList.add('flex');
    });
    closeGuideBtn.addEventListener('click', () => {
        guideModal.classList.add('hidden');
        guideModal.classList.remove('flex');
    });
    guideModal.addEventListener('click', (e) => {
        if (e.target === guideModal) {
        guideModal.classList.add('hidden');
        guideModal.classList.remove('flex');
        }
    });
    }
});