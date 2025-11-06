// Sound effects utility
export class SoundManager {
  private static sounds: { [key: string]: HTMLAudioElement } = {};
  private static enabled = true;

  // Free sound URLs from public sources
  private static soundUrls = {
    spin: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    win: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    rare: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    click: 'https://assets.mixkit.co/active_storage/sfx/2997/2997-preview.mp3',
    success: 'https://assets.mixkit.co/active_storage/sfx/1985/1985-preview.mp3',
    error: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
    coin: 'https://assets.mixkit.co/active_storage/sfx/1989/1989-preview.mp3',
  };

  static init() {
    // Preload sounds
    Object.entries(this.soundUrls).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.volume = 0.3;
      this.sounds[key] = audio;
    });

    // Check if sound is enabled from localStorage
    const savedSetting = localStorage.getItem('soundEnabled');
    if (savedSetting !== null) {
      this.enabled = savedSetting === 'true';
    }
  }

  static play(soundName: keyof typeof SoundManager.soundUrls) {
    if (!this.enabled) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Sound play failed:', e));
    }
  }

  static toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', String(this.enabled));
    return this.enabled;
  }

  static isEnabled() {
    return this.enabled;
  }
}

// Initialize on import
if (typeof window !== 'undefined') {
  SoundManager.init();
}

