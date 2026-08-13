import React, { useState, useEffect } from 'react';
import { Maximize2, Download, Link, Unlink, RefreshCw, Settings2 } from 'lucide-react';
import { triggerFileDownload } from '../utils/downloadHelper';

export default function ResizeTool({ image, onSaveHistory }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [scalePercent, setScalePercent] = useState(100);
  const [dpi, setDpi] = useState('72');
  const [algorithm, setAlgorithm] = useState('high');
  const [bgColor, setBgColor] = useState('transparent');
  const [resizedUrl, setResizedUrl] = useState(null);

  useEffect(() => {
    if (image) {
      setWidth(image.width);
      setHeight(image.height);
      setAspectRatio(image.width / image.height);
      setScalePercent(100);
      setResizedUrl(image.src);
    }
  }, [image]);

  const handleWidthChange = (val) => {
    const w = parseInt(val) || 0;
    setWidth(w);
    if (keepAspect && aspectRatio) {
      setHeight(Math.round(w / aspectRatio));
    }
  };

  const handleHeightChange = (val) => {
    const h = parseInt(val) || 0;
    setHeight(h);
    if (keepAspect && aspectRatio) {
      setWidth(Math.round(h * aspectRatio));
    }
  };

  const handleScaleSlider = (scale) => {
    setScalePercent(scale);
    if (image) {
      const newW = Math.round((image.width * scale) / 100);
      const newH = Math.round((image.height * scale) / 100);
      setWidth(newW);
      setHeight(newH);
    }
  };

  const applyPreset = (w, h) => {
    setWidth(w);
    setHeight(h);
    setKeepAspect(false);
  };

  const processResize = () => {
    if (!image || width <= 0 || height <= 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (bgColor !== 'transparent') {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = algorithm;

    const imgElement = new Image();
    imgElement.src = image.src;
    imgElement.onload = () => {
      ctx.drawImage(imgElement, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/png');
      setResizedUrl(dataUrl);
      if (onSaveHistory) {
        onSaveHistory({ tool: 'Resize', url: dataUrl, name: `resized_${width}x${height}.png` });
      }
    };
  };

  const handleDownload = () => {
    processResize();
    const url = resizedUrl || image?.src;
    triggerFileDownload(url, `resized_${width}x${height}.png`);
  };

  return (
    <div className="glass-panel">
      <div className="panel-head">
        <div className="panel-title-text">
          <Maximize2 size={24} style={{ color: 'var(--accent-primary)' }} /> Image Resizer & Precision Scaler
        </div>
        <button className="btn-glass-primary" onClick={handleDownload}>
          <Download size={18} /> Download Resized
        </button>
      </div>

      <div className="settings-grid">
        <div className="field-box">
          <label className="field-label">Width (Pixels)</label>
          <input
            type="number"
            className="glass-input"
            value={width}
            onChange={(e) => handleWidthChange(e.target.value)}
          />
        </div>

        <div className="field-box">
          <label className="field-label">Height (Pixels)</label>
          <input
            type="number"
            className="glass-input"
            value={height}
            onChange={(e) => handleHeightChange(e.target.value)}
          />
        </div>

        <div className="field-box">
          <label className="field-label">Aspect Lock</label>
          <button
            className={`btn-glass-secondary ${keepAspect ? 'active' : ''}`}
            onClick={() => setKeepAspect(!keepAspect)}
            style={{ height: '44px' }}
          >
            {keepAspect ? <Link size={16} /> : <Unlink size={16} />}
            {keepAspect ? 'Aspect Locked' : 'Aspect Free'}
          </button>
        </div>

        <div className="field-box">
          <label className="field-label">Interpolation</label>
          <select className="glass-select" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            <option value="high">High Quality Bicubic</option>
            <option value="medium">Bilinear Smooth</option>
            <option value="low">Nearest Neighbor (Pixel Art)</option>
          </select>
        </div>

        <div className="field-box">
          <label className="field-label">Print DPI Preset</label>
          <select className="glass-select" value={dpi} onChange={(e) => setDpi(e.target.value)}>
            <option value="72">72 DPI (Web & Screen)</option>
            <option value="150">150 DPI (Draft Print)</option>
            <option value="300">300 DPI (High Res Print)</option>
          </select>
        </div>

        <div className="field-box">
          <label className="field-label">Canvas Filler</label>
          <input
            type="color"
            className="glass-input"
            value={bgColor === 'transparent' ? '#ffffff' : bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{ height: '44px', padding: '4px' }}
          />
        </div>
      </div>

      <div className="field-box" style={{ marginBottom: '20px' }}>
        <label className="field-label">Scale Percentage: {scalePercent}%</label>
        <input
          type="range"
          min="10"
          max="400"
          value={scalePercent}
          onChange={(e) => handleScaleSlider(parseInt(e.target.value))}
          className="glass-slider"
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label className="field-label" style={{ display: 'block', marginBottom: '10px' }}>Quick Social & Screen Presets:</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="glass-chip" onClick={() => applyPreset(1080, 1080)}>Instagram Square (1080x1080)</button>
          <button className="glass-chip" onClick={() => applyPreset(1080, 1920)}>Story/Reel (1080x1920)</button>
          <button className="glass-chip" onClick={() => applyPreset(1280, 720)}>YouTube HD (1280x720)</button>
          <button className="glass-chip" onClick={() => applyPreset(1920, 1080)}>Full HD (1920x1080)</button>
          <button className="glass-chip" onClick={() => applyPreset(3840, 2160)}>4K Ultra HD (3840x2160)</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button className="btn-glass-primary" onClick={processResize}>
          <RefreshCw size={18} /> Apply Resized Dimensions
        </button>
      </div>

      <div className="canvas-preview-box">
        <img src={resizedUrl || image?.src} alt="Resized Preview" className="preview-rendered-img" />
      </div>
    </div>
  );
}
