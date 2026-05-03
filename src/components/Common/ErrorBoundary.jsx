import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy-dark flex items-center justify-center p-6 text-center">
          <div className="premium-card p-10 max-w-md w-full bg-red-500/5 border-red-500/20">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">System Malfunction</h2>
            <p className="text-red-400 text-sm leading-relaxed mb-4">
              Something went wrong while loading LAMP.
            </p>
            <p className="text-slate-400 text-[10px] leading-relaxed mb-8 uppercase tracking-widest">
              Please refresh or contact the admin.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full h-12 bg-red-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
            >
              <RefreshCw size={16} />
              Refresh Terminal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
