export interface ReferenceRow {
  project: string;
  dimensions: string;
  depthInches: number;
  cuFt: number;
  cuYards: number;
  weightTonsConcrete: number;
  weightTonsGravel: number;
  notes: string;
}

export const COMMON_PROJECT_ROWS: ReferenceRow[] = [
  {
    project: 'Standard Patio / Shed Slab',
    dimensions: '10 ft × 10 ft',
    depthInches: 4,
    cuFt: 33.3,
    cuYards: 1.23,
    weightTonsConcrete: 2.50,
    weightTonsGravel: 1.73,
    notes: 'Standard 4" pour on compacted 4" gravel base'
  },
  {
    project: 'Medium Patio / Gazebo Pad',
    dimensions: '12 ft × 12 ft',
    depthInches: 4,
    cuFt: 48.0,
    cuYards: 1.78,
    weightTonsConcrete: 3.60,
    weightTonsGravel: 2.49,
    notes: 'Requires ~80 80lb bags or 2 yd³ ready-mix'
  },
  {
    project: '1-Car Garage Floor / Extension',
    dimensions: '12 ft × 20 ft',
    depthInches: 4,
    cuFt: 80.0,
    cuYards: 2.96,
    weightTonsConcrete: 6.01,
    weightTonsGravel: 4.15,
    notes: 'Consider 5" thickness if parking heavy SUVs'
  },
  {
    project: '2-Car Garage Slab',
    dimensions: '20 ft × 20 ft',
    depthInches: 4,
    cuFt: 133.3,
    cuYards: 4.94,
    weightTonsConcrete: 10.02,
    weightTonsGravel: 6.92,
    notes: 'Order 5.5 yards with ready-mix truck delivery'
  },
  {
    project: 'Single-Lane Driveway',
    dimensions: '10 ft × 30 ft',
    depthInches: 6,
    cuFt: 150.0,
    cuYards: 5.56,
    weightTonsConcrete: 11.28,
    weightTonsGravel: 7.78,
    notes: '6" thickness with #4 rebar grid recommended'
  },
  {
    project: 'Double-Lane Driveway',
    dimensions: '20 ft × 40 ft',
    depthInches: 6,
    cuFt: 400.0,
    cuYards: 14.81,
    weightTonsConcrete: 30.07,
    weightTonsGravel: 20.74,
    notes: 'Requires 2 full ready-mix mixer truckloads'
  },
  {
    project: 'Raised Garden Bed (Soil)',
    dimensions: '4 ft × 8 ft',
    depthInches: 12,
    cuFt: 32.0,
    cuYards: 1.19,
    weightTonsConcrete: 2.40,
    weightTonsGravel: 1.30,
    notes: 'Screened topsoil + compost blend'
  },
  {
    project: 'Landscape Flower Bed (Mulch)',
    dimensions: '20 ft × 4 ft',
    depthInches: 3,
    cuFt: 20.0,
    cuYards: 0.74,
    weightTonsConcrete: 1.50,
    weightTonsGravel: 0.30,
    notes: 'Requires ~10 standard 2 cu ft mulch bags'
  },
  {
    project: 'Continuous Strip Footing',
    dimensions: '40 ft × 1.5 ft',
    depthInches: 12,
    cuFt: 60.0,
    cuYards: 2.22,
    weightTonsConcrete: 4.50,
    weightTonsGravel: 3.11,
    notes: 'Below local frost line with continuous rebar'
  }
];

export interface FAQItem {
  q: string;
  a: string;
  category: 'formula' | 'weights' | 'cost' | 'concrete';
  searchVolume?: string;
  kd?: string;
  intent?: string;
}

export const FAQ_DATA: FAQItem[] = [
  // 1. Core Unit Definition & Conversion Questions
  {
    q: 'How big is a cubic yard?',
    a: 'A cubic yard is a 3-dimensional cube measuring 3 ft × 3 ft × 3 ft (equal to 27 cubic feet or roughly the size of a standard domestic washing machine). In liquid volume, it is equal to 201.97 US liquid gallons or 764.55 liters.',
    category: 'formula',
    searchVolume: '2,900/mo',
    kd: '14%'
  },
  {
    q: 'How to calculate cubic yards?',
    a: 'Cubic Yards = (Length ft × Width ft × Depth ft) ÷ 27.\nIf your depth is measured in inches, divide by 12 first (e.g. 4 inches = 4 ÷ 12 = 0.333 ft), or multiply Length (ft) × Width (ft) × Depth (in) and divide the total by 324.',
    category: 'formula',
    searchVolume: '2,900/mo',
    kd: '47%'
  },
  {
    q: 'How many yards in a ton?',
    a: 'It depends on material density:\n• Crushed Gravel / Stone (1.4 t/yd³): 1 ton ≈ 0.71 cubic yards.\n• Screened Topsoil (1.1 t/yd³): 1 ton ≈ 0.91 cubic yards.\n• Ready-Mix Concrete (2.03 t/yd³): 1 ton ≈ 0.49 cubic yards.\n• Masonry Sand (1.35 t/yd³): 1 ton ≈ 0.74 cubic yards.',
    category: 'formula',
    searchVolume: '2,900/mo',
    kd: '8%'
  },
  {
    q: 'How many cubic yards in a ton?',
    a: 'For crushed gravel: ≈ 0.71 yd³. For screened topsoil / dirt: ≈ 0.91 yd³. For ready-mix concrete: ≈ 0.49 yd³. For construction sand: ≈ 0.74 yd³. For shredded wood mulch: ≈ 2.50 yd³.',
    category: 'formula',
    searchVolume: '1,900/mo',
    kd: '8%'
  },
  {
    q: 'How to calculate cubic inches?',
    a: 'Cubic Inches = Length (in) × Width (in) × Depth (in). There are 1,728 cubic inches in 1 cubic foot, and exactly 46,656 cubic inches in 1 cubic yard.',
    category: 'formula',
    searchVolume: '1,900/mo',
    kd: '13%'
  },
  {
    q: 'How many cubic yards in a tonne (Metric)?',
    a: 'A metric tonne (1,000 kg / 2,204.6 lbs) is ≈ 1.102 US short tons (2,000 lbs). 1 metric tonne of crushed gravel equals approximately 0.78 cubic yards (0.60 cubic meters).',
    category: 'formula',
    searchVolume: '1,600/mo',
    kd: '12%'
  },
  {
    q: 'How many tonnes in a cubic yard?',
    a: 'One cubic yard of standard crushed gravel stone weighs ≈ 1.27 metric tonnes (1,270 kg). One cubic yard of poured ready-mix concrete weighs ≈ 1.84 metric tonnes (1,840 kg).',
    category: 'formula',
    searchVolume: '1,600/mo',
    kd: '12%'
  },
  {
    q: 'How many tons is in a yard of material?',
    a: 'Approximate short tons (2,000 lbs) per cubic yard:\n• Concrete = 2.03 tons (4,050 lbs)\n• Crushed Gravel / Stone = 1.40 tons (2,800 lbs)\n• Masonry Sand = 1.35 tons (2,700 lbs)\n• Topsoil / Dirt = 1.10 tons (2,200 lbs)\n• Shredded Mulch = 0.40 tons (800 lbs)',
    category: 'formula',
    searchVolume: '1,000/mo',
    kd: '12%'
  },
  {
    q: '1 ton is how many cubic yards?',
    a: '1 ton (2,000 lbs) of crushed stone / gravel = 0.71 yd³. 1 ton of topsoil / fill dirt = 0.91 yd³. 1 ton of poured concrete = 0.49 yd³. 1 ton of construction sand = 0.74 yd³.',
    category: 'formula',
    searchVolume: '880/mo',
    kd: '0%'
  },
  {
    q: 'How to calculate cubic yards from square feet?',
    a: 'Cubic Yards = (Square Feet × Depth in Inches) ÷ 324.\nFor example, a 300 sq ft patio slab poured 4 inches thick: (300 × 4) ÷ 324 = 3.70 cubic yards.',
    category: 'formula',
    searchVolume: '590/mo',
    kd: '21%'
  },

  // 2. Material Weight Questions (Featured Snippet Targets)
  {
    q: 'How much does a yard of concrete weigh?',
    a: 'Standard poured ready-mix concrete weighs approximately 4,050 lbs (2.03 short tons) per cubic yard. Lightweight concrete mixes weigh ~3,000 lbs (1.5 tons), while heavy-duty reinforced mixes exceed 4,200 lbs.',
    category: 'weights',
    searchVolume: '2,900/mo',
    kd: '7%'
  },
  {
    q: 'How much does a yard of gravel weigh?',
    a: 'Standard crushed stone / #57 gravel weighs approximately 2,800 lbs (1.40 short tons) per cubic yard. Dense crusher run (road base with fines) can weigh up to 3,000 lbs (1.5 tons) per yard.',
    category: 'weights',
    searchVolume: '1,900/mo',
    kd: '3%'
  },
  {
    q: 'How much does a cubic yard of dirt weigh?',
    a: 'Screened dry topsoil weighs 2,000 to 2,200 lbs (1.0 to 1.1 tons). Wet dirt, heavy clay subsoil, or saturated fill dirt can exceed 2,600 to 3,000 lbs (1.3 to 1.5 tons) per cubic yard.',
    category: 'weights',
    searchVolume: '1,600/mo',
    kd: '6%'
  },
  {
    q: 'How much does a yard of topsoil weigh?',
    a: 'One cubic yard of screened dry topsoil weighs approximately 2,200 lbs (1.1 short tons). Premium organic compost-soil garden blends weigh ~1,800 to 2,000 lbs per yard.',
    category: 'weights',
    searchVolume: '1,600/mo',
    kd: '13%'
  },
  {
    q: 'How much does a yard of mulch weigh?',
    a: 'Dry bark or shredded wood mulch weighs approximately 600 to 800 lbs (0.3 to 0.4 short tons) per cubic yard. Wet, freshly dyed mulch can weigh up to 1,000 lbs per yard.',
    category: 'weights',
    searchVolume: '1,300/mo',
    kd: '5%'
  },
  {
    q: 'How much does a yard of sand weigh?',
    a: 'Dry construction / masonry sand weighs approximately 2,600 to 2,700 lbs (1.30 to 1.35 short tons) per cubic yard. Wet packed sand weighs up to 3,000 lbs (1.5 tons) per yard.',
    category: 'weights',
    searchVolume: '1,300/mo',
    kd: '2%'
  },

  // 3. Cost, Truckload & Contractor Questions
  {
    q: 'How much does a yard of concrete cost?',
    a: 'Ready-mix concrete costs average $125 to $175 per cubic yard delivered. Total cost depends on regional batch plant pricing, compressive strength PSI (3000 vs 4000 PSI), fuel surcharges, and short-load fees.',
    category: 'cost',
    searchVolume: '1,600/mo',
    kd: '13%'
  },
  {
    q: 'How much is a 10-yard truck of concrete?',
    a: 'A full 10-yard concrete mixer truckload typically costs between $1,250 and $1,750 delivered, plus local sales tax and potential environmental disposal fees.',
    category: 'cost',
    searchVolume: '1,300/mo',
    kd: '9%'
  },
  {
    q: 'How many yards of concrete in a truck?',
    a: 'A standard commercial concrete transit mixer truck holds 8 to 11 cubic yards of wet concrete. Most residential deliveries utilize 9 or 10-yard barrel trucks.',
    category: 'cost',
    searchVolume: '1,300/mo',
    kd: '7%'
  },
  {
    q: 'How much to pave a driveway?',
    a: 'Asphalt paving averages $3 to $7 per sq ft ($3,000 to $7,000 for a standard 20×20 ft 2-car driveway). Poured concrete driveways average $6 to $12 per sq ft ($3,600 to $7,200+ for a 20×30 ft driveway) with superior 30+ year lifespan.',
    category: 'cost',
    searchVolume: '1,300/mo',
    kd: '14%'
  },
  {
    q: 'How much chippings do I need?',
    a: 'Multiply your project area (sq ft) by spread depth (typically 2 inches for paths and driveways), divide by 324 to get cubic yards, then multiply by 1.4 to calculate required tonnage from the quarry.',
    category: 'cost',
    searchVolume: '1,300/mo',
    kd: '12%'
  },
  {
    q: 'Figure out yards of gravel?',
    a: 'Length (ft) × Width (ft) × (Depth in ÷ 12) ÷ 27 = Cubic Yards. Always add 10% to 15% extra for sub-base compaction and ground settling.',
    category: 'cost',
    searchVolume: '1,000/mo',
    kd: '9%'
  },

  // 4. Concrete Slabs, Footings & Bag Count Questions
  {
    q: 'How to calculate cubic yards of concrete?',
    a: 'Length (ft) × Width (ft) × Thickness (ft) ÷ 27. For example, a 10×10 ft slab at 4 inches thick: 10 × 10 × (4 ÷ 12) ÷ 27 = 1.23 cubic yards (add 10% waste buffer = 1.35 yards).',
    category: 'concrete',
    searchVolume: '480/mo',
    intent: 'Informational'
  },
  {
    q: 'How many bags of concrete make a cubic yard?',
    a: 'It takes exactly:\n• Forty-five (45) 80 lb bags (yield 0.60 cu ft each)\n• Sixty (60) 60 lb bags (yield 0.45 cu ft each)\n• Ninety (90) 40 lb bags (yield 0.30 cu ft each)\nto make 1 cubic yard (27 cu ft) of concrete.',
    category: 'concrete',
    searchVolume: 'High Intent',
    intent: 'High Intent'
  },
  {
    q: 'How much extra material should I add for waste?',
    a: 'Add 5% to 10% for concrete slabs, footings, and curbs to account for form bowing and uneven ground. Add 10% to 15% for compacted gravel, crusher run stone, and topsoil grading due to mechanical tamp compaction.',
    category: 'concrete',
    searchVolume: 'High Intent',
    intent: 'High Intent'
  },
  {
    q: 'Can a pickup truck haul a cubic yard of gravel?',
    a: 'No. 1 cubic yard of gravel weighs ≈ 2,800 lbs, which exceeds the standard 1,500 to 1,800 lb payload limit of a standard 1/2-ton pickup (e.g. Ford F-150, Silverado 1500). Hauling 1 yard safely requires 2 separate trips or a heavy-duty 1-ton (F-350 / 3500) truck.',
    category: 'concrete',
    searchVolume: 'Safety Intent',
    intent: 'Safety Intent'
  }
];
