import React, { useState, useEffect } from 'react';
import { Maximize2, Download, Link, Unlink, RefreshCw } from 'lucide-react';

export default function ResizeTool({ image, onSaveHistory }) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepAspect, setKeepAspect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [scalePercent, setScalePercent] = useState(100);
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

  const handleWidthChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setWidth(val);
    if (keepAspect && aspectRatio) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (e) => {
    const val = parseInt(e.target.value) || 0;
    setHeight(val);
    if (keepAspect && aspectRatio) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const handleScaleSlider = (e) => {
    const scale = parseInt(e.target.value);
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
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

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

  const downloadImage = () => {
    if (!resizedUrl) return;
    const link = document.createElement('a');
    link.download = `resized_${width}x${height}.png`;
    link.href = resizedUrl;
    link.click();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Maximize2 size={22} /> Image Resizer & Scaler
        </div>
        <button className="btn-primary" onClick={downloadImage}>
          <Download size={18} /> Download
        </button>
      </div>

      <div className="control-grid">
        <div className="form-group">
          <label>Width (px)</label>
          <input
            type="number"
            className="form-control"
            value={width}
            onChange={handleWidthChange}
          />
        </div>

        <div className="form-group">
          <label>Height (px)</label>
          <input
            type="number"
            className="form-control"
            value={height}
            onChange={handleHeightChange}
          />
        </div>

        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
          <button
            className={`btn-secondary ${keepAspect ? 'active' : ''}`}
            onClick={() => setKeepAspect(!keepAspect)}
            style={{ height: '42px' }}
          >
            {keepAspect ? <Link size={16} /> : <Unlink size={16} />}
            {keepAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
          </button>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label>Scale Percentage: {scalePercent}%</label>
        <input
          type="range"
          min="10"
          max="300"
          value={scalePercent}
          onChange={handleScaleSlider}
          className="range-slider"
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
          Quick Dimension Presets:
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="preset-chip" onClick={() => applyPreset(1080, 1080)}>Instagram (1080x1080)</button>
          <button className="preset-chip" onClick={() => applyPreset(1080, 1920)}>Story/Reel (1080x1920)</button>
          <button className="preset-chip" onClick={() => applyPreset(1280, 720)}>YouTube Thumbnail (1280x720)</button>
          <button className="preset-chip" onClick={() => applyPreset(1920, 1080)}>Full HD (1920x1080)</button>
          <button className="preset-chip" onClick={() => applyPreset(500, 500)}>Avatar (500x500)</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button className="btn-primary" onClick={processResize}>
          <RefreshCw size={18} /> Apply New Dimensions
        </button>
      </div>

      <div className="preview-container">
        <img src={resizedUrl || image?.src} alt="Resized Preview" className="preview-image" />
      </div>
    </div>
  );
}
