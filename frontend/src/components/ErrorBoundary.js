import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error?.message || String(error) };
  }

  componentDidCatch(error, info) {
    console.error('App Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A1F14] flex flex-col items-center justify-center max-w-[430px] mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-[#F5F5DC] mb-2">Bir hata oluştu</h2>
          <p className="text-sm text-[#A8B5A0] mb-2">Uygulama beklenmedik bir hata ile karşılaştı.</p>
          {this.state.errorMsg && <p className="text-xs text-red-400/70 mb-4 break-all max-w-xs">{this.state.errorMsg}</p>}
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
            className="px-6 py-3 rounded-xl text-sm font-bold text-[#0A1F14]"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #B8860B)' }}
            data-testid="error-retry">
            Yeniden Başlat
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
