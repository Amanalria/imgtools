import React, { useState, useEffect } from 'react';
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
import { triggerFileDownload } from './utils/downloadHelper';

export default function App() {
  const [activeTool, setActiveTool] = useState(null); // null = Home Dashboard
  const [activeTab, setActiveTab] = useState('all'); // category filter
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
    {
      id: 'crop',
      name: 'Crop & Rotate',
      category: 'edit',
      icon: 'crop',
      desc: 'Freehand crop, aspect ratios, 360° rotation & circular avatar mask',
      layoutClass: 'bento-hero', // 2x2 Large Featured
      component: CropTool
    },
    {
      id: 'bgremover',
      name: 'BG Eraser & Keyer',
      category: 'ai',
      icon: 'backspace',
      desc: 'Chroma key background remover with tolerance feathering',
      badge: 'AI Magic',
      layoutClass: 'bento-wide', // 2x1 Wide
      component: BgRemoverTool
    },
    {
      id: 'compress',
      name: 'Smart Compressor',
      category: 'privacy',
      icon: 'compress',
      desc: 'Target size compression with live KB savings gauge',
      layoutClass: 'bento-tall', // 1x2 Tall
      component: CompressTool
    },
    {
      id: 'resize',
      name: 'Resizer & DPI Scaler',
      category: 'edit',
      icon: 'aspect_ratio',
      desc: 'Exact dimensions, percentage scaler & 300 DPI print quality',
      layoutClass: '',
      component: ResizeTool
    },
    {
      id: 'convert',
      name: 'Format Converter',
      category: 'privacy',
      icon: 'sync',
      desc: 'Instant PNG, JPG, WEBP, BMP target format converter',
      layoutClass: '',
      component: ConvertTool
    },
    {
      id: 'colorpicker',
      name: 'Palette & Eyedropper',
      category: 'ai',
      icon: 'colorize',
      desc: 'Precision color picker & 10-color dominant palette generator',
      layoutClass: '',
      component: ColorPickerTool
    },
    {
      id: 'filters',
      name: 'Filters & Effects Studio',
      category: 'ai',
      icon: 'filter_vintage',
      desc: 'Vintage, Cyberpunk, Nordic Chill presets + adjustment sliders',
      layoutClass: '',
      component: FiltersTool
    },
    {
      id: 'watermark',
      name: 'Brand Watermark',
      category: 'edit',
      icon: 'branding_watermark',
      desc: 'Text/Logo watermark with single anchor & repeat tile pattern',
      layoutClass: '',
      component: WatermarkTool
    },
    {
      id: 'metadata',
      name: 'EXIF Privacy Inspector',
      category: 'privacy',
      icon: 'info',
      desc: 'View camera EXIF metadata & 1-click GPS location stripper',
      layoutClass: '',
      component: MetadataTool
    },
    {
      id: 'collage',
      name: 'Collage Grid Maker',
      category: 'collage',
      icon: 'dashboard_customize',
      desc: 'Combine multiple images in 2x2, 3x3 grids with corner rounder',
      layoutClass: 'bento-wide',
      component: CollageTool
    }
  ];

  const categoryTabs = [
    { id: 'all', label: '✨ All Tools' },
    { id: 'edit', label: '✂️ Crop & Edit' },
    { id: 'ai', label: '🪄 AI & Filters' },
    { id: 'privacy', label: '🔒 Privacy & Convert' },
    { id: 'collage', label: '🧩 Collage Grid' }
  ];

  const filteredTools = tools.filter(
    (t) => activeTab === 'all' || t.category === activeTab
  );

  const activeToolObj = tools.find((t) => t.id === activeTool);
  const ActiveComponent = activeToolObj?.component;

  return (
    <div className="app-viewport">
      {/* Floating Glass Header Bar */}
      <header className="floating-header">
        <div className="brand-badge" onClick={() => setActiveTool(null)}>
          <div className="brand-logo-glow">
            <span className="material-symbols-outlined">auto_awesome</span>
          </div>
          <div className="brand-title-text">PurePixel Pro</div>
        </div>

        <div className="header-action-group">
          {activeTool ? (
            <>
              <button
                className="glass-btn"
                onClick={() => setActiveTool(null)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>grid_view</span>
                All Tools
              </button>
              <button
                className="glass-btn-primary"
                onClick={() => {
                  const applyBtn = document.querySelector('.btn-pure-primary, .btn-glass-primary');
                  if (applyBtn) {
                    applyBtn.click();
                  } else {
                    alert('Please select or edit an image to download.');
                  }
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                Download
              </button>
            </>
          ) : (
            <label className="glass-btn-primary" style={{ cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_photo_alternate</span>
              Open Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleFileUpload(e);
                  setActiveTool('crop'); // Open Crop tool by default when image selected
                }}
                style={{ display: 'none' }}
              />
            </label>
          )}

          <button className="glass-btn" onClick={() => setShowSettings(true)} title="Settings">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings</span>
          </button>
        </div>
      </header>

      {/* Workspace Area with Safe Top & Bottom Padding */}
      <main className="main-content-scroll">
        <div className="container-inner">
          {activeTool === null ? (
            /* Home Bento Dashboard View */
            <>
              {/* Category Filter Tabs */}
              <div className="category-tabs-bar">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab-pill ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Asymmetric Bento Grid (Chota Bda Layout) */}
              <div className="asymmetric-bento-grid">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className={`bento-box ${tool.layoutClass}`}
                    onClick={() => setActiveTool(tool.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="bento-icon-wrapper">
                        <span className="material-symbols-outlined">{tool.icon}</span>
                      </div>
                      {tool.badge && <span className="badge-pill">{tool.badge}</span>}
                    </div>

                    <div>
                      <div className="bento-title">{tool.name}</div>
                      <div className="bento-desc">{tool.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Dedicated Tool View */
            <div>
              {/* Tool Header Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button className="glass-btn" onClick={() => setActiveTool(null)}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
                    Back
                  </button>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {activeToolObj?.name}
                  </h2>
                </div>

                {image && activeTool !== 'collage' && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Source: <strong style={{ color: 'var(--text-primary)' }}>{image.name}</strong> ({image.width}×{image.height}px)
                  </div>
                )}
              </div>

              {!image && activeTool !== 'collage' ? (
                <div className="pure-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div className="brand-logo-glow" style={{ width: '64px', height: '64px', borderRadius: '50%' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>add_photo_alternate</span>
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      Upload Image to use {activeToolObj?.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Supports PNG, JPG, WEBP, BMP, SVG
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
                <ActiveComponent image={image} onSaveHistory={saveToHistory} />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Glass Bottom Nav Bar */}
      <nav className="floating-bottom-nav">
        <button
          className={`nav-tab-btn ${activeTool === null ? 'active' : ''}`}
          onClick={() => setActiveTool(null)}
        >
          <span className="material-symbols-outlined">grid_view</span>
          <span>Home</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTool === 'crop' ? 'active' : ''}`}
          onClick={() => setActiveTool('crop')}
        >
          <span className="material-symbols-outlined">crop</span>
          <span>Crop</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTool === 'convert' ? 'active' : ''}`}
          onClick={() => setActiveTool('convert')}
        >
          <span className="material-symbols-outlined">sync</span>
          <span>Convert</span>
        </button>

        <button
          className="nav-tab-btn"
          onClick={() => setShowHistory(true)}
        >
          <span className="material-symbols-outlined">history</span>
          <span>History</span>
        </button>

        <button
          className="nav-tab-btn"
          onClick={() => setShowSettings(true)}
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </button>
      </nav>

      {/* System Settings Modal */}
      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="pure-panel" style={{ width: '100%', maxWidth: '420px', margin: 0 }}>
            <div className="panel-head">
              <div className="panel-title-text">
                <span className="material-symbols-outlined">settings</span> Settings & Preferences
              </div>
              <button className="glass-btn" onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="field-box">
                <label className="field-label">Visual Theme Mode</label>
                <button className="glass-btn" onClick={toggleTheme} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                  {theme === 'dark' ? '☀️ Switch to Light Theme' : '🌙 Switch to Dark OLED Theme'}
                </button>
              </div>
              <div className="field-box">
                <label className="field-label">Engine Privacy</label>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  100% Client-Side In-Memory Processing. Your photos never leave your device.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="pure-panel" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', margin: 0 }}>
            <div className="panel-head">
              <div className="panel-title-text">
                <span className="material-symbols-outlined">history</span> Export History ({history.length})
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="glass-btn" onClick={clearHistory}>Clear</button>
                <button className="glass-btn" onClick={() => setShowHistory(false)}>✕</button>
              </div>
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '30px 0' }}>
                No exports saved yet in this session.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                    <img src={item.url} alt={item.name} style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.tool} • {item.timestamp}</div>
                    </div>
                    <button
                      className="glass-btn-primary"
                      onClick={() => triggerFileDownload(item.url, item.name)}
                      style={{ padding: '8px 12px' }}
                    >
                      ↓
                    </button>
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
