import React, { useState, useEffect, useRef, useCallback } from "react";

const ABIA_KNOWLEDGE = {
  dangerZones: [
    { area: "Bakassi Boys Area, Aba", risk: "HIGH", note: "Known for sporadic cult activity at night. Avoid after 9pm." },
    { area: "Ariaria Market environs at night", risk: "HIGH", note: "Pick-pocket hotspot. Keep valuables hidden." },
    { area: "Ngwa Road stretch near Old Market", risk: "MEDIUM", note: "Armed robbery incidents reported. Travel in groups." },
    { area: "Aba-Owerri Road after dark", risk: "HIGH", note: "Highway robbery risk. Avoid solo travel at night." },
    { area: "Osusu Market, Aba", risk: "MEDIUM", note: "Congested area with reported bag-snatching." },
    { area: "Old GRA junction at night", risk: "MEDIUM", note: "Poor lighting. Stay alert." },
    { area: "Port Harcourt Road bridge area", risk: "HIGH", note: "Known robbery spot. Avoid after 8pm." },
    { area: "Umuahia-Ikot Ekpene Road bend", risk: "MEDIUM", note: "Road robbery reported. Travel in convoy if possible." },
    { area: "Obohia Road, Aba after midnight", risk: "HIGH", note: "Cult flashpoints. Avoid." },
    { area: "Cemetery Road at night", risk: "MEDIUM", note: "Low security presence. Keep moving." },
  ],

  busStops: {
    aba: [
      { name: "Aba Main Motor Park", area: "Aba Central", routes: ["Lagos", "Port Harcourt", "Umuahia", "Enugu", "Owerri"], keke: true },
      { name: "Ariaria Bus Stop", area: "Ariaria", routes: ["Ngwa Road", "Aba Central", "Osisioma"], keke: true },
      { name: "Asa Road Junction", area: "Aba South", routes: ["Aba South areas", "Ndiegoro"], keke: true },
      { name: "Jubilee Road Stop", area: "Aba South", routes: ["Cemetery Road", "Asa Road"], keke: true },
      { name: "Ogbor Hill Park", area: "Ogbor Hill", routes: ["Ikot Ekpene", "Aba central"], keke: true },
      { name: "Port Harcourt Road Stop", area: "Aba North", routes: ["Osisioma", "Port Harcourt"], keke: false },
      { name: "Eziama Junction", area: "Eziama", routes: ["Eziama", "Factory Road", "Aba North"], keke: true },
      { name: "Faulks Road Stop", area: "Faulks Road", routes: ["Aba central", "Ugwunagbo"], keke: true },
      { name: "Brass Junction", area: "Aba Central", routes: ["All Aba routes"], keke: true },
      { name: "Ikot Ekpene Road Park", area: "Aba North", routes: ["Ikot Ekpene", "Arochukwu"], keke: false },
    ],
    umuahia: [
      { name: "Umuahia Main Park", area: "Umuahia Central", routes: ["Aba", "Enugu", "Port Harcourt", "Abakaliki"], keke: true },
      { name: "Library Avenue Stop", area: "Library Area", routes: ["Umuahia Central", "Ibeku"], keke: true },
      { name: "Bende Road Park", area: "Bende Road", routes: ["Bende", "Arochukwu", "Ohafia"], keke: true },
      { name: "Hospital Road Stop", area: "Hospital Area", routes: ["FMC Umuahia", "Town centre"], keke: true },
      { name: "Uzuakoli Road Stop", area: "Ibeku", routes: ["Uzuakoli", "Bende"], keke: true },
      { name: "Warehouse Road Stop", area: "Warehouse", routes: ["Umuahia industrial area"], keke: true },
      { name: "Ikot Ekpene Road Stop", area: "Umuahia Central", routes: ["Ikot Ekpene", "Aba"], keke: false },
    ]
  },

  landmarks: {
    aba: [
      { name: "Ariaria International Market", type: "market", desc: "Largest market in West Africa for textiles & garments", area: "Ariaria" },
      { name: "Aba Sports Club", type: "recreation", desc: "Popular sports and social club", area: "Aba Central" },
      { name: "Government House Aba", type: "government", desc: "Abia State liaison office Aba", area: "Aba Central" },
      { name: "ABIA State Secretariat", type: "government", desc: "State government offices", area: "Umuahia Road" },
      { name: "Ngwa High School", type: "school", desc: "Secondary school landmark near Ngwa Road", area: "Ngwa Road" },
      { name: "Aba Club", type: "recreation", desc: "Old colonial club, good landmark", area: "Aba Central" },
      { name: "Osisioma Industrial Layout", type: "industrial", desc: "Major industrial zone near Aba airport road", area: "Osisioma" },
      { name: "St. Michael's Catholic Church, Aba", type: "church", desc: "Prominent landmark on St. Michael's Road", area: "Ogbor Hill" },
    ],
    umuahia: [
      { name: "Federal Medical Centre Umuahia", type: "hospital", desc: "Main referral hospital in Umuahia", area: "Leventis Bus Stop" },
      { name: "Abia State University Teaching Hospital (ABSUTH)", type: "hospital", desc: "ABSU Teaching Hospital, Aba Road", area: "ABSUTH" },
      { name: "National War Museum", type: "museum", desc: "Famous civil war museum, Aba Road Umuahia", area: "Aba Road" },
      { name: "Government House Umuahia", type: "government", desc: "Abia State Government House", area: "Umuahia" },
      { name: "Abia State University (ABSU), Uturu", type: "school", desc: "Located in Uturu, Isuikwuato LGA", area: "Uturu" },
      { name: "Michael Okpara University", type: "school", desc: "MOUAU campus, Umudike", area: "Umudike" },
      { name: "Ibeku High School", type: "school", desc: "Prominent school in Ibeku area", area: "Ibeku" },
    ]
  },

  policeStations: [
    { name: "Ariaria Police Station", area: "Ariaria, Aba", phone: "08031001001" },
    { name: "Ndiegoro Police Station", area: "Aba South", phone: "08032001001" },
    { name: "Ogbor Hill Police Station", area: "Ogbor Hill, Aba", phone: "08032002001" },
    { name: "Umuahia Central Police Station", area: "Umuahia", phone: "08033001001" },
    { name: "Ibeku Police Station", area: "Ibeku, Umuahia", phone: "08033002001" },
  ],

  hotels: [
    { name: "Excel Hotel", area: "Aba", vicinity: "Faulks Road, Aba", phone: "08030001001", stars: 3 },
    { name: "Copper Crown Hotel", area: "Aba", vicinity: "Aba Central", phone: "08030001002", stars: 3 },
    { name: "Abia Hotels Ltd", area: "Umuahia", vicinity: "Library Avenue, Umuahia", phone: "08033001101", stars: 3 },
    { name: "De Iroha Garden Hotel", area: "Aba", vicinity: "Ngwa Road, Aba", phone: "08030001003", stars: 3 },
    { name: "Ostenfeld Hotel", area: "Aba", vicinity: "Pound Road, Aba", phone: "08030001004", stars: 2 },
    { name: "Rockville Hotel", area: "Umuahia", vicinity: "Hospital Road, Umuahia", phone: "08033001102", stars: 3 },
    { name: "Bolton White Hotel", area: "Umuahia", vicinity: "Bende Road, Umuahia", phone: "08033001103", stars: 4 },
    { name: "Le Meridien Owerri", area: "Near Aba (Owerri)", vicinity: "Owerri — 45 min from Aba", phone: "083000001", stars: 5 },
  ],

  petrolStations: [
    { name: "NNPC Mega Station", area: "Aba North", vicinity: "Port Harcourt Road, Aba" },
    { name: "Conoil Station", area: "Aba Central", vicinity: "Faulks Road, Aba" },
    { name: "Total Energies", area: "Osisioma", vicinity: "Aba Expressway, Osisioma" },
    { name: "Oando Station", area: "Umuahia", vicinity: "Bende Road, Umuahia" },
    { name: "NNPC Station Umuahia", area: "Umuahia Central", vicinity: "Library Avenue, Umuahia" },
    { name: "MRS Oil Station", area: "Ariaria", vicinity: "Ariaria Market Road, Aba" },
  ],

  foodJoints: [
    { name: "Mr. Biggs (UAC)", area: "Aba", vicinity: "Aba Central", type: "Fast food" },
    { name: "Chicken Republic", area: "Aba", vicinity: "Faulks Road, Aba", type: "Fast food" },
    { name: "Tastee Fried Chicken", area: "Aba", vicinity: "Aba Central", type: "Fast food" },
    { name: "Mama Cass", area: "Aba", vicinity: "Ariaria area, Aba", type: "Local Nigerian" },
    { name: "Yellow Chilli Restaurant", area: "Umuahia", vicinity: "GRA Umuahia", type: "Continental & Nigerian" },
    { name: "Portharcourt Buka", area: "Aba", vicinity: "Ngwa Road area", type: "Local Nigerian" },
    { name: "Genesis Restaurant", area: "Near Aba", vicinity: "Osisioma area", type: "Continental" },
    { name: "Roadchef Café", area: "Umuahia", vicinity: "Umuahia Central", type: "Fast food & snacks" },
  ],


  maternityHospitals: [
    // ── ABA ──────────────────────────────────────────────────
    { name: "Aba Township Hospital (Maternity Wing)", area: "Aba", vicinity: "Asa Road, Aba", phone: "08030002001", type: "Government", services: ["Normal delivery", "C-section", "Antenatal", "Postnatal"], emergency: true },
    { name: "St. Bridget's Catholic Hospital", area: "Aba", vicinity: "Ogbor Hill Road, Aba", phone: "08030002002", type: "Mission", services: ["Maternity", "Antenatal", "Midwifery", "Newborn care"], emergency: true },
    { name: "Graceland Specialist Hospital", area: "Aba", vicinity: "Faulks Road, Aba", phone: "08030002003", type: "Private", services: ["High-risk pregnancy", "C-section", "IVF referral", "Antenatal"], emergency: true },
    { name: "Mothers & Babies Clinic", area: "Aba", vicinity: "Ngwa Road, Aba", phone: "08030002004", type: "Private clinic", services: ["Normal delivery", "Antenatal", "Midwifery"], emergency: false },
    { name: "Bethesda Maternity Home", area: "Aba", vicinity: "Eziama, Aba North", phone: "08030002005", type: "Private clinic", services: ["Midwifery", "Normal delivery", "Postnatal care"], emergency: false },
    { name: "Ariaria PHC Maternity Unit", area: "Ariaria, Aba", vicinity: "Ariaria Junction, Aba", phone: "08031001003", type: "Government PHC", services: ["Normal delivery", "Antenatal", "Family planning"], emergency: false },
    { name: "Jubilee Road PHC Maternity", area: "Aba South", vicinity: "Jubilee Road, Aba South", phone: "08032001003", type: "Government PHC", services: ["Normal delivery", "Antenatal"], emergency: false },
    { name: "Holy Ghost Hospital Aba", area: "Aba", vicinity: "Aba Central", phone: "08030002006", type: "Mission", services: ["Maternity", "Antenatal", "C-section", "NICU"], emergency: true },
    { name: "Vine Medical Centre", area: "Aba", vicinity: "Pound Road, Ogbor Hill, Aba", phone: "08030002007", type: "Private", services: ["Maternity", "Gynecology", "Antenatal", "Normal delivery"], emergency: true },
    { name: "New Life Maternity Home", area: "Aba", vicinity: "Ndiegoro, Aba South", phone: "08030002008", type: "Private clinic", services: ["Midwifery", "Normal delivery", "Postnatal"], emergency: false },

    // ── UMUAHIA ──────────────────────────────────────────────
    { name: "Federal Medical Centre Umuahia (Obs & Gynae)", area: "Umuahia", vicinity: "Leventis Bus Stop, Aba Road, Umuahia", phone: "08033001003", type: "Federal hospital", services: ["High-risk pregnancy", "C-section", "NICU", "Antenatal", "Gynaecology", "IVF referral"], emergency: true },
    { name: "ABSUTH Maternity & Obs/Gynae Dept", area: "Umuahia", vicinity: "ABSUTH, Aba Road, Umuahia", phone: "08033001103", type: "Teaching hospital", services: ["High-risk", "C-section", "NICU", "Antenatal", "Specialist care"], emergency: true },
    { name: "Abia State Hospital (General Hospital Umuahia)", area: "Umuahia", vicinity: "Hospital Road, Umuahia", phone: "08033001002", type: "Government", services: ["Maternity ward", "Antenatal", "Normal delivery", "C-section"], emergency: true },
    { name: "Good Shepherd Hospital Umuahia", area: "Umuahia", vicinity: "Library Avenue, Umuahia", phone: "08033002101", type: "Mission", services: ["Maternity", "Midwifery", "Antenatal", "Normal delivery"], emergency: true },
    { name: "Umuahia Maternity Centre (PHC)", area: "Umuahia", vicinity: "Ikot Ekpene Road, Umuahia", phone: "08033002102", type: "Government PHC", services: ["Normal delivery", "Antenatal", "Family planning"], emergency: false },
    { name: "Sunrise Women's Clinic", area: "Umuahia", vicinity: "Warehouse Road, Umuahia", phone: "08033002103", type: "Private", services: ["Antenatal", "Normal delivery", "Gynecology", "Family planning"], emergency: false },
    { name: "Ibeku PHC Maternity Unit", area: "Ibeku, Umuahia", vicinity: "Ibeku Road, Umuahia", phone: "08033002003", type: "Government PHC", services: ["Normal delivery", "Antenatal"], emergency: false },

    // ── OTHER LGAs ────────────────────────────────────────────
    { name: "Arochukwu General Hospital Maternity", area: "Arochukwu", vicinity: "Mission Road, Arochukwu", phone: "08035001003", type: "Government", services: ["Normal delivery", "Antenatal", "Midwifery"], emergency: true },
    { name: "Bende General Hospital Maternity", area: "Bende", vicinity: "Church Road, Bende", phone: "08036001003", type: "Government", services: ["Normal delivery", "Antenatal"], emergency: true },
    { name: "Ohafia General Hospital Maternity", area: "Ohafia", vicinity: "Ohafia Town, Abia State", phone: "08037001003", type: "Government", services: ["Normal delivery", "Antenatal", "Midwifery"], emergency: true },
    { name: "Abia State University Clinic (Obs)", area: "Uturu (ABSU)", vicinity: "ABSU Campus, Uturu", phone: "08042001003", type: "University clinic", services: ["Antenatal", "Normal delivery", "Student health"], emergency: false },
    { name: "MOUAU Medical Centre (Maternity)", area: "Umudike", vicinity: "MOUAU Campus, Umudike", phone: "08033009001", type: "University clinic", services: ["Antenatal", "Delivery support", "Staff/student"], emergency: false },
  ],

  streetDirections: {
    "ariaria to aba central": "From Ariaria, take Uratta Road northbound → join Ngwa Road → follow to Brass Junction → you're in Aba Central. Keke available throughout.",
    "aba central to ogbor hill": "From Brass Junction Aba Central → take Ikot Ekpene Road heading south → pass St. Michael's Road junction → Ogbor Hill is on your right. 10–15 min keke ride.",
    "aba to umuahia": "Take Aba-Umuahia Expressway from Aba Motor Park. Direct buses available. Journey: ~45–60 min. Alternatively take the Bende Road route via Umuahia.",
    "umuahia to absu uturu": "From Umuahia Main Park → take Okigwe Road → board Isuikwuato-bound bus or keke at Umuahia park → get off at Uturu (ABSU Gate). ~1.5 hrs.",
    "aba to osisioma": "Take Port Harcourt Road from Aba North → pass FRSC checkpoint → Osisioma Industrial layout on left. Danfo or keke from Port Harcourt Road stop.",
    "umuahia to mouau umudike": "From Umuahia park → take Ikot Ekpene Road → get off at Umudike junction → short keke ride to MOUAU gate. ~20 min.",
    "aba to arochukwu": "Take Aba-Ikot Ekpene Road → at Obehie junction turn towards Arochukwu Road → bus from Aba Motor Park (Arochukwu-bound). ~2.5 hrs.",
    "umuahia national war museum": "From Umuahia Central → take Aba Road → museum is clearly signposted on left before ABSUTH. Keke from town. ~10 min.",
    "umuahia fmc": "From Umuahia Central → take Library Avenue → cross Leventis Bus Stop → FMC gate is 200m on right. Easy keke ride.",
    "aba ariaria market": "Ariaria is a major landmark. From any part of Aba, ask keke driver for Ariaria Market — all drivers know it. Buses go from Brass Junction.",
  }
};

// ── SYSTEM PROMPT FOR NNWANNE ──────────────────────────────────
const NNWANNE_SYSTEM = `You are Nnwanne, an intelligent emergency response and navigation assistant for Abia State, Nigeria. You are embedded in the Abia State Emergency Contacts app.

Your name "Nnwanne" means "sibling/fellow" in Igbo — you treat every user like family.

PERSONALITY:
- Warm, calm, and deeply knowledgeable about Abia State
- Mix English with light Igbo phrases naturally (e.g. "Nna/Nne" for dear, "No wahala" for no problem, "Oya" for okay/let's go)
- In emergencies: become laser-focused, brief, action-first
- In normal navigation: friendly, detailed, patient
- Never panic the user unnecessarily

CORE CAPABILITIES:
1. EMERGENCY RESPONSE: Identify emergency type → give immediate action steps → provide relevant contacts
2. NAVIGATION: Give precise directions using Aba and Umuahia street knowledge
3. BUS/KEKE GUIDANCE: Tell users which bus stop to board from, which route, which transport type
4. NEARBY PLACES: Suggest police stations, hotels, petrol stations, food joints, hospitals
5. DANGER ZONE ALERTS: Warn about risky areas in Abia, especially at night
6. FAVOURITES DIALING: Help user call/text their saved emergency contacts
7. GENERAL LOCAL KNOWLEDGE: Schools, markets, landmarks, LGA info

KEY ABIA FACTS YOU KNOW:
- Aba is the commercial capital; Umuahia is the political capital
- Major areas: Ariaria Market (largest textile market in West Africa), Osisioma Industrial Layout, ABSU Uturu, MOUAU Umudike
- Emergency: 112 (general), 199 (police), 122 (FRSC)
- NAPTIP South-East: +2348039000004
- NHRC Abia: +2348035403780
- Legal Aid: 0703-000-0000

DANGER ZONE AWARENESS:
- Ariaria Market environs at night → HIGH risk, pickpockets
- Port Harcourt Road bridge → HIGH robbery risk after 8pm
- Aba-Owerri Road at night → HIGH highway robbery risk
- Old GRA junction at night → MEDIUM risk, poor lighting
- Ngwa Road near Old Market → MEDIUM armed robbery risk

TRANSPORT KNOWLEDGE:
- Keke (tricycle) is the main short-distance transport in Aba and Umuahia
- Danfo (minibuses) for LGA-to-LGA
- Main parks: Aba Motor Park, Umuahia Main Park
- Never recommend solo night travel on major highways

RESPONSE STYLE:
- For emergencies: 3 sentences max, action-first
- For directions: step-by-step with landmarks
- For info: conversational, max 150 words
- Always end emergency responses with: the most relevant hotline number

MATERNITY & OBSTETRIC EMERGENCIES:
- FMC Umuahia and ABSUTH have full 24hr Obs/Gynae and NICU
- St. Bridget's Catholic Hospital Aba and Holy Ghost Hospital Aba are key Mission hospitals with maternity
- For labour emergencies: tell user to call 112 AND head to nearest hospital with 24hr emergency maternity
- Abia has PHC maternity units in every LGA for normal deliveries
- For high-risk pregnancies (twins, complications, preterm): FMC Umuahia or ABSUTH are the best options
- Always ask: How many weeks? First signs or active labour? This helps you advise urgency.

If user says they are in danger, immediately ask: WHERE are you? and give closest police station.
If user mentions pregnancy emergency or labour: ask location → give nearest 24hr maternity hospital → say call 112.

Respond naturally to voice queries — no bullet points for voice responses, use flowing speech.`;

// ── STYLES ─────────────────────────────────────────────────────
const BOT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .nn-fab{
    position:fixed;bottom:24px;right:24px;z-index:9999;
    width:62px;height:62px;border-radius:50%;border:none;cursor:pointer;
    background:linear-gradient(135deg,#00c853,#00897b);
    box-shadow:0 4px 20px rgba(0,200,83,.5),0 0 0 0 rgba(0,200,83,.4);
    display:flex;align-items:center;justify-content:center;
    font-size:1.5rem;transition:transform .2s;
    animation:nn-pulse 3s infinite;
  }
  .nn-fab:hover{transform:scale(1.1);}
  .nn-fab.listening{background:linear-gradient(135deg,#f44336,#c62828);animation:nn-listen-pulse 1s infinite;}
  @keyframes nn-pulse{0%,100%{box-shadow:0 4px 20px rgba(0,200,83,.5),0 0 0 0 rgba(0,200,83,.4);}50%{box-shadow:0 4px 20px rgba(0,200,83,.5),0 0 0 12px rgba(0,200,83,.0);}}
  @keyframes nn-listen-pulse{0%,100%{box-shadow:0 4px 24px rgba(244,67,54,.6),0 0 0 0 rgba(244,67,54,.4);}50%{box-shadow:0 4px 24px rgba(244,67,54,.6),0 0 0 16px rgba(244,67,54,.0);}}

  .nn-overlay{
    position:fixed;bottom:100px;right:16px;z-index:9998;
    width:min(400px, calc(100vw - 32px));
    height:min(600px, calc(100vh - 130px));
    background:linear-gradient(160deg,#07101a,#0b1822);
    border:1px solid rgba(0,200,83,.2);
    border-radius:20px;
    display:flex;flex-direction:column;
    box-shadow:0 24px 80px rgba(0,0,0,.8),0 0 0 1px rgba(0,200,83,.1);
    overflow:hidden;
    animation:nn-slide-in .3s cubic-bezier(.175,.885,.32,1.1);
  }
  @keyframes nn-slide-in{from{opacity:0;transform:translateY(30px) scale(.95);}to{opacity:1;transform:translateY(0) scale(1);}}

  .nn-header{
    background:linear-gradient(90deg,rgba(0,200,83,.15),rgba(0,200,83,.05));
    border-bottom:1px solid rgba(0,200,83,.15);
    padding:14px 16px;
    display:flex;align-items:center;gap:10px;
    flex-shrink:0;
  }
  .nn-avatar{
    width:42px;height:42px;border-radius:50%;
    background:linear-gradient(135deg,#00c853,#00897b);
    display:flex;align-items:center;justify-content:center;
    font-size:1.1rem;flex-shrink:0;position:relative;
  }
  .nn-avatar-ring{
    position:absolute;inset:-3px;border-radius:50%;
    border:2px solid rgba(0,200,83,.4);
    animation:nn-ring 2s linear infinite;
  }
  @keyframes nn-ring{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  .nn-avatar-ring.speaking{border-color:rgba(0,200,83,.9);animation-duration:.5s;}
  .nn-hdr-text{}
  .nn-name{font-family:'Syne',sans-serif;font-size:.92rem;font-weight:700;color:#fff;letter-spacing:.04em;}
  .nn-status{font-size:.62rem;color:rgba(0,200,83,.7);letter-spacing:.08em;text-transform:uppercase;}
  .nn-close{margin-left:auto;background:rgba(255,255,255,.06);border:none;color:rgba(255,255,255,.5);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:.9rem;display:flex;align-items:center;justify-content:center;transition:all .18s;}
  .nn-close:hover{background:rgba(255,255,255,.12);color:#fff;}

  .nn-tabs{display:flex;border-bottom:1px solid rgba(0,200,83,.1);flex-shrink:0;}
  .nn-tab{flex:1;padding:8px;background:transparent;border:none;color:rgba(255,255,255,.35);font-size:.62rem;font-family:'Syne',sans-serif;font-weight:600;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .18s;border-bottom:2px solid transparent;}
  .nn-tab.active{color:rgba(0,200,83,.9);border-bottom-color:#00c853;}

  .nn-messages{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;}
  .nn-messages::-webkit-scrollbar{width:3px;}
  .nn-messages::-webkit-scrollbar-track{background:transparent;}
  .nn-messages::-webkit-scrollbar-thumb{background:rgba(0,200,83,.2);border-radius:3px;}

  .nn-msg{display:flex;gap:8px;animation:nn-msg-in .2s ease;}
  @keyframes nn-msg-in{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
  .nn-msg.user{flex-direction:row-reverse;}
  .nn-bubble{
    max-width:82%;padding:10px 13px;border-radius:14px;
    font-size:.76rem;line-height:1.6;
  }
  .nn-bubble.bot{
    background:rgba(0,200,83,.08);border:1px solid rgba(0,200,83,.15);
    color:#d4eedd;border-radius:4px 14px 14px 14px;
  }
  .nn-bubble.user{
    background:rgba(0,100,255,.15);border:1px solid rgba(100,149,237,.25);
    color:#c5d8ff;border-radius:14px 4px 14px 14px;
  }
  .nn-bubble.emergency{
    background:rgba(244,67,54,.1);border:1px solid rgba(244,67,54,.3);
    color:#ffcccc;
  }
  .nn-bubble.warning{
    background:rgba(255,171,0,.08);border:1px solid rgba(255,171,0,.25);
    color:#ffe9a0;
  }
  .nn-typing{display:flex;gap:4px;align-items:center;padding:12px;}
  .nn-dot{width:6px;height:6px;background:rgba(0,200,83,.5);border-radius:50%;animation:nn-bounce .9s infinite;}
  .nn-dot:nth-child(2){animation-delay:.15s;}
  .nn-dot:nth-child(3){animation-delay:.3s;}
  @keyframes nn-bounce{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}

  .nn-quick-btns{display:flex;flex-wrap:wrap;gap:5px;padding:0 14px 8px;}
  .nn-qbtn{
    background:rgba(0,200,83,.06);border:1px solid rgba(0,200,83,.18);
    color:rgba(0,200,83,.8);padding:5px 10px;border-radius:12px;
    font-size:.62rem;font-family:'Syne',sans-serif;font-weight:600;
    cursor:pointer;transition:all .18s;white-space:nowrap;
  }
  .nn-qbtn:hover{background:rgba(0,200,83,.15);color:#00e676;}
  .nn-qbtn.danger{border-color:rgba(244,67,54,.35);color:rgba(244,67,54,.9);background:rgba(244,67,54,.06);}
  .nn-qbtn.danger:hover{background:rgba(244,67,54,.15);}

  .nn-input-row{
    display:flex;gap:8px;padding:10px 12px;
    border-top:1px solid rgba(0,200,83,.1);
    flex-shrink:0;background:rgba(0,0,0,.3);align-items:flex-end;
  }
  .nn-textarea{
    flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(0,200,83,.15);
    color:#e2ecf5;padding:9px 12px;border-radius:10px;
    font-family:'Syne',sans-serif;font-size:.76rem;
    resize:none;min-height:38px;max-height:100px;line-height:1.5;
    transition:border-color .18s;outline:none;
  }
  .nn-textarea:focus{border-color:rgba(0,200,83,.4);}
  .nn-textarea::placeholder{color:rgba(255,255,255,.2);}
  .nn-send-btn,.nn-voice-btn{
    width:38px;height:38px;border-radius:50%;border:none;cursor:pointer;
    display:flex;align-items:center;justify-content:center;font-size:.9rem;
    transition:all .18s;flex-shrink:0;
  }
  .nn-send-btn{background:linear-gradient(135deg,#00c853,#00897b);color:#000;}
  .nn-send-btn:hover{transform:scale(1.08);}
  .nn-send-btn:disabled{opacity:.4;cursor:not-allowed;transform:none;}
  .nn-voice-btn{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.5);}
  .nn-voice-btn.active{background:rgba(244,67,54,.2);border-color:rgba(244,67,54,.5);color:#f44336;animation:nn-listen-pulse 1s infinite;}
  .nn-voice-btn:hover{background:rgba(255,255,255,.1);}

  /* ── FAVOURITES TAB ── */
  .nn-favs-panel{flex:1;overflow-y:auto;padding:12px;}
  .nn-fav-card{
    background:rgba(255,255,255,.03);border:1px solid rgba(0,200,83,.12);
    border-radius:10px;padding:12px;margin-bottom:8px;
    display:flex;align-items:center;gap:10px;
  }
  .nn-fav-ico{font-size:1.2rem;flex-shrink:0;}
  .nn-fav-name{font-size:.78rem;font-weight:700;color:#e2ecf5;font-family:'Syne',sans-serif;}
  .nn-fav-phone{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:rgba(0,200,83,.7);}
  .nn-fav-relation{font-size:.6rem;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.08em;}
  .nn-fav-actions{margin-left:auto;display:flex;gap:6px;}
  .nn-fav-btn{padding:6px 10px;border-radius:8px;border:none;font-size:.65rem;font-weight:700;cursor:pointer;transition:all .18s;font-family:'Syne',sans-serif;}
  .nn-fav-btn.call{background:rgba(0,200,83,.15);border:1px solid rgba(0,200,83,.3);color:#00e676;}
  .nn-fav-btn.call:hover{background:rgba(0,200,83,.3);}
  .nn-fav-btn.del{background:rgba(244,67,54,.08);border:1px solid rgba(244,67,54,.2);color:rgba(244,67,54,.7);}
  .nn-fav-btn.del:hover{background:rgba(244,67,54,.2);}
  .nn-add-fav-form{background:rgba(0,200,83,.04);border:1px solid rgba(0,200,83,.15);border-radius:10px;padding:12px;margin-top:4px;}
  .nn-add-title{font-size:.68rem;font-weight:700;color:rgba(0,200,83,.7);text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px;font-family:'Syne',sans-serif;}
  .nn-add-input{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(0,200,83,.15);color:#e2ecf5;padding:8px 10px;border-radius:7px;font-family:'Syne',sans-serif;font-size:.73rem;margin-bottom:7px;outline:none;box-sizing:border-box;}
  .nn-add-input:focus{border-color:rgba(0,200,83,.4);}
  .nn-add-input::placeholder{color:rgba(255,255,255,.2);}
  .nn-add-submit{width:100%;padding:9px;background:linear-gradient(90deg,#00c853,#00897b);border:none;border-radius:7px;color:#000;font-weight:700;font-family:'Syne',sans-serif;font-size:.72rem;cursor:pointer;letter-spacing:.06em;transition:opacity .18s;}
  .nn-add-submit:hover{opacity:.85;}
  .nn-sos-all-btn{
    width:100%;padding:11px;background:linear-gradient(90deg,#f44336,#b71c1c);
    border:none;border-radius:10px;color:#fff;font-weight:700;
    font-family:'Syne',sans-serif;font-size:.78rem;cursor:pointer;
    letter-spacing:.06em;margin-bottom:10px;
    animation:nn-pulse 2s infinite;transition:transform .18s;
  }
  .nn-sos-all-btn:hover{transform:scale(1.02);}
  .nn-empty-favs{text-align:center;padding:30px 16px;color:rgba(255,255,255,.3);font-size:.75rem;font-family:'Syne',sans-serif;}

  /* ── VOICE WAVEFORM ── */
  .nn-waveform{display:flex;gap:3px;align-items:center;height:24px;padding:0 14px 8px;}
  .nn-wave-bar{width:3px;background:rgba(0,200,83,.5);border-radius:2px;animation:nn-wave 1.2s ease-in-out infinite;}
  .nn-wave-bar:nth-child(2){animation-delay:.1s;}.nn-wave-bar:nth-child(3){animation-delay:.2s;}.nn-wave-bar:nth-child(4){animation-delay:.3s;}.nn-wave-bar:nth-child(5){animation-delay:.4s;}
  @keyframes nn-wave{0%,100%{height:4px;}50%{height:20px;}}

  /* ── DANGER ALERT ── */
  .nn-danger-alert{
    background:linear-gradient(90deg,rgba(244,67,54,.15),rgba(244,67,54,.05));
    border:1px solid rgba(244,67,54,.35);border-radius:10px;
    padding:10px 12px;margin:0 14px 8px;font-size:.68rem;
    color:rgba(255,200,200,.9);line-height:1.55;
    animation:nn-msg-in .3s ease;
  }
  .nn-danger-title{font-weight:700;color:#f44336;font-family:'Syne',sans-serif;font-size:.7rem;margin-bottom:4px;}

  @media(max-width:480px){
    .nn-overlay{bottom:90px;right:8px;width:calc(100vw - 16px);height:calc(100vh - 120px);}
    .nn-fab{bottom:16px;right:16px;width:56px;height:56px;}
  }
`;

// ── MAIN COMPONENT ─────────────────────────────────────────────
export default function Nnwanne() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("chat"); // chat | favs
  const [messages, setMessages] = useState([
    {
      role: "bot", id: Date.now(),
      content: "Nna/Nne! I'm Nnwanne 👮 — your Abia emergency guide and navigator.\n\nI can help you:\n• 🚨 Report emergencies & dial saved contacts\n• 🗺 Navigate Aba & Umuahia streets\n• 🚌 Find the right bus stop or keke route\n• ⚠️ Check danger zones\n• 🏨 Find hotels, petrol stations & food\n\nHow can I help you right now?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [favs, setFavs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nnwanne_favs") || "[]"); } catch { return []; }
  });
  const [addFavForm, setAddFavForm] = useState(false);
  const [newFav, setNewFav] = useState({ name: "", phone: "", relation: "", icon: "👤" });

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const conversationRef = useRef([]);

  // ── SCROLL TO BOTTOM ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── SAVE FAVS ──
  useEffect(() => {
    localStorage.setItem("nnwanne_favs", JSON.stringify(favs));
  }, [favs]);

  // ── SETUP SPEECH RECOGNITION ──
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = "en-NG";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      setTimeout(() => sendMessage(transcript), 300);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
  }, []);


  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[👮🚨🗺🚌⚠️🏨📞💬👤🔴🟡🟢•\*]/g, "")
      .replace(/\n+/g, ". ")
      .trim()
      .slice(0, 500);
    if (!cleanText) return;

    const doSpeak = () => {
      const utter = new SpeechSynthesisUtterance(cleanText);
      utter.lang = "en-NG";
      utter.rate = 1.05;
      utter.pitch = 0.8;
      utter.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(v => v.lang === "en-NG") ||
        voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("nigerian")) ||
        voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("male")) ||
        voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("david")) ||
        voices.find(v => v.lang.startsWith("en") && !v.name.toLowerCase().includes("female"));
      if (preferred) utter.voice = preferred;

      utter.onstart = () => setSpeaking(true);
      utter.onend = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      utteranceRef.current = utter;
      window.speechSynthesis.speak(utter);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", doSpeak, { once: true });
    } else {
      doSpeak();
    }
  }, []);


  // ── GPS LOCATION ──
  const getLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported on this device.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          resolve(loc);
        },
        (err) => {
          const msg = err.code === 1
            ? "Location access denied. Please allow location in your browser settings."
            : "Could not get your location. Please try again.";
          setLocationError(msg);
          reject(msg);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }, []);

  // ── NEARBY PLACES SEARCH ──
  const PLACE_TYPES = {
    hotel:   { type: "lodging",          keyword: "hotel lodge",        emoji: "🏨", label: "Hotels & Lodges" },
    food:    { type: "restaurant",       keyword: "restaurant food",    emoji: "🍽️", label: "Restaurants" },
    hospital:{ type: "hospital",         keyword: "hospital clinic",    emoji: "🏥", label: "Hospitals" },
    pharmacy:{ type: "pharmacy",         keyword: "pharmacy chemist",   emoji: "💊", label: "Pharmacies" },
    police:  { type: "police",           keyword: "police station",     emoji: "🚔", label: "Police Stations" },
    petrol:  { type: "gas_station",      keyword: "petrol filling station", emoji: "⛽", label: "Petrol Stations" },
    bank:    { type: "bank",             keyword: "bank ATM",           emoji: "🏧", label: "Banks & ATMs" },
    atm:     { type: "atm",              keyword: "ATM cash",           emoji: "🏧", label: "ATMs" },
  };

  const detectPlaceIntent = (text) => {
    const t = text.toLowerCase();
    if (/(hotel|lodge|accommodation|stay|sleep|room)/i.test(t))    return "hotel";
    if (/(eat|food|restaurant|hungry|dinner|lunch|breakfast)/i.test(t)) return "food";
    if (/(pharmacy|chemist|medicine|drug store|panadol|drug)/i.test(t)) return "pharmacy";
    if (/(hospital|clinic|doctor|sick|injured|emergency|medical)/i.test(t)) return "hospital";
    if (/(police|station|security|robber|attack|stolen)/i.test(t)) return "police";
    if (/(petrol|fuel|filling station|diesel|gas station)/i.test(t)) return "petrol";
    if (/(bank|atm|cash|withdraw|money)/i.test(t))                 return "bank";
    return null;
  };

  const searchNearbyPlaces = useCallback(async (intent, loc) => {
    setPlacesLoading(true);
    setNearbyPlaces([]);
    try {
      const IS_DEV = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const BASE = IS_DEV ? "http://localhost:3001" : "https://abia-emergency-center-production.up.railway.app";
      const cfg = PLACE_TYPES[intent];

      const response = await fetch(`${BASE}/api/places`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: loc.lat, lng: loc.lng, type: cfg.type, keyword: cfg.keyword }),
      });

      const data = await response.json();
      if (data.places && data.places.length > 0) {
        setNearbyPlaces({ intent, cfg, places: data.places });
        return data.places;
      } else {
        setNearbyPlaces({ intent, cfg, places: [] });
        return [];
      }
    } catch (err) {
      console.error("Places search error:", err);
      return [];
    } finally {
      setPlacesLoading(false);
    }
  }, []);

  const getDistanceKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);
  };

  // ── SEND MESSAGE ──

  const unlockAudio = useCallback(() => {
    if (!audioUnlocked && window.speechSynthesis) {
      const silent = new SpeechSynthesisUtterance(" ");
      silent.volume = 0;
      silent.rate = 1;
      window.speechSynthesis.speak(silent);
      setAudioUnlocked(true);
    }
  }, [audioUnlocked]);

    // ── STOP SPEAKING ──
  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  // ── TOGGLE VOICE INPUT ──
  const toggleVoice = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      stopSpeaking();
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  // ── DETECT DANGER ZONE MENTION ──
  const checkDangerZone = (text) => {
    const lowerText = text.toLowerCase();
    return ABIA_KNOWLEDGE.dangerZones.find(z =>
      lowerText.includes(z.area.toLowerCase().split(",")[0].toLowerCase()) ||
      z.area.toLowerCase().split(",").some(part => lowerText.includes(part.trim().toLowerCase()))
    );
  };

  // ── BUILD CONTEXT STRING ──
  const buildContext = (userMsg) => {
    const ctx = [];
    const lower = userMsg.toLowerCase();

    if (lower.includes("hotel") || lower.includes("lodge") || lower.includes("stay")) {
      ctx.push("HOTELS: " + ABIA_KNOWLEDGE.hotels.map(h => `${h.name} (${h.area}, ${h.vicinity}, ☎${h.phone})`).join("; "));
    }
    if (lower.includes("petrol") || lower.includes("fuel") || lower.includes("filling")) {
      ctx.push("PETROL STATIONS: " + ABIA_KNOWLEDGE.petrolStations.map(p => `${p.name} - ${p.vicinity}`).join("; "));
    }
    if (lower.includes("maternity") || lower.includes("midwif") || lower.includes("delivery") || lower.includes("antenatal") || lower.includes("pregnant") || lower.includes("labour") || lower.includes("labor") || lower.includes("clinic") || lower.includes("gynae") || lower.includes("gynecol") || lower.includes("hospital") || lower.includes("baby") || lower.includes("birth")) {
      const mat = ABIA_KNOWLEDGE.maternityHospitals;
      ctx.push("MATERNITY HOSPITALS & CLINICS: " + mat.map(m => `${m.name} [${m.type}] - ${m.vicinity}, ☎${m.phone} | Services: ${m.services.join(", ")} ${m.emergency ? "| 🚨 24hr emergency" : ""}`).join("; "));
    }
    if (lower.includes("food") || lower.includes("eat") || lower.includes("restaurant") || lower.includes("hungry")) {
      ctx.push("FOOD JOINTS: " + ABIA_KNOWLEDGE.foodJoints.map(f => `${f.name} (${f.type}) - ${f.vicinity}`).join("; "));
    }
    if (lower.includes("police") || lower.includes("station")) {
      ctx.push("POLICE STATIONS: " + ABIA_KNOWLEDGE.policeStations.map(p => `${p.name}, ${p.area}, ☎${p.phone}`).join("; "));
    }
    if (lower.includes("bus") || lower.includes("keke") || lower.includes("transport") || lower.includes("how to get")) {
      const aba = ABIA_KNOWLEDGE.busStops.aba.map(b => `${b.name} (${b.area}) → ${b.routes.join("/")} ${b.keke ? "[keke avail]" : ""}`).join("; ");
      const umu = ABIA_KNOWLEDGE.busStops.umuahia.map(b => `${b.name} (${b.area}) → ${b.routes.join("/")} ${b.keke ? "[keke avail]" : ""}`).join("; ");
      ctx.push(`ABA BUS STOPS: ${aba}`);
      ctx.push(`UMUAHIA BUS STOPS: ${umu}`);
    }
    if (lower.includes("danger") || lower.includes("safe") || lower.includes("avoid") || lower.includes("risky")) {
      ctx.push("DANGER ZONES: " + ABIA_KNOWLEDGE.dangerZones.map(d => `${d.area} [${d.risk}]: ${d.note}`).join("; "));
    }
    if (favs.length > 0) {
      ctx.push("USER'S SAVED CONTACTS: " + favs.map(f => `${f.name} (${f.relation}) - ${f.phone}`).join("; "));
    }

    // Check street directions
    Object.keys(ABIA_KNOWLEDGE.streetDirections).forEach(key => {
      if (key.split(" ").some(word => lower.includes(word))) {
        ctx.push(`ROUTE (${key}): ${ABIA_KNOWLEDGE.streetDirections[key]}`);
      }
    });

    return ctx.length > 0 ? "\n\n[LOCAL DATA]\n" + ctx.join("\n") : "";
  };

  // ── GPS LOCATION ──
  // ── SEND MESSAGE ──
  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText) return;
    setInput("");
    const userMsg = { role: "user", id: Date.now(), content: userText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Check danger zone proactively
    const danger = checkDangerZone(userText);

    // Build conversation history
    conversationRef.current = [...conversationRef.current, { role: "user", content: userText }];
    if (conversationRef.current.length > 20) conversationRef.current = conversationRef.current.slice(-20);

    // ── GPS PLACE DETECTION ──
    const placeIntent = detectPlaceIntent(userText);
    let gpsContext = "";
    let fetchedPlaces = [];

    if (placeIntent) {
      try {
        const loc = userLocation || await getLocation();
        fetchedPlaces = await searchNearbyPlaces(placeIntent, loc);
        if (fetchedPlaces.length > 0) {
          const cfg = PLACE_TYPES[placeIntent];
          gpsContext = `\n\n[GPS - REAL NEARBY ${cfg.label.toUpperCase()} WITHIN 5KM]\n` +
            fetchedPlaces.map((p, i) => {
              const dist = getDistanceKm(loc.lat, loc.lng, p.lat, p.lng);
              const open = p.open_now === true ? "✅ Open now" : p.open_now === false ? "❌ Closed" : "";
              const rating = p.rating ? `⭐${p.rating}` : "";
              return `${i+1}. ${p.name} — ${p.address} ${rating} ${open} (${dist}km away)`;
            }).join("\n") +
            "\nTell the user these exact real places with distances. Be helpful and specific.";
        } else {
          gpsContext = `\n\n[GPS] No ${PLACE_TYPES[placeIntent].label} found within 5km of user's location.`;
        }
      } catch (locErr) {
        gpsContext = `\n\n[GPS] Could not get location: ${locErr}. Tell user to enable location access.`;
      }
    }

    try {
      const context = buildContext(userText) + gpsContext;
      const systemPrompt = NNWANNE_SYSTEM + context;
      // ── API ENDPOINT ──────────────────────────────────────────────
      // In development: routes to local proxy (port 3001)
      // In production: routes to the Railway-hosted proxy
      const IS_DEV =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

      const ENDPOINT = IS_DEV
        ? "http://localhost:3001/api/chat"
        : "https://abia-emergency-center-production.up.railway.app/api/chat";

      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000,
          system: systemPrompt,
          messages: conversationRef.current,
        }),
      });

      const data = await response.json();
      const botText = data.content?.[0]?.text || "Nna, I had trouble connecting. Please try again or call 112 directly.";

      conversationRef.current = [...conversationRef.current, { role: "assistant", content: botText }];

      const isEmergency = /\b(help|emergency|danger|attack|fire|accident|robber|kidnap|bleeding|unconscious|stabbed|shot|rape)\b/i.test(userText);
      const isWarning = danger !== null;
      const newMsgId = Date.now() + 1;

      setMessages(prev => [...prev, {
        role: "bot", id: newMsgId,
        content: botText,
        type: isEmergency ? "emergency" : isWarning ? "warning" : "normal",
        dangerAlert: danger || null,
      }]);

      speak(botText);
      // Store text on message for mobile tap-to-speak
      setMessages(prev => prev.map((m, idx) =>
        idx === prev.length - 1 ? { ...m, speakText: botText } : m
      ));
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "bot", id: Date.now() + 1,
        content: "Connection error, Nna. But remember — for any emergency in Abia, call 112 immediately.",
        type: "emergency"
      }]);
    }
    setLoading(false);
  }, [input, favs, speak]);

  // ── HANDLE KEYDOWN ──
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── ADD FAVOURITE ──
  const addFav = () => {
    if (!newFav.name || !newFav.phone) return;
    setFavs(prev => [...prev, { ...newFav, id: Date.now() }]);
    setNewFav({ name: "", phone: "", relation: "", icon: "👤" });
    setAddFavForm(false);
  };

  // ── DELETE FAVOURITE ──
  const deleteFav = (id) => setFavs(prev => prev.filter(f => f.id !== id));

  // ── SOS ALL FAVOURITES ──
  const sosAll = () => {
    if (favs.length === 0) return;
    const msg = `🚨 EMERGENCY SOS from Abia Emergency App. I need help immediately. Please call me now!`;
    favs.forEach(f => {
      window.open(`sms:${f.phone}?body=${encodeURIComponent(msg)}`);
    });
  };

  const QUICK_PROMPTS = [
    { label: "🚨 I'm in danger", text: "I am in danger right now. What should I do?", danger: true },
    { label: "🗺 Directions Aba", text: "I need directions in Aba. I'm lost." },
    { label: "🚌 Bus to Umuahia", text: "Which bus stop do I board to go to Umuahia from Aba?" },
    { label: "⚠️ Danger zones", text: "Which areas in Abia should I avoid right now especially at night?" },
    { label: "🏨 Hotels near me", text: "I need a hotel in Aba. What are the options?" },
    { label: "⛽ Nearest petrol", text: "Where can I find a petrol station in Aba right now?" },
    { label: "🍽️ Food nearby", text: "I'm hungry. What food joints are available in Aba?" },
    { label: "🚔 Police station", text: "What is the closest police station to Ariaria, Aba?" },
    { label: "🤱 Maternity hospital", text: "I need a maternity hospital or midwifery clinic in Abia urgently." },
    { label: "🏥 Nearest hospital", text: "What hospitals are available near me in Abia?" },
  ];

  const RELATION_ICONS = { Family: "👨‍👩‍👧", Friend: "🤝", Doctor: "🏥", Neighbour: "🏠", Colleague: "💼", Other: "👤" };


  return (
    <>
      <style>{BOT_STYLES}</style>

      {/* FLOATING ACTION BUTTON */}
      <button className={`nn-fab ${listening ? "listening" : ""}`} onClick={() => {
        // Unlock Audio API on first tap — required for iOS/Android autoplay policy
        if (!audioUnlocked && window.speechSynthesis) {
          const silent = new SpeechSynthesisUtterance(" ");
          silent.volume = 0;
          window.speechSynthesis.speak(silent);
          setAudioUnlocked(true);
        }
        setOpen(o => !o);
        stopSpeaking();
      }} title="Nnwanne AI Assistant">
        {listening ? "🎙️" : open ? "✕" : "👮"}
      </button>

      {/* CHAT OVERLAY */}
      {open && (
        <div className="nn-overlay">
          {/* HEADER */}
          <div className="nn-header">
            <div className="nn-avatar">
              👮
              <div className={`nn-avatar-ring ${speaking ? "speaking" : ""}`} />
            </div>
            <div className="nn-hdr-text">
              <div className="nn-name">Nnwanne</div>
              <div className="nn-status">
                {listening ? "🔴 Listening…" : speaking ? "🔊 Speaking…" : loading ? "⚙️ Thinking…" : "● Ready · Abia AI Guide"}
              </div>
            </div>
            <button className="nn-close" onClick={() => { setOpen(false); stopSpeaking(); }}>✕</button>
          </div>

          {/* TABS */}
          <div className="nn-tabs">
            <button className={`nn-tab ${tab === "chat" ? "active" : ""}`} onClick={() => setTab("chat")}>💬 Chat</button>
            <button className={`nn-tab ${tab === "favs" ? "active" : ""}`} onClick={() => setTab("favs")}>⭐ Saved ({favs.length})</button>
          </div>

          {/* ── CHAT TAB ── */}
          {tab === "chat" && (
            <>
              {/* VOICE WAVEFORM */}
              {listening && (
                <div className="nn-waveform">
                  {[1,2,3,4,5].map(i => <div key={i} className="nn-wave-bar" style={{ height: `${Math.random() * 16 + 4}px` }} />)}
                  <span style={{ fontSize: ".62rem", color: "rgba(244,67,54,.8)", marginLeft: 8, fontFamily: "Syne" }}>Listening…</span>
                </div>
              )}

              {/* MESSAGES */}
              <div className="nn-messages">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    {msg.dangerAlert && (
                      <div className="nn-danger-alert">
                        <div className="nn-danger-title">⚠️ DANGER ZONE ALERT — {msg.dangerAlert.risk} RISK</div>
                        {msg.dangerAlert.note}
                      </div>
                    )}
                    <div className={`nn-msg ${msg.role}`}>
                      <div className={`nn-bubble ${msg.role === "user" ? "user" : msg.type === "emergency" ? "emergency" : msg.type === "warning" ? "warning" : "bot"}`}>
                        {msg.content}
                        {msg.role !== "user" && msg.speakText && (
                          <button
                            onClick={() => speak(msg.speakText)}
                            style={{
                              marginTop: 7, display: "inline-flex", alignItems: "center",
                              gap: 5, cursor: "pointer", fontSize: ".62rem",
                              color: speaking ? "rgba(0,200,83,1)" : "rgba(0,200,83,.7)",
                              fontFamily: "Syne", fontWeight: 700, letterSpacing: ".05em",
                              background: "rgba(0,200,83,.07)",
                              border: "1px solid rgba(0,200,83,.2)",
                              borderRadius: 8, padding: "4px 10px"
                            }}
                          >
                            {speaking ? "🔊 Speaking…" : "🔊 Tap to hear"}
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="nn-msg">
                    <div className="nn-bubble bot">
                      <div className="nn-typing">
                        <div className="nn-dot" /><div className="nn-dot" /><div className="nn-dot" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* NEARBY PLACES CARD */}
              {placesLoading && (
                <div style={{ padding: "10px 16px", background: "rgba(0,200,83,.06)", border: "1px solid rgba(0,200,83,.15)", borderRadius: 10, margin: "8px 0", fontSize: ".72rem", color: "rgba(0,200,83,.8)", fontFamily: "Syne", fontWeight: 700, letterSpacing: ".05em" }}>
                  📍 Finding nearby places…
                </div>
              )}
              {nearbyPlaces?.places?.length > 0 && (
                <div style={{ background: "rgba(0,200,83,.05)", border: "1px solid rgba(0,200,83,.2)", borderRadius: 12, margin: "8px 0", overflow: "hidden" }}>
                  <div style={{ padding: "8px 14px", background: "rgba(0,200,83,.1)", fontSize: ".65rem", fontFamily: "Syne", fontWeight: 700, letterSpacing: ".08em", color: "rgba(0,200,83,.9)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{nearbyPlaces.cfg?.emoji} NEARBY {nearbyPlaces.cfg?.label?.toUpperCase()}</span>
                    <button onClick={() => setNearbyPlaces([])} style={{ background: "none", border: "none", color: "rgba(255,255,255,.3)", cursor: "pointer", fontSize: ".8rem" }}>✕</button>
                  </div>
                  {nearbyPlaces.places.map((p, i) => (
                    <div key={i} style={{ padding: "8px 14px", borderBottom: "1px solid rgba(0,200,83,.08)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: ".72rem", fontWeight: 700, color: "rgba(255,255,255,.9)", fontFamily: "Syne" }}>{p.name}</div>
                        <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,.45)", marginTop: 2 }}>{p.address}</div>
                        <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                          {p.rating && <span style={{ fontSize: ".6rem", color: "#ffd740" }}>⭐ {p.rating}</span>}
                          {p.open_now === true && <span style={{ fontSize: ".6rem", color: "#00e676" }}>✅ Open</span>}
                          {p.open_now === false && <span style={{ fontSize: ".6rem", color: "#ff5252" }}>❌ Closed</span>}
                        </div>
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: ".6rem", background: "rgba(0,200,83,.15)", border: "1px solid rgba(0,200,83,.3)", borderRadius: 6, padding: "4px 8px", color: "rgba(0,200,83,.9)", textDecoration: "none", fontFamily: "Syne", fontWeight: 700, whiteSpace: "nowrap" }}
                      >
                        🗺 Directions
                      </a>
                    </div>
                  ))}
                </div>
              )}
              {nearbyPlaces?.places?.length === 0 && nearbyPlaces?.cfg && !placesLoading && (
                <div style={{ padding: "10px 16px", background: "rgba(255,82,82,.05)", border: "1px solid rgba(255,82,82,.15)", borderRadius: 10, margin: "8px 0", fontSize: ".7rem", color: "rgba(255,255,255,.5)", fontFamily: "Syne" }}>
                  📍 No {nearbyPlaces.cfg.label} found within 5km of your location.
                </div>
              )}

              {/* QUICK PROMPTS */}
              <div className="nn-quick-btns">
                {/* GPS STATUS */}
                {!userLocation && (
                  <button
                    onClick={async () => { try { await getLocation(); } catch(e) {} }}
                    style={{ width: "100%", marginBottom: 6, padding: "6px 10px", background: "rgba(0,200,83,.08)", border: "1px dashed rgba(0,200,83,.3)", borderRadius: 8, color: "rgba(0,200,83,.7)", fontSize: ".62rem", fontFamily: "Syne", fontWeight: 700, cursor: "pointer", letterSpacing: ".05em" }}
                  >
                    📍 Enable location for nearby places
                  </button>
                )}
                {userLocation && (
                  <div style={{ fontSize: ".58rem", color: "rgba(0,200,83,.5)", fontFamily: "Syne", marginBottom: 4, letterSpacing: ".05em" }}>
                    📍 Location active — ask me for nearby hotels, food, hospitals & more
                  </div>
                )}
                {locationError && (
                  <div style={{ fontSize: ".58rem", color: "rgba(255,82,82,.6)", fontFamily: "Syne", marginBottom: 4 }}>
                    ⚠️ {locationError}
                  </div>
                )}
                {QUICK_PROMPTS.map((q, i) => (
                  <button key={i} className={`nn-qbtn ${q.danger ? "danger" : ""}`} onClick={() => { unlockAudio(); sendMessage(q.text); }}>
                    {q.label}
                  </button>
                ))}
              </div>

              {/* INPUT ROW */}
              <div className="nn-input-row">
                <button className={`nn-voice-btn ${listening ? "active" : ""}`} onClick={() => { unlockAudio(); toggleVoice(); }} title={listening ? "Stop" : "Voice input"}>
                  {listening ? "⏹" : speaking ? "🔊" : "🎙️"}
                </button>
                <textarea
                  ref={textareaRef}
                  className="nn-textarea"
                  placeholder="Ask Nnwanne anything about Abia…"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button className="nn-send-btn" onClick={() => { unlockAudio(); sendMessage(); }} disabled={!input.trim() || loading}>➤</button>
              </div>
            </>
          )}

          {/* ── FAVOURITES TAB ── */}
          {tab === "favs" && (
            <div className="nn-favs-panel">
              {favs.length > 0 && (
                <button className="nn-sos-all-btn" onClick={sosAll}>
                  🚨 SOS — ALERT ALL {favs.length} SAVED CONTACT{favs.length > 1 ? "S" : ""}
                </button>
              )}

              {favs.length === 0 && !addFavForm && (
                <div className="nn-empty-favs">
                  <div style={{ fontSize: "2rem", marginBottom: 10 }}>⭐</div>
                  No saved contacts yet.<br />
                  Add your family, doctor, or trusted contacts below so Nnwanne can alert them in an emergency.
                </div>
              )}

              {favs.map(f => (
                <div key={f.id} className="nn-fav-card">
                  <div className="nn-fav-ico">{f.icon}</div>
                  <div>
                    <div className="nn-fav-name">{f.name}</div>
                    <div className="nn-fav-phone">{f.phone}</div>
                    <div className="nn-fav-relation">{f.relation}</div>
                  </div>
                  <div className="nn-fav-actions">
                    <button className="nn-fav-btn call" onClick={() => window.open(`tel:${f.phone}`)}>📞 Call</button>
                    <button className="nn-fav-btn call" style={{ background: "rgba(0,100,255,.15)", borderColor: "rgba(100,149,237,.3)", color: "#c5d8ff" }}
                      onClick={() => window.open(`sms:${f.phone}?body=${encodeURIComponent("🚨 Emergency! I need help. Please call me immediately.")}`)}>
                      💬 SMS
                    </button>
                    <button className="nn-fav-btn del" onClick={() => deleteFav(f.id)}>🗑</button>
                  </div>
                </div>
              ))}

              {!addFavForm ? (
                <button className="nn-add-submit" style={{ marginTop: 8 }} onClick={() => setAddFavForm(true)}>
                  + ADD EMERGENCY CONTACT
                </button>
              ) : (
                <div className="nn-add-fav-form">
                  <div className="nn-add-title">Add Emergency Contact</div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 7 }}>
                    {Object.entries(RELATION_ICONS).map(([rel, ico]) => (
                      <button key={rel} onClick={() => setNewFav(f => ({ ...f, relation: rel, icon: ico }))}
                        style={{
                          flex: 1, padding: "5px 2px", fontSize: ".65rem", fontFamily: "Syne", fontWeight: 600,
                          background: newFav.relation === rel ? "rgba(0,200,83,.2)" : "rgba(255,255,255,.04)",
                          border: `1px solid ${newFav.relation === rel ? "rgba(0,200,83,.5)" : "rgba(255,255,255,.1)"}`,
                          borderRadius: 6, color: newFav.relation === rel ? "#00e676" : "rgba(255,255,255,.4)", cursor: "pointer"
                        }}>
                        {ico}
                      </button>
                    ))}
                  </div>
                  <input className="nn-add-input" placeholder="Name (e.g. Mama, Dr. Okafor)" value={newFav.name} onChange={e => setNewFav(f => ({ ...f, name: e.target.value }))} />
                  <input className="nn-add-input" placeholder="Phone number (e.g. 08012345678)" type="tel" value={newFav.phone} onChange={e => setNewFav(f => ({ ...f, phone: e.target.value }))} />
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="nn-add-submit" onClick={addFav}>✓ SAVE CONTACT</button>
                    <button className="nn-add-submit" style={{ background: "rgba(255,255,255,.07)", color: "rgba(255,255,255,.5)" }} onClick={() => setAddFavForm(false)}>Cancel</button>
                  </div>
                </div>
              )}

              {/* QUICK DIAL SECTION */}
              <div style={{ marginTop: 16, borderTop: "1px solid rgba(0,200,83,.1)", paddingTop: 12 }}>
                <div style={{ fontSize: ".6rem", fontFamily: "Syne", fontWeight: 700, color: "rgba(0,200,83,.5)", letterSpacing: ".1em", marginBottom: 8 }}>ABIA STATE EMERGENCY HOTLINES</div>
                {[
                  { label: "General Emergency", num: "112", ico: "🚨" },
                  { label: "Police", num: "199", ico: "🚔" },
                  { label: "FRSC Road Safety", num: "122", ico: "🛣️" },
                  { label: "NAPTIP (Anti-Trafficking)", num: "08039000001", ico: "🚫" },
                  { label: "Legal Aid Council", num: "07030000000", ico: "⚖️" },
                  { label: "NHRC Abia", num: "08035403780", ico: "🏛️" },
                ].map((h, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: ".9rem" }}>{h.ico}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: ".63rem", color: "rgba(255,255,255,.4)", fontFamily: "Syne" }}>{h.label}</div>
                      <div style={{ fontFamily: "JetBrains Mono", fontSize: ".72rem", color: "rgba(0,200,83,.8)" }}>{h.num}</div>
                    </div>
                    <button className="nn-fav-btn call" onClick={() => window.open(`tel:${h.num}`)}>📞</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}