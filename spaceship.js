/**
 * Premium 3D Spaceship Background
 * Uses Three.js to render a sleek, drifting spaceship in the background.
 */

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("spaceship-container");
    if (!container || typeof THREE === 'undefined') return;

    // ----- Scene Setup -----
    const scene = new THREE.Scene();
    
    // Add subtle deep fog to blend into the background gradient
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.0015);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ----- Lighting -----
    // Ambient light for base visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Key light (Indigo/Purple hue)
    const keyLight = new THREE.DirectionalLight(0x7c3aed, 2);
    keyLight.position.set(10, 20, 10);
    scene.add(keyLight);

    // Fill light (Cyan/Teal hue)
    const fillLight = new THREE.DirectionalLight(0x06b6d4, 1.5);
    fillLight.position.set(-10, -5, 5);
    scene.add(fillLight);

    // Backlight for edge rim illumination
    const rimLight = new THREE.SpotLight(0xc4b5fd, 3);
    rimLight.position.set(0, 5, -20);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);

    // ----- Constructing the Premium Spaceship -----
    const shipGroup = new THREE.Group();

    // Premium metallic material
    const hullMaterial = new THREE.MeshStandardMaterial({
        color: 0x1f2937, // dark gray/slate
        metalness: 0.9,
        roughness: 0.2,
    });

    // Glowing engine material
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x38bdf8, // bright cyan
    });

    // Main fuselage (sleek elongated pyramid/dart shape)
    const fuselageGeometry = new THREE.CylinderGeometry(0, 2, 12, 4);
    fuselageGeometry.rotateX(Math.PI / 2);
    const fuselage = new THREE.Mesh(fuselageGeometry, hullMaterial);
    
    // Flatten it slightly to look more aerodynamic
    fuselage.scale.set(1, 0.5, 1);
    shipGroup.add(fuselage);

    // Wings
    const wingGeometry = new THREE.BoxGeometry(10, 0.2, 4);
    const wings = new THREE.Mesh(wingGeometry, hullMaterial);
    wings.position.set(0, -0.2, 2);
    
    // Sweep the wings back
    const positions = wings.geometry.attributes.position;
    for(let i=0; i<positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        // If x is positive (right wing) or negative (left wing), shift z back
        positions.setZ(i, z + Math.abs(x) * 0.5);
    }
    wings.geometry.computeVertexNormals();
    shipGroup.add(wings);

    // Engine thrusters (glow)
    const ThrusterGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
    ThrusterGeometry.rotateX(Math.PI / 2);

    const thrusterLeft = new THREE.Mesh(ThrusterGeometry, glowMaterial);
    thrusterLeft.position.set(-2, 0, 5.8);
    shipGroup.add(thrusterLeft);

    const thrusterRight = new THREE.Mesh(ThrusterGeometry, glowMaterial);
    thrusterRight.position.set(2, 0, 5.8);
    shipGroup.add(thrusterRight);

    const thrusterCenter = new THREE.Mesh(ThrusterGeometry, glowMaterial);
    thrusterCenter.position.set(0, 0.2, 6);
    thrusterCenter.scale.set(1.5, 1.5, 1.5);
    shipGroup.add(thrusterCenter);

    // Position the ship slightly off-center and angled
    shipGroup.position.set(10, 5, -15);
    shipGroup.rotation.set(0.2, -0.4, 0.1);
    scene.add(shipGroup);

    // ----- Tiny Ambient Stars / Dust -----
    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = 80;
    const dustPositions = new Float32Array(dustCount * 3);
    for(let i=0; i < dustCount * 3; i++) {
        dustPositions[i] = (Math.random() - 0.5) * 100;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    
    const dustMaterial = new THREE.PointsMaterial({
        color: 0xc4b5fd,
        size: 0.2,
        transparent: true,
        opacity: 0.6
    });
    const dustSystem = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dustSystem);

    // ----- Resizing -----
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ----- Mouse Tracking -----
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.002;
        mouseY = (event.clientY - windowHalfY) * 0.002;
    });

    // ----- Animation Loop -----
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Smoothly interpolate mouse targets
        targetX = targetX + (mouseX - targetX) * 0.05;
        targetY = targetY + (mouseY - targetY) * 0.05;

        // Elegant drifting motion
        // Base rotation + sine wave bobbing + mouse parallax
        shipGroup.rotation.y = -0.4 + Math.sin(time * 0.5) * 0.1 + targetX;
        shipGroup.rotation.x = 0.2 + Math.cos(time * 0.3) * 0.05 + targetY;
        shipGroup.rotation.z = Math.sin(time * 0.2) * 0.05 - targetX * 0.5;

        // Gentle positional bobbing
        shipGroup.position.y = 5 + Math.sin(time * 0.8) * 1.5;
        shipGroup.position.x = 10 + targetX * 10;

        // Drifting dust
        dustSystem.rotation.y = time * 0.02;
        dustSystem.rotation.x = time * 0.01;

        renderer.render(scene, camera);
    }

    animate();
});
