import { useRef, useEffect } from 'react';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Simple CSS-based 3D animation since Three.js would require additional setup
    const createFloatingCube = (index: number) => {
      const cube = document.createElement('div');
      cube.className = `absolute animate-spin-slow opacity-20 rounded-lg transform-gpu`;
      cube.style.cssText = `
        width: ${Math.random() * 60 + 20}px;
        height: ${Math.random() * 60 + 20}px;
        background: linear-gradient(45deg, 
          hsl(${Math.random() * 360}, 80%, 70%), 
          hsl(${(Math.random() * 60) + 200}, 90%, 80%)
        );
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 10 + 5}s;
        animation-delay: ${Math.random() * 5}s;
        transform: rotate3d(1, 1, 1, ${Math.random() * 360}deg);
      `;
      
      return cube;
    };

    // Create floating cubes
    const cubes: HTMLElement[] = [];
    for (let i = 0; i < 8; i++) {
      const cube = createFloatingCube(i);
      containerRef.current.appendChild(cube);
      cubes.push(cube);
    }

    // Animate cubes on voice interaction
    const animateOnVoice = () => {
      cubes.forEach((cube, index) => {
        const delay = index * 100;
        setTimeout(() => {
          cube.style.transform = `
            rotate3d(1, 1, 1, ${Math.random() * 360}deg) 
            scale(${Math.random() * 0.5 + 0.8})
            translate3d(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px, 0)
          `;
        }, delay);
      });
    };

    // Listen for voice events
    window.addEventListener('voice-start', animateOnVoice);
    window.addEventListener('voice-end', () => {
      cubes.forEach((cube) => {
        cube.style.transform = cube.style.transform.replace(/scale\([^)]*\)/, 'scale(1)');
      });
    });

    return () => {
      cubes.forEach(cube => cube.remove());
      window.removeEventListener('voice-start', animateOnVoice);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 70%, #0f0f23 100%)',
        backgroundAttachment: 'fixed'
      }}
    />
  );
}
