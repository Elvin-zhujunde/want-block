import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function SU7(props) {
  const gltf = useLoader(GLTFLoader, "/static/gtlb/su7/scene.gltf");
  return <primitive object={gltf.scene} />;
}
