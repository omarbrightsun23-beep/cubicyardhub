export type UnitSystem = 'imperial' | 'metric';
export type DepthUnit = 'inches' | 'feet' | 'cm' | 'meters';
export type ShapeType = 'rectangle' | 'cylinder' | 'triangle' | 'trapezoid';

export type ActiveTool =
  | 'universal'
  | 'slab'
  | 'footing'
  | 'dirt'
  | 'gravel'
  | 'sand'
  | 'block'
  | 'fence'
  | 'stairs'
  | 'driveway'
  | 'converters'
  | 'reference'
  | 'faq';

export interface AreaItem {
  id: string;
  name: string;
  shape: ShapeType;
  // Dimensions (stored in standard input units: ft or meters for length/width; inches/feet or cm/m for depth)
  length: number;
  width: number; // Also used as 2nd dimension or height in triangles
  depth: number;
  depthUnit: DepthUnit;
  topWidth?: number; // for trapezoid / trench
  bottomWidth?: number; // for trapezoid / trench
  quantity?: number; // for repeating piers or steps
}

export interface MaterialPreset {
  id: string;
  name: string;
  category: 'aggregate' | 'concrete' | 'soil' | 'sand' | 'mulch' | 'asphalt';
  densityLbs: number; // lbs per cubic yard
  tonsPerYard: number; // tons per cubic yard
  unitType: 'weight' | 'volume';
  typicalPricePerYard: number;
  description: string;
  compactionRate: number; // default recommended extra %
  bagOptions: {
    name: string;
    weightOrVolume: number;
    unit: 'lbs' | 'cu_ft';
  }[];
}

export interface CalculationResults {
  rawCuFt: number;
  totalCuFt: number;
  totalCuYards: number;
  totalCuMeters: number;
  totalSqFt: number;
  totalSqMeters: number;
  totalLbs: number;
  totalTons: number;
  totalKg: number;
  totalCost: number;
  wastePercent: number;
  wasteCuYards: number;
  // Packaging
  bags50lb: number;
  bags60lb: number;
  bags80lb: number;
  bagsMulch2CuFt: number;
  bagsMulch1_5CuFt: number;
  bagsMulch3CuFt: number;
  // Hauling
  pickupTripsHalfTon: number; // ~1,800 lb payload
  pickupTripsThreeQuarterTon: number; // ~3,500 lb payload
  dumpTruckTrips10Yard: number;
  readyMixTrucks8Yard: number;
  haulingStatus: 'safe_single_pickup' | 'moderate_pickup_trips' | 'heavy_bulk_delivery';
}

export type ModalType = 'share' | 'print' | 'embed' | 'about' | 'contact' | 'privacy' | 'terms' | 'disclaimer' | null;
