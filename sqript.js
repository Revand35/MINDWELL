        // Three.js 3D Background Animation
        let scene, camera, renderer, particles;
        
        function init3D() {
            const canvas = document.getElementById('hero-3d');
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);

            // Create particle system
            const particleCount = 1000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = (Math.random() - 0.5) * 2000;
                positions[i3 + 1] = (Math.random() - 0.5) * 2000;
                positions[i3 + 2] = (Math.random() - 0.5) * 2000;

                // Blue color variations
                colors[i3] = 0.2 + Math.random() * 0.3;     // R
                colors[i3 + 1] = 0.4 + Math.random() * 0.4; // G
                colors[i3 + 2] = 0.8 + Math.random() * 0.2; // B

                sizes[i] = Math.random() * 3 + 1;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    pointTexture: { value: new THREE.TextureLoader().load('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4K') }
                },
                vertexShader: `
                    attribute float size;
                    attribute vec3 color;
                    varying vec3 vColor;
                    uniform float time;
                    
                    void main() {
                        vColor = color;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time * 0.01 + position.x * 0.01) * 0.2);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    uniform sampler2D pointTexture;
                    varying vec3 vColor;
                    
                    void main() {
                        gl_FragColor = vec4(vColor, 1.0);
                        gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
                    }
                `,
                transparent: true,
                vertexColors: true
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            // Add floating geometric shapes
            const shapes = [];
            for (let i = 0; i < 5; i++) {
                const geometry = new THREE.SphereGeometry(20, 8, 6);
                const material = new THREE.MeshBasicMaterial({
                    color: 0x448aff,
                    transparent: true,
                    opacity: 0.1,
                    wireframe: true
                });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(
                    (Math.random() - 0.5) * 1000,
                    (Math.random() - 0.5) * 1000,
                    (Math.random() - 0.5) * 1000
                );
                shapes.push(sphere);
                scene.add(sphere);
            }

            camera.position.z = 500;

            function animate() {
                requestAnimationFrame(animate);
                
                const time = Date.now() * 0.001;
                particles.material.uniforms.time.value = time;
                
                particles.rotation.x += 0.001;
                particles.rotation.y += 0.002;
                
                shapes.forEach((shape, index) => {
                    shape.rotation.x += 0.005 * (index + 1);
                    shape.rotation.y += 0.007 * (index + 1);
                    shape.position.y = Math.sin(time * 0.5 + index) * 100;
                });
                
                renderer.render(scene, camera);
            }
            
            animate();
        }

        // Scroll animations
        function setupScrollAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.fade-in').forEach(el => {
                observer.observe(el);
            });
        }

        // Smooth scrolling
        function setupSmoothScrolling() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
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
        }

        // Navbar scroll effect
        function setupNavbarEffect() {
            const navbar = document.querySelector('.navbar');
            let lastScrollY = window.scrollY;

            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100) {
                    navbar.style.background = 'rgba(26, 35, 126, 0.98)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
                } else {
                    navbar.style.background = 'rgba(26, 35, 126, 0.95)';
                    navbar.style.boxShadow = 'none';
                }

                lastScrollY = currentScrollY;
            });
        }

        // Form submission
        function setupFormSubmission() {
            const form = document.getElementById('contact-form');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(form);
                const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
                const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
                const message = formData.get('message') || e.target.querySelector('textarea').value;
                
                // Show success message
                const button = form.querySelector('button[type="submit"]');
                const originalText = button.textContent;
                button.textContent = 'Sending...';
                button.disabled = true;
                
                setTimeout(() => {
                    button.textContent = 'Message Sent!';
                    button.style.background = 'var(--gradient-secondary)';
                    
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                        button.style.background = '';
                        form.reset();
                    }, 2000);
                }, 1000);
            });
        }

        // Mouse parallax effect
        function setupParallaxEffect() {
            document.addEventListener('mousemove', (e) => {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                document.querySelectorAll('.floating-element').forEach((element, index) => {
                    const speed = (index + 1) * 2;
                    const x = (mouseX - 0.5) * speed;
                    const y = (mouseY - 0.5) * speed;
                    
                    element.style.transform = `translate(${x}px, ${y}px)`;
                });
            });
        }

        // Button hover effects
        function setupButtonEffects() {
            document.querySelectorAll('.btn').forEach(button => {
                button.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px) scale(1.05)';
                });
                
                button.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        }

        // Resize handler
        function setupResizeHandler() {
            window.addEventListener('resize', () => {
                if (camera && renderer) {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                }
            });
        }

        // Initialize everything
        document.addEventListener('DOMContentLoaded', () => {
            init3D();
            setupScrollAnimations();
            setupSmoothScrolling();
            setupNavbarEffect();
            setupFormSubmission();
            setupParallaxEffect();
            setupButtonEffects();
            setupResizeHandler();
            // Add loading animation
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });