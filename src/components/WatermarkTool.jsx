import React, { useState } from 'react';
import { Type, Download, RefreshCw } from 'lucide-react';

export default function WatermarkTool({ image, onSaveHistory }) {
  const [text, setText] = useState('ImgTools Watermark');
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState('#FFFFFF');
  const [opacity, setOpacity] = useState(80);
  const [position, setPosition] = useState('bottom-right');
  const [watermarkedUrl, setWatermarkedUrl] = useState(null);

  const applyWatermark = () => {
    if (!image) return;
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);

      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity / 100;

      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;

      let x = 20;
      let y = fontSize + 20;

      if (position === 'center') {
        x = (canvas.width - textWidth) / 2;
        y = canvas.height / 2;
      } else if (position === 'bottom-right') {
        x = canvas.width - textWidth - 30;
        y = canvas.height - 30;
      } else if (position === 'top-right') {
        x = canvas.width - textWidth - 30;
        y = fontSize + 30;
      } else if (position === 'bottom-left') {
        x = 30;
        y = canvas.height - 30;
      }

      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 6;
      ctx.fillText(text, x, y);

      const url = canvas.toDataURL('image/png');
      setWatermarkedUrl(url);

      if (onSaveHistory) {
        onSaveHistory({ tool: 'Watermark Tool', url, name: 'watermarked_image.png' });
      }
    };
  };

  const downloadImage = () => {
    if (!watermarkedUrl) return;
    const link = document.createElement('a');
    link.download = 'watermarked_image.png';
    link.href = watermarkedUrl;
    link.click();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Type size={22} /> Watermark & Text Overlay Tool
        </div>
        <button className="btn-primary" onClick={downloadImage}>
          <Download size={18} /> Download
        </button>
      </div>

      <div className="control-grid">
        <div className="form-group">
          <label>Watermark Text</label>
          <input
            type="text"
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Font Size (px): {fontSize}</label>
          <input
            type="range"
            min="12"
            max="100"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="range-slider"
          />
        </div>

        <div className="form-group">
          <label>Text Color</label>
          <input
            type="color"
            className="form-control"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ height: '42px', padding: '2px 6px' }}
          />
        </div>

        <div className="form-group">
          <label>Opacity: {opacity}%</label>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(parseInt(e.target.value))}
            className="range-slider"
          />
        </div>

        <div className="form-group">
          <label>Position</label>
          <select className="form-select" value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="center">Center</option>
            <option value="top-right">Top Right</option>
            <option value="top-left">Top Left</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button className="btn-primary" onClick={applyWatermark}>
          <RefreshCw size={18} /> Apply Watermark Overlay
        </button>
      </div>

      <div className="preview-container">
        <img src={watermarkedUrl || image?.src} alt="Watermarked Preview" className="preview-image" />
      </div>
    </div>
  );
}
