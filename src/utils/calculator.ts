import { AreaItem, CalculationResults, MaterialPreset, UnitSystem } from '../types';

/**
 * Calculates raw cubic feet and square feet for a single area element
 */
export function calculateAreaVolume(
  area: AreaItem,
  unitSystem: UnitSystem
): { cuFt: number; sqFt: number } {
  const isMetric = unitSystem === 'metric';
  const qty = area.quantity && area.quantity > 0 ? area.quantity : 1;

  // Convert dimensions to FEET for calculation
  let lengthFt = 0;
  let widthFt = 0;
  let depthFt = 0;

  if (isMetric) {
    // Input is in meters/cm
    lengthFt = (area.length || 0) * 3.28084;
    widthFt = (area.width || 0) * 3.28084;

    if (area.depthUnit === 'cm') {
      depthFt = ((area.depth || 0) / 100) * 3.28084;
    } else if (area.depthUnit === 'meters') {
      depthFt = (area.depth || 0) * 3.28084;
    } else {
      // default metric depth as cm
      depthFt = ((area.depth || 0) / 100) * 3.28084;
    }
  } else {
    // Input is in feet/inches
    lengthFt = area.length || 0;
    widthFt = area.width || 0;

    if (area.depthUnit === 'inches') {
      depthFt = (area.depth || 0) / 12;
    } else if (area.depthUnit === 'feet') {
      depthFt = area.depth || 0;
    } else {
      depthFt = (area.depth || 0) / 12;
    }
  }

  let sqFt = 0;
  let cuFt = 0;

  switch (area.shape) {
    case 'cylinder': {
      // length is Diameter in ft
      const radius = lengthFt / 2;
      sqFt = Math.PI * Math.pow(radius, 2);
      cuFt = sqFt * depthFt;
      break;
    }
    case 'triangle': {
      // length is base, width is perpendicular height
      sqFt = 0.5 * lengthFt * widthFt;
      cuFt = sqFt * depthFt;
      break;
    }
    case 'trapezoid': {
      // top width and bottom width for trench/sloped ditch
      let topFt = (area.topWidth || 0);
      let bottomFt = (area.bottomWidth || 0);
      if (isMetric) {
        topFt *= 3.28084;
        bottomFt *= 3.28084;
      }
      const avgWidth = (topFt + bottomFt) / 2 || widthFt;
      sqFt = lengthFt * avgWidth;
      cuFt = lengthFt * ((topFt + bottomFt) / 2) * depthFt;
      break;
    }
    case 'rectangle':
    default: {
      sqFt = lengthFt * widthFt;
      cuFt = sqFt * depthFt;
      break;
    }
  }

  return {
    sqFt: sqFt * qty,
    cuFt: cuFt * qty
  };
}

/**
 * Calculates complete material takeoff, weights, bags, and hauling safety advisory
 */
export function calculateTakeoff(
  areas: AreaItem[],
  material: MaterialPreset,
  wastePercent: number,
  pricePerYard: number,
  unitSystem: UnitSystem
): CalculationResults {
  let rawCuFt = 0;
  let totalSqFt = 0;

  areas.forEach((area) => {
    const { cuFt, sqFt } = calculateAreaVolume(area, unitSystem);
    rawCuFt += cuFt;
    totalSqFt += sqFt;
  });

  const wasteMultiplier = 1 + (Math.max(0, wastePercent) / 100);
  const totalCuFt = rawCuFt * wasteMultiplier;
  const totalCuYards = totalCuFt / 27;
  const wasteCuYards = (rawCuFt * (Math.max(0, wastePercent) / 100)) / 27;

  // Metric conversions
  const totalCuMeters = totalCuFt * 0.0283168;
  const totalSqMeters = totalSqFt * 0.092903;

  // Weight
  const density = material.densityLbs || 2800;
  const totalLbs = totalCuYards * density;
  const totalTons = totalLbs / 2000;
  const totalKg = totalLbs * 0.45359237;

  // Cost
  const totalCost = totalCuYards * (pricePerYard || 0);

  // Bag Quantities
  let bags50lb = 0;
  let bags60lb = 0;
  let bags80lb = 0;
  let bagsMulch2CuFt = 0;
  let bagsMulch1_5CuFt = 0;
  let bagsMulch3CuFt = 0;

  if (material.unitType === 'volume' || material.category === 'mulch') {
    bagsMulch1_5CuFt = Math.ceil(totalCuFt / 1.5);
    bagsMulch2CuFt = Math.ceil(totalCuFt / 2.0);
    bagsMulch3CuFt = Math.ceil(totalCuFt / 3.0);
    // Rough weight equivalent for bags
    bags50lb = Math.ceil(totalLbs / 50);
    bags60lb = Math.ceil(totalLbs / 60);
    bags80lb = Math.ceil(totalLbs / 80);
  } else {
    bags50lb = Math.ceil(totalLbs / 50);
    bags60lb = Math.ceil(totalLbs / 60);
    bags80lb = Math.ceil(totalLbs / 80);
    bagsMulch2CuFt = Math.ceil(totalCuFt / 2.0);
    bagsMulch1_5CuFt = Math.ceil(totalCuFt / 1.5);
    bagsMulch3CuFt = Math.ceil(totalCuFt / 3.0);
  }

  // Hauling & Payload Check
  const halfTonMaxLbs = 1800; // Ford F-150 / 1500 safe bed payload
  const threeQuarterTonMaxLbs = 3500; // F-250 / 2500 safe bed payload

  const pickupTripsHalfTon = totalLbs > 0 ? Math.ceil(totalLbs / halfTonMaxLbs) : 0;
  const pickupTripsThreeQuarterTon = totalLbs > 0 ? Math.ceil(totalLbs / threeQuarterTonMaxLbs) : 0;
  const dumpTruckTrips10Yard = totalCuYards > 0 ? Math.ceil(totalCuYards / 10) : 0;
  const readyMixTrucks8Yard = totalCuYards > 0 ? Math.ceil(totalCuYards / 8) : 0;

  let haulingStatus: CalculationResults['haulingStatus'] = 'safe_single_pickup';
  if (totalLbs <= halfTonMaxLbs) {
    haulingStatus = 'safe_single_pickup';
  } else if (totalLbs <= halfTonMaxLbs * 3) {
    haulingStatus = 'moderate_pickup_trips';
  } else {
    haulingStatus = 'heavy_bulk_delivery';
  }

  return {
    rawCuFt,
    totalCuFt,
    totalCuYards,
    totalCuMeters,
    totalSqFt,
    totalSqMeters,
    totalLbs,
    totalTons,
    totalKg,
    totalCost,
    wastePercent,
    wasteCuYards,
    bags50lb,
    bags60lb,
    bags80lb,
    bagsMulch2CuFt,
    bagsMulch1_5CuFt,
    bagsMulch3CuFt,
    pickupTripsHalfTon,
    pickupTripsThreeQuarterTon,
    dumpTruckTrips10Yard,
    readyMixTrucks8Yard,
    haulingStatus
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatNumber(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0.00';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
