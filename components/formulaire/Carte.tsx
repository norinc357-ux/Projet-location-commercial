'use client';

import { useEffect, useRef, useState } from 'react';
import type { Langue } from '@/lib/formulaire/i18n';
import 'leaflet/dist/leaflet.css';

type Point = [number, number];
const MONTREAL: Point = [45.5089, -73.5617];

/**
 * Zone dessinée (facultative) : chaque toucher ajoute un sommet du polygone.
 * Leaflet + tuiles OpenStreetMap ; à l'étape 3, on pourra passer à Mapbox sans changer la valeur stockée.
 * Alternative sans carte (clavier, lecteur d'écran) : les secteurs et les adresses du même écran.
 */
export function Carte({ valeur, changer, langue }: { valeur: Point[]; changer: (v: unknown) => void; langue: Langue }) {
  const boite = useRef<HTMLDivElement>(null);
  const carte = useRef<import('leaflet').Map | null>(null);
  const forme = useRef<import('leaflet').Polygon | import('leaflet').Polyline | null>(null);
  const points = useRef<Point[]>(valeur);
  const [ouverte, setOuverte] = useState(valeur.length > 0);
  const [panne, setPanne] = useState(false);
  points.current = valeur;

  useEffect(() => {
    if (!ouverte || !boite.current || carte.current) return;
    let annule = false;
    import('leaflet').then((L) => {
      if (annule || !boite.current) return;
      const m = L.map(boite.current, { center: MONTREAL, zoom: 11, scrollWheelZoom: false });
      const tuiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap',
      }).addTo(m);
      let erreurs = 0;
      tuiles.on('tileerror', () => { if (++erreurs > 4) setPanne(true); });
      m.on('click', (e: import('leaflet').LeafletMouseEvent) => {
        changer([...points.current, [Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5))]]);
      });
      carte.current = m;
      dessiner(L);
    });
    return () => { annule = true; };
  }, [ouverte]); // eslint-disable-line react-hooks/exhaustive-deps

  const dessiner = (L: typeof import('leaflet')) => {
    const m = carte.current;
    if (!m) return;
    forme.current?.remove();
    const pts = points.current;
    if (pts.length >= 3) forme.current = L.polygon(pts, { color: '#0E1E3A', weight: 2, fillColor: '#B08D57', fillOpacity: 0.25 }).addTo(m);
    else if (pts.length) forme.current = L.polyline(pts, { color: '#0E1E3A', weight: 2, dashArray: '4 4' }).addTo(m);
  };
  useEffect(() => {
    if (carte.current) import('leaflet').then(dessiner);
  }, [valeur]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { carte.current?.remove(); carte.current = null; }, []);

  if (!ouverte)
    return (
      <button type="button" className="bouton bouton-secondaire" onClick={() => setOuverte(true)}>
        {langue === 'fr' ? 'Dessiner une zone sur la carte' : 'Draw an area on the map'}
      </button>
    );

  return (
    <div className="carte">
      <p className="indice">
        {langue === 'fr'
          ? 'Touchez la carte pour placer au moins 3 points autour de la zone qui vous intéresse.'
          : 'Tap the map to place at least 3 points around the area you are interested in.'}
      </p>
      <div ref={boite} className="carte-boite" role="application" aria-label={langue === 'fr' ? 'Carte de la région de Montréal' : 'Map of the Montréal area'} />
      {panne && (
        <p className="erreur" role="status">
          {langue === 'fr' ? 'La carte n’a pas pu se charger. Pas de souci : vos secteurs et adresses suffisent.' : 'The map could not load. No problem: your areas and addresses are enough.'}
        </p>
      )}
      <div className="carte-actions">
        <span className="indice" aria-live="polite">
          {valeur.length >= 3
            ? langue === 'fr' ? `Zone tracée (${valeur.length} points)` : `Area drawn (${valeur.length} points)`
            : langue === 'fr' ? `${valeur.length} point(s) sur 3 minimum` : `${valeur.length} of at least 3 points`}
        </span>
        <button type="button" className="lien-bouton" disabled={!valeur.length} onClick={() => changer(valeur.slice(0, -1))}>
          {langue === 'fr' ? 'Annuler le dernier point' : 'Undo last point'}
        </button>
        <button type="button" className="lien-bouton" disabled={!valeur.length} onClick={() => changer([])}>
          {langue === 'fr' ? 'Effacer' : 'Clear'}
        </button>
      </div>
    </div>
  );
}
