// 3D Three.js Interactive Component & Cultural Canvas for Idilewa
import * as THREE from 'three';

export function init3DHeroCanvas(containerElement) {
  if (!containerElement) return null;

  // Clear previous canvas if any
  containerElement.innerHTML = '';

  const width = containerElement.clientWidth || 320;
  const height = containerElement.clientHeight || 260;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  containerElement.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0x15764a, 2.0);
  dirLight1.position.set(5, 5, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xd97706, 1.5);
  dirLight2.position.set(-5, -5, 2);
  scene.add(dirLight2);

  // Center Cultural Emblem (Torus Knot + Glowing Icosahedron)
  const knotGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 100, 16);
  const knotMat = new THREE.MeshStandardMaterial({
    color: 0x15764a,
    roughness: 0.25,
    metalness: 0.8,
    wireframe: false,
  });
  const knotMesh = new THREE.Mesh(knotGeo, knotMat);
  scene.add(knotMesh);

  // Inner Core Jewel
  const coreGeo = new THREE.IcosahedronGeometry(0.7, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.1,
    metalness: 0.9,
    emissive: 0x78350f,
    emissiveIntensity: 0.4,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  scene.add(coreMesh);

  // Orbiting Particles (African Bead Constellation)
  const particleCount = 40;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const beadColors = [
    new THREE.Color(0x15764a), // Forest Green
    new THREE.Color(0xeab308), // Gold/Amber
    new THREE.Color(0x0284c7), // Ocean Blue
    new THREE.Color(0xdc2626), // Coral Red
  ];

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 2.2 + Math.sin(i * 3) * 0.4;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

    const col = beadColors[i % beadColors.length];
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const onPointerMove = (e) => {
    const rect = containerElement.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    targetX = (x / rect.width) * 2;
    targetY = (y / rect.height) * 2;
  };

  containerElement.addEventListener('pointermove', onPointerMove);

  let animFrameId = null;
  const animate = () => {
    animFrameId = requestAnimationFrame(animate);

    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    knotMesh.rotation.x += 0.008;
    knotMesh.rotation.y += 0.012;
    knotMesh.rotation.z = mouseX * 0.5;

    coreMesh.rotation.y -= 0.015;
    coreMesh.rotation.x -= 0.01;

    particleSystem.rotation.z += 0.005;
    particleSystem.rotation.y = mouseY * 0.4;

    camera.position.x = mouseX * 0.8;
    camera.position.y = -mouseY * 0.8;
    camera.lookAt(scene.position);

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
      if (animFrameId) cancelAnimationFrame(animFrameId);
      containerElement.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerElement.innerHTML = '';
    },
  };
}

export function init3DAudioVisualizer(canvasElement) {
  if (!canvasElement) return null;

  const width = canvasElement.clientWidth || 300;
  const height = canvasElement.clientHeight || 150;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 2, 4);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x15764a, 2, 10);
  pointLight.position.set(0, 3, 2);
  scene.add(pointLight);

  // 12 3D Wave Bars
  const barCount = 12;
  const bars = [];
  const barGroup = new THREE.Group();

  for (let i = 0; i < barCount; i++) {
    const geo = new THREE.CylinderGeometry(0.08, 0.08, 1, 16);
    const col = i < 4 ? 0x0284c7 : i < 8 ? 0x15764a : 0xf59e0b; // Dò (Blue), Re (Green), Mí (Amber)
    const mat = new THREE.MeshStandardMaterial({
      color: col,
      roughness: 0.3,
      metalness: 0.6,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = (i - barCount / 2) * 0.28;
    mesh.position.y = 0.5;
    barGroup.add(mesh);
    bars.push(mesh);
  }

  scene.add(barGroup);

  let activePitch = 're';
  let isSpeaking = false;
  let animId = null;
  let time = 0;

  const animate = () => {
    animId = requestAnimationFrame(animate);
    time += 0.08;

    bars.forEach((bar, idx) => {
      let targetScale = 0.4;
      if (isSpeaking) {
        const offset = idx * 0.5;
        targetScale = 0.5 + Math.sin(time * 2 + offset) * 0.8 + Math.random() * 0.3;
      } else if (activePitch === 'low' || activePitch === 'do') {
        targetScale = idx < 4 ? 1.2 + Math.sin(time * 3 + idx) * 0.4 : 0.3;
      } else if (activePitch === 'high' || activePitch === 'mi') {
        targetScale = idx >= 8 ? 1.4 + Math.sin(time * 4 + idx) * 0.5 : 0.3;
      } else {
        targetScale = idx >= 4 && idx < 8 ? 1.1 + Math.sin(time * 3 + idx) * 0.3 : 0.4;
      }

      bar.scale.y += (targetScale - bar.scale.y) * 0.2;
      bar.position.y = bar.scale.y / 2;
    });

    barGroup.rotation.y = Math.sin(time * 0.5) * 0.2;
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
