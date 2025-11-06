import React, { useState, useEffect } from 'react';
import { SoundManager } from '../utils/sounds';

type Theme = 'dark' | 'light' | 'fnaf1' | 'fnaf2';

const THEMES = [
  { id: 'dark' as Theme, name: 'Dark (Default)', bgColor: '#02040a', textColor: '#e0e1e6' },
  { id: 'light' as Theme, name: 'Light Mode', bgColor: '#f0f0f0', textColor: '#1a1a1a' },
  { id: 'fnaf1' as Theme, name: 'FNAF 1', bgColor: '#1a1410', textColor: '#d4af37' },
  { id: 'fnaf2' as Theme, name: 'FNAF 2', bgColor: '#0a0e1a', textColor: '#58a5fe' },
];

const SettingsPage: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(SoundManager.isEnabled());
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme || 'dark';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    switch(theme) {
      case 'light':
        root.style.setProperty('--background-dark', '#f5f5f5');
        root.style.setProperty('--background-med', '#e8e8e8');
        root.style.setProperty('--text-light', '#1a1a1a');
        root.style.setProperty('--text-dark', '#666666');
        root.style.setProperty('--border-light', '#cccccc');
        root.style.setProperty('--border-dark', '#999999');
        break;
      case 'fnaf1':
        root.style.setProperty('--background-dark', '#1a1410');
        root.style.setProperty('--background-med', '#2a2218');
        root.style.setProperty('--accent-green', '#d4af37');
        root.style.setProperty('--accent-cyan', '#d4af37');
        break;
      case 'fnaf2':
        root.style.setProperty('--background-dark', '#0a0e1a');
        root.style.setProperty('--background-med', '#12162a');
        root.style.setProperty('--accent-cyan', '#58a5fe');
        break;
      case 'dark':
      default:
        root.style.setProperty('--background-dark', '#02040a');
        root.style.setProperty('--background-med', '#0d111c');
        root.style.setProperty('--text-light', '#e0e1e6');
        root.style.setProperty('--text-dark', '#8b949e');
        root.style.setProperty('--border-light', '#414a63');
        root.style.setProperty('--border-dark', '#1e2433');
        root.style.setProperty('--accent-green', '#32ff91');
        root.style.setProperty('--accent-cyan', '#00ffff');
        break;
    }
  };

  const changeTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
    applyTheme(theme);
  };

  const toggleSound = () => {
    const newState = SoundManager.toggle();
    setSoundEnabled(newState);
    SoundManager.play('click');
  };

  return (
    <div className="p-2 animate-fadeIn h-full flex flex-col">
      <div className="container-glow flex-grow flex flex-col p-4 min-h-0">
        <h1 className="font-pixel text-2xl text-glow-cyan mb-4">⚙️ Settings</h1>

        <div className="space-y-4 overflow-y-auto pr-2 flex-grow min-h-0">
          {/* Sound Settings */}
          <div className="bg-black/30 border border-border-dark p-4">
            <h2 className="font-pixel text-lg text-glow-green mb-3">🔊 Audio</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-pixel text-sm text-text-light">Sound Effects</p>
                <p className="text-xs text-text-dark">Enable/disable all sounds</p>
              </div>
              
              <button
                onClick={toggleSound}
                className={`relative w-16 h-8 rounded-full transition-all ${
                  soundEnabled ? 'bg-accent-green' : 'bg-border-dark'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    soundEnabled ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-black/30 border border-border-dark p-4">
            <h2 className="font-pixel text-lg text-glow-yellow mb-3">🎨 Themes</h2>
            
            <div className="space-y-2">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.id)}
                  className={`w-full p-3 border text-left transition-all ${
                    currentTheme === theme.id
                      ? 'border-accent-cyan bg-accent-cyan/20'
                      : 'border-border-dark hover:border-accent-cyan'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-pixel text-sm text-text-light">{theme.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-6 h-6 border border-white"
                          style={{ backgroundColor: theme.bgColor }}
                        />
                        <div
                          className="w-6 h-6 border border-white"
                          style={{ backgroundColor: theme.textColor }}
                        />
                      </div>
                    </div>
                    {currentTheme === theme.id && (
                      <span className="text-accent-green text-xl">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* App Info */}
          <div className="bg-black/30 border border-border-dark p-4">
            <h2 className="font-pixel text-lg text-glow-purple mb-3">ℹ️ About</h2>
            <div className="text-xs text-text-dark space-y-1">
              <p>Version: 2.0.0</p>
              <p>Developer: @NAVARRLORBX</p>
              <p>FNTD 2 Casino & Wiki</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

