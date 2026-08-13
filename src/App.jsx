import React, { useState, useEffect } from 'react';
import {
  Image, Maximize2, Crop, RefreshCw, Zap, Pipette,
  Eraser, Sliders, Type, Info, LayoutGrid, Upload,
  Sun, Moon, Settings, History, Download, Trash2, X
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
    { id: 'resize', name: 'Resize', icon: Maximize2, component: ResizeTool },
    { id: 'crop', name: 'Crop & Rotate', icon: Crop, component: CropTool },
    { id: 'convert', name: 'Convert Format', icon: RefreshCw, component: ConvertTool },
    { id: 'compress', name: 'Compress', icon: Zap, component: CompressTool },
    { id: 'colorpicker', name: 'Color Picker', icon: Pipette, component: ColorPickerTool },
    { id: 'bgremover', name: 'Remove BG', icon: Eraser, component: BgRemoverTool },
    { id: 'filters', name: 'Filters', icon: Sliders, component: FiltersTool },
    { id: 'watermark', name: 'Watermark', icon: Type, component: WatermarkTool },
    { id: 'metadata', name: 'Metadata Info', icon: Info, component: MetadataTool },
    { id: 'collage', name: 'Collage Grid', icon: LayoutGrid, component: CollageTool }
  ];

  const ActiveComponent = tools.find((t) => t.id === activeTool)?.component || ResizeTool;

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <header className="top-navbar">
        <div className="brand">
          <Image className="brand-icon" />
          <span>ImgTools Pro</span>
        </div>

        <div className="top-actions">
          <button className="btn-icon" onClick={() => setShowHistory(true)} title="Export History">
            <History size={20} />
          </button>
          <button className="btn-icon" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="btn-icon" onClick={() => setShowSettings(true)} title="Settings">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Desktop Sidebar */}
        <aside className="sidebar">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className={`nav-item ${activeTool === tool.id ? 'active' : ''}`}
                onClick={() => setActiveTool(tool.id)}
              >
                <Icon className="nav-item-icon" />
                <span>{tool.name}</span>
              </button>
            );
          })}
        </aside>

        {/* Main Workspace */}
        <main className="workspace">
          {!image && activeTool !== 'collage' ? (
            <div className="panel" style={{ textAlign: 'center' }}>
              <label className="dropzone">
                <Upload className="dropzone-icon" />
                <div style={{ fontSize: '1.2rem', fontWeight: '600', marginTop: '8px' }}>
                  Upload or Drag & Drop Image Here
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Supports PNG, JPG, WEBP, BMP, SVG (Client-side privacy guaranteed)
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
                <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', marginBottom: '16px', gap: '12px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Active Image: <strong>{image.name}</strong> ({image.width} × {image.height} px)
                  </div>
                  <label className="btn-secondary" style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '0.8rem' }}>
                    Change Image
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
      <nav className="bottom-nav">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              className={`bottom-nav-item ${activeTool === tool.id ? 'active' : ''}`}
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="panel" style={{ width: '100%', maxWidth: '420px', margin: 0 }}>
            <div className="panel-header">
              <div className="panel-title"><Settings size={20} /> Settings</div>
              <button className="btn-icon" onClick={() => setShowSettings(false)}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>Appearance Theme</label>
                <button className="btn-secondary" onClick={toggleTheme}>
                  {theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                </button>
              </div>
              <div className="form-group">
                <label>Export Privacy</label>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  All image operations run 100% locally inside client-side browser memory. Zero server uploads.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="panel" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto', margin: 0 }}>
            <div className="panel-header">
              <div className="panel-title"><History size={20} /> Export History ({history.length})</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" onClick={clearHistory}><Trash2 size={16} /></button>
                <button className="btn-icon" onClick={() => setShowHistory(false)}><X size={18} /></button>
              </div>
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0' }}>
                No export history yet. Process and save images to see them here!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-primary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    <img src={item.url} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.tool} • {item.timestamp}</div>
                    </div>
                    <a href={item.url} download={item.name} className="btn-icon"><Download size={16} /></a>
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
