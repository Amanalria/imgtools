import React, { useState, useEffect } from 'react';
import { Maximize2, Download, Link, Unlink, RefreshCw } from 'lucide-react';
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
    <div className="pure-panel">
      <div className="panel-head">
        <div className="panel-title-text">
          <Maximize2 size={20} /> Image Resizer & Precision Scaler
        </div>
        <button className="btn-pure-primary" onClick={handleDownload}>
          <Download size={16} /> Export Resized Image
        </button>
      </div>

      <div className="settings-grid">
        <div className="field-box">
          <label className="field-label">Width (px)</label>
          <input
            type="number"
            className="pure-input"
            value={width}
            onChange={(e) => handleWidthChange(e.target.value)}
          />
        </div>

        <div className="field-box">
          <label className="field-label">Height (px)</label>
          <input
            type="number"
            className="pure-input"
            value={height}
            onChange={(e) => handleHeightChange(e.target.value)}
          />
        </div>

        <div className="field-box">
          <label className="field-label">Aspect Lock</label>
          <button
            className={`btn-pure-secondary ${keepAspect ? 'active' : ''}`}
            onClick={() => setKeepAspect(!keepAspect)}
            style={{ height: '42px' }}
          >
            {keepAspect ? <Link size={16} /> : <Unlink size={16} />}
            {keepAspect ? 'Aspect Locked' : 'Aspect Free'}
          </button>
        </div>

        <div className="field-box">
          <label className="field-label">Interpolation Algorithm</label>
          <select className="pure-select" value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            <option value="high">High Precision Bicubic</option>
            <option value="medium">Bilinear Smooth</option>
            <option value="low">Nearest Neighbor</option>
          </select>
        </div>

        <div className="field-box">
          <label className="field-label">Target DPI</label>
          <select className="pure-select" value={dpi} onChange={(e) => setDpi(e.target.value)}>
            <option value="72">72 DPI (Screen)</option>
            <option value="150">150 DPI (Draft Print)</option>
            <option value="300">300 DPI (High Res Print)</option>
          </select>
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
          className="pure-slider"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label className="field-label" style={{ display: 'block', marginBottom: '8px' }}>Standard Dimension Presets:</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="pure-chip" onClick={() => applyPreset(1080, 1080)}>1080x1080 (Square)</button>
          <button className="pure-chip" onClick={() => applyPreset(1080, 1920)}>1080x1920 (Story)</button>
          <button className="pure-chip" onClick={() => applyPreset(1280, 720)}>1280x720 (HD)</button>
          <button className="pure-chip" onClick={() => applyPreset(1920, 1080)}>1920x1080 (Full HD)</button>
          <button className="pure-chip" onClick={() => applyPreset(3840, 2160)}>3840x2160 (4K)</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button className="btn-pure-primary" onClick={processResize}>
          <RefreshCw size={16} /> Apply Dimensions
        </button>
      </div>

      <div className="canvas-preview-box">
        <img src={resizedUrl || image?.src} alt="Resized Preview" className="preview-rendered-img" />
      </div>
    </div>
  );
}
