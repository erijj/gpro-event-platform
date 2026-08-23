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
  selector: '[appHeroBackground]',
  standalone: true,
})
export class HeroBackgroundDirective implements OnDestroy {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId = 0;
  private particles: Particle[] = [];
  private resizeObserver: ResizeObserver | null = null;

  private readonly COLORS = [
    'rgba(179, 64, 31,',
    'rgba(255, 196, 107,',
    'rgba(255, 122, 42,',
    'rgba(255, 206, 90,',
  ];

  private readonly MIN_PARTICLES = 80;
  private readonly MAX_PARTICLES = 250;
  private readonly CELL_SIZE = 40;

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
    const newWidth = parent.clientWidth;
    const newHeight = parent.clientHeight;
    const widthChanged = Math.abs(newWidth - this.canvas.width) > 200;
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    if (widthChanged) this.spawnParticles();
  }

  private spawnParticles(): void {
    const w = this.canvas?.width ?? 800;
    const h = this.canvas?.height ?? 600;
    const count = Math.min(this.MAX_PARTICLES, Math.max(this.MIN_PARTICLES, Math.floor((w * h) / 5000)));
    this.particles = [];

    const cols = Math.ceil(w / this.CELL_SIZE);
    const rows = Math.ceil(h / this.CELL_SIZE);
    const totalCells = cols * rows;

    for (let i = 0; i < count; i++) {
      const cell = i % totalCells;
      const col = cell % cols;
      const row = Math.floor(cell / cols);
      const baseX = col * this.CELL_SIZE;
      const baseY = row * this.CELL_SIZE;
      this.particles.push(this.createParticleAt(
        baseX + Math.random() * this.CELL_SIZE,
        baseY + Math.random() * this.CELL_SIZE
      ));
    }
  }

  private createParticleAt(x: number, y: number): Particle {
    return {
      x,
      y,
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
