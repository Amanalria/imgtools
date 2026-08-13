import React, { useState, useEffect } from 'react';
import {
  Maximize2, Crop, RefreshCw, Zap, Pipette,
  Eraser, Sliders, Type, Info, LayoutGrid, Upload,
  Sun, Moon, Settings, History, Download, Trash2, X, SlidersHorizontal
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
      {/* Stitch PurePixel Header */}
      <header className="pure-navbar">
        <div className="brand-badge">
          <SlidersHorizontal className="brand-logo-icon" />
          <span>PurePixel Image Suite</span>
        </div>

        <div className="header-actions">
          <button className="pure-btn-icon" onClick={() => setShowHistory(true)} title="Export History">
            <History size={16} /> History
          </button>
          <button className="pure-btn-icon" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button className="pure-btn-icon" onClick={() => setShowSettings(true)} title="Settings">
            <Settings size={16} />
          </button>
        </div>
      </header>

      {/* Main Viewport Layout */}
      <div className="main-viewport">
        {/* Desktop Sidebar */}
        <aside className="pure-sidebar">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className={`tool-nav-btn ${activeTool === tool.id ? 'active' : ''}`}
                onClick={() => setActiveTool(tool.id)}
              >
                <Icon size={18} />
                <span>{tool.name}</span>
              </button>
            );
          })}
        </aside>

        {/* Main Workspace */}
        <main className="workspace-area">
          {!image && activeTool !== 'collage' ? (
            <div className="pure-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
              <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '4px', backgroundColor: 'var(--primary)', color: 'var(--on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload size={32} />
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.01em' }}>
                  Upload Image File
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: '1.5' }}>
                  High-precision client-side utility engine. Supports PNG, JPEG, WEBP, BMP, SVG. Zero server data transmission.
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
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                    Active Image: <strong style={{ color: 'var(--text-primary)' }}>{image.name}</strong> ({image.width} × {image.height} px)
                  </div>
                  <label className="btn-pure-secondary" style={{ cursor: 'pointer' }}>
                    <Upload size={14} /> Change Source
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
      <nav className="pure-bottom-bar">
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="pure-panel" style={{ width: '100%', maxWidth: '420px', margin: 0 }}>
            <div className="panel-head">
              <div className="panel-title-text"><Settings size={18} /> System Settings</div>
              <button className="pure-btn-icon" onClick={() => setShowSettings(false)}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="field-box">
                <label className="field-label">Color Theme Mode</label>
                <button className="btn-pure-secondary" onClick={toggleTheme}>
                  {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Gallery Light Mode'}
                </button>
              </div>
              <div className="field-box">
                <label className="field-label">Client Security Guarantee</label>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  PurePixel Image Suite operates exclusively on client-side memory. Images never touch an external cloud or server.
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
              <div className="panel-title-text"><History size={18} /> Export History ({history.length})</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-pure-secondary" onClick={clearHistory}><Trash2 size={14} /></button>
                <button className="pure-btn-icon" onClick={() => setShowHistory(false)}><X size={16} /></button>
              </div>
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px 0' }}>
                No export records logged yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <img src={item.url} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '2px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.tool} • {item.timestamp}</div>
                    </div>
                    <a href={item.url} download={item.name} className="pure-btn-icon"><Download size={14} /></a>
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
