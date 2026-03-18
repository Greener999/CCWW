let scene, camera, renderer, controls, envelopeBody, envelopeFlap;

function init() {
    // 1. 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // 2. 创建相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0.5, 2);

    // 3. 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 4. 控制器 (允许鼠标旋转)
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // 5. 灯光
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // 6. 创建信封 (米色材质)
    const material = new THREE.MeshStandardMaterial({ color: 0xeedcb2 });

    // 主体
    envelopeBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.05), material);
    scene.add(envelopeBody);

    // 盖子
    const flapGeo = new THREE.PlaneGeometry(1.2, 0.4);
    flapGeo.translate(0, 0.2, 0); // 移动旋转中心
    envelopeFlap = new THREE.Mesh(flapGeo, material);
    envelopeFlap.position.y = 0.4;
    envelopeFlap.rotation.x = Math.PI; // 默认盖上
    envelopeBody.add(envelopeFlap);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if(controls) controls.update();
    renderer.render(scene, camera);
}

// 点击网页任意地方开启/关闭信封
window.addEventListener('mousedown', () => {
    if (envelopeFlap.rotation.x !== 0) {
        envelopeFlap.rotation.x = 0;
    } else {
        envelopeFlap.rotation.x = Math.PI;
    }
});

init();
