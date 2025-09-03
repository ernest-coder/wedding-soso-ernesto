import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private _score$ = new BehaviorSubject<number>(0);
  score$ = this._score$.asObservable();
  
  
  private _high = 0;
  
  
  constructor() {
  const s = localStorage.getItem('dino_high');
  this._high = s ? Number(s) : 0;
  }
  
  
  setScore(v: number) {
  this._score$.next(v);
  if (v > this._high) {
  this._high = v;
  localStorage.setItem('dino_high', String(this._high));
  }
  }
  
  
  getHigh() { return this._high; }
  }