import React, { useState, useEffect, useRef } from 'react';
import { Crop, RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Download, Check } from 'lucide-react';

export default function CropTool({ image, onSaveHistory }) {
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [aspect, setAspect] = useState('free');
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, w: 80, h: 80 }); // Percentages
  const [croppedUrl, setCroppedUrl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (image) {
      setCroppedUrl(image.src);
    }
  }, [image]);

  const rotateRight = () => setRotation((prev) => (prev + 90) % 360);
  const rotateLeft = () => setRotation((prev) => (prev - 90 + 360) % 360);
  const toggleFlipH = () => setFlipH(!flipH);
  const toggleFlipV = () => setFlipV(!flipV);

  const applyCropAndTransform = () => {
    if (!image) return;
    const img = new Image();
    img.src = image.src;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate crop region in actual pixels
      const cropX = (cropBox.x / 100) * img.width;
      const cropY = (cropBox.y / 100) * img.height;
      const cropW = (cropBox.w / 100) * img.width;
      const cropH = (cropBox.h / 100) * img.height;

      const isRotated90 = rotation === 90 || rotation === 270;
      canvas.width = isRotated90 ? cropH : cropW;
      canvas.height = isRotated90 ? cropW : cropH;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

      const drawW = cropW;
      const drawH = cropH;

      ctx.drawImage(
        img,
        cropX, cropY, cropW, cropH,
        -drawW / 2, -drawH / 2, drawW, drawH
      );

      const url = canvas.toDataURL('image/png');
      setCroppedUrl(url);
      if (onSaveHistory) {
        onSaveHistory({ tool: 'Crop & Rotate', url, name: 'cropped_image.png' });
      }
    };
  };

  const downloadImage = () => {
    if (!croppedUrl) return;
    const link = document.createElement('a');
    link.download = 'cropped_transformed.png';
    link.href = croppedUrl;
    link.click();
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Crop size={22} /> Crop & Rotate Tool
        </div>
        <button className="btn-primary" onClick={downloadImage}>
          <Download size={18} /> Download
        </button>
      </div>

      <div className="control-grid" style={{ marginBottom: '16px' }}>
        <div className="form-group">
          <label>Rotation Controls</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={rotateLeft}><RotateCcw size={16} /> -90°</button>
            <button className="btn-secondary" onClick={rotateRight}><RotateCw size={16} /> +90°</button>
          </div>
        </div>

        <div className="form-group">
          <label>Flip Image</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className={`btn-secondary ${flipH ? 'active' : ''}`} onClick={toggleFlipH}><FlipHorizontal size={16} /> Horiz</button>
            <button className={`btn-secondary ${flipV ? 'active' : ''}`} onClick={toggleFlipV}><FlipVertical size={16} /> Vert</button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
          Crop Ratio Presets:
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className={`preset-chip ${aspect === 'free' ? 'active' : ''}`} onClick={() => { setAspect('free'); setCropBox({ x: 10, y: 10, w: 80, h: 80 }); }}>Free Crop</button>
          <button className={`preset-chip ${aspect === '1:1' ? 'active' : ''}`} onClick={() => { setAspect('1:1'); setCropBox({ x: 15, y: 15, w: 70, h: 70 }); }}>Square (1:1)</button>
          <button className={`preset-chip ${aspect === '4:3' ? 'active' : ''}`} onClick={() => { setAspect('4:3'); setCropBox({ x: 10, y: 15, w: 80, h: 60 }); }}>Standard (4:3)</button>
          <button className={`preset-chip ${aspect === '16:9' ? 'active' : ''}`} onClick={() => { setAspect('16:9'); setCropBox({ x: 5, y: 20, w: 90, h: 50.6 }); }}>Widescreen (16:9)</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button className="btn-primary" onClick={applyCropAndTransform}>
          <Check size={18} /> Render Crop & Transform
        </button>
      </div>

      <div className="preview-container">
        <img
          src={croppedUrl || image?.src}
          alt="Cropped Preview"
          className="preview-image"
          style={{
            transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
            transition: 'transform 0.2s ease'
          }}
        />
      </div>
    </div>
  );
}
