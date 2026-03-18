// 核心 Three.js 变量
let scene, camera, renderer, controls;
let envelopeBody, envelopeFlap, stamp, letter;
let isOpened = false;
let isLetterPulledOut = false;

// 初始化 3D 场景
function init() {
    // 1. 场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // 设置背景颜色

    // 2. 相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0.5, 2); // 设置相机初始位置

    // 3. 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // 4. 控制 (3D 环绕查看)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 增加平滑感

    // 5. 灯光
    const ambientLight = new THREE.AmbientLight(0xffxffx, 0.5); // 环境光
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // 平行光
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // 6. 纹理加载器
    const textureLoader = new THREE.TextureLoader();

    // ==========================================
    // 7. 创建 3D 物体 (信封部分)
    // ==========================================

    // 加载纹理 (请确保你的路径正确)
    // const envTexture = textureLoader.load('textures/envelope_texture.jpg');
    // const stampTexture = textureLoader.load('textures/stamp_texture.jpg');

    // 这里使用临时颜色作为占位符，你需要在本地替换为真实的纹理
    const material = new THREE.MeshStandardMaterial({ color: 0xeedcb2 }); // 信封黄色
    const flapMaterial = new THREE.MeshStandardMaterial({ color: 0xddcbaa }); // 信封盖子稍微深一点点
    const stampMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // 邮票红色占位

    // 信封主体 (一个扁平的六面体)
    const bodyGeometry = new THREE.BoxGeometry(1.2, 0.8, 0.02);
    envelopeBody = new THREE.Mesh(bodyGeometry, material);
    scene.add(envelopeBody);

    // 信封盖子 (可以使用一个平面的旋转来实现)
    const flapGeometry = new THREE.PlaneGeometry(1.2, 0.4);
    envelopeFlap = new THREE.Mesh(flapGeometry, flapMaterial);
    
    // 设置盖子的旋转点在底部
    envelopeFlap.position.y = 0.4; // 将平面移至主体上方
    envelopeFlap.geometry.translate(0, 0.2, 0); // 将几何体中心移至底部，作为旋转轴
    envelopeFlap.rotation.x = Math.PI; // 初始状态是合上的
    envelopeBody.add(envelopeFlap); // 将盖子作为主体的子物体，这样会一起移动

    // 邮票 (一个更小的扁平六面体)
    const stampGeometry = new THREE.BoxGeometry(0.2, 0.25, 0.005);
    stamp = new THREE.Mesh(stampGeometry, stampMaterial);
    stamp.position.set(0.4, 0.25, 0.015); // 放置在信封正面右上角
    envelopeBody.add(stamp);

    // ==========================================
    // 8. 创建 3D 物体 (信件内容)
    // ==========================================
    const letterGeometry = new THREE.PlaneGeometry(1.1, 0.7);
    const letterMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    letter = new THREE.Mesh(letterGeometry, letterMaterial);
    letter.position.set(0, 0, 0.005); // 稍微偏一点，初始藏在信封里
    scene.add(letter);

    // 监听窗口大小变化
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

// ==========================================
// 交互动画逻辑
// ==========================================

function openEnvelope() {
    // 使用简单的动画 (实际项目中可以使用 GSAP 库实现更复杂的过渡)
    const openAnim = setInterval(() => {
        envelopeFlap.rotation.x -= 0.1;
        if (envelopeFlap.rotation.x <= 0) {
            clearInterval(openAnim);
            isOpened = true;
            
            // 显示查看内容的按钮
            document.getElementById('open-btn').classList.add('hidden');
            document.getElementById('view-content-1').classList.remove('hidden');
            document.getElementById('view-content-2').classList.remove('hidden');
        }
    }, 16);
}

function viewContent(contentType) {
    if (!isOpened || isLetterPulledOut) return;

    // 1. 信件“拿出”动画
    const pullOutAnim = setInterval(() => {
        letter.position.y += 0.05;
        letter.position.z += 0.01; // 稍微拉近一点
        if (letter.position.y >= 0.8) {
            clearInterval(pullOutAnim);
            isLetterPulledOut = true;

            // 2. 显示全屏遮罩层
            const overlay = document.getElementById('overlay');
            const contentImg = document.getElementById('content-image');
            
            // 根据 contentType 加载不同的内容图片
            // contentImg.src = `textures/letter_content_${contentType}.jpg`;
            // 这里使用一个占位图，请你替换成你自己的图片路径
            contentImg.src = "https://via.placeholder.com/600x800.png?text=Letter+Content+" + contentType;
            
            overlay.classList.remove('hidden');
            document.getElementById('close-content').classList.remove('hidden');
        }
    }, 16);
}

function closeOverlay() {
    document.getElementById('overlay').classList.add('hidden');
    document.getElementById('close-content').classList.add('hidden');
    
    // 将 3D 信件归位
    letter.position.set(0, 0, 0.005);
    isLetterPulledOut = false;
}

// ==========================================
// 主循环和事件
// ==========================================

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // 必须更新 OrbitControls
    renderer.render(scene, camera);
}

// 绑定按钮事件
document.getElementById('open-btn').addEventListener('click', openEnvelope);
document.getElementById('view-content-1').addEventListener('click', () => viewContent('1'));
document.getElementById('view-content-2').addEventListener('click', () => viewContent('2'));
document.getElementById('close-content').addEventListener('click', closeOverlay);

// 初始化
init();
