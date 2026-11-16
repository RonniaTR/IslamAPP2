import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { countRoute } from '../services/diagnostics';

// Sayfa açılışlarını YALNIZ cihazda sayar (services/diagnostics.js). Ekrana bir şey çizmez.
export default function RouteMeter() {
  const { pathname } = useLocation();
  useEffect(() => { countRoute(pathname); }, [pathname]);
  return null;
}
