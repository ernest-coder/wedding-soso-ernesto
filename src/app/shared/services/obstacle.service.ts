import { Injectable } from '@angular/core';

// Added optional speedMul to support fast obstacles and clusters
export interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  speedMul?: number;
}

@Injectable({ providedIn: 'root' })
export class ObstacleService {
  obstacles: Obstacle[] = [];

  spawn(x: number, y: number, w: number, h: number, speedMul?: number) {
    this.obstacles.push({ x, y, w, h, speedMul });
  }

  clear() {
    this.obstacles = [];
  }

  step(dx: number) {
    // move obstacles left by dx, respecting per-obstacle speedMul if present
    for (const o of this.obstacles) {
      const mul = o.speedMul ?? 1;
      o.x -= dx * mul;
    }
    // remove off-screen objects
    this.obstacles = this.obstacles.filter(o => o.x + o.w > -50);
  }
}
