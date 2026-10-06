import React, { useState, useEffect } from 'react';
import { Menu, X, Hexagon, LogOut, User as UserIcon, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signInWithGoogle, signOutUser, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Servicios', href: '#servicios' },
    { name: 'Tecnologías', href: '#tecnologias' },
    { name: 'Proceso', href: '#proceso' },
    { name: 'Proyectos', href: '#proyectos' },
    { name: 'Empresa', href: '#empresa' },
    { name: 'Portal B2B', href: '#portal-b2b' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/95 backdrop-blur-md border-slate-200 shadow-xs py-3' : 'bg-transparent border-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <Hexagon className="w-8 h-8 text-industrial-accent group-hover:text-slate-900 transition-colors" />
          <span className="text-xl font-bold tracking-tight text-slate-900">PROTOGEN<span className="text-industrial-accent">3D</span></span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-slate-700 hover:text-industrial-accent transition-colors">
              {link.name}
            </a>
          ))}

          {/* User Sign-In or User Profile */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <a href="#portal-b2b" className="flex items-center gap-2 text-xs font-mono text-slate-800 hover:text-industrial-accent">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'Usuario'} className="w-7 h-7 rounded-full border border-slate-300" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-industrial-accent flex items-center justify-center font-bold text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden xl:inline font-semibold">{user.displayName || user.email?.split('@')[0]}</span>
              </a>

              <button
                type="button"
                onClick={signOutUser}
                title="Cerrar sesión"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 bg-white transition-all shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>Acceso Google</span>
            </button>
          )}

          <a href="#cotizacion" className="btn-primary text-sm px-4 py-2">
            Subir Archivo
          </a>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-slate-700 hover:text-slate-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg p-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-slate-700 hover:text-industrial-accent"
            >
              {link.name}
            </a>
          ))}

          {user ? (
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-600">{user.email}</span>
              <button 
                onClick={() => { signOutUser(); setMobileMenuOpen(false); }}
                className="text-xs font-mono text-red-600 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => { signInWithGoogle(); setMobileMenuOpen(false); }}
              className="btn-secondary text-xs flex items-center justify-center gap-2 py-2"
            >
              <span>Iniciar Sesión con Google</span>
            </button>
          )}

          <a href="#cotizacion" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-center">
            Subir Archivo
          </a>
        </div>
      )}
    </header>
  );
}
