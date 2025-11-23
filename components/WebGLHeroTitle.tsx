import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from '../shaders/heroShaders';

interface WebGLHeroTitleProps {
    text: string;
}

const WebGLHeroTitle: React.FC<WebGLHeroTitleProps> = ({ text }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 2;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        // Create Text Texture
        const createTextTexture = (text: string) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;

            // High resolution canvas for sharp text
            canvas.width = 2048;
            canvas.height = 1024;

            // Draw Text
            ctx.fillStyle = 'transparent';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Use Impact or heavy font for that blocky look
            ctx.font = '400px "Impact", "Arial Black", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';

            // Draw text centered
            ctx.fillText(text, canvas.width / 2, canvas.height / 2);

            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;
            return texture;
        };

        const texture = createTextTexture(text);

        // Create Mesh with Custom Shader
        // Wider geometry for the text
        const geometry = new THREE.PlaneGeometry(6, 3, 64, 64);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uTexture: { value: texture },
                uHover: { value: 0 },
                uScrollSpeed: { value: 0 }
            },
            transparent: true,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Animation Loop
        const clock = new THREE.Clock();
        let animationFrameId: number;
        let lastScrollY = window.scrollY;
        let scrollSpeed = 0;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            const time = clock.getElapsedTime();

            // Update Uniforms
            material.uniforms.uTime.value = time;

            // Smooth hover transition
            material.uniforms.uHover.value = THREE.MathUtils.lerp(
                material.uniforms.uHover.value,
                isHovered ? 1.0 : 0.0,
                0.05
            );

            // Scroll speed calculation and decay
            const currentScrollY = window.scrollY;
            const deltaY = currentScrollY - lastScrollY;
            scrollSpeed = THREE.MathUtils.lerp(scrollSpeed, deltaY * 0.1, 0.1);
            material.uniforms.uScrollSpeed.value = scrollSpeed;
            lastScrollY = currentScrollY;

            // Subtle floating, less rotation than before to keep it readable like the ref
            mesh.position.y = Math.sin(time * 0.5) * 0.1;
            // Very slight tilt
            mesh.rotation.x = Math.sin(time * 0.2) * 0.02;
            mesh.rotation.y = Math.cos(time * 0.3) * 0.02;

            renderer.render(scene, camera);
        };

        animate();

        // Handle Resize
        const handleResize = () => {
            if (!mountRef.current) return;
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            if (texture) texture.dispose();
            renderer.dispose();
        };
    }, [text, isHovered]);

    return (
        <div
            ref={mountRef}
            className="w-full h-64 md:h-80 relative z-10 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="heading"
            aria-label={text}
        />
    );
};

export default WebGLHeroTitle;
