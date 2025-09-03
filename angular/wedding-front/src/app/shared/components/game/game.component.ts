import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../../services/game.service';
import { LeaderboardEntry, LeaderboardService } from '../../services/leaderboard.service';
import { ScoreService } from '../../services/score.service';


@Component({
selector: 'app-game',
templateUrl: './game.component.html',
styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  score = 0;
  high = 0;
  gameOver = false;
  assetsLoaded = false;

  // leaderboard UI state
  leaderboard: LeaderboardEntry[] = [];
  showModal = false;
  pendingScore = 0;
  nameInput = '';

  private subs = new Subscription();

  constructor(
    public game: GameService,
    private scoreSvc: ScoreService,
    private leaderboardSvc: LeaderboardService
  ) {
    this.high = this.scoreSvc.getHigh();
    this.subs.add(this.scoreSvc.score$.subscribe(s => { this.score = s; this.high = this.scoreSvc.getHigh(); }));
    this.subs.add(this.game.gameOver$.subscribe(v => this.onGameOverChanged(v)));
    this.subs.add(this.game.assetsLoaded$.subscribe(v => this.assetsLoaded = v));
    this.refreshLeaderboard();
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.game.attachCanvas(canvas);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.game.stop();
  }

  private async onGameOverChanged(v: boolean) {
    this.gameOver = v;
    if (v) {
      const finalScore = this.score;
      const qualifies = await this.leaderboardSvc.qualifies(finalScore);
      if (qualifies) {
        this.pendingScore = finalScore;
        this.nameInput = '';
        this.showModal = true;
      }
    }
    this.refreshLeaderboard();
  }
  
  async refreshLeaderboard() {
    this.leaderboard = await this.leaderboardSvc.getTop();
  }

  async submitName() {
    const n = (this.nameInput || 'Anonymous').trim().slice(0, 32);
    await this.leaderboardSvc.addEntry(n || 'Anonymous', this.pendingScore);
    this.showModal = false;
    await this.refreshLeaderboard();
  }

  cancelSubmit() {
    this.showModal = false;
    // still refresh in case something else changed
    this.refreshLeaderboard();
  }

  // Input handlers - same as before
  @HostListener('window:keydown', ['$event'])
  onKey(event: KeyboardEvent) {
    if (event.code === 'Space') {
      if (this.gameOver) {
        this.game.restart();
      } else {
        if (!this.game.running) this.game.start();
        this.game.jump();
      }
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      this.game.setDuck(true);
    } else if (event.key === 'KeyR') {
      this.game.restart();
    } else if (event.key === 'KeyL') { // quick key to show leaderboard
      this.refreshLeaderboard();
      // (we keep the modal disabled; leaderboard is visible in UI anyway)
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') this.game.setDuck(false);
  }

  onTouchStart(e: TouchEvent) {
    e.preventDefault();
    if (this.gameOver) {
      this.game.restart();
      return;
    }
    if (!this.game.running) this.game.start();
    this.game.jump();
  }
}