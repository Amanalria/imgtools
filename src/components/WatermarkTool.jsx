import React, { useState } from 'react';
import { Type, Download, RefreshCw, Grid } from 'lucide-react';
import { triggerFileDownload } from '../utils/downloadHelper';

export default function WatermarkTool({ image, onSaveHistory }) {
  const [text, setText] = useState('© ImgTools Pro');
  const [fontSize, setFontSize] = useState(42);
  const [color, setColor] = useState('#FFFFFF');
  const [opacity, setOpacity] = useState(85);
  const [position, setPosition] = useState('bottom-right');
  const [isTiled, setIsTiled] = useState(false);
  const [rotation, setRotation] = useState(0);
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

      if (isTiled) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((-30 * Math.PI) / 180);
        const stepX = fontSize * 8;
        const stepY = fontSize * 4;
        for (let x = -canvas.width * 1.5; x < canvas.width * 1.5; x += stepX) {
          for (let y = -canvas.height * 1.5; y < canvas.height * 1.5; y += stepY) {
            ctx.fillText(text, x, y);
          }
        }
        ctx.restore();
      } else {
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;

        let x = 30;
        let y = fontSize + 30;

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

        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 8;
        ctx.fillText(text, x, y);
      }

      const dataUrl = canvas.toDataURL('image/png');
      setWatermarkedUrl(dataUrl);

      if (onSaveHistory) {
        onSaveHistory({ tool: 'Watermark Tool', url: dataUrl, name: 'watermarked_image.png' });
      }
    };
  };

  const handleDownload = () => {
    applyWatermark();
    triggerFileDownload(watermarkedUrl || image?.src, 'watermarked_image.png');
  };

  return (
    <div className="glass-panel">
      <div className="panel-head">
        <div className="panel-title-text">
          <Type size={24} style={{ color: 'var(--accent-primary)' }} /> Watermark & Brand Protection Studio
        </div>
        <button className="btn-glass-primary" onClick={handleDownload}>
          <Download size={18} /> Download Watermarked Image
        </button>
      </div>

      <div className="settings-grid">
        <div className="field-box">
          <label className="field-label">Watermark Text</label>
          <input
            type="text"
            className="glass-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="field-box">
          <label className="field-label">Font Size ({fontSize}px)</label>
          <input
            type="range"
            min="12"
            max="120"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            className="glass-slider"
          />
        </div>

        <div className="field-box">
          <label className="field-label">Watermark Color</label>
          <input
            type="color"
            className="glass-input"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ height: '44px', padding: '4px' }}
          />
        </div>

        <div className="field-box">
          <label className="field-label">Opacity ({opacity}%)</label>
          <input
            type="range"
            min="10"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(parseInt(e.target.value))}
            className="glass-slider"
          />
        </div>

        <div className="field-box">
          <label className="field-label">Placement Pattern</label>
          <button className={`btn-glass-secondary ${isTiled ? 'active' : ''}`} onClick={() => setIsTiled(!isTiled)}>
            <Grid size={16} /> {isTiled ? 'Repeating Tiled Pattern' : 'Single Position'}
          </button>
        </div>

        {!isTiled && (
          <div className="field-box">
            <label className="field-label">Position Anchor</label>
            <select className="glass-select" value={position} onChange={(e) => setPosition(e.target.value)}>
              <option value="bottom-right">Bottom Right Corner</option>
              <option value="bottom-left">Bottom Left Corner</option>
              <option value="center">Center Overlay</option>
              <option value="top-right">Top Right Corner</option>
              <option value="top-left">Top Left Corner</option>
            </select>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '22px' }}>
        <button className="btn-glass-primary" onClick={applyWatermark}>
          <RefreshCw size={18} /> Apply Watermark
        </button>
      </div>

      <div className="canvas-preview-box">
        <img src={watermarkedUrl || image?.src} alt="Watermarked Preview" className="preview-rendered-img" />
      </div>
    </div>
  );
}
