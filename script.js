// ===== Three.js 3D Space Background =====
let scene, camera, renderer, stars, planets = [];
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;

function initThreeJS() {
    // Scene setup
    if (!window.THREE || !document.getElementById("spaceCanvas")) return;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('spaceCanvas'),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create stars
    createStars();
    
    // Create 3D planets
    createPlanets();

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Add point light for planet highlights
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    // Start animation
    animate();
}

function createStars() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        
        // Random positions in a sphere around camera
        positions[i3] = (Math.random() - 0.5) * 200;
        positions[i3 + 1] = (Math.random() - 0.5) * 200;
        positions[i3 + 2] = (Math.random() - 0.5) * 200;

        // Mostly white stars with some colored ones
        const starType = Math.random();
        if (starType > 0.95) {
            // Blue stars
            colors[i3] = 0.6;
            colors[i3 + 1] = 0.8;
            colors[i3 + 2] = 1;
        } else if (starType > 0.9) {
            // Yellow stars
            colors[i3] = 1;
            colors[i3 + 1] = 0.95;
            colors[i3 + 2] = 0.7;
        } else {
            // White stars
            colors[i3] = 1;
            colors[i3 + 1] = 1;
            colors[i3 + 2] = 1;
        }

        // Random sizes
        sizes[i] = Math.random() * 2 + 0.5;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Star material with custom shader for glow effect
    const starMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function createPlanets() {
    // Cyan/Turquoise planet (tilted, like in the image)
    const cyanPlanetGeometry = new THREE.SphereGeometry(5, 32, 32);
    const cyanPlanetMaterial = new THREE.MeshPhongMaterial({
        color: 0x00bcd4,
        emissive: 0x004d40,
        emissiveIntensity: 0.3,
        shininess: 30
    });
    const cyanPlanet = new THREE.Mesh(cyanPlanetGeometry, cyanPlanetMaterial);
    cyanPlanet.position.set(-40, 10, -20);
    cyanPlanet.rotation.x = Math.PI / 3;
    scene.add(cyanPlanet);
    planets.push({ mesh: cyanPlanet, speed: 0.002, floatSpeed: 0.001 });

    // Red/Orange planet
    const redPlanetGeometry = new THREE.SphereGeometry(3, 32, 32);
    const redPlanetMaterial = new THREE.MeshPhongMaterial({
        color: 0xff5722,
        emissive: 0x8b0000,
        emissiveIntensity: 0.2,
        shininess: 20
    });
    const redPlanet = new THREE.Mesh(redPlanetGeometry, redPlanetMaterial);
    redPlanet.position.set(-20, 5, -15);
    scene.add(redPlanet);
    planets.push({ mesh: redPlanet, speed: 0.003, floatSpeed: 0.0015 });

    // Blue planet
    const bluePlanetGeometry = new THREE.SphereGeometry(2, 32, 32);
    const bluePlanetMaterial = new THREE.MeshPhongMaterial({
        color: 0x2196f3,
        emissive: 0x0d47a1,
        emissiveIntensity: 0.2,
        shininess: 40
    });
    const bluePlanet = new THREE.Mesh(bluePlanetGeometry, bluePlanetMaterial);
    bluePlanet.position.set(25, -5, -10);
    scene.add(bluePlanet);
    planets.push({ mesh: bluePlanet, speed: 0.004, floatSpeed: 0.002 });

    // Purple planet with ring (Saturn-like)
    const purplePlanetGeometry = new THREE.SphereGeometry(4, 32, 32);
    const purplePlanetMaterial = new THREE.MeshPhongMaterial({
        color: 0x9c27b0,
        emissive: 0x4a148c,
        emissiveIntensity: 0.2,
        shininess: 30
    });
    const purplePlanet = new THREE.Mesh(purplePlanetGeometry, purplePlanetMaterial);
    purplePlanet.position.set(45, -15, -30);
    scene.add(purplePlanet);
    
    // Ring for purple planet
    const ringGeometry = new THREE.RingGeometry(5.5, 7, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xc8a0ff,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.5;
    purplePlanet.add(ring);
    
    planets.push({ mesh: purplePlanet, speed: 0.0015, floatSpeed: 0.0008 });

    // Small distant planets
    for (let i = 0; i < 5; i++) {
        const size = Math.random() * 1.5 + 0.5;
        const smallPlanetGeometry = new THREE.SphereGeometry(size, 16, 16);
        const hue = Math.random();
        const smallPlanetMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(hue, 0.6, 0.5),
            emissive: new THREE.Color().setHSL(hue, 0.6, 0.2),
            emissiveIntensity: 0.2,
            shininess: 20
        });
        const smallPlanet = new THREE.Mesh(smallPlanetGeometry, smallPlanetMaterial);
        smallPlanet.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 60,
            -30 - Math.random() * 50
        );
        scene.add(smallPlanet);
        planets.push({ 
            mesh: smallPlanet, 
            speed: Math.random() * 0.003 + 0.001,
            floatSpeed: Math.random() * 0.001 + 0.0005
        });
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Smooth mouse following
    targetMouseX += (mouseX - targetMouseX) * 0.05;
    targetMouseY += (mouseY - targetMouseY) * 0.05;

    // Rotate stars based on mouse position (parallax effect)
    if (stars) {
        stars.rotation.x = targetMouseY * 0.1;
        stars.rotation.y = targetMouseX * 0.1;
    }

    // Animate planets
    const time = Date.now() * 0.001;
    planets.forEach((planet, index) => {
        // Slow rotation
        planet.mesh.rotation.y += planet.speed;
        
        // Floating animation
        planet.mesh.position.y += Math.sin(time * planet.floatSpeed * 100 + index) * 0.02;
        
        // React to mouse (parallax depth)
        const depth = (index + 1) * 0.3;
        planet.mesh.position.x += (targetMouseX * depth - planet.mesh.position.x) * 0.01;
    });

    renderer.render(scene, camera);
}

// Mouse move handler for parallax
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Window resize handler
window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize Three.js when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initThreeJS();

    // ===== Smooth Scrolling for Navigation Links =====
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        });
    });

    // ===== Navbar Background Change on Scroll =====
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.boxShadow = '0 5px 30px rgba(0, 212, 255, 0.1)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // ===== Scroll Reveal Animation =====
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to animated elements
    const animatedElements = document.querySelectorAll(
        '.project-card, .skill-badge, .software-icon, .phone-mockup, .contact-btn, .profile-container'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // ===== Project Cards Hover Effect =====
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderColor = '#00d4ff';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderColor = 'rgba(0, 212, 255, 0.2)';
        });
    });

    // ===== Typing Effect for Hero Title =====
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 1s ease';
            heroTitle.style.opacity = '1';
        }, 300);
    }

    // ===== Active Navigation Link Highlight =====
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);

    // ===== Contact Button Ripple Effect =====
    const contactButtons = document.querySelectorAll('.contact-btn');
    
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                width: 100px;
                height: 100px;
                transform: translate(-50%, -50%) scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }
        
        .nav-link.active {
            color: #00d4ff !important;
        }
    `;
    document.head.appendChild(style);
});

// Integrated loading transition and project navigation
window.addEventListener('load',()=>{
 const loader=document.getElementById('space-preloader');
 setTimeout(()=>loader?.classList.add('preloader-hidden'),900);
});
setTimeout(()=>document.getElementById('space-preloader')?.classList.add('preloader-hidden'),4500);
document.querySelectorAll('a[href$=".html"]').forEach(link=>{
 link.addEventListener('click',e=>{
  const url=link.getAttribute('href');
  if(!url || url.startsWith('http') || url==='loading.html')return;
  e.preventDefault();
  sessionStorage.setItem('loader_target_url',url);
  window.location.href='loading.html';
 });
});
