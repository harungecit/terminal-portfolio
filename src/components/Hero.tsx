import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedText3D() {
  const mesh = useRef();
  
  useEffect(() => {
    if (mesh.current) {
      mesh.current.rotation.x = -0.5;
    }
  }, []);

  return (
    <Center>
      <Text3D
        ref={mesh}
        font="/fonts/helvetiker_regular.typeface.json"
        size={1.5}
        height={0.2}
        curveSegments={12}
      >
        {`< Full Stack />`}
        <meshStandardMaterial color="#9333ea" />
      </Text3D>
    </Center>
  );
}

function Scene() {
  return (
    <>
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0}
        fade
        speed={1}
      />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <AnimatedText3D />
    </>
  );
}

function FloatingText({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 100 
      }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div 
      ref={containerRef}
      style={{ opacity }}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      <motion.div 
        style={{ y }}
        className="absolute inset-0"
      >
        <Canvas>
          <Scene />
        </Canvas>
      </motion.div>
      
      <div className="relative z-10 text-center text-white px-4">
        <FloatingText>
          <h1 className="text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600">
            Full Stack Developer
          </h1>
        </FloatingText>
        
        <FloatingText delay={0.2}>
          <p className="text-2xl mb-8 text-gray-300">
            Building the future of web applications
          </p>
        </FloatingText>
        
        <FloatingText delay={0.4}>
          <motion.div 
            className="flex flex-wrap gap-6 justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#skills" 
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              Explore Skills
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact" 
              className="px-8 py-3 border-2 border-purple-600 rounded-full hover:bg-purple-600/20 transition-all duration-300"
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </FloatingText>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-white/50"
        >
          ↓ Scroll to explore
        </motion.div>
      </motion.div>
    </motion.div>
  );
}