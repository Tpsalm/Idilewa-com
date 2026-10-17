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

export function init3DCodeRobotGlyphs(containerElement) {
  if (!containerElement) return null;
  cleanPreviousScene(containerElement);
  if (!isWebGLAvailable()) return null;

  const stageElement = containerElement.closest('.c4k-code-robot-stage') || containerElement;
  const width = containerElement.clientWidth || 760;
  const height = containerElement.clientHeight || 420;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(0, 0, 6.4);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  containerElement.appendChild(renderer.domElement);
  stageElement.setAttribute('data-webgl-ready', 'true');

  scene.add(new THREE.AmbientLight(0xffffff, 1.1));
  const emeraldLight = new THREE.PointLight(0x16a365, 3.5, 12);
  emeraldLight.position.set(-3, 2, 4);
  scene.add(emeraldLight);
  const goldLight = new THREE.PointLight(0xf5b942, 3, 12);
  goldLight.position.set(3, -2, 3);
  scene.add(goldLight);

  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  let animationId = null;
  let elapsed = 0;
  let pointerX = 0;
  let pointerY = 0;
  let resizeObserver = null;
  let destroyed = false;
  const robotGroup = new THREE.Group();
  robotGroup.position.y = -0.12;
  scene.add(robotGroup);
  const shellMaterial = new THREE.MeshStandardMaterial({ color: 0xf4f8f4, roughness: 0.24, metalness: 0.18 });
  const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x1687bf, roughness: 0.22, metalness: 0.42, emissive: 0x073d68, emissiveIntensity: 0.2 });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x101d2c, roughness: 0.2, metalness: 0.28 });
  const cyanMaterial = new THREE.MeshStandardMaterial({ color: 0x79efff, roughness: 0.16, emissive: 0x31dfff, emissiveIntensity: 1.1 });
  const goldMaterial = new THREE.MeshStandardMaterial({ color: 0xeab946, roughness: 0.32, metalness: 0.38 });
  const tabletMaterial = new THREE.MeshStandardMaterial({ color: 0x263444, roughness: 0.3, metalness: 0.42 });
  const addEllipsoid = (parent, material, position, scale) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), material);
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    parent.add(mesh);
    return mesh;
  };
  const addBox = (parent, material, position, size, radius = 0) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position);
    parent.add(mesh);
    if (radius) mesh.rotation.z = radius;
    return mesh;
  };
  const addCylinder = (parent, material, position, size, rotation = 0) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(size[0], size[1], size[2], 20), material);
    mesh.position.set(...position);
    mesh.rotation.z = rotation;
    parent.add(mesh);
    return mesh;
  };

  addEllipsoid(robotGroup, shellMaterial, [0, -0.08, 0], [0.72, 0.77, 0.46]);
  addEllipsoid(robotGroup, goldMaterial, [0, -0.12, 0.46], [0.2, 0.2, 0.07]);
  addCylinder(robotGroup, blueMaterial, [0, 0.62, 0], [0.24, 0.27, 0.22]);

  const robotHead = new THREE.Group();
  robotHead.position.set(0, 1.08, 0);
  robotGroup.add(robotHead);
  addEllipsoid(robotHead, shellMaterial, [0, 0, 0], [1.1, 0.83, 0.58]);
  addEllipsoid(robotHead, darkMaterial, [0, -0.01, 0.49], [0.82, 0.57, 0.16]);
  for (const side of [-1, 1]) {
    addEllipsoid(robotHead, blueMaterial, [side * 1.06, -0.04, 0], [0.28, 0.4, 0.29]);
    addEllipsoid(robotHead, goldMaterial, [side * 1.16, -0.04, 0.02], [0.09, 0.22, 0.25]);
  }
  const eyePupils = [-1, 1].map((side) => {
    const pupilGroup = new THREE.Group();
    pupilGroup.userData.side = side;
    pupilGroup.position.set(side * 0.39, 0.03, 0.67);
    robotHead.add(pupilGroup);
    addEllipsoid(pupilGroup, cyanMaterial, [0, 0, 0], [0.17, 0.22, 0.075]);
    addEllipsoid(pupilGroup, darkMaterial, [0, 0, 0.07], [0.07, 0.12, 0.035]);
    addEllipsoid(pupilGroup, shellMaterial, [-0.035, 0.045, 0.11], [0.026, 0.035, 0.015]);
    return pupilGroup;
  });
  addEllipsoid(robotHead, cyanMaterial, [0, -0.39, 0.64], [0.12, 0.035, 0.025]);
  addCylinder(robotHead, darkMaterial, [0.72, 0.93, 0], [0.035, 0.045, 0.43], -0.12);
  addEllipsoid(robotHead, goldMaterial, [0.75, 1.16, 0], [0.1, 0.1, 0.1]);

  for (const side of [-1, 1]) {
    addEllipsoid(robotGroup, blueMaterial, [side * 0.62, 0.25, 0.08], [0.33, 0.34, 0.34]);
    addCylinder(robotGroup, shellMaterial, [side * 0.7, -0.05, 0.12], [0.18, 0.23, 0.58], side * -0.34);
    addEllipsoid(robotGroup, shellMaterial, [side * 0.54, -0.48, 0.45], [0.21, 0.18, 0.2]);
    addCylinder(robotGroup, blueMaterial, [side * 0.34, -1.05, 0], [0.2, 0.23, 0.56], side * 0.04);
    addEllipsoid(robotGroup, shellMaterial, [side * 0.37, -1.42, 0.1], [0.31, 0.16, 0.38]);
  }
  addBox(robotGroup, tabletMaterial, [0, -0.49, 0.57], [1.03, 0.75, 0.13], -0.05);
  addBox(robotGroup, blueMaterial, [0, -0.49, 0.65], [0.83, 0.52, 0.035], -0.05);
  addBox(robotGroup, cyanMaterial, [0, -0.34, 0.68], [0.46, 0.045, 0.02]);
  addBox(robotGroup, goldMaterial, [0, -0.48, 0.68], [0.58, 0.035, 0.02]);

  const glyphSpecs = [
    { text: '</>', color: 0x087e9b },
    { text: '{ }', color: 0x16834d },
    { text: 'JS', color: 0xe4a82f },
    { text: 'PY', color: 0x167fa2 },
    { text: 'CSS', color: 0x16834d },
    { text: 'HTML', color: 0xd88c21 }
  ];
  const glyphs = glyphSpecs.map(({ text, color }, index) => {
    const token = new THREE.Group();
    const coin = new THREE.Mesh(
      new THREE.SphereGeometry(0.31, 24, 18),
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.24,
        metalness: 0.74,
        emissive: color,
        emissiveIntensity: 0.22
      })
    );
    token.add(coin);

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#ffffff';
      context.font = '800 70px "Fira Code", monospace';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.shadowColor = 'rgba(0, 0, 0, 0.45)';
      context.shadowBlur = 8;
      context.fillText(text, canvas.width / 2, canvas.height / 2 + 3);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.64, 0.32),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide })
    );
    label.position.z = 0.36;
    token.add(label);
    token.userData.side = index % 2 === 0 ? -1 : 1;
    token.userData.row = Math.floor(index / 2) - 1;
    token.userData.orbitOffset = (index / 2) * Math.PI;
    orbitGroup.add(token);
    return token;
  });

  const particleCount = 72;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let index = 0; index < particleCount; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 2;
    particlePositions[index * 3] = Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 3.2;
    particlePositions[index * 3 + 2] = (Math.random() - 0.5) * 1.4;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0xe2ad42,
      size: 0.045,
      transparent: true,
      opacity: 0.72,
      sizeAttenuation: true
    })
  );
  scene.add(particles);

  const renderFrame = () => {
    animationId = null;
    if (destroyed || !containerElement.isConnected) {
      destroy();
      return;
    }
    elapsed += 0.016;
    orbitGroup.rotation.y = Math.sin(elapsed * 0.35) * 0.08 + pointerX * 0.035;
    orbitGroup.rotation.x = Math.cos(elapsed * 0.3) * 0.045 + pointerY * 0.025;
    robotGroup.position.y = -0.12 + Math.sin(elapsed * 0.75) * 0.055;
    robotGroup.rotation.y = Math.sin(elapsed * 0.38) * 0.08 + pointerX * 0.2;
    robotGroup.rotation.x = Math.cos(elapsed * 0.42) * 0.025 - pointerY * 0.12;
    eyePupils.forEach((pupilGroup) => {
      pupilGroup.position.x = pupilGroup.userData.side * 0.39 + pointerX * 0.11;
      pupilGroup.position.y = 0.03 - pointerY * 0.08;
    });
    glyphs.forEach((glyph) => {
      const phase = elapsed * 0.72 + glyph.userData.orbitOffset;
      const aspectScale = Math.min(1, Math.max(0.68, containerElement.clientWidth / Math.max(containerElement.clientHeight, 1)));
      glyph.position.set(
        glyph.userData.side * (2.3 * aspectScale + Math.sin(phase) * 0.1),
        glyph.userData.row * 0.82 + Math.sin(phase * 1.2) * 0.16,
        Math.cos(phase) * 0.48
      );
      glyph.rotation.y = -glyph.userData.side * 0.16 + Math.sin(phase) * 0.16;
      glyph.rotation.x = Math.sin(phase * 0.8) * 0.1;
    });
    particles.rotation.y = elapsed * 0.018;
    particles.rotation.z = Math.sin(elapsed * 0.18) * 0.025;
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(renderFrame);
  };

  const onPointerMove = (event) => {
    pointerX = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1));
    pointerY = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight) * 2 - 1));
  };
  const onPointerLeave = () => {
    pointerX = 0;
    pointerY = 0;
  };
  const onResize = () => {
    const nextWidth = containerElement.clientWidth;
    const nextHeight = containerElement.clientHeight;
    if (!nextWidth || !nextHeight) return;
    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight);
    if (prefersReducedMotion()) renderer.render(scene, camera);
  };
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    if (animationId !== null) cancelAnimationFrame(animationId);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('blur', onPointerLeave);
    window.removeEventListener('resize', onResize);
    resizeObserver?.disconnect();
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          material.map?.dispose();
          material.dispose();
        });
      }
    });
    renderer.dispose();
    renderer.domElement.remove();
    stageElement.removeAttribute('data-webgl-ready');
    stageElement.removeAttribute('data-3d-robot-ready');
    if (activeScenes.get(containerElement)?.destroy === destroy) activeScenes.delete(containerElement);
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('blur', onPointerLeave);
  window.addEventListener('resize', onResize);
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(containerElement);
  }

  const instance = { destroy };
  activeScenes.set(containerElement, instance);
  if (prefersReducedMotion()) {
    glyphs.forEach((glyph, index) => {
      glyph.position.set(glyph.userData.side * 2.3, glyph.userData.row * 0.82, 0);
    });
    robotGroup.position.set(0, -0.12, 0);
    robotGroup.rotation.set(0, 0, 0);
    eyePupils.forEach((pupilGroup) => { pupilGroup.position.x = pupilGroup.userData.side * 0.39; });
    renderer.render(scene, camera);
  } else {
    renderFrame();
  }
  return instance;
}

/**
 * 2. 3D Authentication Scene (Rotating African language globe)
 */
export function init3DAuthCanvas(containerElement) {
  if (!containerElement) return null;
  cleanPreviousScene(containerElement);
  if (!isWebGLAvailable()) return null;

  const width = containerElement.clientWidth || 360;
  const height = containerElement.clientHeight || 300;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 0, 5.1);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  containerElement.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xe7fff0, 1.45));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(-3, 4, 5);
  scene.add(keyLight);
  const greenLight = new THREE.PointLight(0x34d399, 2.8, 8);
  greenLight.position.set(2, -1, 3);
  scene.add(greenLight);

  const world = new THREE.Group();
  world.position.y = 0.1;
  scene.add(world);

  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1.12, 48, 40),
    new THREE.MeshPhongMaterial({ color: 0x79d6aa, transparent: true, opacity: 0.16, shininess: 90 })
  );
  world.add(globe);

  const grid = new THREE.Mesh(
    new THREE.SphereGeometry(1.135, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0xe8fff4, wireframe: true, transparent: true, opacity: 0.12 })
  );
  world.add(grid);

  const continentShapes = [
    [[-18, 36], [-6, 36], [10, 38], [25, 32], [33, 31], [44, 12], [51, 11], [44, -2], [42, -12], [35, -22], [30, -34], [19, -35], [12, -18], [8, -5], [2, 5], [-9, 5], [-17, 15], [-18, 28]],
    [[-10, 36], [-8, 54], [2, 60], [14, 56], [26, 48], [36, 42], [32, 31], [21, 37], [10, 38]],
    [[-82, 10], [-78, 31], [-66, 50], [-53, 52], [-48, 39], [-58, 23], [-72, 8]],
    [[-80, 10], [-67, 8], [-50, 0], [-45, -13], [-54, -30], [-68, -55], [-76, -35], [-79, -10]],
    [[112, -11], [130, -12], [145, -20], [153, -29], [145, -39], [130, -35], [115, -25]],
    [[-8, 58], [20, 72], [62, 68], [90, 58], [125, 50], [145, 42], [150, 18], [130, 5], [110, 12], [95, 5], [80, 8], [65, 23], [48, 30], [35, 42], [20, 38], [8, 52]]
  ];
  const isInsidePolygon = (longitude, latitude, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      const crosses = (yi > latitude) !== (yj > latitude)
        && longitude < ((xj - xi) * (latitude - yi)) / (yj - yi) + xi;
      if (crosses) inside = !inside;
    }
    return inside;
  };
  const landPositions = [];
  for (let latitude = -58; latitude <= 74; latitude += 2.8) {
    for (let longitude = -180; longitude <= 180; longitude += 2.8) {
      if (!continentShapes.some((shape) => isInsidePolygon(longitude, latitude, shape))) continue;
      const lat = THREE.MathUtils.degToRad(latitude);
      const lon = THREE.MathUtils.degToRad(longitude);
      const radius = 1.151;
      landPositions.push(
        radius * Math.cos(lat) * Math.sin(lon),
        radius * Math.sin(lat),
        radius * Math.cos(lat) * Math.cos(lon)
      );
    }
  }
  const landGeometry = new THREE.BufferGeometry();
  landGeometry.setAttribute('position', new THREE.Float32BufferAttribute(landPositions, 3));
  const land = new THREE.Points(
    landGeometry,
    new THREE.PointsMaterial({ color: 0x0c6849, size: 0.028, transparent: true, opacity: 0.6, sizeAttenuation: true })
  );
  world.add(land);
  world.scale.setScalar(0.82);

  const orbit = new THREE.Group();
  orbit.rotation.set(0.55, 0.18, -0.42);
  scene.add(orbit);
  const orbitRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.52, 0.012, 8, 128),
    new THREE.MeshBasicMaterial({ color: 0xf5d77c, transparent: true, opacity: 0.56 })
  );
  orbit.add(orbitRing);
  const secondRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.39, 0.007, 6, 128),
    new THREE.MeshBasicMaterial({ color: 0xd9fff0, transparent: true, opacity: 0.45 })
  );
  secondRing.rotation.set(0.8, 0.25, 0.7);
  orbit.add(secondRing);

  const satellites = [];
  for (let index = 0; index < 4; index += 1) {
    const satellite = new THREE.Mesh(
      new THREE.IcosahedronGeometry(index === 0 ? 0.09 : 0.065, 1),
      new THREE.MeshStandardMaterial({
        color: index % 2 ? 0xf6d16b : 0xf1fff6,
        emissive: index % 2 ? 0x8a5b11 : 0x166044,
        emissiveIntensity: 0.38,
        metalness: 0.24,
        roughness: 0.28
      })
    );
    orbit.add(satellite);
    satellites.push(satellite);
  }

  const particlePositions = new Float32Array(72 * 3);
  for (let index = 0; index < 72; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.72 + Math.random() * 0.82;
    particlePositions[index * 3] = Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = (Math.random() - 0.5) * 3.3;
    particlePositions[index * 3 + 2] = Math.sin(angle) * radius * 0.52;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: 0xffe49a, size: 0.025, transparent: true, opacity: 0.84 })
  );
  scene.add(particles);

  let animationFrame = 0;
  let resizeObserver = null;
  const resize = () => {
    const nextWidth = containerElement.clientWidth;
    const nextHeight = containerElement.clientHeight;
    if (!nextWidth || !nextHeight) return;
    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(nextWidth, nextHeight);
  };
  window.addEventListener('resize', resize);
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(containerElement);
  }

  const renderFrame = (time) => {
    animationFrame = requestAnimationFrame(renderFrame);
    const seconds = time * 0.001;
    world.rotation.y = seconds * 0.32;
    world.rotation.x = 0.2 + Math.sin(seconds * 0.5) * 0.035;
    orbit.rotation.y = seconds * -0.21;
    orbitRing.rotation.z = seconds * 0.12;
    satellites.forEach((satellite, index) => {
      const angle = seconds * 0.72 + (index / satellites.length) * Math.PI * 2;
      satellite.position.set(Math.cos(angle) * 1.52, Math.sin(angle * 1.35) * 0.12, Math.sin(angle) * 1.52);
      satellite.rotation.set(angle, angle * 0.8, 0);
    });
    particles.rotation.y = seconds * 0.025;
    particles.rotation.x = Math.sin(seconds * 0.15) * 0.035;
    renderer.render(scene, camera);
  };
  if (prefersReducedMotion()) renderer.render(scene, camera);
  else animationFrame = requestAnimationFrame(renderFrame);

  const instance = {
    destroy: () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      if (resizeObserver) resizeObserver.disconnect();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material?.dispose());
      });
      renderer.dispose();
      containerElement.innerHTML = '';
    }
  };
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

  const storyEl = document.getElementById('story3DCanvasWrap');
  if (storyEl) init3DStoryCanvas(storyEl);

  const elements = document.querySelectorAll('[data-3d-scene]');
  elements.forEach((el) => {
    const sceneType = el.getAttribute('data-3d-scene');
    if (sceneType === 'hero' || sceneType === 'drum') {
      init3DHeroCanvas(el);
    } else if (sceneType === 'auth' || sceneType === 'shield') {
      init3DAuthCanvas(el);
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
