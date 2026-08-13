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

export default function App() {
  const [activeTool, setActiveTool] = useState(null); // null = Home Dashboard
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [image, setImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
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
    { id: 'crop', name: 'Crop', icon: 'crop', component: CropTool },
    { id: 'convert', name: 'Convert', icon: 'sync', component: ConvertTool },
    { id: 'compress', name: 'Compress', icon: 'compress', component: CompressTool },
    { id: 'resize', name: 'Resize', icon: 'aspect_ratio', component: ResizeTool },
    { id: 'colorpicker', name: 'Color Picker', icon: 'colorize', component: ColorPickerTool },
    { id: 'bgremover', name: 'BG Remover', icon: 'backspace', component: BgRemoverTool },
    { id: 'filters', name: 'Filters', icon: 'filter_vintage', component: FiltersTool },
    { id: 'watermark', name: 'Watermark', icon: 'branding_watermark', component: WatermarkTool },
    { id: 'metadata', name: 'Metadata', icon: 'info', component: MetadataTool },
    { id: 'collage', name: 'Collage', icon: 'dashboard_customize', component: CollageTool }
  ];

  const filteredTools = tools.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ActiveComponent = tools.find((t) => t.id === activeTool)?.component;

  return (
    <div className="app-container">
      {/* TopAppBar */}
      <header className="top-header">
        <div className="header-brand">
          <span
            className="material-symbols-outlined hover:bg-surface-container p-2 rounded-full cursor-pointer transition-colors duration-200"
            onClick={() => setActiveTool(null)}
            title="Dashboard Grid View"
          >
            grid_view
          </span>
          <h1
            className="brand-title cursor-pointer"
            onClick={() => setActiveTool(null)}
          >
            ImageTool Pro
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {activeTool && (
            <>
              <button
                className="header-action-btn secondary"
                onClick={() => setImage(null)}
              >
                Reset
              </button>
              <button
                className="header-action-btn primary"
                onClick={() => {
                  const btn = document.querySelector('.btn-pure-primary, .btn-glass-primary');
                  if (btn) btn.click();
                }}
              >
                Apply & Download
              </button>
            </>
          )}

          <span
            className="material-symbols-outlined text-secondary cursor-pointer hover:bg-surface-container p-2 rounded-full transition-colors duration-200"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            settings
          </span>
        </div>
      </header>

      <div className="main-layout">
        {/* NavigationDrawer (Desktop Only) */}
        <aside className="sidebar-drawer">
          <div className="sidebar-title">Image Toolkit</div>
          <nav className="nav-list">
            <button
              className={`nav-item-btn ${activeTool === null ? 'active' : ''}`}
              onClick={() => setActiveTool(null)}
            >
              <span className="material-symbols-outlined">grid_view</span>
              <span>All Tools (Dashboard)</span>
            </button>

            {tools.map((tool) => (
              <button
                key={tool.id}
                className={`nav-item-btn ${activeTool === tool.id ? 'active' : ''}`}
                onClick={() => setActiveTool(tool.id)}
              >
                <span className="material-symbols-outlined">{tool.icon}</span>
                <span>{tool.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="workspace-container">
          {activeTool === null ? (
            /* Home Bento Dashboard View */
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {/* Search & Filter Bar */}
              <div className="search-container">
                <div className="search-input-wrapper">
                  <span className="material-symbols-outlined">search</span>
                  <input
                    className="search-input"
                    placeholder="Search tools..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="filter-btn">
                  <span className="material-symbols-outlined">tune</span>
                  Filters
                </button>
              </div>

              {/* Upload Zone on Dashboard */}
              <div className="pure-panel" style={{ textAlign: 'center', marginBottom: '32px', padding: '40px 20px' }}>
                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)' }}>add_photo_alternate</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary)' }}>
                    Upload Source Image
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--secondary)' }}>
                    Supports PNG, JPG, WEBP, BMP, SVG (Client-side fast privacy processing)
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Bento Grid for Tools */}
              <div className="bento-grid">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="bento-card group"
                    onClick={() => setActiveTool(tool.id)}
                  >
                    <span className="material-symbols-outlined">{tool.icon}</span>
                    <span className="bento-card-title">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Active Tool View */
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {!image && activeTool !== 'collage' ? (
                <div className="pure-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--primary)' }}>add_photo_alternate</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary)' }}>
                      Upload Source Image for {tools.find((t) => t.id === activeTool)?.name}
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--secondary)' }}>
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
                <>
                  {image && activeTool !== 'collage' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                      <div style={{ fontSize: '0.88rem', color: 'var(--secondary)' }}>
                        Source Image: <strong style={{ color: 'var(--primary)' }}>{image.name}</strong> ({image.width} × {image.height} px)
                      </div>
                      <label className="header-action-btn secondary" style={{ cursor: 'pointer' }}>
                        Change Image
                        <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                      </label>
                    </div>
                  )}

                  <ActiveComponent image={image} onSaveHistory={saveToHistory} />
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button className={`mobile-nav-link ${activeTool === null ? 'active' : ''}`} onClick={() => setActiveTool(null)}>
          <span className="material-symbols-outlined">build</span>
          <span>Tools</span>
        </button>

        <button className="mobile-nav-link" onClick={() => setActiveTool('compress')}>
          <span className="material-symbols-outlined">layers</span>
          <span>Batch</span>
        </button>

        <button className="mobile-nav-link" onClick={() => setShowHistory(true)}>
          <span className="material-symbols-outlined">history</span>
          <span>History</span>
        </button>

        <button className="mobile-nav-link" onClick={() => setShowSettings(true)}>
          <span className="material-symbols-outlined">person</span>
          <span>Settings</span>
        </button>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="pure-panel" style={{ width: '100%', maxWidth: '420px', margin: 0 }}>
            <div className="panel-head">
              <div className="panel-title-text">
                <span className="material-symbols-outlined">settings</span> System Settings
              </div>
              <button className="header-action-btn secondary" onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="field-box">
                <label className="field-label">Color Theme Mode</label>
                <button className="header-action-btn secondary" onClick={toggleTheme}>
                  {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Gallery Light Mode'}
                </button>
              </div>
              <div className="field-box">
                <label className="field-label">Security & Privacy</label>
                <div style={{ fontSize: '0.85rem', color: 'var(--secondary)', lineHeight: '1.5' }}>
                  ImageTool Pro runs 100% locally inside client-side browser memory. Zero server uploads.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="pure-panel" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', margin: 0 }}>
            <div className="panel-head">
              <div className="panel-title-text">
                <span className="material-symbols-outlined">history</span> Export History ({history.length})
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="header-action-btn secondary" onClick={clearHistory}>Clear</button>
                <button className="header-action-btn secondary" onClick={() => setShowHistory(false)}>✕</button>
              </div>
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--secondary)', padding: '24px 0' }}>
                No export records logged yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface-container-low)', padding: '10px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--surface-border)' }}>
                    <img src={item.url} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{item.tool} • {item.timestamp}</div>
                    </div>
                    <a href={item.url} download={item.name} className="header-action-btn secondary">↓</a>
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
