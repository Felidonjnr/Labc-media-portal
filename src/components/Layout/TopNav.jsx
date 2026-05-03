// src/components/Layout/TopNav.js
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const NAV = [
  { path: '/', label: '🏠 Home' },
  { path: '/studio', label: '⚡ Studio' },
  { path: '/sermon', label: '🎤 Sermon' },
  { path: '/followup', label: '🤝 Follow-Up' },
  { path: '/media', label: '📸 Media' },
  { path: '/calendar', label: '📅 Calendar' },
  { path: '/queue', label: '📥 Queue' },
  { path: '/history', label: '📚 History' },
  { path: '/knowledge', label: '💡 Knowledge' },
  { path: '/church', label: '⛪ Church KB' },
  { path: '/team', label: '👥 Team', adminOnly: true },
];

export default function TopNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout, isAdmin } = useAuth();

  const items = NAV.filter(n => !n.adminOnly || isAdmin);

  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        <div style={s.logo} onClick={() => navigate('/')}>
          <div style={s.logoIcon}>✝</div>
          <div>
            <div style={s.logoText}>LIGHT ASSEMBLY MEDIA OS</div>
            <div style={s.logoSub}>Media Command Center</div>
          </div>
        </div>
        <div style={s.navScroll}>
          {items.map(item => {
            const active = pathname === item.path;
            return (
              <button
                key={item.path}
                style={{ ...s.pill, ...(active ? s.pillActive : {}) }}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </button>
            );
          })}
          <button style={s.signOutBtn} onClick={logout}>Sign Out</button>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap: { background: 'white', borderBottom: '1px solid #E4E8F0', boxShadow: '0 2px 8px rgba(10,22,40,0.06)', position: 'sticky', top: 0, zIndex: 100 },
  inner: { padding: '0.6rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: '1200px', margin: '0 auto' },
  logo: { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' },
  logoIcon: { fontSize: '1.3rem', color: '#C9960C' },
  logoText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.05rem', letterSpacing: '2px', color: '#0A1628', lineHeight: 1 },
  logoSub: { fontSize: '0.55rem', color: '#9AA3B2', letterSpacing: '1.5px', textTransform: 'uppercase' },
  navScroll: { display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' },
  pill: { background: 'transparent', border: '1px solid #E4E8F0', color: '#5A6478', padding: '5px 11px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' },
  pillActive: { background: '#0A1628', border: '1px solid #0A1628', color: 'white', fontWeight: '600' },
  signOutBtn: { background: 'transparent', border: '1px solid rgba(220,38,38,0.25)', color: '#DC2626', padding: '5px 11px', borderRadius: '20px', fontSize: '0.65rem', cursor: 'pointer', whiteSpace: 'nowrap' }
};
