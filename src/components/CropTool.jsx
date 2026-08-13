import React, { useState, useEffect } from 'react';
import { Crop, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Download, Check, Circle } from 'lucide-react';
import { triggerFileDownload } from '../utils/downloadHelper';

export default function CropTool({ image, onSaveHistory }) {
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [aspect, setAspect] = useState('free');
  const [circleCrop, setCircleCrop] = useState(false);
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 });
  const [croppedUrl, setCroppedUrl] = useState(null);

  useEffect(() => {
    if (image) {
      setCroppedUrl(image.src);
    }
  }, [image]);

  const applyTransforms = () => {
    if (!image) return;
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const cropX = (cropBox.x / 100) * img.width;
      const cropY = (cropBox.y / 100) * img.height;
      const cropW = (cropBox.w / 100) * img.width;
      const cropH = (cropBox.h / 100) * img.height;

      const isRotated90 = Math.abs(rotation % 180) === 90;
      canvas.width = isRotated90 ? cropH : cropW;
      canvas.height = isRotated90 ? cropW : cropH;

      if (circleCrop) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
        ctx.clip();
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      ctx.drawImage(
        img,
        cropX, cropY, cropW, cropH,
        -cropW / 2, -cropH / 2, cropW, cropH
      );

      const dataUrl = canvas.toDataURL('image/png');
      setCroppedUrl(dataUrl);

      if (onSaveHistory) {
        onSaveHistory({ tool: 'Crop & Rotate', url: dataUrl, name: 'cropped_transformed.png' });
      }
    };
  };

  const handleDownload = () => {
    applyTransforms();
    triggerFileDownload(croppedUrl || image?.src, 'cropped_transformed.png');
  };

  return (
    <div className="glass-panel">
      <div className="panel-head">
        <div className="panel-title-text">
          <Crop size={24} style={{ color: 'var(--accent-primary)' }} /> Crop, Rotate & Circle Mask Studio
        </div>
        <button className="btn-glass-primary" onClick={handleDownload}>
          <Download size={18} /> Download Crop
        </button>
      </div>

      <div className="settings-grid">
        <div className="field-box">
          <label className="field-label">Fine Rotation ({rotation}°)</label>
          <input
            type="range"
            min="-180"
            max="180"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="glass-slider"
          />
        </div>

        <div className="field-box">
          <label className="field-label">Quick Rotate</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-glass-secondary" onClick={() => setRotation((prev) => (prev - 90 + 360) % 360)}><RotateCcw size={16} /> -90°</button>
            <button className="btn-glass-secondary" onClick={() => setRotation((prev) => (prev + 90) % 360)}><RotateCw size={16} /> +90°</button>
          </div>
        </div>

        <div className="field-box">
          <label className="field-label">Flip Image</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={`btn-glass-secondary ${flipH ? 'active' : ''}`} onClick={() => setFlipH(!flipH)}><FlipHorizontal size={16} /> Horiz</button>
            <button className={`btn-glass-secondary ${flipV ? 'active' : ''}`} onClick={() => setFlipV(!flipV)}><FlipVertical size={16} /> Vert</button>
          </div>
        </div>

        <div className="field-box">
          <label className="field-label">Circular Avatar Mask</label>
          <button className={`btn-glass-secondary ${circleCrop ? 'active' : ''}`} onClick={() => setCircleCrop(!circleCrop)}>
            <Circle size={16} /> {circleCrop ? 'Circle Mask ON' : 'Standard Box'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '22px' }}>
        <label className="field-label" style={{ display: 'block', marginBottom: '10px' }}>Aspect Ratio Presets:</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className={`glass-chip ${aspect === 'free' ? 'active' : ''}`} onClick={() => { setAspect('free'); setCropBox({ x: 10, y: 10, w: 80, h: 80 }); }}>Freeform</button>
          <button className={`glass-chip ${aspect === '1:1' ? 'active' : ''}`} onClick={() => { setAspect('1:1'); setCropBox({ x: 15, y: 15, w: 70, h: 70 }); }}>Square (1:1)</button>
          <button className={`glass-chip ${aspect === '4:3' ? 'active' : ''}`} onClick={() => { setAspect('4:3'); setCropBox({ x: 10, y: 15, w: 80, h: 60 }); }}>Standard (4:3)</button>
          <button className={`glass-chip ${aspect === '16:9' ? 'active' : ''}`} onClick={() => { setAspect('16:9'); setCropBox({ x: 5, y: 20, w: 90, h: 50.6 }); }}>Widescreen (16:9)</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button className="btn-glass-primary" onClick={applyTransforms}>
          <Check size={18} /> Render Crop & Rotation
        </button>
      </div>

      <div className="canvas-preview-box">
        <img
          src={croppedUrl || image?.src}
          alt="Cropped Preview"
          className="preview-rendered-img"
          style={{
            transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
            borderRadius: circleCrop ? '50%' : 'var(--radius-sm)'
          }}
        />
      </div>
    </div>
  );
}
