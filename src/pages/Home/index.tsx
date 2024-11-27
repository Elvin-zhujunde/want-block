import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

function Home() {
  // 使用正确的类型声明
  const threeRoot = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!threeRoot.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5; // 设置相机位置
    
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    threeRoot.current.appendChild(renderer.domElement);
    
    // 创建GLTF加载器对象
    const loader = new GLTFLoader();
    
    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    
    // 添加平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);
    
    // 创建轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    
    // 加载模型
    loader.load(
      "/static/su7/scene.gltf",
      (gltf: GLTF) => {
        console.log("模型加载成功:", gltf);
        scene.add(gltf.scene);
        
        // 自动调整相机位置以适应模型
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.z = maxDim * 2;
        
        // 将模型居中
        gltf.scene.position.x = -center.x;
        gltf.scene.position.y = -center.y;
        gltf.scene.position.z = -center.z;
      },
      (progress) => {
        console.log("加载进度:", (progress.loaded / progress.total) * 100 + "%");
      },
      (error) => {
        console.error("模型加载错误:", error);
      }
    );
    
    // 动画循环
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
    
    // 处理窗口大小变化
    function handleResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener("resize", handleResize);
    
    // 清理函数
    return () => {
      window.removeEventListener("resize", handleResize);
      threeRoot.current?.removeChild(renderer.domElement);
      controls.dispose();
    };
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <div ref={threeRoot} style={{ width: "100%", height: "100vh" }}></div>
    </div>
  );
}

export default Home;
