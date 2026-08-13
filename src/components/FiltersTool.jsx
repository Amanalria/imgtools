import React, { useState } from 'react';
import { Sliders, Download, RotateCcw } from 'lucide-react';

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
      setSepia(50);
      setContrast(110);
      setBrightness(105);
    } else if (type === 'noir') {
      setGrayscale(100);
      setContrast(140);
    } else if (type === 'cyberpunk') {
      setSaturate(180);
      setHue(45);
      setContrast(120);
    } else if (type === 'dramatic') {
      setContrast(150);
      setSaturate(130);
      setBrightness(90);
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

  const downloadImage = () => {
    exportFilteredImage();
    const link = document.createElement('a');
    link.download = 'filtered_image.png';
    link.href = filteredUrl || image?.src;
    link.click();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Sliders size={22} /> Filters & Effects Studio
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" onClick={resetFilters}>
            <RotateCcw size={16} /> Reset
          </button>
          <button className="btn-primary" onClick={downloadImage}>
            <Download size={18} /> Download
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
          Filter Presets:
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="preset-chip" onClick={() => resetFilters()}>Original</button>
          <button className="preset-chip" onClick={() => applyPreset('vintage')}>Vintage</button>
          <button className="preset-chip" onClick={() => applyPreset('noir')}>Noir B&W</button>
          <button className="preset-chip" onClick={() => applyPreset('cyberpunk')}>Cyberpunk</button>
          <button className="preset-chip" onClick={() => applyPreset('dramatic')}>Dramatic</button>
        </div>
      </div>

      <div className="control-grid">
        <div className="form-group">
          <label>Brightness: {brightness}%</label>
          <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(e.target.value)} className="range-slider" />
        </div>

        <div className="form-group">
          <label>Contrast: {contrast}%</label>
          <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(e.target.value)} className="range-slider" />
        </div>

        <div className="form-group">
          <label>Saturation: {saturation}%</label>
          <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturate(e.target.value)} className="range-slider" />
        </div>

        <div className="form-group">
          <label>Blur: {blur}px</label>
          <input type="range" min="0" max="15" value={blur} onChange={(e) => setBlur(e.target.value)} className="range-slider" />
        </div>

        <div className="form-group">
          <label>Grayscale: {grayscale}%</label>
          <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(e.target.value)} className="range-slider" />
        </div>

        <div className="form-group">
          <label>Sepia: {sepia}%</label>
          <input type="range" min="0" max="100" value={sepia} onChange={(e) => setSepia(e.target.value)} className="range-slider" />
        </div>
      </div>

      <div className="preview-container">
        <img
          src={image?.src}
          alt="Filtered Preview"
          className="preview-image"
          style={{ filter: getFilterStyle(), transition: 'filter 0.1s ease' }}
        />
      </div>
    </div>
  );
}
