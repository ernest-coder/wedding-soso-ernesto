import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ObstacleService } from './obstacle.service';
import { ScoreService } from './score.service';

export interface TrexState { x: number; y: number; vy: number; w: number; h: number; onGround: boolean; }

@Injectable({
  providedIn: 'root'
})


export class GameService {
  private ctx?: CanvasRenderingContext2D;
  private raf = 0;

  width = 800;
  height = 200;

  gravity = 1.6;
  speed = 14;

  trex: TrexState = { x: 50, y: 0, vy: 0, w: 44, h: 40, onGround: true };

  groundY = 140;

  running = false;
  private lastSpawn = 0;
  private score = 0;

  // Game over observable
  private _gameOver$ = new BehaviorSubject<boolean>(false);
  gameOver$ = this._gameOver$.asObservable();

  // Assets
  private playerImg = new Image();
  private obstacleImg = new Image();
  private assetsLoadedSubject = new BehaviorSubject<boolean>(false);
  assetsLoaded$ = this.assetsLoadedSubject.asObservable();
  private useImageForPlayer = false;
  private useImageForObstacle = false;

  constructor(private ngZone: NgZone, private obs: ObstacleService, private scoreSvc: ScoreService) {
    this.reset();
  }

  /**
   * Loads images. Resolves successfully even if images fail to load
   */
  loadAssets(): Promise<void> {
    return new Promise((resolve) => {
      let loaded = 0;
      const check = () => {
        loaded += 1;
        if (loaded === 2) {
          // compute scaling so the player/hitbox match desired heights
          const desiredPlayerH = 40;
          if (this.playerImg.naturalHeight && this.playerImg.naturalHeight > 0) {
            const scale = desiredPlayerH / this.playerImg.naturalHeight;
            this.trex.h = Math.round(this.playerImg.naturalHeight * scale);
            this.trex.w = Math.round(this.playerImg.naturalWidth * scale);
            this.useImageForPlayer = true;
          } else {
            this.useImageForPlayer = false;
          }

          // obstacle base size used when spawning
          if (this.obstacleImg.naturalHeight && this.obstacleImg.naturalHeight > 0) {
            // we'll scale obstacles to a reasonable height range later during spawn
            this.useImageForObstacle = true;
          } else {
            this.useImageForObstacle = false;
          }

          this.assetsLoadedSubject.next(true);
          resolve();
        }
      };

      // Player
      this.playerImg.onload = () => check();
      this.playerImg.onerror = () => {
        console.warn('Failed to load player image at assets/skier.png — using rectangle fallback.');
        check();
      };
      this.playerImg.src = 'assets/skier.png';

      // Obstacle
      this.obstacleImg.onload = () => check();
      this.obstacleImg.onerror = () => {
        console.warn('Failed to load obstacle image at assets/sapin.png — using rectangle fallback.');
        check();
      };
      this.obstacleImg.src = 'assets/sapin.png';
    });
  }

  attachCanvas(canvas: HTMLCanvasElement) {
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx = canvas.getContext('2d')!;
    this.reset();

    // start loading assets (non-blocking). UI can subscribe to assetsLoaded$
    this.loadAssets().then(() => {
      // adjust trex vertical position after image dimensions maybe changed
      this.trex.y = this.groundY - this.trex.h;
    });
  }

  reset() {
    this.trex.y = this.groundY - this.trex.h;
    this.trex.vy = 0;
    this.trex.onGround = true;
    this.obs.clear();
    this.score = 0;
    this.speed = 6;
    this.lastSpawn = 0;
    this.scoreSvc.setScore(0);
    this._gameOver$.next(false);
  }

  start() {
    // don't start if game over or already running
    if (this.running || this._gameOver$.value) return;
    // optionally allow start only after assets are loaded; we allow start early because we fallback to rectangles
    this.running = true;
    this.ngZone.runOutsideAngular(() => this.loop(0));
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  restart() {
    this.reset();
    this.start();
  }

  jump() {
    if (!this.trex.onGround || this._gameOver$.value) return;
    this.trex.vy = -14;
    this.trex.onGround = false;
  }

  ducking = false;
  setDuck(v: boolean) { this.ducking = v; if (v) { this.trex.h = Math.max(20, Math.round(this.trex.h * 0.6)); } else { /* keep original player image height if using image */ if (this.useImageForPlayer) { /* recalc from image */ const desiredPlayerH = 40; const scale = this.playerImg.naturalHeight ? desiredPlayerH / this.playerImg.naturalHeight : 1; this.trex.h = Math.round(this.playerImg.naturalHeight * scale); this.trex.w = Math.round(this.playerImg.naturalWidth * scale); } else { this.trex.h = 40; this.trex.w = 44; } } }

  private loop(ts: number) {
    this.raf = requestAnimationFrame(t => this.loop(t));
    this.update();
    this.render();
  }

  private update() {
    // physics
    this.trex.vy += this.gravity * 0.6;
    this.trex.y += this.trex.vy;
  
    if (this.trex.y >= this.groundY - this.trex.h) {
      this.trex.y = this.groundY - this.trex.h;
      this.trex.vy = 0;
      this.trex.onGround = true;
    }
  
    // spawn obstacles faster
    this.lastSpawn += 1;
    const spawnInterval = Math.max(50, 120 - Math.floor(this.speed)); // faster spawn as speed increases
    if (this.lastSpawn > spawnInterval + Math.random() * 50) {
      let h: number;
      let w: number;
      if (this.useImageForObstacle && this.obstacleImg.naturalHeight > 0) {
        const desiredH = 24 + Math.random() * 32;
        const scale = desiredH / this.obstacleImg.naturalHeight;
        h = Math.round(this.obstacleImg.naturalHeight * scale);
        w = Math.round(this.obstacleImg.naturalWidth * scale);
      } else {
        h = 30 + Math.random() * 40;
        w = 12 + Math.random() * 20;
      }
      this.obs.spawn(this.width + 20, this.groundY - h, w, h);
      this.lastSpawn = 0;
    }
  
    // move obstacles
    this.obs.step(this.speed);
  
    // increase speed faster
    this.speed += 0.02; // instead of tiny random increase
  
    // score
    this.score += 0.1 * this.speed;
    this.scoreSvc.setScore(Math.floor(this.score));
  
    // collisions -> END GAME
    for (const o of this.obs.obstacles) {
      if (this.collides(this.trex, o)) {
        this.endGame();
        break;
      }
    }
  }
  

  private endGame() {
    this.stop();
    this._gameOver$.next(true);

    // small crash adjustment
    this.trex.vy = 0;
    this.trex.y = Math.min(this.trex.y + 2, this.groundY - 1);
  }

  private collides(t: TrexState, o: { x: number; y: number; w: number; h: number }) {
    const tx = t.x; const ty = t.y; const tw = t.w; const th = t.h;
    return !(tx + tw < o.x || tx > o.x + o.w || ty + th < o.y || ty > o.y + o.h);
  }

  private render() {
    const ctx = this.ctx; if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    // background
    ctx.fillStyle = '#f7fafc';
    ctx.fillRect(0, 0, this.width, this.height);

    // ground
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, this.groundY, this.width, 4);

    // draw player (image or fallback)
    if (this.useImageForPlayer && this.playerImg.complete) {
      ctx.drawImage(this.playerImg, this.trex.x, this.trex.y, this.trex.w, this.trex.h);
    } else {
      ctx.fillStyle = this._gameOver$.value ? '#ef4444' : '#111827';
      ctx.fillRect(this.trex.x, this.trex.y, this.trex.w, this.trex.h);
    }

    // obstacles
    for (const o of this.obs.obstacles) {
      if (this.useImageForObstacle && this.obstacleImg.complete) {
        ctx.drawImage(this.obstacleImg, o.x, o.y, o.w, o.h);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(o.x, o.y, o.w, o.h);
      }
    }

    // score HUD
    ctx.font = '18px ui-sans-serif, system-ui';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(String(Math.floor(this.score)).padStart(5, '0'), this.width - 100, 30);

    // GAME OVER overlay
    if (this._gameOver$.value) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font = '28px ui-sans-serif, system-ui';
      ctx.fillText('PARTIE TERMINÉE', this.width / 2, this.height / 2 - 10);
      ctx.font = '14px ui-sans-serif, system-ui';
      ctx.fillText('Appuyez sur Espace ou cliquez sur Rejouer pour rejouer', this.width / 2, this.height / 2 + 16);
      ctx.textAlign = 'start';
    }
  }
}