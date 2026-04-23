import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { QRCodeSVG } from 'qrcode.react';

/**
 * --- Prototype Application ---
 * Buildless ESM React Component (N-Koten Pattern)
 */
function App() {
  const [inputQRC, setInputQRC] = useState(null);
  const inputQRCHandler = (v) => {
    v.preventDefault();
    setInputQRC(v.target.value);
  };

  useEffect(() => {}, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <h1 className="text-5xl font-black text-amber-600 tracking-tighter">
          N-Koten
        </h1>
        <p className="text-slate-400">Prototype: qrcode.react</p>
        <input
          type="text"
          placeholder="texto"
          value={inputQRC}
          onChange={inputQRCHandler}
          className="text-slate-600"
        />
        <QRC data={inputQRC || 'oi'} />
      </div>
    </>
  );
}

/*
 * data: string;
 * size: number; 256
 * level: string; // Nível de correção de erro (L, M, Q, H)
 * hasMargin: boolean;
 * */
const QRC = ({ data, size, level, hasMargin }) => {
  return (
    <div style={{ padding: '20px' }}>
      <QRCodeSVG
        value={data}
        size={size || 256}
        level={level || 'H'}
        includeMargin={hasMargin || true}
      />
    </div>
  );
};

createRoot(document.getElementById('app_root')).render(<App />);

