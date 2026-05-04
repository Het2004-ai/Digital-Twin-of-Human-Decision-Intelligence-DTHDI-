/**
 * DTHDI Behavioral Tracker SDK
 * Captures real-time user interactions for digital twin modeling.
 */

export interface TelemetryEvent {
  type: 'click' | 'mousemove' | 'keypress' | 'scroll' | 'pageview';
  timestamp: number;
  data: any;
  sessionId: string;
  url: string;
}

export class DTHDITracker {
  private socket: any;
  private sessionId: string;
  private buffer: TelemetryEvent[] = [];
  private flushInterval: number = 2000; // 2 seconds

  constructor(endpoint: string) {
    this.sessionId = this.generateSessionId();
    this.init(endpoint);
  }

  private init(endpoint: string) {
    // We'll use a dynamic import or window-level Socket.io client
    console.log(`[DTHDI] Initializing tracker for session ${this.sessionId}`);
    
    // Setup listeners
    this.setupListeners();
    
    // Start heartbeats/flushing
    setInterval(() => this.flush(), this.flushInterval);
  }

  private setupListeners() {
    // 1. Click Tracking
    window.addEventListener('click', (e) => {
      this.capture('click', {
        x: e.clientX,
        y: e.clientY,
        target: this.getSelector(e.target as HTMLElement),
      });
    });

    // 2. Mouse Movement (Throttled)
    let lastMove = 0;
    window.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastMove > 100) { // 10Hz sampling
        this.capture('mousemove', { x: e.clientX, y: e.clientY });
        lastMove = now;
      }
    });

    // 3. Typing Dynamics (Anonymized)
    window.addEventListener('keydown', (e) => {
      this.capture('keypress', {
        key: 'REDACTED', // Privacy first: we care about speed/pattern, not content
        keyCode: e.code,
      });
    });

    // 4. Scroll Depth
    window.addEventListener('scroll', () => {
      this.capture('scroll', {
        y: window.scrollY,
        percentage: (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
      });
    });
  }

  private capture(type: TelemetryEvent['type'], data: any) {
    const event: TelemetryEvent = {
      type,
      timestamp: Date.now(),
      data,
      sessionId: this.sessionId,
      url: window.location.href,
    };
    
    this.buffer.push(event);
    
    // Immediate flush for critical events
    if (type === 'click' || type === 'pageview') {
      this.flush();
    }
  }

  private flush() {
    if (this.buffer.length === 0) return;
    
    // In a real implementation, we'd send this over WebSocket
    console.log('[DTHDI] Flushing events:', this.buffer);
    
    // TODO: Send to api-gateway
    this.buffer = [];
  }

  private getSelector(el: HTMLElement): string {
    if (el.id) return `#${el.id}`;
    if (el.className) return `.${el.className.split(' ').join('.')}`;
    return el.tagName.toLowerCase();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

// Auto-initialize if running in browser
if (typeof window !== 'undefined') {
  (window as any).DTHDI = DTHDITracker;
}
