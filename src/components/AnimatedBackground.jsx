import { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Configurar el canvas para que ocupe toda la ventana
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Función para inicializar las partículas
    const initParticles = () => {
      for (let i = 0; i < 20; i++) {
        particles.current.push(new Particle(canvas, ctx));
      }
    };

    // Clase Particle
    class Particle {
      constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.radius = Math.random() * 8 + 20; // Tamaño aleatorio para círculos
        this.side = Math.random() * 2 + 12; // Lado aleatorio para cuadrados
        this.color = generateRandomColor(); // Color aleatorio
        this.type = Math.floor(Math.random() * 3); // 0 para círculos, 1 para cuadrados, 2 para triángulos
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > this.canvas.width) {
          this.speedX = -this.speedX;
        }

        if (this.y < 0 || this.y > this.canvas.height) {
          this.speedY = -this.speedY;
        }
      }

      draw() {
        this.ctx.beginPath();
        if (this.type === 0) {
          // Dibujar círculo
          this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        } else if (this.type === 1) {
          // Dibujar cuadrado
          this.ctx.rect(
            this.x - this.side / 2,
            this.y - this.side / 2,
            this.side,
            this.side
          );
        } else {
          // Dibujar triángulo
          this.ctx.moveTo(this.x, this.y - this.radius);
          this.ctx.lineTo(
            this.x - (this.radius * Math.sqrt(3)) / 2,
            this.y + this.radius / 2
          );
          this.ctx.lineTo(
            this.x + (this.radius * Math.sqrt(3)) / 2,
            this.y + this.radius / 2
          );
          this.ctx.closePath();
        }
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
      }
    }

    // Función para animar las partículas
    const animateParticles = () => {
      requestAnimationFrame(animateParticles);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle) => {
        particle.update();
        particle.draw();
      });
    };

    const generateRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    // Iniciar las partículas y la animación
    initParticles();
    animateParticles();

    // Evento de redimensionamiento de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.current = []; // Limpiar las partículas
      initParticles(); // Volver a inicializar las partículas
    };

    window.addEventListener("resize", resizeCanvas);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="background"
      style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
    />
  );
};

export default AnimatedBackground;
