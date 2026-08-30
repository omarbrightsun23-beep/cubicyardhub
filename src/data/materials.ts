import { MaterialPreset } from '../types';

export const MATERIAL_PRESETS: Record<string, MaterialPreset> = {
  gravel: {
    id: 'gravel',
    name: 'Crushed Stone / Gravel',
    category: 'aggregate',
    densityLbs: 2800,
    tonsPerYard: 1.40,
    unitType: 'weight',
    typicalPricePerYard: 65.00,
    description: '#57 limestone or crushed bluestone. Ideal for driveways, French drains, and concrete aggregate subbase.',
    compactionRate: 10,
    bagOptions: [
      { name: '50 lb Bag', weightOrVolume: 50, unit: 'lbs' },
      { name: '60 lb Bag', weightOrVolume: 60, unit: 'lbs' },
      { name: '80 lb Bag', weightOrVolume: 80, unit: 'lbs' }
    ]
  },
  concrete: {
    id: 'concrete',
    name: 'Ready-Mix Concrete',
    category: 'concrete',
    densityLbs: 4050,
    tonsPerYard: 2.03,
    unitType: 'weight',
    typicalPricePerYard: 145.00,
    description: 'Standard 3,000 to 4,000 PSI ready-mix concrete batch for slabs, patios, footings, and curbs.',
    compactionRate: 10,
    bagOptions: [
      { name: '50 lb Quick-Set', weightOrVolume: 50, unit: 'lbs' },
      { name: '60 lb Sakrete', weightOrVolume: 60, unit: 'lbs' },
      { name: '80 lb Quikrete', weightOrVolume: 80, unit: 'lbs' }
    ]
  },
  dirt: {
    id: 'dirt',
    name: 'Screened Topsoil / Dirt',
    category: 'soil',
    densityLbs: 2200,
    tonsPerYard: 1.10,
    unitType: 'weight',
    typicalPricePerYard: 45.00,
    description: 'Fine-screened black garden topsoil. Used for lawn leveling, garden beds, and sod prep.',
    compactionRate: 15,
    bagOptions: [
      { name: '40 lb Soil Bag', weightOrVolume: 40, unit: 'lbs' },
      { name: '0.75 cu ft Bag', weightOrVolume: 0.75, unit: 'cu_ft' },
      { name: '1.0 cu ft Bag', weightOrVolume: 1.0, unit: 'cu_ft' }
    ]
  },
  sand: {
    id: 'sand',
    name: 'Construction / Masonry Sand',
    category: 'sand',
    densityLbs: 2700,
    tonsPerYard: 1.35,
    unitType: 'weight',
    typicalPricePerYard: 55.00,
    description: 'Washed concrete sand or fine masonry sand for paver bedding, sandbox, and pool lining.',
    compactionRate: 10,
    bagOptions: [
      { name: '50 lb Play Sand', weightOrVolume: 50, unit: 'lbs' },
      { name: '60 lb Mason Sand', weightOrVolume: 60, unit: 'lbs' },
      { name: '80 lb Concrete Sand', weightOrVolume: 80, unit: 'lbs' }
    ]
  },
  pea_gravel: {
    id: 'pea_gravel',
    name: 'Pea Gravel (3/8" Smooth)',
    category: 'aggregate',
    densityLbs: 2700,
    tonsPerYard: 1.35,
    unitType: 'weight',
    typicalPricePerYard: 75.00,
    description: 'Smooth round river pea pebbles. Perfect for decorative walkways, patio infill, and dog runs.',
    compactionRate: 5,
    bagOptions: [
      { name: '50 lb Pebble Bag', weightOrVolume: 50, unit: 'lbs' },
      { name: '0.5 cu ft Bag', weightOrVolume: 0.5, unit: 'cu_ft' }
    ]
  },
  river_rock: {
    id: 'river_rock',
    name: 'River Rock (1" - 3")',
    category: 'aggregate',
    densityLbs: 2850,
    tonsPerYard: 1.42,
    unitType: 'weight',
    typicalPricePerYard: 85.00,
    description: 'Decorative naturally rounded river stones for dry creek beds, border edging, and xeriscaping.',
    compactionRate: 5,
    bagOptions: [
      { name: '50 lb Rock Bag', weightOrVolume: 50, unit: 'lbs' },
      { name: '0.5 cu ft Bag', weightOrVolume: 0.5, unit: 'cu_ft' }
    ]
  },
  crusher_run: {
    id: 'crusher_run',
    name: 'Crusher Run / Road Base (#411)',
    category: 'aggregate',
    densityLbs: 3000,
    tonsPerYard: 1.50,
    unitType: 'weight',
    typicalPricePerYard: 50.00,
    description: 'Crushed stone blended with stone dust for high compaction paver and asphalt base layers.',
    compactionRate: 15,
    bagOptions: [
      { name: '50 lb Base Bag', weightOrVolume: 50, unit: 'lbs' },
      { name: '80 lb Base Bag', weightOrVolume: 80, unit: 'lbs' }
    ]
  },
  mulch: {
    id: 'mulch',
    name: 'Bark / Hardwood Mulch',
    category: 'mulch',
    densityLbs: 800,
    tonsPerYard: 0.40,
    unitType: 'volume',
    typicalPricePerYard: 38.00,
    description: 'Double-shredded hardwood or cedar bark mulch for weed barrier and moisture retention.',
    compactionRate: 10,
    bagOptions: [
      { name: '1.5 cu ft Bag', weightOrVolume: 1.5, unit: 'cu_ft' },
      { name: '2.0 cu ft Standard', weightOrVolume: 2.0, unit: 'cu_ft' },
      { name: '3.0 cu ft Jumbo', weightOrVolume: 3.0, unit: 'cu_ft' }
    ]
  },
  asphalt: {
    id: 'asphalt',
    name: 'Hot-Mix Asphalt (HMA)',
    category: 'asphalt',
    densityLbs: 3900,
    tonsPerYard: 1.95,
    unitType: 'weight',
    typicalPricePerYard: 110.00,
    description: 'Commercial blacktop paving mix for residential driveways, parking lots, and walkways.',
    compactionRate: 12,
    bagOptions: [
      { name: '50 lb Cold Patch', weightOrVolume: 50, unit: 'lbs' },
      { name: '60 lb Cold Patch', weightOrVolume: 60, unit: 'lbs' }
    ]
  }
};
