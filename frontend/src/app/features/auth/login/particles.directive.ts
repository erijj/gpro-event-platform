import { Directive, ElementRef, OnDestroy, afterNextRender } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

@Directive({
  selector: '[appParticles]',
  standalone: true,
})
export class ParticlesDirective implements OnDestroy {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId = 0;
  private particles: Particle[] = [];
  private resizeObserver: ResizeObserver | null = null;

  private readonly COLORS = [
    'rgba(179, 64, 31,',   // ember
    'rgba(255, 196, 107,', // amber
    'rgba(255, 122, 42,',  // flame-orange
    'rgba(255, 206, 90,',  // flame-gold
  ];

  private readonly PARTICLE_COUNT = 120;

  constructor(el: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      this.init(el.nativeElement);
    });
  }

  private init(host: HTMLElement): void {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    host.style.position = 'relative';
    host.insertBefore(this.canvas, host.firstChild);

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.resize();
    this.spawnParticles();
    this.animate();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
  }

  private resize(): void {
    if (!this.canvas || !this.ctx) return;
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    this.canvas.width = w;
    this.canvas.height = h;
  }

  private spawnParticles(): void {
    this.particles = [];
    for (let i = 0; i < this.PARTICLE_COUNT; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    return {
      x: Math.random() * (this.canvas?.width ?? 800),
      y: Math.random() * (this.canvas?.height ?? 600),
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      color: this.COLORS[Math.floor(Math.random() * this.COLORS.length)],
    };
  }

  private animate = (): void => {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      // wrap around
      if (p.y < -10) {
        p.y = this.canvas.height + 10;
        p.x = Math.random() * this.canvas.width;
      }
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.color} ${p.alpha})`;
      this.ctx.fill();
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  ngOnDestroy(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.canvas?.parentElement) this.canvas.parentElement.removeChild(this.canvas);
  }
}
