// ============================================================
//  VIRUS EVOLUTION – game.js
//  All game logic runs client-side; Flask only serves files.
// ============================================================

// ===================== VIRUS SVG DEFINITIONS =====================
const VIRUS_TYPES = [
  {
    id: 'coronavirus', name: 'Coronavirus',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="28" fill="#1a3a2a" stroke="#00cc66" stroke-width="1.5"/>
      <circle cx="50" cy="50" r="22" fill="#0d2a1a" stroke="#00ff88" stroke-width="0.8" opacity="0.6"/>
      ${Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180,x=50+28*Math.cos(a),y=50+28*Math.sin(a),ex=50+42*Math.cos(a),ey=50+42*Math.sin(a);return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#00ff88" stroke-width="1.5"/><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="3.5" fill="#00cc44" stroke="#00ff88" stroke-width="0.8"/>`}).join('')}
      <circle cx="50" cy="50" r="10" fill="#004422" stroke="#00ff88" stroke-width="1"/>
    </svg>`
  },
  {
    id: 'hiv', name: 'HIV',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="30" fill="#2a1a00" stroke="#ff8800" stroke-width="1.5"/>
      <polygon points="50,28 60,42 55,58 45,58 40,42" fill="#1a0e00" stroke="#ffaa33" stroke-width="1.2"/>
      ${Array.from({length:16},(_,i)=>{const a=i*22.5*Math.PI/180,x=50+30*Math.cos(a),y=50+30*Math.sin(a),ex=50+36*Math.cos(a),ey=50+36*Math.sin(a);return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#ff6600" stroke-width="1"/><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="2" fill="#ff8800"/>`}).join('')}
      <circle cx="50" cy="50" r="8" fill="#330a00" stroke="#ff6600" stroke-width="1"/>
    </svg>`
  },
  {
    id: 'phage', name: 'Bacteriophage T4',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,15 62,22 62,38 50,45 38,38 38,22" fill="#1a1a2a" stroke="#8888ff" stroke-width="1.5"/>
      <rect x="46" y="45" width="8" height="20" fill="#0a0a1a" stroke="#8888ff" stroke-width="1"/>
      <line x1="50" y1="65" x2="36" y2="78" stroke="#6666ff" stroke-width="1.2"/><circle cx="36" cy="78" r="2.5" fill="#8888ff"/>
      <line x1="50" y1="65" x2="64" y2="78" stroke="#6666ff" stroke-width="1.2"/><circle cx="64" cy="78" r="2.5" fill="#8888ff"/>
      <line x1="50" y1="60" x2="32" y2="70" stroke="#6666ff" stroke-width="1"/><circle cx="32" cy="70" r="2" fill="#8888ff"/>
      <line x1="50" y1="60" x2="68" y2="70" stroke="#6666ff" stroke-width="1"/><circle cx="68" cy="70" r="2" fill="#8888ff"/>
      <line x1="50" y1="55" x2="30" y2="62" stroke="#5555ee" stroke-width="0.8"/><circle cx="30" cy="62" r="1.8" fill="#7777ff"/>
      <line x1="50" y1="55" x2="70" y2="62" stroke="#5555ee" stroke-width="0.8"/><circle cx="70" cy="62" r="1.8" fill="#7777ff"/>
      <circle cx="50" cy="30" r="5" fill="#222244" stroke="#aaaaff" stroke-width="0.8"/>
    </svg>`
  },
  {
    id: 'ebola', name: 'Ebola',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,50 Q30,25 50,30 Q70,35 75,50 Q70,75 50,70 Q30,75 25,65 Q15,55 20,50Z" fill="#2a0a00" stroke="#ff2200" stroke-width="1.5"/>
      <path d="M22,50 Q32,28 50,32 Q68,36 73,50 Q68,72 50,68 Q32,72 27,64 Q17,54 22,50Z" fill="none" stroke="#ff4400" stroke-width="0.5" opacity="0.5"/>
      <ellipse cx="50" cy="50" rx="20" ry="16" fill="#1a0500" stroke="#ff3300" stroke-width="0.8"/>
      ${Array.from({length:8},(_,i)=>{const x=25+i*7;return `<line x1="${x}" y1="${50-4+Math.sin(i)*3}" x2="${x}" y2="${50+4+Math.cos(i)*2}" stroke="#ff2200" stroke-width="0.8" opacity="0.7"/>`}).join('')}
    </svg>`
  },
  {
    id: 'influenza', name: 'Influenza',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="26" fill="#1a2a1a" stroke="#44cc44" stroke-width="1.5"/>
      ${Array.from({length:10},(_,i)=>{const a=i*36*Math.PI/180,x=50+26*Math.cos(a),y=50+26*Math.sin(a),ex=50+38*Math.cos(a),ey=50+38*Math.sin(a);return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#66ff66" stroke-width="1.8"/><ellipse cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" rx="3" ry="4" fill="#33aa33" stroke="#66ff66" stroke-width="0.8" transform="rotate(${i*36},${ex.toFixed(1)},${ey.toFixed(1)})"/>`}).join('')}
      ${Array.from({length:8},(_,i)=>{const a=(i*45+18)*Math.PI/180,x=50+26*Math.cos(a),y=50+26*Math.sin(a),ex=50+34*Math.cos(a),ey=50+34*Math.sin(a);return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#88ff44" stroke-width="1.2"/><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="2.5" fill="#44bb22"/>`}).join('')}
    </svg>`
  },
  {
    id: 'rabies', name: 'Rabies',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="22" y="35" width="56" height="30" rx="15" ry="15" fill="#1a0a2a" stroke="#aa44ff" stroke-width="1.5"/>
      <ellipse cx="25" cy="50" rx="10" ry="14" fill="#110820" stroke="#aa44ff" stroke-width="1"/>
      ${Array.from({length:14},(_,i)=>{const y=36+i*2;return `<line x1="${22+i*0.3}" y1="${y}" x2="${78-i*0.3}" y2="${y}" stroke="#bb55ff" stroke-width="0.4" opacity="0.4"/>`}).join('')}
      ${Array.from({length:8},(_,i)=>{const a=i*45*Math.PI/180,x=50+5*Math.cos(a),y=50+5*Math.sin(a);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#cc66ff" opacity="0.6"/>`}).join('')}
    </svg>`
  },
  {
    id: 'poxvirus', name: 'Poxvirus',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="30" width="64" height="40" rx="8" ry="8" fill="#2a1a00" stroke="#dd8800" stroke-width="1.5"/>
      <rect x="22" y="34" width="56" height="32" rx="5" ry="5" fill="#1a1000" stroke="#aa6600" stroke-width="0.8"/>
      ${Array.from({length:5},(_,i)=>Array.from({length:3},(_,j)=>`<circle cx="${28+i*12}" cy="${38+j*10}" r="3" fill="#333300" stroke="#ffaa00" stroke-width="0.8"/>`).join('')).join('')}
      <line x1="18" y1="50" x2="82" y2="50" stroke="#cc8800" stroke-width="0.8" opacity="0.5"/>
      <line x1="50" y1="30" x2="50" y2="70" stroke="#cc8800" stroke-width="0.8" opacity="0.5"/>
    </svg>`
  },
  {
    id: 'herpes', name: 'Herpes',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="32" fill="none" stroke="#ff6688" stroke-width="1" opacity="0.4"/>
      <circle cx="50" cy="50" r="26" fill="#2a0a12" stroke="#ff4466" stroke-width="1.2"/>
      <circle cx="50" cy="50" r="19" fill="#1a0a0f" stroke="#dd2244" stroke-width="0.8"/>
      ${Array.from({length:20},(_,i)=>{const a=i*18*Math.PI/180,x=50+19*Math.cos(a),y=50+19*Math.sin(a),ex=50+22*Math.cos(a),ey=50+22*Math.sin(a);return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#ff4466" stroke-width="0.8"/>`}).join('')}
      <polygon points="50,35 56,44 53,54 47,54 44,44" fill="#110008" stroke="#ff2244" stroke-width="0.8"/>
      <circle cx="50" cy="50" r="6" fill="#220010" stroke="#ff4466" stroke-width="0.8"/>
    </svg>`
  },
  {
    id: 'rotavirus', name: 'Rotavirus',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="30" fill="#0a1a2a" stroke="#0088ff" stroke-width="1.5"/>
      <circle cx="50" cy="50" r="22" fill="#051015" stroke="#0066cc" stroke-width="1"/>
      ${Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180,x1=50+22*Math.cos(a),y1=50+22*Math.sin(a),x2=50+30*Math.cos(a),y2=50+30*Math.sin(a);return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#0099ff" stroke-width="1.8"/>`}).join('')}
      ${Array.from({length:12},(_,i)=>{const a=(i*30+15)*Math.PI/180,x=50+22*Math.cos(a),y=50+22*Math.sin(a);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#0077dd"/>`}).join('')}
      <circle cx="50" cy="50" r="8" fill="#001020" stroke="#00aaff" stroke-width="1"/>
    </svg>`
  },
  {
    id: 'adenovirus', name: 'Adenovirus',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,20 67,30 67,70 50,80 33,70 33,30" fill="#1a2a00" stroke="#88ff00" stroke-width="1.5"/>
      ${[0,60,120,180,240,300].map(d=>{const r=d*Math.PI/180,x=50+28*Math.cos(r-Math.PI/2),y=50+28*Math.sin(r-Math.PI/2),ex=50+38*Math.cos(r-Math.PI/2),ey=50+38*Math.sin(r-Math.PI/2);return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#aaff22" stroke-width="1.2"/><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="3" fill="#66cc00" stroke="#aaff22" stroke-width="0.8"/>`}).join('')}
      <polygon points="50,30 58,35 58,65 50,70 42,65 42,35" fill="#0a1500" stroke="#66cc00" stroke-width="0.8"/>
      <circle cx="50" cy="50" r="6" fill="#1a2800" stroke="#aaff22" stroke-width="0.8"/>
    </svg>`
  },
  {
    id: 'norovirus', name: 'Norovirus',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="28" fill="#1a1a00" stroke="#cccc00" stroke-width="1.5"/>
      ${Array.from({length:20},(_,i)=>{const a=i*18*Math.PI/180,x=50+22*Math.cos(a),y=50+22*Math.sin(a);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="#888800" stroke="#cccc00" stroke-width="0.5"/>`}).join('')}
      ${Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180,x=50+14*Math.cos(a),y=50+14*Math.sin(a);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5" fill="#aaaa00"/>`}).join('')}
      <circle cx="50" cy="50" r="5" fill="#111100" stroke="#ffff00" stroke-width="0.8"/>
    </svg>`
  },
  {
    id: 'papillomavirus', name: 'Papillomavirus',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,20 62,26 68,38 64,52 54,60 46,60 36,52 32,38 38,26" fill="#200a20" stroke="#ff44ff" stroke-width="1.5"/>
      ${Array.from({length:9},(_,i)=>{const a=(i*40+20)*Math.PI/180,x=50+28*Math.cos(a),y=50+28*Math.sin(a);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#330a33" stroke="#ff44ff" stroke-width="0.8"/>`}).join('')}
      ${Array.from({length:9},(_,i)=>{const a=(i*40)*Math.PI/180,x=50+18*Math.cos(a),y=50+18*Math.sin(a);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#220a22" stroke="#dd22dd" stroke-width="0.6"/>`}).join('')}
      <circle cx="50" cy="50" r="6" fill="#110011" stroke="#ff44ff" stroke-width="0.8"/>
    </svg>`
  },
  {
    id: 'marburg', name: 'Marburg',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M15,50 Q20,20 50,25 Q80,30 85,50 Q80,80 50,75 Q20,80 15,50Z" fill="#1a0a00" stroke="#ff6600" stroke-width="1.5"/>
      <path d="M17,50 Q22,24 50,27 Q78,32 83,50 Q78,76 50,73 Q22,76 17,50Z" fill="none" stroke="#ff4400" stroke-width="0.5" opacity="0.5"/>
      <path d="M80,50 Q90,40 92,50 Q90,60 80,50Z" fill="#1a0500" stroke="#ff6600" stroke-width="1"/>
      ${Array.from({length:10},(_,i)=>{const x=20+i*6,y=50+Math.sin(i*0.9)*6;return `<circle cx="${x}" cy="${y.toFixed(1)}" r="2" fill="#ff4400" opacity="0.7"/>`}).join('')}
    </svg>`
  },
  {
    id: 'dengue', name: 'Dengue',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="28" fill="#001a2a" stroke="#0099cc" stroke-width="1.5"/>
      <circle cx="50" cy="50" r="22" fill="#000f1a" stroke="#0077aa" stroke-width="1"/>
      ${Array.from({length:18},(_,i)=>{const a=i*20*Math.PI/180,x=50+22*Math.cos(a),y=50+22*Math.sin(a),ex=50+27*Math.cos(a),ey=50+27*Math.sin(a);return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#00aaff" stroke-width="1"/>`}).join('')}
      <circle cx="50" cy="50" r="8" fill="#001018" stroke="#00bbff" stroke-width="1"/>
      <circle cx="50" cy="50" r="3" fill="#003344" stroke="#00ccff" stroke-width="0.8"/>
    </svg>`
  },
  {
    id: 'zika', name: 'Zika',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="27" fill="#00100a" stroke="#00ffaa" stroke-width="1.5"/>
      <circle cx="50" cy="50" r="20" fill="#000a05" stroke="#00cc88" stroke-width="1"/>
      ${Array.from({length:16},(_,i)=>{const a=i*22.5*Math.PI/180,x=50+20*Math.cos(a),y=50+20*Math.sin(a),ex=50+26*Math.cos(a),ey=50+26*Math.sin(a);return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#00ffaa" stroke-width="1.2"/><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="1.8" fill="#00cc88"/>`}).join('')}
      <circle cx="50" cy="50" r="7" fill="#002215" stroke="#00ffaa" stroke-width="0.8"/>
    </svg>`
  },
  {
    id: 'rhinovirus', name: 'Rhinovirus',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,22 63,29 68,43 63,57 50,64 37,57 32,43 37,29" fill="#1a0a1a" stroke="#ff88ff" stroke-width="1.5"/>
      ${Array.from({length:8},(_,i)=>{const a=(i*45)*Math.PI/180,x=50+22*Math.cos(a),y=50+22*Math.sin(a);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="#2a0a2a" stroke="#ff66ff" stroke-width="0.8"/>`}).join('')}
      ${Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180,x=50+12*Math.cos(a),y=50+12*Math.sin(a);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.5" fill="#dd44dd"/>`}).join('')}
      <circle cx="50" cy="50" r="5" fill="#110011" stroke="#ff88ff" stroke-width="0.8"/>
    </svg>`
  }
];

// ===================== HOST TYPES =====================
const HOST_TYPES = [
  { id: 'birds', emoji: '🐦', name: 'Birds', desc: 'Fast spread via migration, airborne bonus', bonus: 'airborne' },
  { id: 'mammals', emoji: '🐷', name: 'Animals', desc: 'Zoonotic jump easier, moderate all-round', bonus: 'zoonotic' },
  { id: 'humans', emoji: '👤', name: 'Humans', desc: 'Urban spread bonus, high infectivity in cities', bonus: 'urban' },
  { id: 'fish', emoji: '🐟', name: 'Marine', desc: 'Aquatic spread, resistant to heat, weak on land', bonus: 'aquatic' },
  { id: 'plants', emoji: '🌿', name: 'Plants', desc: 'Insect vector bonus, slow but unstoppable in tropics', bonus: 'insect' },
  { id: 'insects', emoji: '🦟', name: 'Insects', desc: 'Tropical bonus, vector-borne, weak in cold', bonus: 'tropical' }
];

// ===================== DIFFICULTY =====================
const DIFFICULTIES = [
  { id: 'easy', name: 'EASY', desc: 'Slow AI, weak medicine, 50 starting EP', startEP: 50, aiSpeed: 0.4, spawnRate: 300, medicineStr: 0.5 },
  { id: 'normal', name: 'NORMAL', desc: 'Balanced challenge, 20 starting EP', startEP: 20, aiSpeed: 1.0, spawnRate: 180, medicineStr: 1.0 },
  { id: 'hard', name: 'HARD', desc: 'Fast AI, strong medicine, 10 starting EP', startEP: 10, aiSpeed: 2.0, spawnRate: 120, medicineStr: 1.8 },
  { id: 'nightmare', name: 'NIGHTMARE', desc: 'Extreme difficulty, 0 starting EP', startEP: 0, aiSpeed: 4.0, spawnRate: 60, medicineStr: 3.0 }
];

// ===================== UPGRADES =====================
const UPGRADES_DEFINITION = {
  environment: [
    { id: 'cold1', name: 'Cold Resistance I', maxLevel: 3, costs: [15, 35, 70],
      descs: ['Antifreeze proteins prevent ice crystal formation in viral capsid', 'Cryoprotectant layers allow replication at sub-zero temperatures', 'The virus freezes solid and revives upon thawing — unstoppable in Greenland'],
      effects: ['+Cold region survival', '+Cold region spread', '+Arctic unlock'], tab: 'environment' },
    { id: 'heat1', name: 'Heat Resistance', maxLevel: 3, costs: [15, 35, 70],
      descs: ['Heat-shock proteins stabilize viral envelope above 40°C', 'Lipid membrane reinforcement enables spread in 50°C+ environments', 'Thermophilic adaptation — the virus thrives in conditions that kill competitors'],
      effects: ['+Desert survival', '+Desert spread bonus', '+Middle East x2'], tab: 'environment' },
    { id: 'humid1', name: 'Humidity Adaptation', maxLevel: 3, costs: [20, 45, 90],
      descs: ['Mucus layer prevents desiccation in high-humidity environments', 'Aerosol stability in 100% humidity — Central Africa becomes a breeding ground', 'Hydrophilic capsid coating maximizes spread in all tropical biomes'],
      effects: ['+Tropical spread', '+Rainforest optimal', '+All tropical bonus'], tab: 'environment' },
    { id: 'uv1', name: 'UV Resistance', maxLevel: 2, costs: [25, 55],
      descs: ['DNA repair mechanisms protect viral genome from UV damage', 'Melanin-like compounds absorb and neutralize UV radiation'],
      effects: ['+Surface survival', '+Open environment active'], tab: 'environment' },
    { id: 'aqua1', name: 'Aquatic Survival', maxLevel: 2, costs: [30, 60],
      descs: ['Salt-tolerant proteins enable survival in rivers and lakes', 'Marine adaptation — the virus survives ocean transport to reach Oceania'],
      effects: ['+Water spread', '+Oceania reachable'], tab: 'environment' }
  ],
  transmission: [
    { id: 'infect1', name: 'Infectivity', maxLevel: 4, costs: [10, 25, 50, 100],
      descs: ['More efficient cell entry via receptor binding optimization', 'Optimized spike protein binding to host cell receptors', 'Perfect binding affinity — almost every exposure results in infection', 'Maximum pathogen efficiency — unprecedented infectivity in viral history'],
      effects: ['+15% infection rate', '+30% infection rate', '+50% infection rate', '+75% infection rate'], tab: 'transmission' },
    { id: 'airborne1', name: 'Airborne Transmission', maxLevel: 3, costs: [20, 45, 90],
      descs: ['Lightweight capsid allows respiratory droplet transmission', 'Aerosol persistence for hours — spreads between buildings and regions', 'True airborne — wind currents carry the virus across entire continents'],
      effects: ['+Regional air spread', '+Adjacent region spread', '+Continental airborne'], tab: 'transmission' },
    { id: 'water1', name: 'Waterborne Transmission', maxLevel: 2, costs: [20, 50],
      descs: ['Hydrophilic proteins enable survival in water supply systems', 'Chlorine resistance — survives municipal water treatment'],
      effects: ['+Water spread', '+Coastal region speed'], tab: 'transmission' },
    { id: 'vector1', name: 'Vector-Borne (Insect)', maxLevel: 2, costs: [25, 55],
      descs: ['Mosquito salivary gland tropism enables insect-mediated transmission', 'Multi-vector adaptation — spreads via mosquitoes, flies, and ticks'],
      effects: ['+Tropical insect spread', '+Doubled tropical spread'], tab: 'transmission' },
    { id: 'fecal1', name: 'Fecal-Oral Route', maxLevel: 2, costs: [15, 35],
      descs: ['Enteric stability allows survival in digestive tract and water supplies', 'Extreme environmental persistence — viable for weeks on surfaces'],
      effects: ['+Contamination spread', '+High surface stability'], tab: 'transmission' },
    { id: 'sexual1', name: 'Sexual Transmission', maxLevel: 2, costs: [20, 40],
      descs: ['Mucosal affinity enables transmission through intimate contact', 'Asymptomatic carriers spread the virus unknowingly for months'],
      effects: ['+Undetectable slow spread', '+Long latency evasion'], tab: 'transmission' },
    { id: 'zoonotic1', name: 'Zoonotic Jump', maxLevel: 2, costs: [30, 65],
      descs: ['Polyvalent receptor binding allows cross-species infection', 'Pandemic potential — simultaneous spread across multiple species'],
      effects: ['+Cross-species infection', '+Multi-species spread'], tab: 'transmission' }
  ],
  survival: [
    { id: 'drug1', name: 'Drug Resistance', maxLevel: 3, costs: [25, 55, 100],
      descs: ['Active site mutations prevent antiviral drug binding', 'Multi-drug efflux pumps expel antiviral compounds', 'Pan-resistant genome — no existing antiviral can stop it'],
      effects: ['-20% antiviral effect', '-50% antiviral effect', '-95% antiviral effect'], tab: 'survival' },
    { id: 'immune1', name: 'Immune Evasion', maxLevel: 3, costs: [30, 65, 120],
      descs: ['Surface protein camouflage mimics host cell markers', 'Antigen mimicry confuses antibodies — the immune system attacks itself', 'Stealth virus — completely invisible to innate and adaptive immunity'],
      effects: ['-25% immune detection', '-Mimics host proteins', '-Near invisible to immunity'], tab: 'survival' },
    { id: 'antigen1', name: 'Antigen Shifting', maxLevel: 2, costs: [40, 85],
      descs: ['Antigenic drift — surface proteins shift slightly each generation', 'Antigenic shift — complete surface protein replacement every few weeks'],
      effects: ['+Periodic protein change', '+Vaccines lose effect faster'], tab: 'survival' },
    { id: 'mutrate1', name: 'Mutation Rate', maxLevel: 3, costs: [20, 45, 85],
      descs: ['Error-prone RNA polymerase increases genetic diversity', 'Hypermutation — thousands of variants generated per replication cycle', 'Directed evolution — mutations are no longer random but adaptive'],
      effects: ['+Faster evolution', '+Double mutation speed', '+Auto-beneficial mutations'], tab: 'survival' },
    { id: 'latency1', name: 'Latency', maxLevel: 2, costs: [25, 55],
      descs: ['Dormant integration into host genome — spreads silently for weeks', 'Stress-triggered reactivation — hides then strikes when host is vulnerable'],
      effects: ['+Pre-symptom spread', '+Dormancy reactivation'], tab: 'survival' },
    { id: 'biofilm1', name: 'Biofilm Formation', maxLevel: 2, costs: [30, 60],
      descs: ['Extracellular matrix production enables surface colonization', 'Biofilm fortress — survives disinfectants and extreme temperatures on surfaces'],
      effects: ['+Surface survival longer', '+Disinfectant resistance'], tab: 'survival' }
  ],
  lethality: [
    { id: 'virulence1', name: 'Virulence', maxLevel: 3, costs: [20, 45, 90],
      descs: ['Enhanced cytopathic effects accelerate cell destruction', 'Multi-organ tropism — simultaneous attack on lungs, liver, and kidneys', 'Endothelial destruction causes systemic bleeding — near 100% fatality'],
      effects: ['+Fast host damage', '+Severe symptoms', '+Hemorrhagic effects'], tab: 'lethality' },
    { id: 'toxin1', name: 'Toxin Production', maxLevel: 2, costs: [25, 55],
      descs: ['Viral proteases release cytotoxic compounds that destroy competing pathogens', 'Superantigen production — massive immune damage to competing organisms'],
      effects: ['+Damage rival viruses', '+Powerful cytotoxins'], tab: 'lethality' },
    { id: 'cytokine1', name: 'Cytokine Storm', maxLevel: 2, costs: [35, 75],
      descs: ['Inflammatory cascade causes the immune system to destroy its own host', 'Runaway cytokine storm — organ failure in hours'],
      effects: ['+Immune overreaction', '+Deadly immune cascade'], tab: 'lethality' },
    { id: 'neuro1', name: 'Neurotropism', maxLevel: 1, costs: [40],
      descs: ['Blood-brain barrier penetration enables neurological infection and behavior modification'],
      effects: ['+Nervous system infection'], tab: 'lethality', requiresHost: 'humans' },
    { id: 'hemorrhagic1', name: 'Hemorrhagic Fever', maxLevel: 1, costs: [50],
      descs: ['Vascular endothelium destruction causes catastrophic internal hemorrhaging'],
      effects: ['+Bleeding, high lethality'], tab: 'lethality' }
  ],
  special: [
    { id: 'avian1', name: 'Avian Adaptation', maxLevel: 2, costs: [20, 45],
      descs: ['Migration bonus — spreads along migratory routes in season', 'Migratory route spread — jumps between distant regions automatically'],
      effects: ['+Migration spread', '+Long-distance jump'], tab: 'special', requiresHost: 'birds' },
    { id: 'enteric1', name: 'Enteric Specialization', maxLevel: 1, costs: [25],
      descs: ['Gut infection bonus — water spread rate doubled in marine regions'],
      effects: ['+Marine spread x2'], tab: 'special', requiresHost: 'fish' },
    { id: 'photodisrupt1', name: 'Photosynthesis Disruption', maxLevel: 1, costs: [30],
      descs: ['Weaken plant hosts faster — insect vectors become highly efficient'],
      effects: ['+Weaker hosts, faster vectors'], tab: 'special', requiresHost: 'plants' },
    { id: 'urban1', name: 'Urban Adaptation', maxLevel: 2, costs: [25, 55],
      descs: ['Spread bonus in high-density urban regions', 'Public transport spread — subways and airports become vectors'],
      effects: ['+Urban spread bonus', '+Transport vector spread'], tab: 'special', requiresHost: 'humans' },
    { id: 'agri1', name: 'Agricultural Vector', maxLevel: 1, costs: [30],
      descs: ['Spread through farming and livestock systems — rural areas become hotspots'],
      effects: ['+Farm/livestock spread'], tab: 'special', requiresHost: 'mammals' }
  ]
};

// Flatten all upgrades
const ALL_UPGRADES = Object.values(UPGRADES_DEFINITION).flat();

// ===================== WORLD REGIONS =====================
const REGIONS = [
  { id: 'na_north', name: 'North America (North)', climate: 'cold', pop: 120000000, x: 140, y: 105,
    climateReq: { cold1: 1 }, penalty: 0.05,
    path: 'M65,55 C105,48 165,50 218,58 C225,78 222,125 210,148 C192,162 148,168 98,158 C68,148 60,122 62,95 C63,75 65,60 65,55 Z' },
  { id: 'na_south', name: 'North America (South)', climate: 'temperate', pop: 200000000, x: 132, y: 185,
    path: 'M68,148 C108,140 168,138 200,150 C212,170 210,205 200,222 C182,235 148,238 108,232 C78,225 65,208 65,192 C65,175 67,155 68,148 Z' },
  { id: 'central_am', name: 'Central America', climate: 'tropical', pop: 50000000, x: 148, y: 240,
    path: 'M122,222 C142,215 170,215 180,225 C188,240 185,258 172,265 C156,272 132,270 120,260 C112,250 112,232 122,222 Z' },
  { id: 'sa_north', name: 'South America (North)', climate: 'tropical', pop: 130000000, x: 195, y: 292,
    path: 'M133,248 C175,238 228,236 265,250 C280,272 278,315 260,338 C240,355 198,362 165,354 C135,345 115,318 115,290 C115,268 128,252 133,248 Z' },
  { id: 'sa_south', name: 'South America (South)', climate: 'temperate', pop: 80000000, x: 180, y: 378,
    path: 'M145,333 C178,323 220,322 232,338 C244,360 240,398 222,420 C202,438 168,440 150,430 C132,420 122,395 125,368 C127,348 138,338 145,333 Z' },
  { id: 'west_europe', name: 'Western Europe', climate: 'temperate', pop: 260000000, x: 408, y: 112,
    medResist: 1.5,
    path: 'M358,65 C395,58 438,58 460,72 C472,92 470,132 455,152 C438,170 402,175 372,168 C345,160 335,135 338,108 C340,85 348,70 358,65 Z' },
  { id: 'east_europe', name: 'Eastern Europe', climate: 'cold', pop: 160000000, x: 502, y: 108,
    climateReq: { cold1: 1 },
    path: 'M452,58 C488,50 528,50 552,65 C564,85 560,128 545,150 C526,168 490,172 462,162 C438,152 435,122 442,92 C445,75 450,62 452,58 Z' },
  { id: 'north_africa', name: 'North Africa', climate: 'hot', pop: 220000000, x: 445, y: 210,
    climateReq: { heat1: 2 },
    path: 'M332,168 C392,160 472,158 555,170 C570,192 568,235 552,258 C505,275 385,276 338,262 C320,242 320,202 332,168 Z' },
  { id: 'west_africa', name: 'West Africa', climate: 'tropical', pop: 380000000, x: 360, y: 300,
    path: 'M310,252 C345,242 395,240 418,255 C430,278 428,318 410,342 C392,360 355,365 328,355 C305,344 298,318 306,290 C308,272 308,256 310,252 Z' },
  { id: 'central_africa', name: 'Central Africa', climate: 'tropical', pop: 190000000, x: 460, y: 298,
    path: 'M407,248 C445,238 496,238 515,252 C528,275 526,318 510,342 C490,362 452,368 426,358 C406,348 400,318 406,288 C406,268 406,252 407,248 Z' },
  { id: 'east_africa', name: 'East Africa', climate: 'tropical', pop: 460000000, x: 535, y: 300,
    path: 'M492,242 C522,232 562,232 578,248 C592,272 590,315 572,342 C553,368 522,375 498,364 C478,352 476,318 484,288 C488,268 490,248 492,242 Z' },
  { id: 'south_africa', name: 'Southern Africa', climate: 'temperate', pop: 130000000, x: 472, y: 388,
    path: 'M397,342 C440,330 518,330 552,348 C570,375 568,418 546,440 C518,458 448,462 416,448 C390,436 380,408 382,378 C384,358 392,348 397,342 Z' },
  { id: 'middle_east', name: 'Middle East', climate: 'hot', pop: 190000000, x: 575, y: 185,
    climateReq: { heat1: 2 },
    path: 'M515,138 C550,128 602,126 632,142 C648,168 644,208 626,232 C606,252 562,258 532,242 C508,228 504,198 512,168 C514,150 514,142 515,138 Z' },
  { id: 'central_asia', name: 'Central Asia', climate: 'cold', pop: 100000000, x: 660, y: 118,
    climateReq: { cold1: 2 },
    path: 'M568,75 C622,65 698,62 752,78 C768,100 765,145 748,165 C722,182 648,188 605,180 C568,172 558,148 562,118 C564,95 566,80 568,75 Z' },
  { id: 'south_asia', name: 'South Asia', climate: 'tropical', pop: 1900000000, x: 675, y: 228,
    path: 'M605,158 C648,148 715,145 750,162 C768,192 764,248 745,280 C725,308 680,318 645,310 C608,302 588,268 588,232 C588,198 595,165 605,158 Z' },
  { id: 'east_asia', name: 'East Asia', climate: 'temperate', pop: 1600000000, x: 802, y: 138,
    medResist: 1.4,
    path: 'M722,68 C775,58 850,56 882,75 C898,105 895,168 878,198 C858,222 810,228 768,220 C728,212 712,182 715,148 C718,115 720,78 722,68 Z' },
  { id: 'se_asia', name: 'Southeast Asia', climate: 'tropical', pop: 680000000, x: 788, y: 258,
    path: 'M718,208 C755,198 812,196 852,212 C868,238 865,280 842,308 C820,330 775,338 740,325 C712,312 706,278 712,252 C714,232 716,212 718,208 Z' },
  { id: 'oceania', name: 'Oceania', climate: 'temperate', pop: 43000000, x: 838, y: 382,
    climateReq: { aqua1: 2 },
    path: 'M778,328 C822,315 875,315 902,332 C920,360 918,405 896,430 C870,452 815,458 780,444 C752,432 745,402 750,370 C754,348 758,335 778,328 Z' },
  { id: 'arctic', name: 'Arctic/Greenland', climate: 'extreme', pop: 500000, x: 272, y: 26,
    climateReq: { cold1: 3 }, penalty: 0.2,
    path: 'M198,8 C250,4 308,5 348,12 C356,22 354,38 342,46 C308,55 228,55 200,46 C190,38 190,18 198,8 Z' }
];

// Color palette for 19 regions
const REGION_BASE_COLORS = {
  cold: '#2a3d4f', temperate: '#1e3d2a', tropical: '#3d3010', hot: '#3d2010',
  extreme: '#1a1030'
};

// AI virus names pool
const AI_NAME_POOL = ['NecrX-7','BloodHaze','ArcticPox','VoidStrain','HexaPlag',
  'ToxoVir','ShadowFlux','DeathWave','InfernoRot','BioNecro','PlagueMind',
  'CrimsonPest','DarkSurge','ViralOmen','MutaFrost','AshenPest','PandoraX',
  'NightBlight','CryptoRot','FrostKill'];

// ===================== GAME STATE =====================
let G = null; // main game state

function initGameState(virusName, virusTypeId, hostId, diffId) {
  const diff = DIFFICULTIES.find(d => d.id === diffId);
  const regionStates = {};
  REGIONS.forEach(r => {
    regionStates[r.id] = {
      virusInfections: {}, // virusId -> infected count
      totalPop: r.pop,
      healthy: r.pop
    };
  });

  G = {
    day: 0,
    tick: 0,
    speed: 1,
    ep: diff.startEP,
    epRate: 0,
    totalInfected: 0,
    regionsOwned: 0,
    upgradesTab: 'environment',
    upgradeLevels: {}, // upgradeId -> current level
    playerVirus: {
      id: 'player',
      name: virusName,
      typeId: virusTypeId,
      hostId: hostId,
      color: '#00ff88',
      evolveLevel: 0
    },
    aiViruses: [],
    regionStates,
    difficulty: diff,
    paused: false,
    gameOver: false,
    aiSpawnTimer: 0,
    aiSpawnCooldown: diff.spawnRate,
    started: false,
    startRegion: 'na_south', // player starts here
    totalWorldPop: REGIONS.reduce((s, r) => s + r.pop, 0),
    upgradesPurchased: 0,
    selectedRegion: null
  };

  // Give player initial infection in start region
  G.regionStates[G.startRegion].virusInfections['player'] = Math.floor(G.regionStates[G.startRegion].totalPop * 0.0001);
  G.regionStates[G.startRegion].healthy -= G.regionStates[G.startRegion].virusInfections['player'];
}

// ===================== GAME LOOP =====================
let gameInterval = null;
let lastTimestamp = 0;

function startGameLoop() {
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameTick, 1000 / 20); // 20 ticks/sec base
}

function gameTick() {
  if (!G || G.paused || G.gameOver) return;

  const ticksPerSec = 20;
  const stepsPerTick = G.speed; // at speed 1: 1 step, speed 2: 2 steps, etc.

  for (let s = 0; s < stepsPerTick; s++) {
    G.tick++;
    if (G.tick % ticksPerSec === 0) G.day++;

    // Spread player virus
    spreadVirus('player');

    // Spread AI viruses
    G.aiViruses.forEach(ai => spreadVirus(ai.id));

    // AI upgrades
    G.aiViruses.forEach(ai => aiUpgrade(ai));

    // AI spawn
    G.aiSpawnTimer++;
    if (G.aiSpawnTimer >= G.aiSpawnCooldown) {
      spawnAIVirus();
      G.aiSpawnTimer = 0;
    }

    // Medical response (reduce infections in highly infected regions)
    applyMedicalResponse();

    // Compute stats
    computeStats();

    // Check win/lose
    if (!G.gameOver) checkEndConditions();
  }

  renderHUD();
  renderMap();
  if (G.selectedRegion) renderRegionPanel(G.selectedRegion);
}

// ===================== SPREAD LOGIC =====================
function getUpgradeLevel(virusId, upgradeId) {
  if (virusId === 'player') return G.upgradeLevels[upgradeId] || 0;
  const ai = G.aiViruses.find(a => a.id === virusId);
  if (!ai) return 0;
  return ai.upgradeLevels[upgradeId] || 0;
}

function getInfectivityBonus(virusId) {
  const l = getUpgradeLevel(virusId, 'infect1');
  return 1 + [0, 0.15, 0.30, 0.50, 0.75][l];
}

function getHostObj(virusId) {
  const id = virusId === 'player' ? G.playerVirus.hostId : (G.aiViruses.find(a=>a.id===virusId)||{}).hostId;
  return HOST_TYPES.find(h => h.id === id) || HOST_TYPES[0];
}

function spreadVirus(virusId) {
  // For each region, compute spread
  REGIONS.forEach(region => {
    const rs = G.regionStates[region.id];
    const currentInfected = rs.virusInfections[virusId] || 0;

    // Check climate requirements
    const climateReq = region.climateReq || {};
    let canSurvive = true;
    let survivalPenalty = 0;

    for (const [reqId, reqLevel] of Object.entries(climateReq)) {
      const hasLevel = getUpgradeLevel(virusId, reqId);
      if (hasLevel < reqLevel) {
        if (currentInfected > 0) {
          // Virus suffers in this region
          survivalPenalty = region.penalty || 0.03;
        }
        canSurvive = (currentInfected === 0); // can't enter new region
        break;
      }
    }

    // Special: aqua1 required for oceania
    if (region.id === 'oceania' && getUpgradeLevel(virusId, 'aqua1') < 2) {
      if (currentInfected === 0) return; // can't enter
      survivalPenalty = 0.02;
    }

    // Apply penalty (virus loses population)
    if (survivalPenalty > 0 && currentInfected > 0) {
      const loss = Math.ceil(currentInfected * survivalPenalty);
      rs.virusInfections[virusId] = Math.max(0, currentInfected - loss);
      rs.healthy = Math.min(rs.totalPop, rs.healthy + loss);
      return; // no spread while penalized
    }

    if (!canSurvive) return;

    // Base spread rate
    let spreadRate = 0.0004 * getInfectivityBonus(virusId);

    // Climate bonuses
    const climate = region.climate;
    const cold1 = getUpgradeLevel(virusId, 'cold1');
    const heat1 = getUpgradeLevel(virusId, 'heat1');
    const humid1 = getUpgradeLevel(virusId, 'humid1');
    const aqua1 = getUpgradeLevel(virusId, 'aqua1');
    const vector1 = getUpgradeLevel(virusId, 'vector1');
    const airborne1 = getUpgradeLevel(virusId, 'airborne1');
    const water1 = getUpgradeLevel(virusId, 'water1');
    const fecal1 = getUpgradeLevel(virusId, 'fecal1');
    const sexual1 = getUpgradeLevel(virusId, 'sexual1');
    const latency1 = getUpgradeLevel(virusId, 'latency1');

    if (climate === 'cold') spreadRate *= (0.5 + cold1 * 0.3);
    if (climate === 'hot' || climate === 'extreme') spreadRate *= (0.4 + heat1 * 0.4);
    if (climate === 'tropical') {
      spreadRate *= (1 + humid1 * 0.4);
      if (vector1 > 0) spreadRate *= (1 + vector1 * 0.5);
    }
    if (climate === 'extreme') spreadRate *= (cold1 >= 3 ? 1.5 : 0.1);

    // Airborne bonus
    spreadRate *= (1 + airborne1 * 0.2);

    // Water bonus
    if (water1 > 0 && (climate === 'tropical' || climate === 'temperate')) spreadRate *= (1 + water1 * 0.15);

    // Fecal-oral
    if (fecal1 > 0) spreadRate *= (1 + fecal1 * 0.1);

    // Sexual
    if (sexual1 > 0) spreadRate += 0.0003 * sexual1;

    // Latency
    if (latency1 > 0) spreadRate *= (1 + latency1 * 0.1);

    // Host bonuses
    const host = getHostObj(virusId);
    if (host.id === 'birds' && airborne1 > 0) spreadRate *= 1.3;
    if (host.id === 'fish' && climate !== 'extreme') spreadRate *= (aqua1 > 0 ? 1.3 : 0.8);
    if (host.id === 'insects' && climate === 'tropical') spreadRate *= 1.4;
    if (host.id === 'humans') {
      const urban1 = getUpgradeLevel(virusId, 'urban1');
      if (urban1 > 0) spreadRate *= (1 + urban1 * 0.3);
    }

    // Medical resistance in certain regions
    const medResist = region.medResist || 1.0;
    const drugR = getUpgradeLevel(virusId, 'drug1');
    const immuneE = getUpgradeLevel(virusId, 'immune1');
    const drugFactor = [1.0, 0.8, 0.5, 0.05][drugR];
    const immuneFactor = [1.0, 0.75, 0.5, 0.15][immuneE];
    spreadRate *= (drugFactor + immuneFactor) / 2;
    spreadRate /= medResist;

    // Virulence — increase spread but also kills hosts faster
    const vir = getUpgradeLevel(virusId, 'virulence1');
    if (vir > 0) spreadRate *= (1 + vir * 0.15);

    // Mutation rate bonus to spread
    const mutR = getUpgradeLevel(virusId, 'mutrate1');
    if (mutR > 0) spreadRate *= (1 + mutR * 0.05);

    // Only spread if there are healthy hosts
    if (rs.healthy <= 0 || currentInfected <= 0) return;

    const newInfections = Math.floor(currentInfected * spreadRate * (rs.healthy / rs.totalPop));
    if (newInfections > 0) {
      const actual = Math.min(newInfections, rs.healthy);
      rs.virusInfections[virusId] = currentInfected + actual;
      rs.healthy -= actual;
    }

    // Virulence kills infected (freeing up healthy for re-infection by others)
    if (vir >= 2) {
      const deathRate = 0.0002 * vir;
      const deaths = Math.floor(rs.virusInfections[virusId] * deathRate);
      rs.virusInfections[virusId] = Math.max(0, rs.virusInfections[virusId] - deaths);
      // Dead don't return to healthy pool
    }

    // Toxin production — damage rival viruses in same region
    const toxin1 = getUpgradeLevel(virusId, 'toxin1');
    if (toxin1 > 0) {
      Object.keys(rs.virusInfections).forEach(otherId => {
        if (otherId !== virusId && rs.virusInfections[otherId] > 0) {
          const dmg = Math.floor(rs.virusInfections[otherId] * 0.001 * toxin1);
          rs.virusInfections[otherId] = Math.max(0, rs.virusInfections[otherId] - dmg);
          rs.healthy += dmg;
        }
      });
    }
  });

  // Spread to adjacent regions (airborne/waterborne)
  spreadToAdjacentRegions(virusId);
}

function spreadToAdjacentRegions(virusId) {
  const airborne1 = getUpgradeLevel(virusId, 'airborne1');
  const water1 = getUpgradeLevel(virusId, 'water1');
  const avian1 = getUpgradeLevel(virusId, 'avian1');

  if (airborne1 < 2 && water1 < 2 && avian1 < 2) return;

  // For each region where this virus is present, check for jump to adjacent
  REGIONS.forEach(srcRegion => {
    const srcRS = G.regionStates[srcRegion.id];
    const srcInfected = srcRS.virusInfections[virusId] || 0;
    if (srcInfected < 1000) return; // need critical mass to spread

    // Find nearby regions (by proximity of SVG coordinates)
    REGIONS.forEach(dstRegion => {
      if (dstRegion.id === srcRegion.id) return;
      const dstRS = G.regionStates[dstRegion.id];
      if (dstRS.virusInfections[virusId] > 0) return; // already infected

      // Check climate requirements for destination
      const climateReq = dstRegion.climateReq || {};
      for (const [reqId, reqLevel] of Object.entries(climateReq)) {
        if (getUpgradeLevel(virusId, reqId) < reqLevel) return;
      }
      if (dstRegion.id === 'oceania' && getUpgradeLevel(virusId, 'aqua1') < 2) return;

      const dist = regionDist(srcRegion, dstRegion);
      let jumpChance = 0;

      if (airborne1 >= 3) jumpChance += 0.0003 * (100 / Math.max(dist, 50));
      else if (airborne1 >= 2) jumpChance += 0.0001 * (100 / Math.max(dist, 100));

      if (water1 >= 2) jumpChance += 0.00005;

      if (avian1 >= 2 && getHostObj(virusId).id === 'birds') jumpChance += 0.0002;

      if (Math.random() < jumpChance) {
        dstRS.virusInfections[virusId] = Math.floor(dstRegion.pop * 0.0001);
        dstRS.healthy -= dstRS.virusInfections[virusId];
        if (virusId === 'player') {
          notify('🌍 Spread to ' + dstRegion.name + '!', 'success');
          spawnRipple(dstRegion);
        }
      }
    });
  });
}

function regionDist(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function applyMedicalResponse() {
  const medStr = G.difficulty.medicineStr;
  REGIONS.forEach(region => {
    const rs = G.regionStates[region.id];
    const medResist = region.medResist || 1.0;
    const totalInfected = Object.values(rs.virusInfections).reduce((s,v)=>s+v,0);
    if (totalInfected === 0) return;

    const infectedPct = totalInfected / region.pop;
    // Medicine kicks in when >5% infected
    if (infectedPct > 0.05) {
      const medRate = 0.0001 * medStr * medResist * infectedPct;
      // Reduce all viruses proportionally (drug resistance modifies per-virus)
      Object.keys(rs.virusInfections).forEach(virusId => {
        const drugR = getUpgradeLevel(virusId, 'drug1');
        const immuneE = getUpgradeLevel(virusId, 'immune1');
        const resistance = [1.0, 0.8, 0.5, 0.05][drugR] * [1.0, 0.75, 0.5, 0.15][immuneE];
        const reduction = Math.floor(rs.virusInfections[virusId] * medRate * resistance);
        if (reduction > 0) {
          rs.virusInfections[virusId] = Math.max(0, rs.virusInfections[virusId] - reduction);
          rs.healthy = Math.min(region.pop, rs.healthy + reduction);
        }
      });
    }
  });
}

function computeStats() {
  let totalInfected = 0;
  let playerInfected = 0;
  let regionsOwned = 0;

  REGIONS.forEach(region => {
    const rs = G.regionStates[region.id];
    const playerCount = rs.virusInfections['player'] || 0;
    playerInfected += playerCount;

    const allInfected = Object.values(rs.virusInfections).reduce((s,v)=>s+v,0);
    totalInfected += allInfected;

    // Region "owned" if player has > 50% of total population
    if (playerCount / region.pop > 0.5) regionsOwned++;
  });

  G.totalInfected = playerInfected;
  G.regionsOwned = regionsOwned;
  if (playerInfected > (G.peakInfected || 0)) G.peakInfected = playerInfected;

  // EP rate: 1 EP per second per 1M infected (×0.5 to slow accumulation)
  G.epRate = playerInfected / 1000000 * 0.5;
  G.ep += G.epRate / 20; // 20 ticks per second

  // Antigen shifting — periodically gain free EP bonus
  const antigen1 = G.upgradeLevels['antigen1'] || 0;
  if (antigen1 > 0 && G.tick % (300 / antigen1) === 0) G.ep += 5 * antigen1;
}

function checkEndConditions() {
  // WIN: player infected 80%+ of world population
  const playerTotal = REGIONS.reduce((sum, r) => {
    return sum + (G.regionStates[r.id].virusInfections['player'] || 0);
  }, 0);

  if (playerTotal / G.totalWorldPop >= 0.80) {
    triggerWin();
    return;
  }

  // LOSE: player virus completely wiped out everywhere
  if (playerTotal === 0 && G.day > 5) {
    triggerLose('Your virus was eradicated by medicine.');
    return;
  }
}

function triggerWin() {
  G.gameOver = true;
  clearInterval(gameInterval);
  const days = G.day;
  const ep = Math.floor(G.ep);
  document.getElementById('win-subtitle').textContent =
    `${G.playerVirus.name} infected 80% of humanity in ${days} days`;
  document.getElementById('win-stats').innerHTML = `
    <div class="stat-row"><span class="stat-label">DAYS</span><span class="stat-val">${days}</span></div>
    <div class="stat-row"><span class="stat-label">EP EARNED</span><span class="stat-val">${ep}</span></div>
    <div class="stat-row"><span class="stat-label">REGIONS</span><span class="stat-val">${G.regionsOwned}/19</span></div>
    <div class="stat-row"><span class="stat-label">DIFFICULTY</span><span class="stat-val">${G.difficulty.name}</span></div>
  `;
  document.getElementById('win-screen').style.display = 'flex';
}

function triggerLose(reason) {
  G.gameOver = true;
  clearInterval(gameInterval);
  document.getElementById('lose-subtitle').textContent = reason;
  document.getElementById('lose-stats').innerHTML = `
    <div class="stat-row"><span class="stat-label">SURVIVED</span><span class="stat-val">${G.day} days</span></div>
    <div class="stat-row"><span class="stat-label">PEAK INFECTED</span><span class="stat-val">${(G.peakInfected || 0).toLocaleString()}</span></div>
  `;
  document.getElementById('lose-screen').style.display = 'flex';
}

// ===================== AI VIRUS LOGIC =====================
function spawnAIVirus() {
  if (G.aiViruses.length >= 8) return;

  const usedNames = G.aiViruses.map(a => a.name);
  const availableNames = AI_NAME_POOL.filter(n => !usedNames.includes(n));
  if (availableNames.length === 0) return;

  const name = availableNames[Math.floor(Math.random() * availableNames.length)];
  const type = VIRUS_TYPES[Math.floor(Math.random() * VIRUS_TYPES.length)];
  const host = HOST_TYPES[Math.floor(Math.random() * HOST_TYPES.length)];
  const colors = ['#ff4444','#ff8800','#aa44ff','#0088ff','#ff44aa','#44ffff','#ff2266','#88ff00'];
  const color = colors[G.aiViruses.length % colors.length];

  // Pick random start region (not player's)
  const startRegions = REGIONS.filter(r => r.id !== 'na_south' && r.climate !== 'extreme' && r.climate !== 'cold');
  const startRegion = startRegions[Math.floor(Math.random() * startRegions.length)];

  const ai = {
    id: 'ai_' + Date.now(),
    name,
    typeId: type.id,
    hostId: host.id,
    color,
    upgradeLevels: {},
    upgradeEP: 20,
    evolveLevel: 0,
    age: 0
  };

  G.aiViruses.push(ai);

  const rs = G.regionStates[startRegion.id];
  rs.virusInfections[ai.id] = Math.floor(startRegion.pop * 0.001);
  rs.healthy -= rs.virusInfections[ai.id];

  notify(`⚠️ New rival: ${name} detected in ${startRegion.name}!`, 'warn');
}

function aiUpgrade(ai) {
  ai.age++;
  const upgradeSpeed = G.difficulty.aiSpeed;

  // Earn EP
  let aiInfected = 0;
  REGIONS.forEach(r => { aiInfected += G.regionStates[r.id].virusInfections[ai.id] || 0; });
  ai.upgradeEP += aiInfected / 1000000 / 20 * upgradeSpeed * 2;

  // Buy upgrades periodically
  if (ai.age % Math.floor(60 / upgradeSpeed) !== 0) return;

  // Priority upgrade list for AI
  const priorityUpgrades = [
    'infect1', 'airborne1', 'cold1', 'heat1', 'humid1', 'drug1', 'immune1',
    'virulence1', 'mutrate1', 'water1', 'aqua1', 'latency1', 'fecal1'
  ];

  for (const upgradeId of priorityUpgrades) {
    const upgDef = ALL_UPGRADES.find(u => u.id === upgradeId);
    if (!upgDef) continue;
    const currentLevel = ai.upgradeLevels[upgradeId] || 0;
    if (currentLevel >= upgDef.maxLevel) continue;
    const cost = upgDef.costs[currentLevel];
    if (ai.upgradeEP >= cost) {
      ai.upgradeEP -= cost;
      ai.upgradeLevels[upgradeId] = currentLevel + 1;
      // Update evolve level
      ai.evolveLevel = Math.min(3, Math.floor(Object.values(ai.upgradeLevels).reduce((s,v)=>s+v,0) / 4));
      break;
    }
  }
}

// ===================== UPGRADE PURCHASE =====================
function buyUpgrade(upgradeId) {
  const upgDef = ALL_UPGRADES.find(u => u.id === upgradeId);
  if (!upgDef) return;

  const currentLevel = G.upgradeLevels[upgradeId] || 0;
  if (currentLevel >= upgDef.maxLevel) {
    notify('Already at maximum level!', 'info');
    return;
  }

  // Check host requirement
  if (upgDef.requiresHost && G.playerVirus.hostId !== upgDef.requiresHost) {
    notify(`Requires ${upgDef.requiresHost} host type!`, 'error');
    return;
  }

  const cost = upgDef.costs[currentLevel];
  if (G.ep < cost) {
    notify(`Not enough EP! Need ${cost} EP`, 'error');
    return;
  }

  G.ep -= cost;
  G.upgradeLevels[upgradeId] = currentLevel + 1;
  G.upgradesPurchased++;

  // Update player evolve level for visual changes
  G.playerVirus.evolveLevel = Math.min(3, Math.floor(Object.values(G.upgradeLevels).reduce((s,v)=>s+v,0) / 5));

  notify(`✓ ${upgDef.name} Level ${currentLevel + 1} acquired!`, 'success');
  flashUpgradeCard(upgradeId);
  renderUpgradePanel();
  updateHUDIcon();
}

// ===================== RENDERING =====================
function renderHUD() {
  document.getElementById('hud-virus-name').textContent = G.playerVirus.name;
  document.getElementById('hud-ep').textContent = Math.floor(G.ep);
  document.getElementById('hud-epsec').textContent = G.epRate.toFixed(1);
  document.getElementById('hud-infected').textContent = formatNum(G.totalInfected);
  const pct = (G.totalInfected / G.totalWorldPop * 100);
  document.getElementById('hud-pct').textContent = pct.toFixed(2) + '%';
  document.getElementById('hud-regions').textContent = G.regionsOwned + '/19';
  document.getElementById('hud-progress-fill').style.width = Math.min(100, pct * 2) + '%';
  document.getElementById('hud-day').textContent = 'DAY ' + G.day;
  document.getElementById('panel-ep').textContent = '⚡ ' + Math.floor(G.ep) + ' EP';
}

function renderMap() {
  REGIONS.forEach(region => {
    const rs = G.regionStates[region.id];
    const el = document.getElementById('region-' + region.id);
    if (!el) return;

    // Determine dominant virus
    let domVirus = null, domCount = 0;
    Object.entries(rs.virusInfections).forEach(([vid, count]) => {
      if (count > domCount) { domCount = count; domVirus = vid; }
    });

    const baseColor = REGION_BASE_COLORS[region.climate] || '#1a1a2a';
    if (!domVirus || domCount < 100) {
      el.style.fill = baseColor;
      el.classList.remove('infected');
    } else {
      const color = getVirusColor(domVirus);
      const infPct = domCount / region.pop;
      const intensity = Math.min(1, infPct * 3);
      el.style.fill = blendColor(baseColor, color, intensity);
      el.classList.toggle('infected', infPct > 0.1);
    }
  });
}

function getVirusColor(virusId) {
  if (virusId === 'player') return G.playerVirus.color;
  const ai = G.aiViruses.find(a => a.id === virusId);
  return ai ? ai.color : '#888888';
}

function blendColor(base, target, t) {
  const br = parseInt(base.slice(1,3),16), bg = parseInt(base.slice(3,5),16), bb = parseInt(base.slice(5,7),16);
  const tr = parseInt(target.slice(1,3),16), tg = parseInt(target.slice(3,5),16), tb = parseInt(target.slice(5,7),16);
  const r = Math.round(br + (tr-br)*t);
  const g = Math.round(bg + (tg-bg)*t);
  const b = Math.round(bb + (tb-bb)*t);
  return `rgb(${r},${g},${b})`;
}

function updateHUDIcon() {
  const container = document.getElementById('hud-virus-icon');
  const vt = VIRUS_TYPES.find(v => v.id === G.playerVirus.typeId);
  if (!vt) return;
  const evolveClass = ['', 'virus-evolved-1', 'virus-evolved-2', 'virus-evolved-3'][G.playerVirus.evolveLevel];
  container.innerHTML = `<div class="${evolveClass}" style="width:36px;height:36px">${vt.svg}</div>`;
}

function renderUpgradePanel() {
  const tab = G.upgradeTab || 'environment';
  const list = document.getElementById('upgrade-list');
  const upgrades = UPGRADES_DEFINITION[tab] || [];
  list.innerHTML = '';

  upgrades.forEach(upg => {
    const currentLevel = G.upgradeLevels[upg.id] || 0;
    const isMaxed = currentLevel >= upg.maxLevel;
    const nextCost = isMaxed ? 0 : upg.costs[currentLevel];
    const canAfford = G.ep >= nextCost;
    const hostLocked = upg.requiresHost && G.playerVirus.hostId !== upg.requiresHost;

    let cardClass = 'upgrade-card';
    if (hostLocked) cardClass += ' locked';
    else if (isMaxed) cardClass += ' maxed';
    else if (!canAfford) cardClass += ' insufficient';

    const dots = Array.from({length: upg.maxLevel}, (_, i) =>
      `<div class="level-dot ${i < currentLevel ? 'filled' : ''}"></div>`
    ).join('');

    const descIdx = Math.max(0, currentLevel - (isMaxed ? 1 : 0));
    const desc = upg.descs[Math.min(descIdx, upg.descs.length-1)];
    const effect = isMaxed ? '' : upg.effects[currentLevel];

    let footerHTML = '';
    if (isMaxed) {
      footerHTML = `<span class="maxed-badge">✓ MAXED</span>`;
    } else if (hostLocked) {
      footerHTML = `<span style="color:#888;font-size:0.7em;font-family:Orbitron,monospace">🔒 REQUIRES: ${upg.requiresHost.toUpperCase()}</span>`;
    } else {
      footerHTML = `<span class="upgrade-cost ${canAfford ? '' : 'insufficient'}">⚡ ${nextCost} EP</span>
                   <span class="upgrade-effect">${effect}</span>`;
    }

    const onclick = (!isMaxed && !hostLocked) ? `buyUpgrade('${upg.id}')` : '';
    list.innerHTML += `
      <div class="upgrade-card ${cardClass.replace('upgrade-card ','')}" id="upg-${upg.id}" ${onclick ? `onclick="${onclick}"` : ''}>
        <div class="upgrade-header">
          <span class="upgrade-name">${upg.name}</span>
          <div class="upgrade-level">${dots}</div>
        </div>
        <div class="upgrade-desc">${desc}</div>
        <div class="upgrade-footer">${footerHTML}</div>
      </div>`;
  });
}

function switchTab(tab) {
  G.upgradeTab = tab;
  document.querySelectorAll('.upgrade-tab').forEach((btn, i) => {
    btn.classList.toggle('active', ['environment','transmission','survival','lethality','special'][i] === tab);
  });
  renderUpgradePanel();
}

function flashUpgradeCard(upgradeId) {
  const el = document.getElementById('upg-' + upgradeId);
  if (el) {
    el.classList.add('upgrade-flash');
    setTimeout(() => el.classList.remove('upgrade-flash'), 600);
  }
}

// ===================== REGION PANEL =====================
function openRegionPanel(regionId) {
  G.selectedRegion = regionId;
  renderRegionPanel(regionId);
  document.getElementById('ai-panel').classList.remove('open');
  document.getElementById('region-panel').classList.add('open');
}

function closeRegionPanel() {
  G.selectedRegion = null;
  document.getElementById('region-panel').classList.remove('open');
}

function renderRegionPanel(regionId) {
  const region = REGIONS.find(r => r.id === regionId);
  if (!region) return;
  const rs = G.regionStates[regionId];

  document.getElementById('region-panel-title').textContent = region.name.toUpperCase();

  const climateLabel = {cold:'❄️ Cold',temperate:'🌱 Temperate',tropical:'🌿 Tropical',hot:'☀️ Desert/Hot',extreme:'🌨 Extreme Cold'}[region.climate] || region.climate;
  const climateClass = {cold:'climate-cold',temperate:'climate-temperate',tropical:'climate-tropical',hot:'climate-hot',extreme:'climate-extreme'}[region.climate] || 'climate-temperate';

  const totalInfected = Object.values(rs.virusInfections).reduce((s,v)=>s+v,0);
  const healthyPct = (rs.healthy / region.pop * 100).toFixed(1);
  const infectedPct = (totalInfected / region.pop * 100).toFixed(1);

  // Climate requirement warning
  let warningHTML = '';
  if (region.climateReq) {
    for (const [reqId, reqLevel] of Object.entries(region.climateReq)) {
      const playerLevel = G.upgradeLevels[reqId] || 0;
      if (playerLevel < reqLevel) {
        const upgDef = ALL_UPGRADES.find(u => u.id === reqId);
        warningHTML += `<div class="warning-box">⚠️ ${upgDef ? upgDef.name : reqId} Level ${reqLevel} required for survival</div>`;
      }
    }
  }
  if (region.id === 'oceania' && (G.upgradeLevels['aqua1'] || 0) < 2) {
    warningHTML += `<div class="warning-box">⚠️ Aquatic Survival Level 2 required to reach Oceania</div>`;
  }

  // Virus bars
  let virusBarsHTML = '<div style="margin-top:10px"><div style="font-family:Orbitron,monospace;font-size:0.7em;color:rgba(0,255,136,0.5);margin-bottom:6px">VIRUSES PRESENT</div>';
  const sortedViruses = Object.entries(rs.virusInfections)
    .filter(([,count]) => count > 0)
    .sort((a,b) => b[1]-a[1]);

  sortedViruses.forEach(([vid, count]) => {
    const pct = (count / region.pop * 100).toFixed(1);
    const color = getVirusColor(vid);
    const vName = vid === 'player' ? G.playerVirus.name : (G.aiViruses.find(a=>a.id===vid)||{name:vid}).name;
    virusBarsHTML += `
      <div style="margin-bottom:6px">
        <div style="display:flex;justify-content:space-between;font-size:0.8em;margin-bottom:2px">
          <span style="color:${color}">${vName}</span>
          <span style="color:rgba(255,255,255,0.6)">${formatNum(count)} (${pct}%)</span>
        </div>
        <div class="infection-bar-container">
          <div class="infection-bar-fill" style="width:${pct}%;background:${color}"></div>
        </div>
      </div>`;
  });
  virusBarsHTML += '</div>';

  document.getElementById('region-panel-content').innerHTML = `
    <span class="region-climate ${climateClass}">${climateLabel}</span>
    <div class="region-pop">Population: <strong>${formatNum(region.pop)}</strong></div>
    ${warningHTML}
    <div class="region-stat-row"><span>Healthy</span><span style="color:#44ff88">${formatNum(rs.healthy)} (${healthyPct}%)</span></div>
    <div class="region-stat-row"><span>Total Infected</span><span style="color:#ff4444">${formatNum(totalInfected)} (${infectedPct}%)</span></div>
    ${virusBarsHTML}
    ${region.medResist ? `<div class="warning-box" style="border-color:rgba(0,170,255,0.4);color:#00aaff">🏥 High medical resistance (×${region.medResist})</div>` : ''}
  `;
}

// ===================== AI PANEL =====================
function toggleAIPanel() {
  const panel = document.getElementById('ai-panel');
  const isOpen = panel.classList.contains('open');
  if (isOpen) {
    panel.classList.remove('open');
  } else {
    document.getElementById('region-panel').classList.remove('open');
    G.selectedRegion = null;
    renderAIPanel();
    panel.classList.add('open');
  }
}

function renderAIPanel() {
  const content = document.getElementById('ai-panel-content');
  if (G.aiViruses.length === 0) {
    content.innerHTML = '<div style="color:rgba(200,200,255,0.4);text-align:center;padding:20px;font-size:0.85em">No rival viruses yet...</div>';
    return;
  }

  content.innerHTML = G.aiViruses.map(ai => {
    const vt = VIRUS_TYPES.find(v => v.id === ai.typeId);
    const host = HOST_TYPES.find(h => h.id === ai.hostId);
    let aiInfected = 0, aiRegions = 0;
    REGIONS.forEach(r => {
      const c = G.regionStates[r.id].virusInfections[ai.id] || 0;
      aiInfected += c;
      if (c / r.pop > 0.5) aiRegions++;
    });
    const powerPct = Math.min(100, (Object.values(ai.upgradeLevels).reduce((s,v)=>s+v,0) / 20) * 100);
    const evolveClass = ['','virus-evolved-1','virus-evolved-2','virus-evolved-3'][ai.evolveLevel];

    return `
      <div class="ai-virus-item">
        <div class="ai-icon ${evolveClass}" style="color:${ai.color}">${vt ? vt.svg.replace(/^(<svg[^>]*)>/, '$1 style="width:44px;height:44px">') : ''}</div>
        <div style="flex:1;min-width:0">
          <div class="ai-virus-name" style="color:${ai.color}">${ai.name}</div>
          <div class="ai-virus-info">${host ? host.emoji : ''} ${host ? host.name : ''} · ${formatNum(aiInfected)} infected · ${aiRegions} regions</div>
          <div class="ai-power-bar"><div class="ai-power-fill" style="width:${powerPct}%;background:${ai.color}"></div></div>
        </div>
      </div>`;
  }).join('');
}

// ===================== CREATION SCREEN =====================
let selectedVirusType = 'coronavirus';
let selectedHost = 'humans';
let selectedDifficulty = 'normal';

function buildCreationScreen() {
  // Virus grid
  const vgrid = document.getElementById('virus-grid');
  vgrid.innerHTML = VIRUS_TYPES.map(vt => `
    <div class="virus-card ${vt.id === selectedVirusType ? 'selected' : ''}" onclick="selectVirusType('${vt.id}', this)">
      ${vt.svg}
      <div class="virus-card-name">${vt.name}</div>
    </div>`).join('');

  // Host grid
  const hgrid = document.getElementById('host-grid');
  hgrid.innerHTML = HOST_TYPES.map(h => `
    <div class="host-card ${h.id === selectedHost ? 'selected' : ''}" onclick="selectHost('${h.id}', this)">
      <div class="host-emoji">${h.emoji}</div>
      <div class="host-name">${h.name}</div>
      <div class="host-desc">${h.desc}</div>
    </div>`).join('');

  // Difficulty
  const dgrid = document.getElementById('difficulty-grid');
  dgrid.innerHTML = DIFFICULTIES.map(d => `
    <div class="diff-card ${d.id === selectedDifficulty ? 'selected' : ''}" onclick="selectDifficulty('${d.id}', this)">
      <div class="diff-name">${d.name}</div>
      <div class="diff-desc">${d.desc}</div>
    </div>`).join('');
}

function selectVirusType(id, el) {
  selectedVirusType = id;
  document.querySelectorAll('.virus-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function selectHost(id, el) {
  selectedHost = id;
  document.querySelectorAll('.host-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function selectDifficulty(id, el) {
  selectedDifficulty = id;
  document.querySelectorAll('.diff-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function startGame() {
  const nameInput = document.getElementById('virus-name-input');
  const virusName = nameInput.value.trim() || 'ViralX-' + Math.floor(Math.random()*9000+1000);

  initGameState(virusName, selectedVirusType, selectedHost, selectedDifficulty);

  document.getElementById('creation-screen').style.display = 'none';
  const gs = document.getElementById('game-screen');
  gs.style.display = 'flex';

  buildWorldMap();
  renderUpgradePanel();
  updateHUDIcon();
  renderHUD();
  startGameLoop();

  notify(`🦠 ${virusName} released into North America!`, 'success');
}

// ===================== WORLD MAP BUILDING =====================
function buildWorldMap() {
  const svg = document.getElementById('world-map');

  // Add ocean background if not already present
  if (!svg.querySelector('#ocean-bg')) {
    const ocean = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    ocean.setAttribute('x', '0');
    ocean.setAttribute('y', '0');
    ocean.setAttribute('width', '960');
    ocean.setAttribute('height', '540');
    ocean.setAttribute('fill', '#0a1628');
    ocean.setAttribute('id', 'ocean-bg');
    svg.insertBefore(ocean, svg.firstChild);
  }

  // Clear existing regions
  svg.querySelectorAll('.region, .region-label').forEach(e => e.remove());

  REGIONS.forEach(region => {
    // Draw region polygon
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', 'region-' + region.id);
    path.setAttribute('class', 'region');
    path.setAttribute('d', region.path);
    path.style.fill = REGION_BASE_COLORS[region.climate];

    path.addEventListener('click', () => openRegionPanel(region.id));
    path.addEventListener('mouseenter', (e) => showMapTooltip(e, region));
    path.addEventListener('mouseleave', () => hideMapTooltip());

    svg.appendChild(path);

    // Region label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('class', 'region-label');
    text.setAttribute('x', region.x);
    text.setAttribute('y', region.y + 5);
    text.textContent = region.name.split(' ')[0];
    svg.appendChild(text);
  });
}

function showMapTooltip(e, region) {
  const tooltip = document.getElementById('map-tooltip');
  const rs = G ? G.regionStates[region.id] : null;
  const playerInfected = rs ? (rs.virusInfections['player'] || 0) : 0;
  const infectedPct = rs ? (playerInfected / region.pop * 100).toFixed(1) : '0.0';
  const climateLabel = {cold:'❄️ Cold',temperate:'🌱 Temperate',tropical:'🌿 Tropical',hot:'☀️ Hot/Desert',extreme:'🌨 Extreme Cold'}[region.climate] || region.climate;

  tooltip.innerHTML = `
    <div class="map-tooltip-name">${region.name}</div>
    <div class="map-tooltip-info">${climateLabel}</div>
    <div class="map-tooltip-info">Pop: ${formatNum(region.pop)}</div>
    ${G ? `<div class="map-tooltip-info" style="color:#00ff88">Your infection: ${infectedPct}%</div>` : ''}
  `;

  const mapContainer = document.getElementById('map-container');
  const rect = mapContainer.getBoundingClientRect();
  let tx = e.clientX - rect.left + 12;
  let ty = e.clientY - rect.top + 12;
  if (tx + 180 > rect.width) tx -= 192;
  if (ty + 100 > rect.height) ty -= 100;

  tooltip.style.left = tx + 'px';
  tooltip.style.top = ty + 'px';
  tooltip.style.display = 'block';
}

function hideMapTooltip() {
  document.getElementById('map-tooltip').style.display = 'none';
}

// ===================== SPEED CONTROLS =====================
function setSpeed(speed) {
  G.speed = speed;
  G.paused = (speed === 0);
  document.querySelectorAll('.speed-btn').forEach((btn, i) => {
    btn.classList.toggle('active', [0,1,2,5,10][i] === speed);
  });
}

// ===================== NOTIFICATIONS =====================
function notify(msg, type = 'info') {
  const container = document.getElementById('notifications');
  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3100);
}

// ===================== PARTICLES & RIPPLE =====================
function spawnRipple(region) {
  const mapContainer = document.getElementById('map-container');
  const svg = document.getElementById('world-map');
  const svgRect = svg.getBoundingClientRect();
  const viewBox = svg.viewBox.baseVal;
  const scaleX = svgRect.width / viewBox.width;
  const scaleY = svgRect.height / viewBox.height;

  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  ripple.style.left = (region.x * scaleX - 15) + 'px';
  ripple.style.top = (region.y * scaleY - 15) + 'px';
  ripple.style.width = '30px';
  ripple.style.height = '30px';
  ripple.style.borderColor = G.playerVirus.color;
  mapContainer.appendChild(ripple);
  setTimeout(() => ripple.remove(), 1100);
}

// ===================== UTILITY =====================
function formatNum(n) {
  if (n >= 1e9) return (n/1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n/1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

// ===================== INIT =====================
buildCreationScreen();

// Render world map preview (without game state)
document.addEventListener('DOMContentLoaded', () => {
  // Map is built when game starts; creation screen shown first
});
