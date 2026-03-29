// src/data/bunkerStyles.js

export const BUNKER_STYLES = [
  {
    id: 'underground',
    name: 'Underground Bunker',
    tagline: 'Full excavation below your property',
    description:
      'A fully buried reinforced shelter beneath your yard or garage. Offers the highest protection from blast, weather events, and radiation.',
    icon: '⛏',
    pros: ['Maximum protection', 'Hidden from view', 'Temperature stable'],
    cons: ['High excavation cost', 'Permits required', 'Longer build time'],
    basePrice: 35000,
    imageBg: 'linear-gradient(135deg, #2c1810 0%, #4a3020 50%, #1a0f08 100%)',
  },
  {
    id: 'saferoom',
    name: 'Safe Room',
    tagline: 'Hardened interior room in your existing home',
    description:
      'Convert an existing basement room, closet, or interior space into a FEMA-rated safe room. Fastest path to shelter for most homeowners.',
    icon: '🏠',
    pros: ['No excavation needed', 'Lower cost', 'Fast installation'],
    cons: ['Limited space', 'Less blast protection', 'Visible inside home'],
    basePrice: 8500,
    imageBg: 'linear-gradient(135deg, #1a2035 0%, #2d3a52 50%, #111827 100%)',
  },
]

// Cost multipliers and adders per configuration choice
export const COST_FACTORS = {
  underground: {
    // Size (sq ft)
    size: {
      200: { label: '200 sq ft (Studio)', multiplier: 1.0 },
      400: { label: '400 sq ft (Standard)', multiplier: 1.6 },
      600: { label: '600 sq ft (Spacious)', multiplier: 2.2 },
      900: { label: '900 sq ft (Large)', multiplier: 3.1 },
    },
    // Soil type affects excavation
    soilType: {
      loose: { label: 'Loose / Sandy soil', adder: 0 },
      clay: { label: 'Clay / Dense soil', adder: 4000 },
      rock: { label: 'Rock / Bedrock', adder: 14000 },
    },
    // Depth
    depth: {
      8: { label: '8 ft deep (Basic)', adder: 0 },
      12: { label: '12 ft deep (Standard)', adder: 6000 },
      20: { label: '20 ft deep (Fortified)', adder: 18000 },
    },
    // Access
    access: {
      hatch: { label: 'Exterior hatch only', adder: 0 },
      stair: { label: 'Staircase from garage/basement', adder: 3500 },
      both: { label: 'Staircase + emergency hatch', adder: 5500 },
    },
    // Amenities
    amenities: {
      ventilation: { label: 'NBC air filtration system', adder: 3200 },
      generator: { label: 'Backup generator hookup', adder: 4500 },
      water: { label: 'Water storage tank (500 gal)', adder: 2800 },
      toilet: { label: 'Composting toilet', adder: 1800 },
      comms: { label: 'Radio / comms station', adder: 1200 },
      solar: { label: 'Solar panel connection', adder: 6500 },
    },
  },
  saferoom: {
    // Size
    size: {
      50: { label: '50 sq ft (Closet)', multiplier: 0.6 },
      100: { label: '100 sq ft (Small room)', multiplier: 1.0 },
      200: { label: '200 sq ft (Large room)', multiplier: 1.7 },
      350: { label: '350 sq ft (Basement room)', multiplier: 2.6 },
    },
    // Wall construction
    wallType: {
      steel: { label: 'Steel plate reinforcement', adder: 0 },
      concrete: { label: 'Poured concrete walls', adder: 5500 },
      icf: { label: 'Insulated Concrete Forms (ICF)', adder: 8000 },
    },
    // Location in home
    location: {
      basement: { label: 'Basement room', adder: 0 },
      firstfloor: { label: 'First floor interior room', adder: 1200 },
      garage: { label: 'Attached garage', adder: 2000 },
    },
    // Door type
    door: {
      standard: { label: 'Steel security door (FEMA rated)', adder: 0 },
      vault: { label: 'Vault-style blast door', adder: 4500 },
      hidden: { label: 'Hidden / bookcase entry', adder: 3200 },
    },
    // Amenities
    amenities: {
      ventilation: { label: 'Filtered ventilation system', adder: 1800 },
      generator: { label: 'Battery backup / UPS', adder: 2200 },
      water: { label: 'Water storage (100 gal)', adder: 900 },
      toilet: { label: 'Chemical toilet', adder: 600 },
      comms: { label: 'Radio / comms station', adder: 1200 },
      camera: { label: 'External security cameras', adder: 1500 },
    },
  },
}

export const WORK_PHASES = {
  underground: [
    {
      phase: 'Planning & Permits',
      duration: '4–8 weeks',
      diy: false,
      tasks: [
        'Soil survey and geotechnical report',
        'Structural engineering drawings',
        'Building permit application',
        'Utility locates (gas, electric, sewer)',
      ],
    },
    {
      phase: 'Excavation',
      duration: '1–2 weeks',
      diy: false,
      tasks: [
        'Excavator mobilization',
        'Dig to required depth',
        'Haul away soil (estimate 50–150 truckloads)',
        'Shore walls for safety',
      ],
    },
    {
      phase: 'Structure & Waterproofing',
      duration: '3–6 weeks',
      diy: false,
      tasks: [
        'Pour concrete slab and footings',
        'Form and pour walls + roof',
        'Install rebar and blast reinforcement',
        'Apply exterior waterproofing membrane',
        'Install drainage system',
      ],
    },
    {
      phase: 'Access & Entry',
      duration: '1–2 weeks',
      diy: 'Partial',
      tasks: [
        'Install blast-rated entry hatch or door',
        'Build staircase or ladder access',
        'Frame entry tunnel if needed',
      ],
    },
    {
      phase: 'Mechanical & Systems',
      duration: '2–4 weeks',
      diy: 'Partial',
      tasks: [
        'Electrical rough-in and panel',
        'Ventilation / NBC filtration install',
        'Plumbing rough-in',
        'Generator hookup',
        'Backfill and grade ground surface',
      ],
    },
    {
      phase: 'Finishing',
      duration: '1–3 weeks',
      diy: true,
      tasks: [
        'Interior wall finishing (paint, panels)',
        'Flooring installation',
        'Install shelving and storage',
        'Stock supplies and test all systems',
      ],
    },
  ],
  saferoom: [
    {
      phase: 'Planning & Permits',
      duration: '1–3 weeks',
      diy: false,
      tasks: [
        'Structural assessment of existing room',
        'Building permit (may be required)',
        'Engineering drawings for wall reinforcement',
      ],
    },
    {
      phase: 'Demo & Prep',
      duration: '1–3 days',
      diy: true,
      tasks: [
        'Remove existing drywall and finishes',
        'Identify and protect existing utilities',
        'Frame new walls if changing room size',
      ],
    },
    {
      phase: 'Wall & Ceiling Reinforcement',
      duration: '1–2 weeks',
      diy: false,
      tasks: [
        'Install steel plate or ICF/concrete walls',
        'Anchor reinforcement to floor and ceiling',
        'Apply ballistic insulation layer',
        'Waterproof / vapor barrier if basement',
      ],
    },
    {
      phase: 'Door & Entry',
      duration: '1–3 days',
      diy: false,
      tasks: [
        'Frame and install steel security door frame',
        'Hang and seal blast/security door',
        'Install locking hardware',
      ],
    },
    {
      phase: 'Systems',
      duration: '3–7 days',
      diy: 'Partial',
      tasks: [
        'Electrical outlets and lighting',
        'Ventilation system install',
        'Battery backup / UPS wiring',
        'Comms and camera wiring',
      ],
    },
    {
      phase: 'Finishing',
      duration: '2–5 days',
      diy: true,
      tasks: [
        'Drywall and painting',
        'Flooring',
        'Install shelving and storage',
        'Stock supplies and test all systems',
      ],
    },
  ],
}
