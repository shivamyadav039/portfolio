/**
 * Classical Floating Particles Animation
 * Creates an elegant, premium bokeh floating effect
 */

const initParticles = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 80;

    let width, height;

    // Resize handler
    const resize = () => {
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // Mouse tracking (gentle parallax)
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };
    window.addEventListener("mousemove", (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
    });

    // Premium color palette (champagne, soft silver, slate blue)
    const colors = [
        { r: 238, g: 216, b: 161 },   // Soft Gold/Champagne
        { r: 215, g: 215, b: 220 },   // Silver/White
        { r: 156, g: 175, b: 200 },   // Slate Blue
        { r: 250, g: 245, b: 235 }    // Warm White
    ];

    const getGradientColor = (alpha = 0.5) => {
        const colorIndex = Math.floor(Math.random() * colors.length);
        const color = colors[colorIndex];
        return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Very slow drift upwards
            this.vx = (Math.random() - 0.5) * 0.15;
            this.vy = (Math.random() - 0.5) * 0.2 - 0.1;
            // Varying sizes for depth (bokeh effect)
            this.size = Math.random() * Math.random() * 20 + 2;
            
            // Opacity based on size (smaller = further = dimmer)
            const baseAlpha = this.size < 4 ? 0.2 : (this.size < 12 ? 0.4 : 0.6);
            this.color = getGradientColor(baseAlpha * (Math.random() * 0.5 + 0.5));
            this.blur = this.size > 8 ? this.size * 0.4 : 0;
            this.sway = Math.random() * Math.PI * 2;
            this.swaySpeed = Math.random() * 0.008 + 0.002;
            this.depth = Math.random() * 0.5 + 0.1;
        }

        update() {
            // Gentle swaying motion
            this.sway += this.swaySpeed;
            this.x += this.vx + Math.sin(this.sway) * 0.15;
            this.y += this.vy;

            // Parallax effect from mouse
            const dx = (mouse.x - width / 2) * 0.001 * this.depth;
            const dy = (mouse.y - height / 2) * 0.001 * this.depth;
            this.x -= dx;
            this.y -= dy;

            // Wrap around edges softly
            if (this.x < -30) this.x = width + 30;
            if (this.x > width + 30) this.x = -30;
            if (this.y < -30) {
                this.y = height + 30;
                this.x = Math.random() * width;
            }
            if (this.y > height + 30) {
                this.y = -30;
                this.x = Math.random() * width;
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            
            if (this.blur > 0) {
                ctx.shadowBlur = this.blur;
                ctx.shadowColor = this.color;
            }
            
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    const animate = () => {
        // Smoothly interpolate mouse position
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Clear with slight trail effect
        // Using a very deep, rich dark color for premium feel
        ctx.fillStyle = 'rgba(5, 5, 8, 0.4)';
        ctx.fillRect(0, 0, width, height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    };

    animate();
};

window.initParticles = initParticles;
