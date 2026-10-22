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

    // 3. Header & Parallax Layers Entrance Animation
    // Muncul berurutan dari layer paling atas (foreground layer 4), bergerak dari bawah ke atas
    const heroLayerSvgs = [
        document.querySelector('#heroLayerForeground svg'),
        document.querySelector('#heroLayerRiverValley svg'),
        document.querySelector('#heroLayerMidMountain svg'),
        document.querySelector('#heroLayerFarMountain svg'),
        document.querySelector('#heroLayerSky svg'),
    ].filter(Boolean);

    const heroEntranceTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
            ScrollTrigger.refresh();
        }
    });

    // Inner SVGs muncul dari bawah ke atas berurutan (Layer 4 foreground duluan, lalu 3, 2, 1, 0)
    // Menggunakan inner SVG memastikan outer .parallax-layer div tetap murni bebas transform awal (anti-patah saat scroll pertama)
    heroEntranceTl.fromTo(
        heroLayerSvgs,
        { y: 130, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1.25,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'transform',
        },
        0.05
    );

    // Navbar meluncur halus dari atas
    heroEntranceTl.fromTo(
        '#topNavbar',
        { y: -60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power2.out', clearProps: 'transform' },
        0.25
    );

    // Elemen konten hero muncul bertahap
    heroEntranceTl.fromTo(
        '#heroContent > div:first-child',
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)', clearProps: 'transform' },
        0.5
    );

    heroEntranceTl.fromTo(
        '#heroContent h1',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', clearProps: 'transform' },
        0.65
    );

    heroEntranceTl.fromTo(
        '#heroContent p',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'transform' },
        0.8
    );

    heroEntranceTl.fromTo(
        '#heroContent .flex',
        { y: 25, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'power2.out', clearProps: 'transform' },
        0.95
    );

    // 4. Multi-Layer Hero Parallax saat scroll
    // Mengontrol elemen outer .parallax-layer yang memiliki data-parallax-speed > 0
    const parallaxLayers = document.querySelectorAll('.parallax-layer[data-parallax-speed]');
    parallaxLayers.forEach((layer) => {
        const speed = parseFloat(layer.getAttribute('data-parallax-speed') || '0');
        if (speed > 0) {
            gsap.to(layer, {
                y: () => speed * 300,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.3,
                    invalidateOnRefresh: true,
                },
            });
        }
    });

    // Konten teks hero melayang lembut dan memudar elegan saat di-scroll
    const heroContent = document.getElementById('heroContent');
    if (heroContent) {
        gsap.to(heroContent, {
            y: -50,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: '20% top',
                end: '75% top',
                scrub: true,
            }
        });
    }

    // 5. Dynamic Scroll Reveals: Lateral Left & Right Slides (Section 2 Trust & About)
    gsap.utils.toArray('#trust-about .reveal-from-left').forEach((el) => {
        gsap.fromTo(
            el,
            { x: -85, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.95,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );
    });

    gsap.utils.toArray('#trust-about .reveal-from-right').forEach((el) => {
        gsap.fromTo(
            el,
            { x: 85, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.95,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            }
        );
    });

    // 6. Behind the Craft: Portrait Photo Scrub Parallax (Rotate & Scale on Scroll)
    const portraitFrame = document.getElementById('aboutPortraitFrame');
    if (portraitFrame) {
        gsap.fromTo(
            portraitFrame,
            { scale: 0.88, rotation: -4.5 },
            {
                scale: 1.0,
                rotation: 2,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#trust-about',
                    start: 'top 75%',
                    end: 'bottom 40%',
                    scrub: 1.2,
                    invalidateOnRefresh: true,
                }
            }
        );
    }

    // 6.5. Professional Services: Section Heading & Dynamic Card Reveals
    const servicesHeading = document.getElementById('servicesHeading');
    if (servicesHeading) {
        gsap.fromTo(
            servicesHeading,
            { y: 35, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.85,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '#services',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                }
            }
        );
    }

    gsap.utils.toArray('#services .service-card').forEach((card) => {
        gsap.fromTo(
            card,
            { y: 45, opacity: 0, scale: 0.95 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.85,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                }
            }
        );
    });

    // 7. Selected Works: Item Entrance Reveal & Silky-Smooth Horizontal Pinning
    const projectsSection = document.getElementById('projects');
    const projectsHeading = document.getElementById('projectsHeading');
    const projectsTrack = document.getElementById('projectsGalleryTrack');
    const projectCards = document.querySelectorAll('.project-card-reveal');

    if (projectsSection && projectsTrack) {
        // Animasi kemunculan heading saat section Selected Works mulai terlihat
        if (projectsHeading) {
            gsap.fromTo(
                projectsHeading,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.85,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: projectsSection,
                        start: 'top 65%',
                        toggleActions: 'play none none reverse',
                    }
                }
            );
        }

        // Animasi kemunculan kartu-kartu proyek saat masuk area pandang mata (sebelum di-pin)
        // Kartu membesar dinamis dengan sedikit rotasi artistik (scale & subtle tilt)
        if (projectCards.length > 0) {
            projectCards.forEach((card, idx) => {
                const rot = idx % 2 === 0 ? -2.5 : 2.5;
                gsap.fromTo(
                    card,
                    { scale: 0.88, rotation: rot, y: 55, opacity: 0 },
                    {
                        scale: 1,
                        rotation: 0,
                        y: 0,
                        opacity: 1,
                        duration: 1.0,
                        ease: 'back.out(1.2)',
                        scrollTrigger: {
                            trigger: projectsSection,
                            start: 'top 35%',
                            toggleActions: 'play none none reverse',
                        }
                    }
                );
            });
        }

        // Horizontal Pinning & Direct Scrub
        const getHorizontalScrollDistance = () => {
            const trackWidth = projectsTrack.scrollWidth;
            const viewportWidth = window.innerWidth;
            return Math.max(0, trackWidth - viewportWidth + 64);
        };

        gsap.to(projectsTrack, {
            x: () => -getHorizontalScrollDistance(),
            ease: 'none',
            scrollTrigger: {
                trigger: projectsSection,
                pin: true,
                scrub: 0.5,
                start: 'top top',
                end: () => '+=' + getHorizontalScrollDistance(),
                invalidateOnRefresh: true,
                anticipatePin: 0,
            }
        });

        // Sinkronisasi ulang ukuran ScrollTrigger saat gambar proyek selesai ter-load
        projectsTrack.querySelectorAll('img').forEach((img) => {
            if (img.complete) {
                ScrollTrigger.refresh();
            } else {
                img.addEventListener('load', () => ScrollTrigger.refresh());
            }
        });
    }

    // 8. Versatile Craft: Bento Cards Individual Pop-Up (Muncul saat tiap kartu masuk layar)
    gsap.utils.toArray('#craft .bento-spotlight-card').forEach((card) => {
        gsap.fromTo(
            card,
            { y: 45, scale: 0.94, opacity: 0 },
            {
                y: 0,
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 84%',
                    toggleActions: 'play none none reverse',
                },
            }
        );
    });

    // 9. Let's Collaborate: Conversion Card Scale-Up Reveal
    const collaborateCard = document.querySelector('.reveal-collaborate');
    if (collaborateCard) {
        gsap.fromTo(
            collaborateCard,
            { scale: 0.9, y: 40, opacity: 0 },
            {
                scale: 1,
                y: 0,
                opacity: 1,
                duration: 0.85,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: collaborateCard,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                }
            }
        );
    }

    // 10. My Professional Journey: Timeline Row Reveal & Scroll-Drawn Progress Line
    // Heading Journey Reveal
    const journeyHeading = document.getElementById('journeyHeading');
    if (journeyHeading) {
        gsap.fromTo(
            journeyHeading,
            { y: 35, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.85,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '#journey',
                    start: 'top 78%',
                    toggleActions: 'play none none reverse',
                }
            }
        );
    }

    // Setiap baris milestone muncul bersamaan (kiri meluncur, badge icon membal/pop, kanan meluncur)
    gsap.utils.toArray('.timeline-row').forEach((row) => {
        const leftEl = row.querySelector('.reveal-from-left');
        const rightEl = row.querySelector('.reveal-from-right');
        const dot = row.querySelector('.timeline-dot');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: row,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
            }
        });

        if (leftEl) {
            tl.fromTo(leftEl, { x: -85, opacity: 0 }, { x: 0, opacity: 1, duration: 0.95, ease: 'power3.out' }, 0);
        }
        if (rightEl) {
            tl.fromTo(rightEl, { x: 85, opacity: 0 }, { x: 0, opacity: 1, duration: 0.95, ease: 'power3.out' }, 0.05);
        }
        if (dot) {
            tl.fromTo(dot, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.8)' }, 0.1);
        }
    });

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

    // 11. Web-Scroll Design: Top Progress Bar, Navbar State & Active Chapter Dots
    const progressBar = document.getElementById('scrollProgressBar');
    const topNavbar = document.getElementById('topNavbar');
    const chapterDots = document.querySelectorAll('.chapter-dot');
    const sectionIds = ['#hero', '#trust-about', '#services', '#projects', '#craft', '#journey', '#collaborate', '#contact'];

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

    // 13. Global Refresh on Complete Window Load (Assets, Fonts & Stylesheets)
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });
});