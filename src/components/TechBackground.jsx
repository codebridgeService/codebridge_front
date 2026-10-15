'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function TechBackground() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for interactive tech network
    const mouse = {
      x: null,
      y: null,
      radius: 140,
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Tech Node Particle Class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.size = Math.random() * 2 + 1; // 1 to 3px
        this.baseSize = this.size;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseAngle = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges gently
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle pulsing of nodes
        this.pulseAngle += this.pulseSpeed;
        this.size = this.baseSize + Math.sin(this.pulseAngle) * 0.5;

        // Interactive mouse connection/reaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            // Gentle repulsive/orbital push
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.2;
            this.y -= (dy / dist) * force * 1.2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const isDark = theme === 'dark';
        ctx.fillStyle = isDark
          ? 'rgba(96, 165, 250, 0.7)' // Electric cyan in dark mode
          : 'rgba(55, 138, 221, 0.55)'; // Light-blue node in light mode
        ctx.fill();

        // Glowing outer halo on select nodes
        if (this.size > 2) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? 'rgba(55, 138, 221, 0.15)'
            : 'rgba(55, 138, 221, 0.12)';
          ctx.fill();
        }
      }
    }

    let particles = [];
    const initParticles = () => {
      particles = [];
      // Calculate responsive particle count (lighter on small screens)
      const particleDensity = width < 768 ? 28 : Math.min(55, Math.floor(width / 30));
      for (let i = 0; i < particleDensity; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    // Render loop
    const connectDistance = width < 768 ? 95 : 125;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';

      // Draw interactive connections between close particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDistance) {
            const alpha = (1 - dist / connectDistance) * (isDark ? 0.25 : 0.16);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(96, 165, 250, ${alpha})`
              : `rgba(55, 138, 221, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw line from particle to cursor if in range
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = particles[i].x - mouse.x;
          const mdy = particles[i].y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.radius) {
            const mAlpha = (1 - mdist / mouse.radius) * (isDark ? 0.35 : 0.22);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = isDark
              ? `rgba(96, 165, 250, ${mAlpha})`
              : `rgba(26, 35, 104, ${mAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const isDark = mounted && theme === 'dark';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: isDark ? 'var(--bg-main)' : '#FAFCFF', // Clean, crisp light color default
      }}
    >
      {/* 1. Precision Tech Grid Layer with Radial Fade Vignette */}
      <div
        className="absolute inset-0 opacity-[0.45] dark:opacity-[0.25]"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(to right, rgba(96, 165, 250, 0.12) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(96, 165, 250, 0.12) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(55, 138, 221, 0.08) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(55, 138, 221, 0.08) 1px, transparent 1px)`,
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 35%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 35%, black 40%, transparent 95%)',
        }}
      />

      {/* 2. Micro Tech Dot Matrix Intersections */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage: isDark
            ? `radial-gradient(rgba(147, 197, 253, 0.6) 1px, transparent 1px)`
            : `radial-gradient(rgba(55, 138, 221, 0.4) 1px, transparent 1px)`,
          backgroundSize: '108px 108px',
          backgroundPosition: '-1px -1px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 90%)',
        }}
      />

      {/* 3. Luminous Floating Ambient Glowing Orbs (Pure Light Elegance) */}
      {/* Top Center-Left Ambient Glow */}
      <div
        className="absolute -top-32 left-[10%] w-[520px] h-[520px] rounded-full blur-[110px] pointer-events-none transition-all duration-700 animate-tech-float-1"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(55, 138, 221, 0.28) 0%, rgba(26, 35, 104, 0) 70%)'
            : 'radial-gradient(circle, rgba(55, 138, 221, 0.14) 0%, rgba(147, 197, 253, 0.08) 45%, transparent 70%)',
        }}
      />

      {/* Top Right Cyan Glow */}
      <div
        className="absolute top-20 -right-24 w-[480px] h-[480px] rounded-full blur-[100px] pointer-events-none transition-all duration-700 animate-tech-float-2"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(96, 165, 250, 0.22) 0%, rgba(30, 58, 138, 0) 70%)'
            : 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(55, 138, 221, 0.05) 50%, transparent 70%)',
        }}
      />

      {/* Center-Bottom Subtle Navy Anchor Glow */}
      <div
        className="absolute top-[48%] left-[25%] w-[640px] h-[640px] rounded-full blur-[130px] pointer-events-none transition-all duration-700 opacity-60"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(30, 41, 106, 0.35) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(26, 35, 104, 0.05) 0%, rgba(55, 138, 221, 0.04) 50%, transparent 75%)',
        }}
      />

      {/* 4. Interactive Tech Particle & Neural Network Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block w-full h-full"
      />

      {/* 5. Delicate Horizontal Cyber Horizon Line Accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] opacity-40 dark:opacity-20 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(55, 138, 221, 0.4) 50%, transparent 100%)',
        }}
      />
    </div>
  );
}
