// ==============================================================================
// 3D THREE.JS ENGINE & INTERACTIVE 3D EFFECTS FOR IDILEWA
// Comprehensive 3D animations, artifact rendering, audio visuals, and card tilt
// ==============================================================================
import * as THREE from 'three';

/**
 * 1. Interactive 3D Hero Stage (African Cultural Artifacts, Talking Drum, Rotating Glyphs & Golden Particles)
 */
export function init3DHeroCanvas(containerElement) {
  if (!containerElement) return null;

  containerElement.innerHTML = '';
  const width = containerElement.clientWidth || 360;
  const height = containerElement.clientHeight || 300;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0.5, 6.5);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  containerElement.appendChild(renderer.domElement);

  // 3D Scene Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const greenRimLight = new THREE.PointLight(0x15764a, 2.5, 12);
  greenRimLight.position.set(-4, -2, 3);
  scene.add(greenRimLight);

  const goldRimLight = new THREE.PointLight(0xf59e0b, 2.5, 12);
  goldRimLight.position.set(4, -3, 2);
  scene.add(goldRimLight);

  // Master 3D Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // --- 3D AFRICAN TALKING DRUM (Gángan) & CULTURAL EMBLEM ---
  const drumGroup = new THREE.Group();

  // Drum Body (Hourglass/Curved Cylinder)
  const bodyGeo = new THREE.CylinderGeometry(0.75, 0.75, 1.8, 32, 10, true);
  // Pinch the cylinder waist to make authentic talking drum shape
  const posAttr = bodyGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    const scale = 0.65 + 0.35 * Math.pow(y / 0.9, 2);
    posAttr.setX(i, posAttr.getX(i) * scale);
    posAttr.setZ(i, posAttr.getZ(i) * scale);
  }
  bodyGeo.computeVertexNormals();

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.35,
    metalness: 0.15,
  });
  const drumBody = new THREE.Mesh(bodyGeo, woodMat);
  drumGroup.add(drumBody);

  // Drum Membrane Tops (Leather Skins)
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    roughness: 0.6,
    metalness: 0.1,
  });
  const topSkin = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.76, 0.1, 32), skinMat);
  topSkin.position.y = 0.9;
  drumGroup.add(topSkin);

  const bottomSkin = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.76, 0.1, 32), skinMat);
  bottomSkin.position.y = -0.9;
  drumGroup.add(bottomSkin);

  // Brass Ring Hoops
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.2,
    metalness: 0.9,
  });
  const topRing = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.05, 16, 32), brassMat);
  topRing.rotation.x = Math.PI / 2;
  topRing.position.y = 0.9;
  drumGroup.add(topRing);

  const bottomRing = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.05, 16, 32), brassMat);
  bottomRing.rotation.x = Math.PI / 2;
  bottomRing.position.y = -0.9;
  drumGroup.add(bottomRing);

  // Drum Leather Tension Ropes (12 vertical strings)
  const ropeMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.7,
    metalness: 0.05,
  });
  const ropeCount = 12;
  for (let i = 0; i < ropeCount; i++) {
    const angle = (i / ropeCount) * Math.PI * 2;
    const ropeGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.8, 8);
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    const rx = Math.cos(angle) * 0.7;
    const rz = Math.sin(angle) * 0.7;
    rope.position.set(rx, 0, rz);
    drumGroup.add(rope);
  }

  // Emerald Gem Center Belt
  const gemBelt = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.06, 16, 32),
    new THREE.MeshStandardMaterial({
      color: 0x15764a,
      roughness: 0.1,
      metalness: 0.8,
      emissive: 0x064e3b,
      emissiveIntensity: 0.5,
    })
  );
  gemBelt.rotation.x = Math.PI / 2;
  drumGroup.add(gemBelt);

  drumGroup.rotation.z = 0.3;
  drumGroup.rotation.x = 0.2;
  masterGroup.add(drumGroup);

  // --- 3D FLOATING ORBITING CULTURAL RINGS & GLYPH PLATES ---
  const outerRingGeo = new THREE.TorusGeometry(2.1, 0.04, 16, 64);
  const outerRingMat = new THREE.MeshStandardMaterial({
    color: 0x15764a,
    roughness: 0.2,
    metalness: 0.85,
    transparent: true,
    opacity: 0.8,
  });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRing.rotation.x = Math.PI / 2.5;
  masterGroup.add(outerRing);

  // Orbiting Yoruba Glyph Spheres (È, Ẹ, Ọ, Ṣ)
  const glyphGroup = new THREE.Group();
  const glyphColors = [0x15764a, 0xf59e0b, 0x0284c7, 0xd97706];
  const glyphSpheres = [];

  for (let i = 0; i < 4; i++) {
    const gGeo = new THREE.IcosahedronGeometry(0.24, 2);
    const gMat = new THREE.MeshStandardMaterial({
      color: glyphColors[i],
      roughness: 0.2,
      metalness: 0.8,
      emissive: glyphColors[i],
      emissiveIntensity: 0.3,
    });
    const gMesh = new THREE.Mesh(gGeo, gMat);
    glyphGroup.add(gMesh);
    glyphSpheres.push(gMesh);
  }
  masterGroup.add(glyphGroup);

  // --- 3D PARTICLES FIELD (Golden Dust & Cultural Fireflies) ---
  const particleCount = 80;
  const particleGeo = new THREE.BufferGeometry();
  const posArr = new Float32Array(particleCount * 3);
  const colArr = new Float32Array(particleCount * 3);

  const colorsPalette = [
    new THREE.Color(0xf59e0b), // Amber Gold
    new THREE.Color(0x15764a), // Emerald Green
    new THREE.Color(0x38bdf8), // Sky Blue
    new THREE.Color(0xfbbf24), // Bright Yellow
  ];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.6 + Math.random() * 2.2;
    const y = (Math.random() - 0.5) * 3.5;
    posArr[i * 3] = Math.cos(angle) * radius;
    posArr[i * 3 + 1] = y;
    posArr[i * 3 + 2] = Math.sin(angle) * radius;

    const col = colorsPalette[i % colorsPalette.length];
    colArr[i * 3] = col.r;
    colArr[i * 3 + 1] = col.g;
    colArr[i * 3 + 2] = col.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  masterGroup.add(particles);

  // --- MOUSE & TOUCH PARALLAX INTERACTION ---
  let targetRotX = 0;
  let targetRotY = 0;
  let curRotX = 0;
  let curRotY = 0;
  let isDragging = false;
  let prevMouseX = 0;
  let prevMouseY = 0;

  const onPointerDown = (e) => {
    isDragging = true;
    prevMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    prevMouseY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  };

  const onPointerMove = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    if (isDragging) {
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
      prevMouseX = clientX;
      prevMouseY = clientY;
    } else {
      const rect = containerElement.getBoundingClientRect();
      const nx = (clientX - rect.left) / rect.width - 0.5;
      const ny = (clientY - rect.top) / rect.height - 0.5;
      targetRotY = nx * 0.8;
      targetRotX = -ny * 0.6;
    }
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  containerElement.addEventListener('mousedown', onPointerDown);
  containerElement.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);
  containerElement.addEventListener('touchstart', onPointerDown, { passive: true });
  containerElement.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  let animId = null;
  let clock = 0;

  const animate = () => {
    animId = requestAnimationFrame(animate);
    clock += 0.02;

    // Smooth inertia interpolation
    curRotX += (targetRotX - curRotX) * 0.06;
    curRotY += (targetRotY - curRotY) * 0.06;

    masterGroup.rotation.y = curRotY + Math.sin(clock * 0.5) * 0.15;
    masterGroup.rotation.x = curRotX + Math.cos(clock * 0.4) * 0.1;

    drumGroup.rotation.y += 0.01;
    outerRing.rotation.z += 0.005;

    // Orbit glyph spheres
    glyphSpheres.forEach((sphere, idx) => {
      const angle = clock * 0.8 + (idx / 4) * Math.PI * 2;
      sphere.position.x = Math.cos(angle) * 2.1;
      sphere.position.z = Math.sin(angle) * 2.1;
      sphere.position.y = Math.sin(clock * 1.5 + idx) * 0.35;
      sphere.rotation.y += 0.02;
    });

    particles.rotation.y -= 0.003;
    particles.rotation.x += 0.002;

    renderer.render(scene, camera);
  };

  animate();

  const handleResize = () => {
    const w = containerElement.clientWidth;
    const h = containerElement.clientHeight;
    if (w && h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
  };

  window.addEventListener('resize', handleResize);

  return {
    destroy: () => {
      if (animId) cancelAnimationFrame(animId);
      containerElement.removeEventListener('mousedown', onPointerDown);
      containerElement.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      containerElement.removeEventListener('touchstart', onPointerDown);
      containerElement.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerElement.innerHTML = '';
    },
  };
}

/**
 * 2. 3D Audio Visualizer (Waveform Sphere & Frequency Rings)
 */
export function init3DAudioVisualizer(canvasElement) {
  if (!canvasElement) return null;

  const width = canvasElement.clientWidth || 320;
  const height = canvasElement.clientHeight || 160;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 1.8, 4.2);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x15764a, 2.5, 10);
  pointLight.position.set(0, 3, 2);
  scene.add(pointLight);

  const barCount = 14;
  const bars = [];
  const barGroup = new THREE.Group();

  for (let i = 0; i < barCount; i++) {
    const geo = new THREE.CylinderGeometry(0.07, 0.07, 1.2, 16);
    // Dò (Blue), Re (Green), Mí (Amber/Gold)
    const col = i < 4 ? 0x0284c7 : i < 9 ? 0x15764a : 0xf59e0b;
    const mat = new THREE.MeshStandardMaterial({
      color: col,
      roughness: 0.25,
      metalness: 0.7,
      emissive: col,
      emissiveIntensity: 0.2,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = (i - barCount / 2) * 0.25;
    mesh.position.y = 0.6;
    barGroup.add(mesh);
    bars.push(mesh);
  }

  // Waveform Orbiting Ring
  const ringGeo = new THREE.TorusGeometry(1.8, 0.03, 16, 64);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x15764a,
    metalness: 0.9,
    roughness: 0.2,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2.3;
  barGroup.add(ring);

  scene.add(barGroup);

  let activePitch = 're';
  let isSpeaking = false;
  let animId = null;
  let time = 0;

  const animate = () => {
    animId = requestAnimationFrame(animate);
    time += 0.07;

    bars.forEach((bar, idx) => {
      let targetScale = 0.35;
      if (isSpeaking) {
        const offset = idx * 0.45;
        targetScale = 0.6 + Math.sin(time * 3 + offset) * 0.9 + Math.random() * 0.25;
      } else if (activePitch === 'low' || activePitch === 'do') {
        targetScale = idx < 5 ? 1.3 + Math.sin(time * 4 + idx) * 0.5 : 0.3;
      } else if (activePitch === 'high' || activePitch === 'mi') {
        targetScale = idx >= 9 ? 1.5 + Math.sin(time * 5 + idx) * 0.5 : 0.3;
      } else {
        targetScale = idx >= 4 && idx < 9 ? 1.2 + Math.sin(time * 3.5 + idx) * 0.4 : 0.4;
      }

      bar.scale.y += (targetScale - bar.scale.y) * 0.2;
      bar.position.y = bar.scale.y / 2;
    });

    barGroup.rotation.y = Math.sin(time * 0.6) * 0.25;
    ring.rotation.z += 0.01;

    renderer.render(scene, camera);
  };

  animate();

  return {
    setPitch: (pitch) => {
      activePitch = pitch;
    },
    setSpeaking: (speaking) => {
      isSpeaking = speaking;
    },
    destroy: () => {
      if (animId) cancelAnimationFrame(animId);
      renderer.dispose();
    },
  };
}

/**
 * 3. Global 3D Interactive Card Tilt Engine (Perspective 3D Hover & Glare)
 */
export function init3DTiltEngine() {
  const cards = document.querySelectorAll('.feature-card, .activity-card, .language-card, .c4k-hub-card, .yoruba-editor-card, .auth-box, .stat-card, .proverb-card, .plan-card');

  cards.forEach((card) => {
    if (card.__tiltInitialized) return;
    card.__tiltInitialized = true;

    // Add perspective CSS classes if missing
    card.classList.add('perspective-3d-card');

    let glare = card.querySelector('.card-3d-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-3d-glare';
      card.appendChild(glare);
    }

    const onMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // degrees
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025) translateZ(8px)`;

      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 65%)`;
      }
    };

    const onMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)';
      if (glare) glare.style.opacity = '0';
    };

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}
