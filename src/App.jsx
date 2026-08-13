import React, { useState, useEffect } from 'react';
import {
  Image, Maximize2, Crop, RefreshCw, Zap, Pipette,
  Eraser, Sliders, Type, Info, LayoutGrid, Upload,
  Sun, Moon, Settings, History, Download, Trash2, X, Sparkles
} from 'lucide-react';

import ResizeTool from './components/ResizeTool';
import CropTool from './components/CropTool';
import ConvertTool from './components/ConvertTool';
import CompressTool from './components/CompressTool';
import ColorPickerTool from './components/ColorPickerTool';
import BgRemoverTool from './components/BgRemoverTool';
import FiltersTool from './components/FiltersTool';
import WatermarkTool from './components/WatermarkTool';
import MetadataTool from './components/MetadataTool';
import CollageTool from './components/CollageTool';

export default function App() {
  const [activeTool, setActiveTool] = useState('resize');
  const [theme, setTheme] = useState('dark');
  const [image, setImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new window.Image();
      img.src = evt.target.result;
      img.onload = () => {
        setImage({
          src: evt.target.result,
          name: file.name,
          width: img.width,
          height: img.height,
          type: file.type
        });
      };
    };
    reader.readAsDataURL(file);
  };

  const saveToHistory = (item) => {
    const historyItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      ...item
    };
    setHistory((prev) => [historyItem, ...prev.slice(0, 19)]);
  };

  const clearHistory = () => setHistory([]);

  const tools = [
    { id: 'resize', name: 'Resize & Scale', icon: Maximize2, component: ResizeTool },
    { id: 'crop', name: 'Crop & Rotate', icon: Crop, component: CropTool },
    { id: 'convert', name: 'Convert Format', icon: RefreshCw, component: ConvertTool },
    { id: 'compress', name: 'Compressor', icon: Zap, component: CompressTool },
    { id: 'colorpicker', name: 'Color Picker', icon: Pipette, component: ColorPickerTool },
    { id: 'bgremover', name: 'Remove BG', icon: Eraser, component: BgRemoverTool },
    { id: 'filters', name: 'Filters Lab', icon: Sliders, component: FiltersTool },
    { id: 'watermark', name: 'Watermark', icon: Type, component: WatermarkTool },
    { id: 'metadata', name: 'Metadata Info', icon: Info, component: MetadataTool },
    { id: 'collage', name: 'Collage Grid', icon: LayoutGrid, component: CollageTool }
  ];

  const ActiveComponent = tools.find((t) => t.id === activeTool)?.component || ResizeTool;

  return (
    <div className="app-container">
      {/* Liquid Glass Header */}
      <header className="glass-navbar">
        <div className="brand-badge">
          <Image className="brand-logo-icon" />
          <span>ImgTools Liquid</span>
        </div>

        <div className="header-actions">
          <button className="glass-btn-icon" onClick={() => setShowHistory(true)} title="Export History">
            <History size={20} />
          </button>
          <button className="glass-btn-icon" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="glass-btn-icon" onClick={() => setShowSettings(false)} title="Settings">
            <Settings size={20} onClick={() => setShowSettings(true)} />
          </button>
        </div>
      </header>

      {/* Main Viewport Layout */}
      <div className="main-viewport">
        {/* Desktop Liquid Sidebar */}
        <aside className="glass-sidebar">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className={`tool-nav-btn ${activeTool === tool.id ? 'active' : ''}`}
                onClick={() => setActiveTool(tool.id)}
              >
                <Icon size={20} />
                <span>{tool.name}</span>
              </button>
            );
          })}
        </aside>

        {/* Main Workspace Area */}
        <main className="workspace-area">
          {!image && activeTool !== 'collage' ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--accent-glow)' }}>
                  <Upload size={38} color="#ffffff" />
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                  Upload Image to Get Started
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '400px' }}>
                  Supports PNG, JPEG, WEBP, BMP, SVG. Processing runs 100% locally with ultra privacy.
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          ) : (
            <>
              {image && activeTool !== 'collage' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Loaded Image: <strong style={{ color: 'var(--text-main)' }}>{image.name}</strong> ({image.width} × {image.height} px)
                  </div>
                  <label className="btn-glass-secondary" style={{ cursor: 'pointer' }}>
                    <Upload size={16} /> Load New Image
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              )}

              <ActiveComponent image={image} onSaveHistory={saveToHistory} />
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="glass-bottom-bar">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              className={`bottom-tab ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => setActiveTool(tool.id)}
            >
              <Icon size={18} />
              <span>{tool.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', margin: 0 }}>
            <div className="panel-head">
              <div className="panel-title-text"><Settings size={22} /> Settings & Preferences</div>
              <button className="glass-btn-icon" onClick={() => setShowSettings(false)}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="field-box">
                <label className="field-label">Liquid Theme Engine</label>
                <button className="btn-glass-secondary" onClick={toggleTheme}>
                  {theme === 'dark' ? 'Switch to Liquid Light Theme' : 'Switch to Liquid Dark Theme'}
                </button>
              </div>
              <div className="field-box">
                <label className="field-label">Privacy Assurance</label>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  All image rendering, scaling, background keying, and filter processing is computed 100% inside your device's browser memory. Zero external server uploads.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', maxHeight: '80vh', overflowY: 'auto', margin: 0 }}>
            <div className="panel-head">
              <div className="panel-title-text"><History size={22} /> Recent Export History ({history.length})</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-glass-secondary" onClick={clearHistory}><Trash2 size={16} /></button>
                <button className="glass-btn-icon" onClick={() => setShowHistory(false)}><X size={18} /></button>
              </div>
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0' }}>
                No exports saved in history yet. Process images to see them here!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--glass-card)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                    <img src={item.url} alt={item.name} style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.tool} • {item.timestamp}</div>
                    </div>
                    <a href={item.url} download={item.name} className="glass-btn-icon"><Download size={18} /></a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
