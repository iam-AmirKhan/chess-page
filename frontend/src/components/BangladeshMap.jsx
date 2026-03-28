// src/components/BangladeshMap.jsx
// SVG-based Bangladesh map with city purchase pins
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Approximate SVG coordinates within the Bangladesh outline
const CITY_DATA = [
  { name: 'Dhaka', x: 195, y: 230, count: 240, region: 'Dhaka Division' },
  { name: 'Chittagong', x: 275, y: 310, count: 89, region: 'Chattogram Division' },
  { name: 'Sylhet', x: 295, y: 155, count: 45, region: 'Sylhet Division' },
  { name: 'Rajshahi', x: 95, y: 155, count: 38, region: 'Rajshahi Division' },
  { name: 'Khulna', x: 115, y: 295, count: 31, region: 'Khulna Division' },
  { name: 'Comilla', x: 245, y: 245, count: 28, region: 'Chattogram Division' },
  { name: 'Gazipur', x: 200, y: 205, count: 22, region: 'Dhaka Division' },
  { name: 'Mymensingh', x: 200, y: 165, count: 18, region: 'Mymensingh Division' },
  { name: 'Rangpur', x: 130, y: 100, count: 15, region: 'Rangpur Division' },
  { name: 'Barisal', x: 185, y: 320, count: 12, region: 'Barisal Division' },
];

function getPinSize(count) {
  if (count >= 200) return 18;
  if (count >= 80) return 14;
  if (count >= 40) return 11;
  if (count >= 20) return 9;
  return 7;
}

function getPinColor(count) {
  if (count >= 200) return '#81b64c';
  if (count >= 80) return '#95c660';
  if (count >= 40) return '#ffbf61';
  return '#c3c3c0';
}

export default function BangladeshMap() {
  const [hovered, setHovered] = useState(null);
  const total = CITY_DATA.reduce((s, c) => s + c.count, 0);

  return (
    <div className="relative">
      <svg
        viewBox="0 30 380 380"
        className="w-full max-w-sm mx-auto"
        style={{ filter: 'drop-shadow(0 0 20px rgba(129,182,76,0.1))' }}
      >
        {/* Bangladesh outline — simplified SVG path */}
        <path
          d="M108,68 L130,55 L155,58 L175,45 L200,42 L225,50 L245,45 L270,60 L290,75 L305,95 L310,118 L318,140 L320,160 L310,178 L305,200 L310,220 L308,240 L298,258 L285,272 L278,290 L270,308 L260,322 L245,335 L230,345 L215,355 L200,360 L185,355 L170,345 L155,335 L140,320 L128,305 L115,290 L108,272 L100,255 L92,240 L88,222 L85,205 L88,185 L82,165 L80,145 L85,125 L92,108 L100,90 Z"
          fill="#1e2d1a"
          stroke="#81b64c"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />

        {/* Division borders (simplified) */}
        <path d="M155,140 L245,140 M155,200 L245,200 M130,170 L310,170" stroke="#81b64c" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="4,4" />

        {/* City pins */}
        {CITY_DATA.map((city) => {
          const size = getPinSize(city.count);
          const color = getPinColor(city.count);
          const isHovered = hovered?.name === city.name;

          return (
            <g key={city.name}
              onMouseEnter={() => setHovered(city)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Pulse ring for large cities */}
              {city.count >= 80 && (
                <circle cx={city.x} cy={city.y} r={size + 6} fill={color} opacity="0.15">
                  <animate attributeName="r" values={`${size + 4};${size + 10};${size + 4}`} dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2.5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Pin dot */}
              <circle
                cx={city.x}
                cy={city.y}
                r={isHovered ? size + 2 : size}
                fill={color}
                stroke={isHovered ? 'white' : color}
                strokeWidth={isHovered ? 2 : 0}
                style={{ transition: 'all 0.2s' }}
              />

              {/* City label for large ones */}
              {city.count >= 80 && (
                <text x={city.x + size + 4} y={city.y + 4} fill="#c3c3c0" fontSize="10" fontWeight="bold">
                  {city.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Tooltip */}
        {hovered && (
          <g>
            <rect
              x={Math.min(hovered.x + 12, 260)}
              y={hovered.y - 40}
              width={130}
              height={50}
              rx={6}
              fill="#1e2535"
              stroke="#403d39"
              strokeWidth={1}
            />
            <text x={Math.min(hovered.x + 20, 268)} y={hovered.y - 20} fill="white" fontSize="11" fontWeight="800">
              {hovered.name}
            </text>
            <text x={Math.min(hovered.x + 20, 268)} y={hovered.y - 6} fill="#81b64c" fontSize="10" fontWeight="600">
              {hovered.count} members
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
        {[
          { label: '200+ members', color: '#81b64c' },
          { label: '80–199', color: '#95c660' },
          { label: '40–79', color: '#ffbf61' },
          { label: 'Under 40', color: '#c3c3c0' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
            <span className="text-[#888]">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 text-center">
        <p className="text-xs text-[#666]">
          <span className="text-[#81b64c] font-black text-lg">{total}</span> members across <span className="text-white font-bold">{CITY_DATA.length}</span> cities
        </p>
      </div>
    </div>
  );
}
