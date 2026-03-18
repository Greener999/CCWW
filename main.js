let scene, camera, renderer, controls, envelopeBody, envelopeFlap;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0.5, 2);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // 关键点：把 3D 画布放入 div 容器中
    const container = document.getElementById('canvas-container');
    if (container) {
        container.appendChild(renderer.domElement);
    } else {
        document.body.appendChild(renderer.domElement);
    }

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const material = new THREE.MeshStandardMaterial({ color: 0xeedcb2 });

    // 创建信封
    envelopeBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.05), material);
    scene.add(envelopeBody);

    const flapGeo = new THREE.PlaneGeometry(1.2, 0.4);
    flapGeo.translate(0, 0.2, 0); 
    envelopeFlap = new THREE.Mesh(flapGeo, material);
    envelopeFlap.position.y = 0.4;
    envelopeFlap.rotation.x = Math.PI - 0.1; 
    envelopeBody.add(envelopeFlap);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

window.addEventListener('click', () => {
    if (envelopeFlap.rotation.x > 0.5) {
        envelopeFlap.rotation.x = 0; // 打开
    } else {
        envelopeFlap.rotation.x = Math.PI - 0.1; // 合上
    }
});

init();
