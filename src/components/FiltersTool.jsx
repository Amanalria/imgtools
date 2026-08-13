import React, { useState } from 'react';
import { Sliders, Download, RotateCcw, Sparkles } from 'lucide-react';
import { triggerFileDownload } from '../utils/downloadHelper';

export default function FiltersTool({ image, onSaveHistory }) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturate] = useState(100);
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [invert, setInvert] = useState(0);
  const [hue, setHue] = useState(0);
  const [filteredUrl, setFilteredUrl] = useState(null);

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setBlur(0);
    setGrayscale(0);
    setSepia(0);
    setInvert(0);
    setHue(0);
    setFilteredUrl(null);
  };

  const getFilterStyle = () => {
    return `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) grayscale(${grayscale}%) sepia(${sepia}%) invert(${invert}%) hue-rotate(${hue}deg)`;
  };

  const applyPreset = (type) => {
    resetFilters();
    if (type === 'vintage') {
      setSepia(60);
      setContrast(115);
      setBrightness(105);
    } else if (type === 'noir') {
      setGrayscale(100);
      setContrast(145);
    } else if (type === 'cyberpunk') {
      setSaturate(190);
      setHue(45);
      setContrast(130);
    } else if (type === 'dramatic') {
      setContrast(160);
      setSaturate(140);
      setBrightness(90);
    } else if (type === 'nordic') {
      setSaturate(70);
      setBrightness(110);
      setContrast(105);
      setHue(190);
    }
  };

  const exportFilteredImage = () => {
    if (!image) return;
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx.filter = getFilterStyle();
      ctx.drawImage(img, 0, 0);

      const url = canvas.toDataURL('image/png');
      setFilteredUrl(url);

      if (onSaveHistory) {
        onSaveHistory({ tool: 'Filter Studio', url, name: 'filtered_image.png' });
      }
    };
  };

  const handleDownload = () => {
    exportFilteredImage();
    triggerFileDownload(filteredUrl || image?.src, 'filtered_image.png');
  };

  return (
    <div className="glass-panel">
      <div className="panel-head">
        <div className="panel-title-text">
          <Sliders size={24} style={{ color: 'var(--accent-primary)' }} /> Pro Filters & Effects Lab
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-glass-secondary" onClick={resetFilters}>
            <RotateCcw size={16} /> Reset All
          </button>
          <button className="btn-glass-primary" onClick={handleDownload}>
            <Download size={18} /> Download Filtered Image
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label className="field-label" style={{ display: 'block', marginBottom: '10px' }}>Liquid Filter Presets:</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="glass-chip" onClick={() => resetFilters()}><Sparkles size={14} /> Normal</button>
          <button className="glass-chip" onClick={() => applyPreset('vintage')}>Vintage Film</button>
          <button className="glass-chip" onClick={() => applyPreset('noir')}>Noir B&W</button>
          <button className="glass-chip" onClick={() => applyPreset('cyberpunk')}>Cyberpunk Glow</button>
          <button className="glass-chip" onClick={() => applyPreset('dramatic')}>HDR Dramatic</button>
          <button className="glass-chip" onClick={() => applyPreset('nordic')}>Nordic Chill</button>
        </div>
      </div>

      <div className="settings-grid">
        <div className="field-box">
          <label className="field-label">Brightness: {brightness}%</label>
          <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} className="glass-slider" />
        </div>

        <div className="field-box">
          <label className="field-label">Contrast: {contrast}%</label>
          <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} className="glass-slider" />
        </div>

        <div className="field-box">
          <label className="field-label">Saturation: {saturation}%</label>
          <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturate(e.target.value)} className="glass-slider" />
        </div>

        <div className="field-box">
          <label className="field-label">Blur Radius: {blur}px</label>
          <input type="range" min="0" max="20" value={blur} onChange={(e) => setBlur(e.target.value)} className="glass-slider" />
        </div>

        <div className="field-box">
          <label className="field-label">Hue Shift: {hue}°</label>
          <input type="range" min="0" max="360" value={hue} onChange={(e) => setHue(e.target.value)} className="glass-slider" />
        </div>

        <div className="field-box">
          <label className="field-label">Grayscale: {grayscale}%</label>
          <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(e.target.value)} className="glass-slider" />
        </div>

        <div className="field-box">
          <label className="field-label">Sepia Warmth: {sepia}%</label>
          <input type="range" min="0" max="100" value={sepia} onChange={(e) => setSepia(e.target.value)} className="glass-slider" />
        </div>

        <div className="field-box">
          <label className="field-label">Invert Negative: {invert}%</label>
          <input type="range" min="0" max="100" value={invert} onChange={(e) => setInvert(e.target.value)} className="glass-slider" />
        </div>
      </div>

      <div className="canvas-preview-box">
        <img
          src={image?.src}
          alt="Filtered Preview"
          className="preview-rendered-img"
          style={{ filter: getFilterStyle() }}
        />
      </div>
    </div>
  );
}
