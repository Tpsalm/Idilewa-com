// ==============================================================================
// 3D THREE.JS ENGINE & INTERACTIVE 3D EFFECTS FOR IDILEWA
// Comprehensive 3D animations, artifact rendering, audio visuals, and card tilt
// ==============================================================================
import * as THREE from 'three';

const activeScenes = new Map();


export function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (_) {
    return false;
  }
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function renderFallbackVisual(containerElement, label = 'Idilewa Cultural Artifact') {
  if (!containerElement) return;
  containerElement.innerHTML = `
    <div class="webgl-fallback-stage" role="img" aria-label="${label}">
      <div class="webgl-fallback-ambient" aria-hidden="true"></div>
      <div class="webgl-fallback-icon" aria-hidden="true">🥁</div>
      <div class="webgl-fallback-text">
        <strong>${label}</strong>
        <small>Warm cultural learning space · WebGL fallback active</small>
      </div>
    </div>
  `;
}

function cleanPreviousScene(containerElement) {
  if (activeScenes.has(containerElement)) {
    const prev = activeScenes.get(containerElement);
    if (prev && typeof prev.destroy === 'function') {
      try { prev.destroy(); } catch (_) {}
    }
    activeScenes.delete(containerElement);
  }
  containerElement.innerHTML = '';
}

/**
 * 1. Interactive 3D Hero Stage (African Cultural Artifacts, Talking Drum, Rotating Glyphs & Golden Particles)
 */
export function init3DHeroCanvas(containerElement) {
  if (!containerElement) return null;
  cleanPreviousScene(containerElement);
  if (!isWebGLAvailable()) {
    renderFallbackVisual(containerElement, '3D African Talking Drum & Living Glyphs');
    return { destroy: () => { containerElement.innerHTML = ''; } };
  }

  const width = containerElement.clientWidth || 380;
  const height = containerElement.clientHeight || 340;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0.4, 6.2);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  containerElement.appendChild(renderer.domElement);

  // 3D Scene Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
  mainLight.position.set(5, 8, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const greenRimLight = new THREE.PointLight(0x15764a, 3.2, 12);
  greenRimLight.position.set(-4, -2, 3);
  scene.add(greenRimLight);

  const goldRimLight = new THREE.PointLight(0xf59e0b, 3.2, 12);
  goldRimLight.position.set(4, -3, 2);
  scene.add(goldRimLight);

  // Master 3D Group
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  // --- 3D AFRICAN TALKING DRUM (Gángan) & CULTURAL EMBLEM ---
  const drumGroup = new THREE.Group();

  // Drum Body (Hourglass/Curved Cylinder)
  const bodyGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.9, 32, 12, true);
  const posAttr = bodyGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    const scale = 0.65 + 0.35 * Math.pow(y / 0.95, 2);
    posAttr.setX(i, posAttr.getX(i) * scale);
    posAttr.setZ(i, posAttr.getZ(i) * scale);
  }
  bodyGeo.computeVertexNormals();

  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.3,
    metalness: 0.2,
  });
  const drumBody = new THREE.Mesh(bodyGeo, woodMat);
  drumGroup.add(drumBody);

  // Drum Membrane Tops (Leather Skins)
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    roughness: 0.5,
    metalness: 0.15,
  });
  const topSkin = new THREE.Mesh(new THREE.CylinderGeometry(0.81, 0.81, 0.1, 32), skinMat);
  topSkin.position.y = 0.95;
  drumGroup.add(topSkin);

  const bottomSkin = new THREE.Mesh(new THREE.CylinderGeometry(0.81, 0.81, 0.1, 32), skinMat);
  bottomSkin.position.y = -0.95;
  drumGroup.add(bottomSkin);

  // Brass Ring Hoops
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.15,
    metalness: 0.95,
  });
  const topRing = new THREE.Mesh(new THREE.TorusGeometry(0.83, 0.05, 16, 32), brassMat);
  topRing.rotation.x = Math.PI / 2;
  topRing.position.y = 0.95;
  drumGroup.add(topRing);

  const bottomRing = new THREE.Mesh(new THREE.TorusGeometry(0.83, 0.05, 16, 32), brassMat);
  bottomRing.rotation.x = Math.PI / 2;
  bottomRing.position.y = -0.95;
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
    const ropeGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.9, 8);
    const rope = new THREE.Mesh(ropeGeo, ropeMat);
    const rx = Math.cos(angle) * 0.75;
    const rz = Math.sin(angle) * 0.75;
    rope.position.set(rx, 0, rz);
    drumGroup.add(rope);
  }

  // Emerald Gem Center Belt
  const gemBelt = new THREE.Mesh(
    new THREE.TorusGeometry(0.58, 0.07, 16, 32),
    new THREE.MeshStandardMaterial({
      color: 0x15764a,
      roughness: 0.1,
      metalness: 0.85,
      emissive: 0x064e3b,
      emissiveIntensity: 0.6,
    })
  );
  gemBelt.rotation.x = Math.PI / 2;
  drumGroup.add(gemBelt);

  drumGroup.rotation.z = 0.28;
  drumGroup.rotation.x = 0.2;
  masterGroup.add(drumGroup);

  // --- 3D FLOATING ORBITING CULTURAL RINGS & GLYPH PLATES ---
  const outerRingGeo = new THREE.TorusGeometry(2.2, 0.045, 16, 64);
  const outerRingMat = new THREE.MeshStandardMaterial({
    color: 0x15764a,
    roughness: 0.2,
    metalness: 0.9,
    transparent: true,
    opacity: 0.85,
  });
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
  outerRing.rotation.x = Math.PI / 2.5;
  masterGroup.add(outerRing);

  // Orbiting Yoruba Glyph Spheres (È, Ẹ, Ọ, Ṣ)
  const glyphGroup = new THREE.Group();
  const glyphColors = [0x15764a, 0xf59e0b, 0x0284c7, 0xd97706];
  const glyphSpheres = [];

  for (let i = 0; i < 4; i++) {
    const gGeo = new THREE.IcosahedronGeometry(0.26, 2);
    const gMat = new THREE.MeshStandardMaterial({
      color: glyphColors[i],
      roughness: 0.15,
      metalness: 0.85,
      emissive: glyphColors[i],
      emissiveIntensity: 0.4,
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
    new THREE.Color(0xf59e0b),
    new THREE.Color(0x15764a),
    new THREE.Color(0x38bdf8),
    new THREE.Color(0xfbbf24),
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
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  masterGroup.add(particles);

  const instance = setupOrbitControls(containerElement, masterGroup, glyphSpheres, drumGroup, outerRing, particles, renderer, scene, camera);
  activeScenes.set(containerElement, instance);
  return instance;
}

/**
 * 2. 3D Auth Stage (Sacred African Shield & Glowing Gateway Key)
 */
export function init3DAuthCanvas(containerElement) {
  if (!containerElement) return null;
  cleanPreviousScene(containerElement);
  if (!isWebGLAvailable()) {
    renderFallbackVisual(containerElement, 'Sacred African Shield & Gateway');
    return { destroy: () => { containerElement.innerHTML = ''; } };
  }

  const width = containerElement.clientWidth || 340;
  const height = containerElement.clientHeight || 220;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 5.8);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  containerElement.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfde047, 2.5);
  keyLight.position.set(3, 4, 4);
  scene.add(keyLight);

  const emeraldLight = new THREE.PointLight(0x15764a, 3.2, 10);
  emeraldLight.position.set(-3, -2, 2);
  scene.add(emeraldLight);

  const group = new THREE.Group();
  scene.add(group);

  const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.9, 0.28, 80, 16),
    new THREE.MeshStandardMaterial({ color: 0x15764a, roughness: 0.2, metalness: 0.85 })
  );
  group.add(torusKnot);

  const coreJewel = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.6, 2),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.15, metalness: 0.95, emissive: 0x78350f, emissiveIntensity: 0.4 })
  );
  group.add(coreJewel);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.03, 16, 48),
    new THREE.MeshStandardMaterial({ color: 0xfde047, metalness: 0.9, roughness: 0.2 })
  );
  ring.rotation.x = Math.PI / 3;
  group.add(ring);

  const sparkGeo = new THREE.BufferGeometry();
  const sparkCount = 45;
  const sparkPos = new Float32Array(sparkCount * 3);
  for (let i = 0; i < sparkCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = 1.3 + Math.random() * 1.2;
    sparkPos[i * 3] = Math.cos(theta) * r;
    sparkPos[i * 3 + 1] = (Math.random() - 0.5) * 2;
    sparkPos[i * 3 + 2] = Math.sin(theta) * r;
  }
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  const sparkles = new THREE.Points(
    sparkGeo,
    new THREE.PointsMaterial({ color: 0xfbbf24, size: 0.12, transparent: true, opacity: 0.9 })
  );
  group.add(sparkles);

  const instance = setupSimpleOrbit(containerElement, group, torusKnot, coreJewel, ring, sparkles, renderer, scene, camera);
  activeScenes.set(containerElement, instance);
  return instance;
}

/**
 * 3. 3D Coding Stage (Yoruba Hologram Code Cube & Cyber Matrix)
 */
export function init3DCodingCanvas(containerElement) {
  if (!containerElement) return null;
  cleanPreviousScene(containerElement);
  if (!isWebGLAvailable()) {
    renderFallbackVisual(containerElement, 'Indigenous Yoruba STEAM Hologram');
    return { destroy: () => { containerElement.innerHTML = ''; } };
  }

  const width = containerElement.clientWidth || 340;
  const height = containerElement.clientHeight || 280;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 5.5);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  containerElement.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambient);

  const cyanLight = new THREE.PointLight(0x06b6d4, 3, 10);
  cyanLight.position.set(3, 3, 3);
  scene.add(cyanLight);

  const greenLight = new THREE.PointLight(0x10b981, 3, 10);
  greenLight.position.set(-3, -3, 3);
  scene.add(greenLight);

  const group = new THREE.Group();
  scene.add(group);

  const cubeWire = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x10b981, wireframe: true, roughness: 0.1, metalness: 0.9 })
  );
  group.add(cubeWire);

  const crystal = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.7, 1),
    new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2, metalness: 0.85, emissive: 0x0e7490, emissiveIntensity: 0.5 })
  );
  group.add(crystal);

  const axisRing1 = new THREE.Mesh(
    new THREE.TorusGeometry(1.3, 0.03, 16, 48),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
  );
  group.add(axisRing1);

  const axisRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.45, 0.03, 16, 48),
    new THREE.MeshStandardMaterial({ color: 0x15764a, metalness: 0.9, roughness: 0.2 })
  );
  axisRing2.rotation.x = Math.PI / 2;
  group.add(axisRing2);

  const instance = setupSimpleOrbit(containerElement, group, cubeWire, crystal, axisRing1, axisRing2, renderer, scene, camera);
  activeScenes.set(containerElement, instance);
  return instance;
}

/**
 * 4. 3D Story & Culture Stage (Ancient Drum, Cowrie Shell & Magic Story Orb)
 */
export function init3DStoryCanvas(containerElement) {
  if (!containerElement) return null;
  cleanPreviousScene(containerElement);
  if (!isWebGLAvailable()) {
    renderFallbackVisual(containerElement, 'Living Story Orb & Oral Traditions');
    return { destroy: () => { containerElement.innerHTML = ''; } };
  }

  const width = containerElement.clientWidth || 360;
  const height = containerElement.clientHeight || 280;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 5.5);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  containerElement.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.95);
  scene.add(ambient);

  const warmLight = new THREE.PointLight(0xf59e0b, 3, 10);
  warmLight.position.set(3, 4, 3);
  scene.add(warmLight);

  const group = new THREE.Group();
  scene.add(group);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.85, 0.25, 70, 16, 2, 3),
    new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.8 })
  );
  group.add(knot);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x15764a, emissive: 0x064e3b, emissiveIntensity: 0.6, roughness: 0.1 })
  );
  group.add(core);

  const instance = setupSimpleOrbit(containerElement, group, knot, core, null, null, renderer, scene, camera);
  activeScenes.set(containerElement, instance);
  return instance;
}

/**
 * 5. Auto Mount Any 3D Element on Page
 */
export function autoMount3DElements() {
  const heroEl = document.getElementById('hero3DCanvasWrap');
  if (heroEl) init3DHeroCanvas(heroEl);

  const authEl = document.getElementById('auth3DCanvasWrap');
  if (authEl) init3DAuthCanvas(authEl);

  const codingEl = document.getElementById('coding3DCanvasWrap');
  if (codingEl) init3DCodingCanvas(codingEl);

  const storyEl = document.getElementById('story3DCanvasWrap');
  if (storyEl) init3DStoryCanvas(storyEl);

  const elements = document.querySelectorAll('[data-3d-scene]');
  elements.forEach((el) => {
    const sceneType = el.getAttribute('data-3d-scene');
    if (sceneType === 'hero' || sceneType === 'drum') {
      init3DHeroCanvas(el);
    } else if (sceneType === 'auth' || sceneType === 'shield') {
      init3DAuthCanvas(el);
    } else if (sceneType === 'coding' || sceneType === 'cube') {
      init3DCodingCanvas(el);
    } else if (sceneType === 'story' || sceneType === 'culture') {
      init3DStoryCanvas(el);
    }
  });
}

function setupOrbitControls(container, masterGroup, glyphs, drum, ring, particles, renderer, scene, camera) {
  let targetRotX = 0, targetRotY = 0, curRotX = 0, curRotY = 0;
  let isDragging = false, prevX = 0, prevY = 0;
  let animId = null;

  const onDown = (e) => {
    isDragging = true;
    prevX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    prevY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  };

  const onMove = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    if (isDragging) {
      targetRotY += (clientX - prevX) * 0.008;
      targetRotX += (clientY - prevY) * 0.008;
      prevX = clientX;
      prevY = clientY;
    } else {
      const rect = container.getBoundingClientRect();
      if (rect.width && rect.height) {
        targetRotY = ((clientX - rect.left) / rect.width - 0.5) * 0.8;
        targetRotX = -((clientY - rect.top) / rect.height - 0.5) * 0.6;
      }
    }
  };

  const onUp = () => { isDragging = false; };

  container.addEventListener('mousedown', onDown);
  container.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  container.addEventListener('touchstart', onDown, { passive: true });
  container.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onUp);

  let clock = 0;
  const animate = () => {
    animId = requestAnimationFrame(animate);
    clock += 0.02;

    curRotX += (targetRotX - curRotX) * 0.06;
    curRotY += (targetRotY - curRotY) * 0.06;

    masterGroup.rotation.y = curRotY + Math.sin(clock * 0.5) * 0.15;
    masterGroup.rotation.x = curRotX + Math.cos(clock * 0.4) * 0.1;

    if (drum) drum.rotation.y += 0.01;
    if (ring) ring.rotation.z += 0.005;

    if (glyphs && glyphs.length) {
      glyphs.forEach((sphere, idx) => {
        const angle = clock * 0.8 + (idx / 4) * Math.PI * 2;
        sphere.position.x = Math.cos(angle) * 2.2;
        sphere.position.z = Math.sin(angle) * 2.2;
        sphere.position.y = Math.sin(clock * 1.5 + idx) * 0.35;
        sphere.rotation.y += 0.02;
      });
    }

    if (particles) {
      particles.rotation.y -= 0.003;
      particles.rotation.x += 0.002;
    }

    renderer.render(scene, camera);
  };
  if (prefersReducedMotion()) {
    renderer.render(scene, camera);
  } else {
    animate();
  }

  const onResize = () => {
    const w = container.clientWidth || 360;
    const h = container.clientHeight || 340;
    if (w > 0 && h > 0) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
  };
  window.addEventListener('resize', onResize);

  let resizeObserver = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(container);
  }

  return {
    destroy: () => {
      if (animId) cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onDown);
      container.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      container.removeEventListener('touchstart', onDown);
      container.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('resize', onResize);
      if (resizeObserver) {
        try { resizeObserver.disconnect(); } catch (_) {}
      }
      renderer.dispose();
      container.innerHTML = '';
    }
  };
}

function setupSimpleOrbit(container, masterGroup, m1, m2, m3, m4, renderer, scene, camera) {
  let targetRotX = 0, targetRotY = 0, curRotX = 0, curRotY = 0;
  let isDragging = false, prevX = 0, prevY = 0;
  let animId = null;

  const onDown = (e) => {
    isDragging = true;
    prevX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    prevY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  };

  const onMove = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    if (isDragging) {
      targetRotY += (clientX - prevX) * 0.008;
      targetRotX += (clientY - prevY) * 0.008;
      prevX = clientX;
      prevY = clientY;
    } else {
      const rect = container.getBoundingClientRect();
      if (rect.width && rect.height) {
        targetRotY = ((clientX - rect.left) / rect.width - 0.5) * 0.8;
        targetRotX = -((clientY - rect.top) / rect.height - 0.5) * 0.6;
      }
    }
  };

  const onUp = () => { isDragging = false; };

  container.addEventListener('mousedown', onDown);
  container.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
  container.addEventListener('touchstart', onDown, { passive: true });
  container.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onUp);

  let clock = 0;
  const animate = () => {
    animId = requestAnimationFrame(animate);
    clock += 0.02;

    curRotX += (targetRotX - curRotX) * 0.06;
    curRotY += (targetRotY - curRotY) * 0.06;

    masterGroup.rotation.y = curRotY + Math.sin(clock * 0.5) * 0.15;
    masterGroup.rotation.x = curRotX + Math.cos(clock * 0.4) * 0.1;

    if (m1) m1.rotation.y += 0.012;
    if (m2) m2.rotation.x -= 0.01;
    if (m3) m3.rotation.z += 0.008;
    if (m4) m4.rotation.y -= 0.005;

    renderer.render(scene, camera);
  };
  if (prefersReducedMotion()) {
    renderer.render(scene, camera);
  } else {
    animate();
  }

  const onResize = () => {
    const w = container.clientWidth || 340;
    const h = container.clientHeight || 240;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  return {
    destroy: () => {
      if (animId) cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onDown);
      container.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      container.removeEventListener('touchstart', onDown);
      container.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      container.innerHTML = '';
    }
  };
}

/**
 * 6. 3D Audio Visualizer (Waveform Sphere & Frequency Rings)
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
    setPitch: (pitch) => { activePitch = pitch; },
    setSpeaking: (speaking) => { isSpeaking = speaking; },
    destroy: () => {
      if (animId) cancelAnimationFrame(animId);
      renderer.dispose();
    },
  };
}

/**
 * 7. Global 3D Interactive Card Tilt Engine (Perspective 3D Hover & Glare)
 */
export function init3DTiltEngine() {
  if (prefersReducedMotion()) return;
  const cards = document.querySelectorAll('.feature-card, .activity-card, .language-card, .c4k-hub-card, .yoruba-editor-card, .auth-clean-card, .stat-card, .proverb-card, .plan-card, .code-hero-3d-card, .vowels-3d-card, .teacher-profile-card, .learner-request-card, .role-portal-card');

  cards.forEach((card) => {
    if (card.__tiltInitialized) return;
    card.__tiltInitialized = true;

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

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

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
