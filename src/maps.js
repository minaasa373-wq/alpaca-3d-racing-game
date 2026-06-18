// Map definitions for Codex Racing Game.
// Each map describes its geometry and environment so contributors can add new circuits.

export const maps = [
  {
    id: 'aurora-ring',
    name: 'オーロラリング',
    description: 'ネオンが輝く夜のサーキット。流れるようなコーナーとスタジアムの雰囲気。',
    track: {
      controlPoints: [
        [0, 0, 60],
        [60, 0, 70],
        [130, 0, 30],
        [120, 0, -50],
        [40, 0, -90],
        [-30, 0, -80],
        [-120, 0, -40],
        [-110, 0, 50],
        [-40, 0, 90]
      ],
      tubularSegments: 700,
      radius: 13,
      verticalScale: 0.08,
      edgeColor: 0xffd54f,
      material: {
        color: 0x2c2f37,
        metalness: 0.05,
        roughness: 0.85,
        emissive: 0x050607,
        emissiveIntensity: 0.3
      }
    },
    fog: { color: 0x0d1024, near: 80, far: 260 },
    background: 0x101428,
    environment: {
      treeCount: 55,
      guardRailPosts: 140,
      guardRailOffset: 1.6,
      lights: { count: 24, offset: 2.4 },
      billboards: [
        { position: [40, 0, 60], rotation: Math.PI / 5, color: 0x2196f3 },
        { position: [-80, 0, -30], rotation: -Math.PI / 3, color: 0xee5555 },
        { position: [100, 0, -20], rotation: Math.PI / 2.2, color: 0x4caf50 }
      ],
      grandstands: [
        { progress: 0.05, side: 1 },
        { progress: 0.28, side: -1 },
        { progress: 0.62, side: 1 }
      ]
    },
    trafficPresets: [
      { bodyColor: 0x29b6f6, accentColor: 0x0d47a1, laneOffset: 2.6, speed: 38, progress: 0.18 },
      { bodyColor: 0xffc107, accentColor: 0x8d6e63, laneOffset: -2.6, speed: 42, progress: 0.55 },
      { bodyColor: 0x8e24aa, accentColor: 0x5e35b1, laneOffset: 0.6, speed: 34, progress: 0.82 }
    ]
  },
  {
    id: 'sunset-canyon',
    name: 'サンセットキャニオン',
    description: '夕暮れの峡谷を駆け抜けるテクニカルコース。切り返しと連続コーナーが連なる上級者向け。',
    track: {
      controlPoints: [
        [0, 0, 65],
        [85, 0, 60],
        [130, 0, 15],
        [110, 0, -40],
        [140, 0, -85],
        [100, 0, -130],
        [35, 0, -145],
        [-30, 0, -130],
        [-60, 0, -75],
        [-120, 0, -95],
        [-150, 0, -40],
        [-110, 0, 5],
        [-140, 0, 55],
        [-95, 0, 75],
        [-75, 0, 100],
        [-30, 0, 88]
      ],
      tubularSegments: 820,
      radius: 13.5,
      verticalScale: 0.07,
      edgeColor: 0xffa040,
      material: {
        color: 0x38322b,
        metalness: 0.12,
        roughness: 0.82,
        emissive: 0x20140a,
        emissiveIntensity: 0.26
      }
    },
    fog: { color: 0x2b1c0f, near: 70, far: 220 },
    background: 0x40281b,
    environment: {
      treeCount: 38,
      guardRailPosts: 120,
      guardRailOffset: 1.8,
      lights: { count: 18, offset: 2.1 },
      billboards: [
        { position: [105, 0, 72], rotation: -Math.PI / 2.5, color: 0xff7043 },
        { position: [56, 0, -163], rotation: Math.PI / 2.5, color: 0xffc400 },
        { position: [-149, 0, -7], rotation: Math.PI / 3, color: 0x26a69a }
      ],
      grandstands: [
        { progress: 0.05, side: 1 },
        { progress: 0.42, side: -1 },
        { progress: 0.70, side: 1 }
      ]
    },
    trafficPresets: [
      { bodyColor: 0xff7043, accentColor: 0x5d4037, laneOffset: 2.2, speed: 40, progress: 0.12 },
      { bodyColor: 0x26a69a, accentColor: 0x004d40, laneOffset: -2.8, speed: 44, progress: 0.58 },
      { bodyColor: 0xffca28, accentColor: 0xbf360c, laneOffset: 1.1, speed: 36, progress: 0.82 }
    ]
  }
];

export const defaultMapId = maps[0].id;

export function getMapById(id) {
  return maps.find((map) => map.id === id) ?? maps[0];
}
