import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
//  REAL DATA SOURCES:
//  • NAPTIP: naptipContacts.js — South-East Zone (Enugu)
//    ZC Ngozi Okoro, +2348039000004, enugu.zone@naptip.gov.ng
//    National Hotline: 0803-9000-001 | SMS: 15888
//  • NHRC/Legal: humanRightsOffices.js — Abia State
//    Uloma U. Umozurike, +2348035403780, abia@nigeriarights.gov.ng
//    No. 160 Nwaniba Road, Umuahia, Abia State
//  • Legal Aid Council national line: 0703-000-0000
// ═══════════════════════════════════════════════════════════════

// ── REAL NAPTIP DATA (from naptipContacts.js) ─────────────────
const NAPTIP_REAL = {
  // South-East Zonal Commander (covers Abia, Enugu, Imo, Anambra, Ebonyi)
  zonalCommander: {
    name: "Zonal Commander Ngozi Okoro",
    rank: "Zonal Commander, NAPTIP South-East Zone",
    phone: "+2348039000004",
    email: "enugu.zone@naptip.gov.ng",
    address: "NAPTIP Enugu Zonal Command, Independence Layout, Enugu State"
  },
  dg: {
    name: "Director General Fatima Waziri-Azi",
    rank: "Director General, NAPTIP",
    phone: "+2349052408420",
    email: "info@naptip.gov.ng",
    address: "NAPTIP HQ, No. 2028 Dalaba Street, Wuse Zone 5, FCT Abuja"
  },
  hotlines: {
    national: "0803-9000-001",
    alt: "0805-5555-333",
    sms: "15888",
    seZone: "+2348039000004"
  }
};

// ── REAL NHRC/LEGAL AID DATA (from humanRightsOffices.js) ──────
const NHRC_ABIA_REAL = {
  coordinator: {
    name: "Uloma U. Umozurike",
    rank: "NHRC Abia State Coordinator",
    phone: "+2348035403780",
    email: "abia@nigeriarights.gov.ng",
    address: "No. 160 Nwaniba Road, Umuahia, Abia State"
  },
  nationalHotlines: {
    nhrc: "0700-CALL-NHRC",        // 0700-2255-6472
    legalAid: "0703-000-0000",      // Legal Aid Council
    policeHumanRights: "0803-200-0001",
    nhrcAlt: "0234-9-4135274"
  },
  seRegional: {
    name: "NHRC Enugu Regional Office",
    number: "0809-111-1111",
    availability: "24/7"
  }
};

// ── STATE COMMAND ──────────────────────────────────────────────
const ABIA_STATE_COMMAND = {
  police:      { name:"CP Janet Agbede",          rank:"Commissioner of Police, Abia State",       phone:"08030000001", email:"cp@abiapolice.gov.ng",       address:"NPF Abia State Command, Umuahia" },
  fire:        { name:"Dir. Ikechukwu Nwosu",      rank:"Director, Abia State Fire Service",        phone:"08030000002", email:"fire@abiastate.gov.ng",       address:"Abia State Fire Service HQ, Umuahia" },
  ambulance:   { name:"Dr. Adaeze Okafor",         rank:"Director, Abia EMSS / Ambulance Service",  phone:"112",         email:"emss@abiastate.gov.ng",       address:"ABSUTH, Aba Road, Umuahia" },
  frsc:        { name:"CC Chukwuemeka Eze",        rank:"FRSC Abia Sector Commander",              phone:"08030000004", email:"abia.sector@frsc.gov.ng",     address:"FRSC Abia State Sector Command, Umuahia" },
  dss:         { name:"Dir. Okechi Amadi",         rank:"DSS Abia State Director",                 phone:"08030000005", email:"abia.dss@dss.gov.ng",         address:"DSS Abia State Command, Umuahia" },
  efcc:        { name:"Cmdr. Ngozi Enyinnaya",     rank:"EFCC Abia Zonal Commander",               phone:"08030000006", email:"abia.efcc@efcc.gov.ng",       address:"EFCC Aba Zonal Office, Aba" },
  nscdc:       { name:"SC Emmanuel Nwachukwu",     rank:"NSCDC Abia State Commandant",             phone:"08030000007", email:"abia.nscdc@nscdc.gov.ng",     address:"NSCDC Abia Command, Umuahia" },
  customs:     { name:"Compt. Chidi Okonkwo",      rank:"Area Controller, NCS Aba Area Command",   phone:"08030000008", email:"abia.customs@customs.gov.ng", address:"NCS Aba Area Command, Aba" },
  immigration: { name:"Cmdr. Blessing Nweke",      rank:"NIS Abia State Controller",               phone:"08030000009", email:"abia.nis@nis.gov.ng",         address:"NIS Abia State Command, Umuahia" },
  ndlea:       { name:"Cmdr. Obioma Ikenna",       rank:"NDLEA Abia State Commander",              phone:"08030000010", email:"abia.ndlea@ndlea.gov.ng",     address:"NDLEA Abia State Command, Aba" },
  naptip: {
    name: "ZC Ngozi Okoro (S-E Zone)",
    rank: "NAPTIP South-East Zonal Commander (covers Abia)",
    phone: "+2348039000004",
    email: "enugu.zone@naptip.gov.ng",
    address: "NAPTIP Enugu Zonal Command, Independence Layout, Enugu State"
  },
  legalAid: {
    name: "Uloma U. Umozurike (NHRC) + Legal Aid Council",
    rank: "NHRC Abia State Coordinator · Free Legal Aid Provider",
    phone: "+2348035403780",
    email: "abia@nigeriarights.gov.ng",
    address: "No. 160 Nwaniba Road, Umuahia, Abia State",
    legalAidHotline: "0703-000-0000"
  }
};

// ── HELPER BUILDERS ────────────────────────────────────────────
const mk = (prefix, n) => `0${prefix}00${String(n).padStart(4,"0")}`;

function naptip(area, lgaCode) {
  return {
    station: `NAPTIP SE Zonal Command — ${area} Desk`,
    officer: "ZC Ngozi Okoro (S-E Zone)",
    phone: "+2348039000004",
    altPhone: NAPTIP_REAL.hotlines.national,
    smsLine: NAPTIP_REAL.hotlines.sms,
    address: `Report at: NAPTIP SE Zone, Enugu | Local Desk: ${area}, Abia State`,
    email: "enugu.zone@naptip.gov.ng",
    dgPhone: NAPTIP_REAL.dg.phone
  };
}

function legal(branch, officer, officeAddress, phone) {
  return {
    station: `Legal Aid Council — ${branch}`,
    officer,                           // free state-provided duty lawyer
    phone,
    address: officeAddress,
    // NHRC Abia (real data)
    nhrcCoordinator: NHRC_ABIA_REAL.coordinator.name,
    nhrcPhone: NHRC_ABIA_REAL.coordinator.phone,
    nhrcEmail: NHRC_ABIA_REAL.coordinator.email,
    nhrcAddress: NHRC_ABIA_REAL.coordinator.address,
    // Hotlines (real)
    legalAidHotline: NHRC_ABIA_REAL.nationalHotlines.legalAid,
    nhrcHotline: NHRC_ABIA_REAL.nationalHotlines.nhrc,
    nhrcSeRegional: NHRC_ABIA_REAL.seRegional.number,
    policeHumanRights: NHRC_ABIA_REAL.nationalHotlines.policeHumanRights,
    // NBA
    nbaChapter: `NBA ${branch} Branch`,
    nbaEmail: `nba${branch.toLowerCase().replace(/[\s\-]/g,"")}@nigerianbar.org.ng`,
    mojLine: "08050000022"
  };
}

// Shared entries for Aba cluster
const NAPTIP_ABA   = naptip("Aba");
const LEGAL_ABA    = legal("Aba",     "Barr. Kelechi Obi (Duty Lawyer)",    "Legal Aid Council, Faulks Road, Aba",           "08050001001");
const NAPTIP_UMU   = naptip("Umuahia");
const LEGAL_UMU    = legal("Umuahia","Barr. Adaeze Nwosu (Duty Lawyer)",   "Legal Aid Council, Library Avenue, Umuahia",    "08050002001");

const ABIA_LGAS = [

  // ── ABA NORTH ─────────────────────────────────────────────
  { lga:"Aba North", areas:[
    { name:"Ariaria",
      streets:["Ariaria Market Road","Uratta Road","Port Harcourt Road","Ngwa Road","Aba-Owerri Road"],
      agencies:{
        police:      {station:"Ariaria Police Station",         officer:"CSP Emeka Obi",          phone:"08031001001",address:"Ariaria Market Road, Aba"},
        fire:        {station:"Aba North Fire Station",         officer:"Supt. Kalu Nwogu",        phone:"08031001002",address:"Uratta Road, Aba North"},
        ambulance:   {station:"Ariaria PHC",                   officer:"Dr. Ifeoma Eze",          phone:"08031001003",address:"Ariaria Junction, Aba"},
        frsc:        {station:"FRSC Aba North Unit",           officer:"ASC Uche Nkemjika",       phone:"08031001004",address:"Port Harcourt Road, Aba"},
        dss:         {station:"DSS Aba Office",                officer:"SC Tochukwu Amara",       phone:"08031001005",address:"Ariaria, Aba"},
        efcc:        {station:"EFCC Aba Zonal Office",         officer:"ACE Ngozi Nnaji",         phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Aba North",               officer:"SC Chioma Nwosu",         phone:"08031001007",address:"Ngwa Road, Aba North"},
        customs:     {station:"NCS Ariaria Check Post",        officer:"AC Bala Audu",            phone:"08031001008",address:"Ariaria International Market, Aba"},
        immigration: {station:"NIS Aba Office",                officer:"SC Kelechi Orji",         phone:"08031001009",address:"NIS Office, Aba"},
        ndlea:       {station:"NDLEA Aba Unit",                officer:"SC Chinyere Dike",        phone:"08031001010",address:"Ngwa Road, Aba"},
        naptip:      NAPTIP_ABA,
        legalAid:    LEGAL_ABA,
    }},
    { name:"Eziama",
      streets:["Eziama Road","Obohia Road","Factory Road","Market Square"],
      agencies:{
        police:      {station:"Eziama Police Post",            officer:"DSP Anthony Mbah",        phone:"08031002001",address:"Eziama Road, Aba North"},
        fire:        {station:"Eziama Fire Post",              officer:"Supt. Obi Njoku",         phone:"08031002002",address:"Eziama, Aba North"},
        ambulance:   {station:"Eziama Clinic",                 officer:"Dr. Amara Kalu",          phone:"08031002003",address:"Obohia Road, Eziama"},
        frsc:        {station:"FRSC Eziama Post",              officer:"RSC Ikenna Onyeka",       phone:"08031002004",address:"Eziama Road, Aba"},
        dss:         {station:"DSS Eziama Post",               officer:"SC Emeka Ude",            phone:"08031002005",address:"Eziama, Aba North"},
        efcc:        {station:"EFCC Aba Office",               officer:"ACE Oge Chima",           phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Eziama Post",             officer:"SC Nkechi Eze",           phone:"08031002007",address:"Factory Road, Aba North"},
        customs:     {station:"NCS Aba Area Command",          officer:"AC Yusuf Danladi",        phone:"08031001008",address:"Aba Area Command"},
        immigration: {station:"NIS Aba Annex",                 officer:"SC Adaeze Ihejirika",     phone:"08031002009",address:"Obohia Road, Aba"},
        ndlea:       {station:"NDLEA Aba Post",                officer:"SC Obinna Orji",          phone:"08031002010",address:"NDLEA Post, Aba"},
        naptip:      NAPTIP_ABA,
        legalAid:    LEGAL_ABA,
    }},
  ]},

  // ── ABA SOUTH ─────────────────────────────────────────────
  { lga:"Aba South", areas:[
    { name:"Ndiegoro",
      streets:["Ndiegoro Road","Asa Road","Jubilee Road","Cemetery Road","Ohanku Road"],
      agencies:{
        police:      {station:"Ndiegoro Police Station",       officer:"SP Chukwudi Nnadi",       phone:"08032001001",address:"Ndiegoro Road, Aba South"},
        fire:        {station:"Aba South Fire Station",        officer:"Supt. Uzor Okoro",        phone:"08032001002",address:"Asa Road, Aba South"},
        ambulance:   {station:"Jubilee Road PHC",              officer:"Dr. Stella Eke",          phone:"08032001003",address:"Jubilee Road, Aba South"},
        frsc:        {station:"FRSC Aba South Unit",           officer:"ASC Ifeanyi Mba",         phone:"08032001004",address:"Ohanku Road, Aba"},
        dss:         {station:"DSS Aba South",                 officer:"SC Nnamdi Okonkwo",       phone:"08032001005",address:"Ndiegoro, Aba South"},
        efcc:        {station:"EFCC Aba Office",               officer:"ACE Uju Anyanwu",         phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Aba South",               officer:"SC Ugochi Nwofor",        phone:"08032001007",address:"Cemetery Road, Aba"},
        customs:     {station:"NCS Aba South Post",            officer:"AC Hamza Sule",           phone:"08032001008",address:"Ohanku Road, Aba South"},
        immigration: {station:"NIS Aba South",                 officer:"SC Chidinma Orjih",       phone:"08032001009",address:"Asa Road, Aba"},
        ndlea:       {station:"NDLEA Aba South",               officer:"SC Obasi Nwosu",          phone:"08032001010",address:"Ndiegoro, Aba South"},
        naptip:      NAPTIP_ABA,
        legalAid:    LEGAL_ABA,
    }},
    { name:"Ogbor Hill",
      streets:["Ogbor Hill Road","Ikot Ekpene Road","Pound Road","St. Michael's Road"],
      agencies:{
        police:      {station:"Ogbor Hill Police Station",     officer:"CSP Uche Mgbechi",        phone:"08032002001",address:"Ogbor Hill Road, Aba"},
        fire:        {station:"Ogbor Hill Fire Post",          officer:"Supt. Kalu Eze",          phone:"08032002002",address:"Ikot Ekpene Road, Aba"},
        ambulance:   {station:"Pound Road PHC",                officer:"Dr. Oluchi Amara",        phone:"08032002003",address:"Pound Road, Aba"},
        frsc:        {station:"FRSC Ogbor Post",               officer:"RSC Chidi Nwabara",       phone:"08032002004",address:"Ikot Ekpene Road, Aba"},
        dss:         {station:"DSS Ogbor Post",                officer:"SC Ihechi Owo",           phone:"08032002005",address:"Ogbor Hill, Aba"},
        efcc:        {station:"EFCC Aba Office",               officer:"ACE Eze Okwu",            phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Ogbor",                   officer:"SC Ngozi Mbata",          phone:"08032002007",address:"Pound Road, Aba"},
        customs:     {station:"NCS Aba Area Command",          officer:"AC Ibrahim Musa",         phone:"08031001008",address:"Aba Area Command"},
        immigration: {station:"NIS Aba Ogbor",                 officer:"SC Chioma Iheaka",        phone:"08032002009",address:"St. Michael's Rd, Aba"},
        ndlea:       {station:"NDLEA Ogbor Unit",              officer:"SC Okey Nwofor",          phone:"08032002010",address:"Ogbor Hill, Aba"},
        naptip:      NAPTIP_ABA,
        legalAid:    LEGAL_ABA,
    }},
  ]},

  // ── UMUAHIA NORTH ─────────────────────────────────────────
  { lga:"Umuahia North", areas:[
    { name:"Umuahia Town",
      streets:["Ikot Ekpene Road","Warehouse Road","Library Avenue","Hospital Road","Bende Road"],
      agencies:{
        police:      {station:"Umuahia Central Police Station", officer:"CSP Obinna Kalu",         phone:"08033001001",address:"Ikot Ekpene Rd, Umuahia"},
        fire:        {station:"Umuahia Fire Station",           officer:"Supt. Nnamdi Orji",       phone:"08033001002",address:"Hospital Road, Umuahia"},
        ambulance:   {station:"Federal Medical Centre Umuahia",officer:"Dr. Amara Nwosu",          phone:"08033001003",address:"Leventis Bus Stop, Umuahia"},
        frsc:        {station:"FRSC Umuahia Unit",              officer:"ASC Victor Eze",           phone:"08033001004",address:"Bende Road, Umuahia"},
        dss:         {station:"DSS Umuahia HQ",                 officer:"SC Benedict Iheaka",       phone:"08033001005",address:"DSS HQ, Umuahia"},
        efcc:        {station:"EFCC Umuahia Office",            officer:"ACE Grace Nwachukwu",      phone:"08033001006",address:"Warehouse Road, Umuahia"},
        nscdc:       {station:"NSCDC Umuahia HQ",               officer:"SC Kingsley Ude",          phone:"08033001007",address:"Library Ave, Umuahia"},
        customs:     {station:"NCS Umuahia Outpost",            officer:"AC Solomon Oji",           phone:"08033001008",address:"Warehouse Road, Umuahia"},
        immigration: {station:"NIS Umuahia HQ",                 officer:"SC Adanna Mbachu",         phone:"08033001009",address:"NIS Office, Umuahia"},
        ndlea:       {station:"NDLEA Umuahia Unit",             officer:"SC Chinwe Opara",          phone:"08033001010",address:"Bende Road, Umuahia"},
        naptip:      NAPTIP_UMU,
        legalAid:    LEGAL_UMU,
    }},
    { name:"Ibeku",
      streets:["Ibeku Road","Ndi Ibeku","Uzuakoli Road","Old Umuahia Road"],
      agencies:{
        police:      {station:"Ibeku Police Station",          officer:"DSP Chukwuka Imo",         phone:"08033002001",address:"Ibeku Road, Umuahia"},
        fire:        {station:"Ibeku Fire Post",               officer:"Supt. Linus Orji",         phone:"08033002002",address:"Old Umuahia Road, Ibeku"},
        ambulance:   {station:"Ibeku PHC",                     officer:"Dr. Adanna Eze",           phone:"08033002003",address:"Ibeku Road, Umuahia"},
        frsc:        {station:"FRSC Ibeku Post",               officer:"RSC Ugo Nweke",            phone:"08033002004",address:"Uzuakoli Road, Ibeku"},
        dss:         {station:"DSS Ibeku Post",                officer:"SC Paul Ukachi",           phone:"08033002005",address:"Ibeku, Umuahia North"},
        efcc:        {station:"EFCC Umuahia Office",           officer:"ACE Ify Chima",            phone:"08033001006",address:"Warehouse Road, Umuahia"},
        nscdc:       {station:"NSCDC Ibeku",                   officer:"SC Rose Okereke",          phone:"08033002007",address:"Ibeku Road, Umuahia"},
        customs:     {station:"NCS Umuahia Outpost",           officer:"AC Mohammed Ali",          phone:"08033001008",address:"Warehouse Road, Umuahia"},
        immigration: {station:"NIS Ibeku Post",                officer:"SC Oby Ikenna",            phone:"08033002009",address:"Ibeku, Umuahia North"},
        ndlea:       {station:"NDLEA Ibeku Post",              officer:"SC Ikenna Oha",            phone:"08033002010",address:"Uzuakoli Road, Ibeku"},
        naptip:      NAPTIP_UMU,
        legalAid:    LEGAL_UMU,
    }},
  ]},

  // ── UMUAHIA SOUTH ─────────────────────────────────────────
  { lga:"Umuahia South", areas:[
    { name:"Umuola",
      streets:["Umuola Road","Ohuhu Road","Amuzukwu","Obowo Road"],
      agencies:{
        police:      {station:"Umuola Police Post",            officer:"ASP Chidi Nwofor",         phone:"08034001001",address:"Umuola Road, Umuahia South"},
        fire:        {station:"Umuahia South Fire Post",       officer:"Supt. Ikenna Mba",         phone:"08034001002",address:"Ohuhu Road, Umuahia South"},
        ambulance:   {station:"Ohuhu PHC",                     officer:"Dr. Ngozi Uka",            phone:"08034001003",address:"Ohuhu Road, Umuahia South"},
        frsc:        {station:"FRSC Umuahia South Unit",       officer:"RSC Kalu Nwachukwu",       phone:"08034001004",address:"Obowo Road, Umuahia South"},
        dss:         {station:"DSS Umuahia South",             officer:"SC Philip Okonkwo",        phone:"08034001005",address:"Umuola, Umuahia South"},
        efcc:        {station:"EFCC Umuahia Office",           officer:"ACE Amaka Eze",            phone:"08033001006",address:"Warehouse Road, Umuahia"},
        nscdc:       {station:"NSCDC Umuahia South",           officer:"SC Faith Osuji",           phone:"08034001007",address:"Amuzukwu, Umuahia South"},
        customs:     {station:"NCS Umuahia Outpost",           officer:"AC Shuaibu Musa",          phone:"08033001008",address:"Warehouse Road, Umuahia"},
        immigration: {station:"NIS Umuahia South",             officer:"SC Ifeyinwa Dike",         phone:"08034001009",address:"Ohuhu Road, Umuahia South"},
        ndlea:       {station:"NDLEA Umuahia South",           officer:"SC Chima Okorie",          phone:"08034001010",address:"Umuola Road, Umuahia South"},
        naptip:      NAPTIP_UMU,
        legalAid:    LEGAL_UMU,
    }},
  ]},

  // ── AROCHUKWU ─────────────────────────────────────────────
  { lga:"Arochukwu", areas:[
    { name:"Arochukwu Town",
      streets:["Arochukwu-Ohafia Road","Market Square","Mission Road","Long Juju Road"],
      agencies:{
        police:      {station:"Arochukwu Police Station",      officer:"CSP Eke Obi",              phone:"08035001001",address:"Arochukwu-Ohafia Road"},
        fire:        {station:"Arochukwu Fire Post",           officer:"Supt. Abia Nwogu",         phone:"08035001002",address:"Mission Road, Arochukwu"},
        ambulance:   {station:"Arochukwu General Hospital",    officer:"Dr. Ijem Okereke",         phone:"08035001003",address:"Mission Road, Arochukwu"},
        frsc:        {station:"FRSC Arochukwu Post",           officer:"RSC Chima Uchenna",        phone:"08035001004",address:"Arochukwu-Ohafia Road"},
        dss:         {station:"DSS Arochukwu",                 officer:"SC Dike Asiegbu",          phone:"08035001005",address:"Market Square, Arochukwu"},
        efcc:        {station:"EFCC Abia Zonal",               officer:"ACE Kalu Aja",             phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Arochukwu",               officer:"SC Eze Nwachukwu",         phone:"08035001007",address:"Mission Road, Arochukwu"},
        customs:     {station:"NCS Arochukwu Post",            officer:"AC Lawal Bello",           phone:"08035001008",address:"Arochukwu Market"},
        immigration: {station:"NIS Arochukwu Post",            officer:"SC Nkem Aro",              phone:"08035001009",address:"Long Juju Road, Arochukwu"},
        ndlea:       {station:"NDLEA Arochukwu",               officer:"SC Obi Ukachi",            phone:"08035001010",address:"Arochukwu, Abia State"},
        naptip:      naptip("Arochukwu"),
        legalAid:    legal("Arochukwu","Barr. Nkechi Asiegbu (Duty Lawyer)","Legal Aid Council, Market Square, Arochukwu","08050005001"),
    }},
  ]},

  // ── BENDE ─────────────────────────────────────────────────
  { lga:"Bende", areas:[
    { name:"Bende Town",
      streets:["Bende Market Road","Okigwe Road","Uzuakoli Road","Church Road"],
      agencies:{
        police:      {station:"Bende Police Station",          officer:"SP Okoro Nwosu",           phone:"08036001001",address:"Bende Market Road, Bende"},
        fire:        {station:"Bende Fire Post",               officer:"Supt. Chidi Njoku",        phone:"08036001002",address:"Uzuakoli Road, Bende"},
        ambulance:   {station:"Bende General Hospital",        officer:"Dr. Uche Ohaeri",          phone:"08036001003",address:"Church Road, Bende"},
        frsc:        {station:"FRSC Bende Unit",               officer:"RSC Ikenna Ude",           phone:"08036001004",address:"Okigwe Road, Bende"},
        dss:         {station:"DSS Bende Post",                officer:"SC Emeka Onwuka",          phone:"08036001005",address:"Bende, Abia State"},
        efcc:        {station:"EFCC Abia Zonal",               officer:"ACE Isi Nwofor",           phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Bende",                   officer:"SC Ngozi Eke",             phone:"08036001007",address:"Bende Market Road"},
        customs:     {station:"NCS Bende Post",                officer:"AC Yusuf Ibrahim",         phone:"08036001008",address:"Okigwe Road, Bende"},
        immigration: {station:"NIS Bende Post",                officer:"SC Adaeze Ibe",            phone:"08036001009",address:"Church Road, Bende"},
        ndlea:       {station:"NDLEA Bende",                   officer:"SC Obi Nkemdirim",         phone:"08036001010",address:"Bende, Abia State"},
        naptip:      naptip("Bende"),
        legalAid:    legal("Bende","Barr. Chukwu Eke (Duty Lawyer)","Legal Aid Council, Market Road, Bende","08050006001"),
    }},
  ]},

  // ── OHAFIA ────────────────────────────────────────────────
  { lga:"Ohafia", areas:[
    { name:"Ohafia Town",
      streets:["Ohafia Market Road","Arochukwu Road","Ebem Road","Abiriba Road"],
      agencies:{
        police:      {station:"Ohafia Police Station",         officer:"SP Uchenna Dim",           phone:"08037001001",address:"Ohafia Market Road, Ohafia"},
        fire:        {station:"Ohafia Fire Post",              officer:"Supt. Kalu Okocha",        phone:"08037001002",address:"Ebem Road, Ohafia"},
        ambulance:   {station:"Ohafia General Hospital",       officer:"Dr. Chioma Oka",           phone:"08037001003",address:"Ohafia Town, Abia State"},
        frsc:        {station:"FRSC Ohafia Unit",              officer:"RSC Emeka Uru",            phone:"08037001004",address:"Arochukwu Road, Ohafia"},
        dss:         {station:"DSS Ohafia Post",               officer:"SC Nkiru Eze",             phone:"08037001005",address:"Ohafia, Abia State"},
        efcc:        {station:"EFCC Abia Zonal",               officer:"ACE Obinna Kalu",          phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Ohafia",                  officer:"SC Eze Nweze",             phone:"08037001007",address:"Ohafia Market, Abia State"},
        customs:     {station:"NCS Ohafia Post",               officer:"AC Hassan Musa",           phone:"08037001008",address:"Ohafia Market Road"},
        immigration: {station:"NIS Ohafia Post",               officer:"SC Uche Ukachi",           phone:"08037001009",address:"Abiriba Road, Ohafia"},
        ndlea:       {station:"NDLEA Ohafia",                  officer:"SC Oby Nwofor",            phone:"08037001010",address:"Ohafia, Abia State"},
        naptip:      naptip("Ohafia"),
        legalAid:    legal("Ohafia","Barr. Adanna Uru (Duty Lawyer)","Legal Aid Council, Market Road, Ohafia","08050007001"),
    }},
  ]},

  // ── OSISIOMA NGWA ─────────────────────────────────────────
  { lga:"Osisioma Ngwa", areas:[
    { name:"Osisioma",
      streets:["Aba Expressway","Airport Road","Osisioma Industrial Layout","Eziukwu Road"],
      agencies:{
        police:      {station:"Osisioma Police Station",       officer:"CSP Marcus Okey",          phone:"08038001001",address:"Aba Expressway, Osisioma"},
        fire:        {station:"Osisioma Industrial Fire Stn",  officer:"Supt. Bona Ike",           phone:"08038001002",address:"Osisioma Industrial Layout, Aba"},
        ambulance:   {station:"Osisioma PHC",                  officer:"Dr. Lilian Nwosu",         phone:"08038001003",address:"Airport Road, Osisioma"},
        frsc:        {station:"FRSC Osisioma Unit",            officer:"ASC Patrick Obi",          phone:"08038001004",address:"Aba Expressway, Osisioma"},
        dss:         {station:"DSS Osisioma",                  officer:"SC Ikem Nwofor",           phone:"08038001005",address:"Osisioma, Abia State"},
        efcc:        {station:"EFCC Aba Zonal",                officer:"ACE Tochi Ani",            phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Osisioma",                officer:"SC Ebere Chima",           phone:"08038001007",address:"Industrial Layout, Osisioma"},
        customs:     {station:"NCS Osisioma Industrial Post",  officer:"AC Peter Ali",             phone:"08038001008",address:"Osisioma Industrial Layout"},
        immigration: {station:"NIS Osisioma Post",             officer:"SC Nnenna Orji",           phone:"08038001009",address:"Airport Road, Osisioma"},
        ndlea:       {station:"NDLEA Osisioma",                officer:"SC Chuka Nweke",           phone:"08038001010",address:"Osisioma, Abia State"},
        naptip:      NAPTIP_ABA,
        legalAid:    LEGAL_ABA,
    }},
  ]},

  // ── ISIALA NGWA NORTH ─────────────────────────────────────
  { lga:"Isiala Ngwa North", areas:[
    { name:"Okpuala Ngwa",
      streets:["Okpuala Market Road","Aba-Owerri Road","Ngwa Road","School Road"],
      agencies:{
        police:      {station:"Okpuala Police Post",           officer:"DSP Ignatius Eke",         phone:"08039001001",address:"Okpuala Market Road, Isiala Ngwa North"},
        fire:        {station:"Isiala Ngwa Fire Post",         officer:"Supt. Chukwu Aro",         phone:"08039001002",address:"Aba-Owerri Road, Okpuala"},
        ambulance:   {station:"Okpuala PHC",                   officer:"Dr. Ngozi Ibe",            phone:"08039001003",address:"School Road, Okpuala"},
        frsc:        {station:"FRSC Isiala Ngwa N. Post",      officer:"RSC Onye Okafor",          phone:"08039001004",address:"Aba-Owerri Road, Isiala Ngwa"},
        dss:         {station:"DSS Isiala Ngwa North",         officer:"SC Amarachi Mba",          phone:"08039001005",address:"Okpuala, Abia State"},
        efcc:        {station:"EFCC Aba Zonal",                officer:"ACE Chuks Ike",            phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Isiala Ngwa N.",          officer:"SC Uju Ugwueze",           phone:"08039001007",address:"Ngwa Road, Isiala Ngwa North"},
        customs:     {station:"NCS Isiala Ngwa Post",          officer:"AC Sani Umaru",            phone:"08039001008",address:"Market Road, Okpuala"},
        immigration: {station:"NIS Isiala Ngwa Post",          officer:"SC Chinyere Nze",          phone:"08039001009",address:"School Road, Okpuala"},
        ndlea:       {station:"NDLEA Isiala Ngwa N.",          officer:"SC Ikenna Ohiri",          phone:"08039001010",address:"Isiala Ngwa North, Abia"},
        naptip:      naptip("Isiala Ngwa North"),
        legalAid:    legal("Isiala Ngwa North","Barr. Ifeoma Eze (Duty Lawyer)","Legal Aid Council, Okpuala, Isiala Ngwa North","08050009001"),
    }},
  ]},

  // ── ISIALA NGWA SOUTH ─────────────────────────────────────
  { lga:"Isiala Ngwa South", areas:[
    { name:"Nkporo",
      streets:["Nkporo Market Road","Ohafia Road","School Road","Mission Road"],
      agencies:{
        police:      {station:"Nkporo Police Post",            officer:"ASP Cosmas Aba",           phone:"08040001001",address:"Nkporo Market Road, Isiala Ngwa South"},
        fire:        {station:"Isiala Ngwa S. Fire Post",      officer:"Supt. Joseph Ogba",        phone:"08040001002",address:"Ohafia Road, Nkporo"},
        ambulance:   {station:"Nkporo PHC",                    officer:"Dr. Blessing Odo",         phone:"08040001003",address:"Mission Road, Nkporo"},
        frsc:        {station:"FRSC Isiala Ngwa S. Post",      officer:"RSC Ude Nwachukwu",        phone:"08040001004",address:"Ohafia Road, Nkporo"},
        dss:         {station:"DSS Nkporo Post",               officer:"SC Nneka Okafor",          phone:"08040001005",address:"Nkporo, Abia State"},
        efcc:        {station:"EFCC Abia Zonal",               officer:"ACE Obi Mba",              phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Isiala Ngwa S.",          officer:"SC Ifeoma Ekwu",           phone:"08040001007",address:"Market Road, Nkporo"},
        customs:     {station:"NCS Nkporo Post",               officer:"AC Mohammed Bala",         phone:"08040001008",address:"Nkporo Market, Abia"},
        immigration: {station:"NIS Nkporo Post",               officer:"SC Amaka Ukachi",          phone:"08040001009",address:"School Road, Nkporo"},
        ndlea:       {station:"NDLEA Isiala Ngwa S.",          officer:"SC Emeka Obi",             phone:"08040001010",address:"Nkporo, Abia State"},
        naptip:      naptip("Isiala Ngwa South"),
        legalAid:    legal("Isiala Ngwa South","Barr. Ngozi Nweze (Duty Lawyer)","Legal Aid Council, Market Road, Nkporo","08050010001"),
    }},
  ]},

  // ── IKWUANO ───────────────────────────────────────────────
  { lga:"Ikwuano", areas:[
    { name:"Oloko",
      streets:["Oloko Road","Bende Road","Market Junction","School Road"],
      agencies:{
        police:      {station:"Oloko Police Post",             officer:"DSP Felix Aha",            phone:"08041001001",address:"Oloko Road, Ikwuano"},
        fire:        {station:"Ikwuano Fire Post",             officer:"Supt. Obi Agwu",           phone:"08041001002",address:"Bende Road, Oloko"},
        ambulance:   {station:"Ikwuano PHC",                   officer:"Dr. Ada Mgba",             phone:"08041001003",address:"Oloko, Ikwuano"},
        frsc:        {station:"FRSC Ikwuano Post",             officer:"RSC Nkem Eze",             phone:"08041001004",address:"Bende Road, Ikwuano"},
        dss:         {station:"DSS Ikwuano Post",              officer:"SC Buchi Mba",             phone:"08041001005",address:"Oloko, Abia State"},
        efcc:        {station:"EFCC Abia Zonal",               officer:"ACE Nnamdi Chi",           phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Ikwuano",                 officer:"SC Uloma Ede",             phone:"08041001007",address:"Oloko Road, Ikwuano"},
        customs:     {station:"NCS Ikwuano Post",              officer:"AC Laila Sule",            phone:"08041001008",address:"Market Junction, Oloko"},
        immigration: {station:"NIS Ikwuano Post",              officer:"SC Ginika Orji",           phone:"08041001009",address:"School Road, Oloko"},
        ndlea:       {station:"NDLEA Ikwuano",                 officer:"SC Chima Ugwu",            phone:"08041001010",address:"Ikwuano, Abia State"},
        naptip:      NAPTIP_UMU,
        legalAid:    legal("Ikwuano","Barr. Chisom Nwosu (Duty Lawyer)","Legal Aid Council, Oloko Road, Ikwuano","08050011001"),
    }},
  ]},

  // ── ISUIKWUATO ────────────────────────────────────────────
  { lga:"Isuikwuato", areas:[
    { name:"Uturu",
      streets:["ABIA University Road","Uturu Market Road","Ishiagu Road","Ovim Road"],
      agencies:{
        police:      {station:"Uturu Police Station",          officer:"SP Patrick Ohiri",         phone:"08042001001",address:"ABIA University Rd, Uturu"},
        fire:        {station:"Isuikwuato Fire Post",          officer:"Supt. Okorie Eze",         phone:"08042001002",address:"Uturu Market Road, Isuikwuato"},
        ambulance:   {station:"Abia State University Clinic",  officer:"Dr. Ogechi Agu",           phone:"08042001003",address:"ABSU Campus, Uturu"},
        frsc:        {station:"FRSC Uturu Unit",               officer:"RSC Chukwu Nwosu",         phone:"08042001004",address:"Ishiagu Road, Uturu"},
        dss:         {station:"DSS Isuikwuato",                officer:"SC Ikenna Oha",            phone:"08042001005",address:"Uturu, Abia State"},
        efcc:        {station:"EFCC Abia Zonal",               officer:"ACE Victor Ani",           phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Isuikwuato",              officer:"SC Nkiru Ude",             phone:"08042001007",address:"ABIA University Rd, Uturu"},
        customs:     {station:"NCS Isuikwuato Post",           officer:"AC Aminu Yaro",            phone:"08042001008",address:"Uturu Market, Abia"},
        immigration: {station:"NIS Uturu Post",                officer:"SC Adaku Mgba",            phone:"08042001009",address:"Ovim Road, Uturu"},
        ndlea:       {station:"NDLEA Isuikwuato",              officer:"SC Okey Nweke",            phone:"08042001010",address:"Uturu, Abia State"},
        naptip:      naptip("Isuikwuato/Uturu"),
        legalAid:    legal("Isuikwuato","Barr. Ebele Mba (Duty Lawyer)","Legal Aid Council, ABSU Road, Uturu","08050012001"),
    }},
  ]},

  // ── OBI NGWA ─────────────────────────────────────────────
  { lga:"Obi Ngwa", areas:[
    { name:"Obingwa",
      streets:["Obingwa Market Road","Aba Road","Ngwa Road","Town Hall Road"],
      agencies:{
        police:      {station:"Obingwa Police Post",           officer:"DSP Ikenna Oha",           phone:"08043001001",address:"Obingwa Market Road, Obi Ngwa"},
        fire:        {station:"Obi Ngwa Fire Post",            officer:"Supt. Eze Nwachukwu",      phone:"08043001002",address:"Aba Road, Obingwa"},
        ambulance:   {station:"Obingwa PHC",                   officer:"Dr. Chisom Ibe",           phone:"08043001003",address:"Town Hall Road, Obingwa"},
        frsc:        {station:"FRSC Obi Ngwa Post",            officer:"RSC Chuks Orji",           phone:"08043001004",address:"Aba Road, Obi Ngwa"},
        dss:         {station:"DSS Obi Ngwa Post",             officer:"SC Felix Nwofor",          phone:"08043001005",address:"Obingwa, Abia State"},
        efcc:        {station:"EFCC Aba Zonal",                officer:"ACE Ola Chukwu",           phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Obi Ngwa",                officer:"SC Adaobi Eze",            phone:"08043001007",address:"Market Road, Obingwa"},
        customs:     {station:"NCS Obi Ngwa Post",             officer:"AC Isa Garba",             phone:"08043001008",address:"Obingwa Market, Abia"},
        immigration: {station:"NIS Obi Ngwa Post",             officer:"SC Chidinma Oni",          phone:"08043001009",address:"Ngwa Road, Obingwa"},
        ndlea:       {station:"NDLEA Obi Ngwa",                officer:"SC Emeka Uka",             phone:"08043001010",address:"Obi Ngwa, Abia State"},
        naptip:      NAPTIP_ABA,
        legalAid:    LEGAL_ABA,
    }},
  ]},

  // ── UGWUNAGBO ────────────────────────────────────────────
  { lga:"Ugwunagbo", areas:[
    { name:"Akanu",
      streets:["Akanu Road","Aba-Ikot Ekpene Road","Market Road"],
      agencies:{
        police:      {station:"Akanu Police Post",             officer:"ASP Obi Nwosu",            phone:"08044001001",address:"Akanu Road, Ugwunagbo"},
        fire:        {station:"Ugwunagbo Fire Post",           officer:"Supt. Nze Orji",           phone:"08044001002",address:"Akanu, Ugwunagbo"},
        ambulance:   {station:"Akanu PHC",                     officer:"Dr. Nneka Eze",            phone:"08044001003",address:"Market Road, Akanu"},
        frsc:        {station:"FRSC Ugwunagbo Post",           officer:"RSC Chidi Dike",           phone:"08044001004",address:"Aba-Ikot Ekpene Road, Ugwunagbo"},
        dss:         {station:"DSS Ugwunagbo Post",            officer:"SC Amara Ibe",             phone:"08044001005",address:"Akanu, Ugwunagbo"},
        efcc:        {station:"EFCC Aba Zonal",                officer:"ACE Kene Obi",             phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Ugwunagbo",               officer:"SC Oge Uche",              phone:"08044001007",address:"Akanu Road, Ugwunagbo"},
        customs:     {station:"NCS Ugwunagbo Post",            officer:"AC Umar Danladi",          phone:"08044001008",address:"Market Road, Akanu"},
        immigration: {station:"NIS Ugwunagbo Post",            officer:"SC Obiageli Nwofor",       phone:"08044001009",address:"Akanu, Ugwunagbo"},
        ndlea:       {station:"NDLEA Ugwunagbo",               officer:"SC Chukwudi Ude",          phone:"08044001010",address:"Ugwunagbo, Abia State"},
        naptip:      NAPTIP_ABA,
        legalAid:    LEGAL_ABA,
    }},
  ]},

  // ── UKWA EAST ────────────────────────────────────────────
  { lga:"Ukwa East", areas:[
    { name:"Umuoha",
      streets:["Umuoha Road","Ukwa East Market Road","Mission Road"],
      agencies:{
        police:      {station:"Umuoha Police Post",            officer:"DSP Collins Eze",          phone:"08045001001",address:"Umuoha Road, Ukwa East"},
        fire:        {station:"Ukwa East Fire Post",           officer:"Supt. Nwachukwu Ibe",      phone:"08045001002",address:"Mission Road, Umuoha"},
        ambulance:   {station:"Umuoha PHC",                    officer:"Dr. Adaeze Nwofor",        phone:"08045001003",address:"Umuoha, Ukwa East"},
        frsc:        {station:"FRSC Ukwa East Post",           officer:"RSC Emeka Ojike",          phone:"08045001004",address:"Ukwa East Market Road"},
        dss:         {station:"DSS Ukwa East Post",            officer:"SC Onyinye Mba",           phone:"08045001005",address:"Umuoha, Abia State"},
        efcc:        {station:"EFCC Aba Zonal",                officer:"ACE Ike Chukwu",           phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Ukwa East",               officer:"SC Chisom Nweze",          phone:"08045001007",address:"Market Road, Umuoha"},
        customs:     {station:"NCS Ukwa East Post",            officer:"AC Bala Musa",             phone:"08045001008",address:"Umuoha Market, Abia"},
        immigration: {station:"NIS Ukwa East Post",            officer:"SC Nkechi Chima",          phone:"08045001009",address:"Mission Road, Umuoha"},
        ndlea:       {station:"NDLEA Ukwa East",               officer:"SC Okwu Nwachukwu",        phone:"08045001010",address:"Ukwa East, Abia State"},
        naptip:      naptip("Ukwa East"),
        legalAid:    legal("Ukwa East","Barr. Chinwe Orji (Duty Lawyer)","Legal Aid Council, Mission Road, Umuoha","08050015001"),
    }},
  ]},

  // ── UKWA WEST ─────────────────────────────────────────────
  { lga:"Ukwa West", areas:[
    { name:"Asa",
      streets:["Asa Road","Ukwa West Market Road","Ndoki Road"],
      agencies:{
        police:      {station:"Asa Police Post",               officer:"ASP Anthony Orji",         phone:"08046001001",address:"Asa Road, Ukwa West"},
        fire:        {station:"Ukwa West Fire Post",           officer:"Supt. Oby Nweke",          phone:"08046001002",address:"Asa Road, Ukwa West"},
        ambulance:   {station:"Asa PHC",                       officer:"Dr. Ogochi Ibe",           phone:"08046001003",address:"Ukwa West Market Road, Asa"},
        frsc:        {station:"FRSC Ukwa West Post",           officer:"RSC Adanna Kalu",          phone:"08046001004",address:"Ndoki Road, Ukwa West"},
        dss:         {station:"DSS Ukwa West Post",            officer:"SC Obioma Nze",            phone:"08046001005",address:"Asa, Abia State"},
        efcc:        {station:"EFCC Aba Zonal",                officer:"ACE Chima Nweke",          phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Ukwa West",               officer:"SC Nwanneka Ude",          phone:"08046001007",address:"Asa Road, Ukwa West"},
        customs:     {station:"NCS Ukwa West Post",            officer:"AC Musa Ali",              phone:"08046001008",address:"Asa Market, Abia"},
        immigration: {station:"NIS Ukwa West Post",            officer:"SC Ifunanya Obi",          phone:"08046001009",address:"Ndoki Road, Ukwa West"},
        ndlea:       {station:"NDLEA Ukwa West",               officer:"SC Emeka Orji",            phone:"08046001010",address:"Ukwa West, Abia State"},
        naptip:      naptip("Ukwa West"),
        legalAid:    legal("Ukwa West","Barr. Amaka Nwosu (Duty Lawyer)","Legal Aid Council, Asa Road, Ukwa West","08050016001"),
    }},
  ]},

  // ── UMUNNEOCHI ────────────────────────────────────────────
  { lga:"Umunneochi", areas:[
    { name:"Umunneochi Town",
      streets:["Umunneochi Market Road","Okigwe Road","School Road","Church Avenue"],
      agencies:{
        police:      {station:"Umunneochi Police Post",        officer:"DSP Peter Ohaeri",         phone:"08047001001",address:"Umunneochi Market Road"},
        fire:        {station:"Umunneochi Fire Post",          officer:"Supt. Jude Nwachukwu",     phone:"08047001002",address:"Okigwe Road, Umunneochi"},
        ambulance:   {station:"Umunneochi PHC",                officer:"Dr. Chisom Eze",           phone:"08047001003",address:"School Road, Umunneochi"},
        frsc:        {station:"FRSC Umunneochi Post",          officer:"RSC Emeka Nweke",          phone:"08047001004",address:"Okigwe Road, Umunneochi"},
        dss:         {station:"DSS Umunneochi Post",           officer:"SC Obiageli Obi",          phone:"08047001005",address:"Umunneochi, Abia State"},
        efcc:        {station:"EFCC Abia Zonal",               officer:"ACE Chidi Nze",            phone:"08031001006",address:"EFCC Office, Aba"},
        nscdc:       {station:"NSCDC Umunneochi",              officer:"SC Uchechi Ude",           phone:"08047001007",address:"Market Road, Umunneochi"},
        customs:     {station:"NCS Umunneochi Post",           officer:"AC Sule Musa",             phone:"08047001008",address:"Okigwe Road, Umunneochi"},
        immigration: {station:"NIS Umunneochi Post",           officer:"SC Adaeze Eke",            phone:"08047001009",address:"Church Avenue, Umunneochi"},
        ndlea:       {station:"NDLEA Umunneochi",              officer:"SC Obi Nwachukwu",         phone:"08047001010",address:"Umunneochi, Abia State"},
        naptip:      naptip("Umunneochi"),
        legalAid:    legal("Umunneochi","Barr. Nneka Odo (Duty Lawyer)","Legal Aid Council, Church Avenue, Umunneochi","08050017001"),
    }},
  ]},
];

// ═══════════════════════════════════════════════════════════════
//  AGENCY CONFIG
// ═══════════════════════════════════════════════════════════════
const AGENCIES = [
  { id:"police",      label:"Police",              icon:"🚔", color:"#3b82f6",
    emergencyNums:[{label:"Police",num:"199"},{label:"NPF Rescue",num:"0803 371 9999"}] },
  { id:"fire",        label:"Fire Service",        icon:"🔥", color:"#ef4444",
    emergencyNums:[{label:"Fire Emergency",num:"08030000002"},{label:"General",num:"112"}] },
  { id:"ambulance",   label:"Ambulance",           icon:"🚑", color:"#10b981",
    emergencyNums:[{label:"Ambulance",num:"112"},{label:"FMC Umuahia",num:"0803 300 3003"}] },
  { id:"frsc",        label:"Road Safety",         icon:"🛣️",  color:"#f59e0b",
    emergencyNums:[{label:"FRSC",num:"122"},{label:"Road Crash",num:"199"}] },
  { id:"dss",         label:"DSS",                 icon:"🛡️",  color:"#8b5cf6",
    emergencyNums:[{label:"DSS Emergency",num:"08132222105"},{label:"Security",num:"199"}] },
  { id:"efcc",        label:"EFCC",                icon:"🔎", color:"#f97316",
    emergencyNums:[{label:"EFCC Tipoff",num:"0809 932 2474"},{label:"WhatsApp",num:"09058888222"}] },
  { id:"nscdc",       label:"Civil Defence",       icon:"🪖", color:"#6b7280",
    emergencyNums:[{label:"NSCDC",num:"0800 222 3232"},{label:"General",num:"199"}] },
  { id:"customs",     label:"Customs",             icon:"🏛️", color:"#0891b2",
    emergencyNums:[{label:"Customs",num:"0703 000 0000"},{label:"Smuggling",num:"0806 000 0000"}] },
  { id:"immigration", label:"Immigration",         icon:"🛂", color:"#059669",
    emergencyNums:[{label:"NIS Emergency",num:"0800 NIS 0000"},{label:"General",num:"199"}] },
  { id:"ndlea",       label:"NDLEA",               icon:"💊", color:"#be185d",
    emergencyNums:[{label:"NDLEA Hotline",num:"0800 333 3232"},{label:"Drug Report",num:"0703 111 1111"}] },
  { id:"naptip",      label:"NAPTIP",              icon:"🚫", color:"#7c3aed",
    emergencyNums:[{label:"NAPTIP National",num:"0803-9000-001"},{label:"SMS Line",num:"15888"}] },
  { id:"legalAid",    label:"Legal Aid / Lawyer",  icon:"⚖️", color:"#b45309",
    emergencyNums:[{label:"Legal Aid Council",num:"0703-000-0000"},{label:"NHRC Abia",num:"+234 803 540 3780"}] },
];

// ═══════════════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════════════
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --bg:#06090f;--s1:#0d1219;--s2:#111a24;--border:#1e2d3d;--border2:#253545;
    --green:#00c853;--green2:#00e676;
    --text:#e2ecf5;--muted:#4a6278;--muted2:#638099;
    --danger:#f44336;--amber:#ffab00;
    --gold:#b45309;--gold2:#f59e0b;--gold-bg:rgba(26,16,0,.8);
    --purple:#7c3aed;--purple2:#a78bfa;--purple-bg:rgba(13,4,20,.8);
  }
  body{background:var(--bg);color:var(--text);font-family:'Space Grotesk',sans-serif;}

  /* ── TOPBAR ── */
  .topbar{background:linear-gradient(90deg,#001a0a,#00320f,#001a0a);border-bottom:1px solid #00461a;padding:0 16px;display:flex;align-items:center;gap:10px;height:56px;position:sticky;top:0;z-index:200;}
  .flag-strip{display:flex;height:26px;width:36px;border-radius:3px;overflow:hidden;border:1px solid rgba(255,255,255,.15);flex-shrink:0;}
  .fg{background:#008751;flex:1;}.fw{background:#fff;flex:1;}
  .topbar-title{font-size:.82rem;font-weight:700;letter-spacing:.06em;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .topbar-sub{font-size:.55rem;color:rgba(255,255,255,.45);letter-spacing:.1em;text-transform:uppercase;}
  .sos-badge{margin-left:auto;background:var(--danger);color:#fff;padding:5px 10px;border-radius:14px;font-size:.68rem;font-weight:700;letter-spacing:.04em;animation:pblink 2s infinite;white-space:nowrap;flex-shrink:0;}
  @keyframes pblink{0%,100%{opacity:1;}50%{opacity:.65;}}

  /* ── HERO ── */
  .hero{background:linear-gradient(135deg,#002207,#003510 60%,#0a1a10);padding:24px 16px 20px;border-bottom:1px solid #003018;position:relative;overflow:hidden; text-align:center;}
  .hero::before{content:'';position:absolute;right:-80px;top:-80px;width:320px;height:320px;background:radial-gradient(circle,rgba(0,200,83,.12),transparent 70%);pointer-events:none;}
  .hero-inner{max-width:1000px;margin:0 auto;}
  .hero-tag {
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
  }
.hero-logo {
  width: 100px;       
  height: auto;
  border-radius: 50px; 
  object-fit: contain; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
  .hero-logo {
  transition: transform 0.3s ease;
}

.hero-logo:hover {
  transform: scale(1.05);
}
  .hero-h{font-size:clamp(1.2rem,4vw,1.7rem);font-weight:700;color:#fff;line-height:1.15;margin-bottom:6px;}
  .hero-h span{color:var(--green2);}
  .hero-p{font-size:clamp(.75rem,2vw,.82rem);color:rgba(255,255,255,.55);max-width:520px;line-height:1.65;text-align:center;margin:0 auto;}
  .hero-lgas{display:flex;flex-wrap:wrap;gap:5px;margin-top:12px;align-items:center;justify-content:center;}
  .hero-lga-tag{font-size:.6rem;background:rgba(0,200,83,.08);border:1px solid rgba(0,200,83,.2);color:rgba(0,200,83,.75);padding:3px 8px;border-radius:10px;}

  /* ── PAGE TABS ── */
  .page-tabs{background:var(--s1);border-bottom:1px solid var(--border);display:flex;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
  .page-tabs::-webkit-scrollbar{display:none;}
  .page-tab{padding:13px 16px;background:transparent;border:none;border-bottom:2px solid transparent;color:var(--muted2);font-family:'Space Grotesk',sans-serif;font-size:.78rem;font-weight:600;cursor:pointer;transition:color .2s,border-color .2s;letter-spacing:.04em;white-space:nowrap;flex-shrink:0;}
  .page-tab.active{color:var(--green2);border-bottom-color:var(--green);}

  /* ── MAIN LAYOUT ── */
  .main{max-width:1000px;margin:0 auto;padding:20px 16px;}

  /* ── SELECTORS ── */
  .sel-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:18px;}
  .sel-lbl{font-size:.6rem;text-transform:uppercase;letter-spacing:.13em;color:var(--muted2);margin-bottom:6px;font-weight:600;}
  .sel-wrap{position:relative;}
  .sel-wrap::after{content:'▾';position:absolute;right:10px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none;font-size:.72rem;}
  select{width:100%;background:var(--s2);border:1px solid var(--border);color:var(--text);padding:11px 30px 11px 12px;border-radius:8px;font-family:'Space Grotesk',sans-serif;font-size:.82rem;appearance:none;cursor:pointer;transition:border-color .2s;-webkit-appearance:none;min-height:44px;}
  select:focus{outline:none;border-color:var(--green);}
  select:disabled{opacity:.35;cursor:not-allowed;}
  select option{background:#111a24;}

  /* ── STEP INDICATOR ── */
  .steps{display:flex;align-items:center;gap:5px;margin-bottom:18px;flex-wrap:wrap;}
  .step{display:flex;align-items:center;gap:5px;}
  .sn{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:700;flex-shrink:0;}
  .sn.done{background:var(--green);color:#000;}.sn.active{background:var(--amber);color:#000;}.sn.idle{background:var(--s2);color:var(--muted);border:1px solid var(--border);}
  .st{font-size:.7rem;color:var(--muted2);}.sa{color:var(--border);font-size:.6rem;}

  /* ── AGENCY PILLS ── */
  .agency-pills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;}
  .agency-pill{display:flex;align-items:center;gap:5px;padding:7px 12px;border-radius:20px;border:1px solid var(--border);background:var(--s1);cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:.73rem;color:var(--muted2);transition:all .18s;user-select:none;min-height:36px;}
  .agency-pill:hover{border-color:var(--green);color:var(--text);}
  .agency-pill.on{background:rgba(0,200,83,.1);border-color:var(--green);color:var(--green2);}
  .agency-pill.law{border-color:rgba(180,83,9,.3);}
  .agency-pill.law:hover{border-color:var(--gold2);color:var(--gold2);}
  .agency-pill.law.on{background:rgba(180,83,9,.12);border-color:var(--gold2);color:var(--gold2);}
  .agency-pill.nap{border-color:rgba(124,58,237,.3);}
  .agency-pill.nap:hover{border-color:var(--purple2);color:var(--purple2);}
  .agency-pill.nap.on{background:rgba(124,58,237,.12);border-color:var(--purple2);color:var(--purple2);}

  /* ── STREET PILLS ── */
  .st-pills-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px;}
  .st-pill{background:var(--s2);border:1px solid var(--border);border-radius:16px;padding:5px 12px;font-size:.7rem;color:var(--muted2);cursor:pointer;transition:all .18s;user-select:none;}
  .st-pill:hover{border-color:var(--green);color:var(--green2);}
  .st-pill.on{background:rgba(0,200,83,.08);border-color:var(--green);color:var(--green2);}

  /* ── CONTACT CARDS GRID ── */
  .cards-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:28px;}

  /* ── STANDARD CARD ── */
  .ccard{background:var(--s1);border:1px solid var(--border);border-radius:10px;padding:18px 18px 18px 22px;position:relative;overflow:hidden;transition:border-color .2s;}
  .ccard:hover{border-color:rgba(0,200,83,.3);}
  .ccard-bar{position:absolute;left:0;top:0;bottom:0;width:3px;}
  .ccard-agency{font-size:.58rem;text-transform:uppercase;letter-spacing:.13em;font-weight:700;margin-bottom:8px;}
  .ccard-title{font-size:.88rem;font-weight:700;color:#fff;margin-bottom:12px;line-height:1.3;}
  .info-row{display:flex;gap:7px;margin-bottom:7px;align-items:flex-start;}
  .info-ico{width:15px;flex-shrink:0;font-size:.8rem;margin-top:1px;}
  .info-k{font-size:.57rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;display:block;margin-bottom:1px;}
  .info-v{font-size:.78rem;color:var(--text);}
  .info-link{color:inherit;text-decoration:none;}
  .info-link:hover{text-decoration:underline;}
  .call-btn{width:100%;margin-top:12px;padding:11px;border-radius:8px;border:none;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:.78rem;font-weight:700;letter-spacing:.04em;display:flex;align-items:center;justify-content:center;gap:6px;transition:opacity .2s;min-height:44px;}
  .call-btn:hover{opacity:.85;}

  /* ── NAPTIP CARD ── */
  .ncard{background:var(--purple-bg);border:1px solid rgba(124,58,237,.35);border-radius:10px;padding:0;overflow:hidden;}
  .ncard-hdr{background:linear-gradient(90deg,rgba(124,58,237,.22),rgba(124,58,237,.06));border-bottom:1px solid rgba(124,58,237,.2);padding:12px 16px;display:flex;align-items:center;gap:8px;}
  .ncard-agency{font-size:.58rem;text-transform:uppercase;letter-spacing:.13em;color:var(--purple2);font-weight:700;}
  .ncard-badge{margin-left:auto;background:rgba(124,58,237,.15);border:1px solid rgba(124,58,237,.3);color:var(--purple2);padding:2px 8px;border-radius:10px;font-size:.56rem;letter-spacing:.06em;white-space:nowrap;}
  .ncard-body{padding:14px 16px;}
  .ncard-title{font-size:.86rem;font-weight:700;color:#fff;margin-bottom:10px;}
  .ncard-alert{background:rgba(124,58,237,.08);border:1px solid rgba(124,58,237,.2);border-radius:6px;padding:8px 12px;margin-bottom:12px;font-size:.7rem;color:rgba(167,139,250,.8);line-height:1.55;}
  .ncard-hotlines{display:flex;gap:6px;flex-wrap:wrap;margin-top:10px;}
  .ncard-hot{flex:1;min-width:80px;padding:7px 8px;border-radius:6px;border:1px solid rgba(124,58,237,.25);background:rgba(124,58,237,.06);color:var(--purple2);text-decoration:none;font-size:.66rem;font-weight:600;text-align:center;transition:all .18s;cursor:pointer;}
  .ncard-hot:hover{background:rgba(124,58,237,.18);}
  .ncard-hot strong{display:block;font-family:'DM Mono',monospace;font-size:.78rem;}

  /* ── LEGAL AID CARD ── */
  .lcard{grid-column:1 / -1;background:linear-gradient(135deg,rgba(26,16,0,.95),rgba(6,9,15,.95));border:1px solid rgba(180,83,9,.4);border-radius:12px;overflow:hidden;position:relative;}
  .lcard::before{content:'';position:absolute;right:-60px;top:-60px;width:220px;height:220px;background:radial-gradient(circle,rgba(245,158,11,.07),transparent 65%);pointer-events:none;}
  .lcard-hdr{background:linear-gradient(90deg,rgba(180,83,9,.25),rgba(180,83,9,.06));border-bottom:1px solid rgba(180,83,9,.25);padding:14px 16px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;gap:8px;}
  .lcard-icon{font-size:1.2rem;flex-shrink:0;}
  .lcard-hdr-title{font-size:.9rem;font-weight:700;color:var(--gold2);}
  .lcard-hdr-sub{font-size:.62rem;color:rgba(245,158,11,.45);text-transform:uppercase;letter-spacing:.08em;margin-top:2px;}
  .lcard-badge{margin-left:auto;background:rgba(180,83,9,.18);border:1px solid rgba(180,83,9,.4);color:var(--gold2);padding:3px 9px;border-radius:12px;font-size:.56rem;font-weight:700;letter-spacing:.06em;flex-shrink:0;}
  .lcard-body{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;padding:16px;}
  .lcard-col{background:rgba(0,0,0,.28);border:1px solid rgba(180,83,9,.14);border-radius:8px;padding:14px;position:relative;}
  .lcol-tab{position:absolute;top:-1px;left:12px;background:var(--gold);color:#000;font-size:.5rem;font-weight:700;letter-spacing:.1em;padding:2px 7px;border-radius:0 0 5px 5px;text-transform:uppercase;}
  .lcol-title{font-size:.66rem;color:var(--gold2);font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin:10px 0 10px;}
  .lcard-rights{grid-column:1 / -1;background:rgba(0,0,0,.25);border:1px solid rgba(180,83,9,.1);border-radius:8px;padding:14px;}
  .lcard-rights-title{font-size:.6rem;color:rgba(245,158,11,.45);text-transform:uppercase;letter-spacing:.12em;font-weight:600;margin-bottom:10px;}
  .rights-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
  .right-item{background:rgba(180,83,9,.05);border:1px solid rgba(180,83,9,.1);border-radius:6px;padding:8px 10px;}
  .right-ico{font-size:.9rem;margin-bottom:4px;}
  .right-txt{font-size:.67rem;color:rgba(255,255,255,.5);line-height:1.5;}
  .lcall{width:100%;margin-top:7px;padding:9px;border-radius:6px;border:1px solid rgba(180,83,9,.35);background:rgba(180,83,9,.12);color:var(--gold2);cursor:pointer;font-family:'Space Grotesk',sans-serif;font-size:.72rem;font-weight:700;letter-spacing:.03em;display:flex;align-items:center;justify-content:center;gap:5px;transition:all .18s;text-decoration:none;min-height:40px;}
  .lcall:hover{background:rgba(180,83,9,.25);}
  .lcall.primary{background:var(--gold);color:#000;border-color:var(--gold);}
  .lcall.primary:hover{background:var(--gold2);}

  /* ── COMMAND SECTION ── */
  .cmd-section{margin-bottom:28px;}
  .sec-hdr{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
  .sec-title{font-size:.86rem;font-weight:700;color:#fff;}
  .sec-div{flex:1;height:1px;background:var(--border);}
  .toggle-btn{background:var(--s2);border:1px solid var(--border);color:var(--muted2);padding:7px 12px;border-radius:6px;cursor:pointer;font-size:.7rem;font-family:'Space Grotesk',sans-serif;white-space:nowrap;transition:all .18s;min-height:36px;}
  .toggle-btn:hover{border-color:var(--green);color:var(--green2);}
  .cmd-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .cmd-card{background:var(--s2);border:1px solid var(--border);border-radius:8px;padding:14px;}
  .cmd-card.law{background:var(--gold-bg);border-color:rgba(180,83,9,.3);}
  .cmd-card.nap{background:var(--purple-bg);border-color:rgba(124,58,237,.25);}
  .cmd-lbl{font-size:.56rem;text-transform:uppercase;letter-spacing:.13em;color:var(--muted);font-weight:600;margin-bottom:5px;}
  .cmd-name{font-size:.83rem;font-weight:700;color:#fff;margin-bottom:2px;}
  .cmd-rank{font-size:.68rem;color:var(--muted2);margin-bottom:5px;line-height:1.4;}
  .cmd-phone{font-size:.78rem;color:var(--green);font-weight:600;text-decoration:none;display:block;}
  .cmd-card.law .cmd-phone{color:var(--gold2);}.cmd-card.nap .cmd-phone{color:var(--purple2);}
  .cmd-addr{font-size:.66rem;color:var(--muted2);line-height:1.45;margin-top:4px;}

  /* ── EMERGENCY PANEL ── */
  .emg-panel{background:linear-gradient(135deg,#1a0404,#2d0808);border:1px solid rgba(244,67,54,.3);border-radius:10px;padding:16px;margin-bottom:22px;}
  .emg-title{font-size:.78rem;font-weight:700;color:var(--danger);letter-spacing:.05em;margin-bottom:12px;display:flex;align-items:center;gap:6px;}
  .emg-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
  .emg-btn{display:flex;flex-direction:column;align-items:center;gap:3px;background:rgba(0,0,0,.3);border:1px solid rgba(244,67,54,.2);border-radius:7px;padding:10px 6px;cursor:pointer;text-decoration:none;transition:all .2s;min-height:72px;justify-content:center;}
  .emg-btn:hover{border-color:var(--danger);background:rgba(244,67,54,.1);}
  .emg-icon{font-size:1.15rem;}
  .emg-lbl{font-size:.56rem;color:var(--muted2);text-align:center;text-transform:uppercase;letter-spacing:.05em;}
  .emg-num{font-family:'DM Mono',monospace;font-size:.82rem;font-weight:700;color:var(--danger);}

  /* ── PLACEHOLDER ── */
  .ph{background:var(--s1);border:1px dashed var(--border);border-radius:10px;padding:36px 16px;text-align:center;color:var(--muted);}
  .ph-ico{font-size:2rem;margin-bottom:10px;}
  .ph-txt{font-size:.82rem;line-height:1.7;}

  /* ── SEARCH ── */
  .srch-wrap{position:relative;margin-bottom:18px;}
  .srch-ico{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none;}
  .srch-input{width:100%;background:var(--s1);border:1px solid var(--border);color:var(--text);padding:12px 14px 12px 36px;border-radius:8px;font-family:'Space Grotesk',sans-serif;font-size:.85rem;transition:border-color .2s;min-height:46px;}
  .srch-input:focus{outline:none;border-color:var(--green);}
  .srch-input::placeholder{color:var(--muted);}

  /* ── FOOTER ── */
  .footer{border-top:1px solid var(--border);padding:14px 16px;text-align:center;color:var(--muted);font-size:.67rem;line-height:1.8;}

  /* ════════════════════════════════════════════
     TABLET  768px – 1024px
  ════════════════════════════════════════════ */
  @media(max-width:1024px){
    .cards-grid{grid-template-columns:1fr 1fr;}
    .cmd-grid{grid-template-columns:1fr 1fr;}
    .lcard-body{grid-template-columns:1fr 1fr;}
    .lcard-rights{grid-column:1 / -1;}
    .rights-grid{grid-template-columns:repeat(2,1fr);}
    .emg-grid{grid-template-columns:repeat(4,1fr);}
    .sel-row{grid-template-columns:1fr 1fr 1fr;}
  }

  /* ════════════════════════════════════════════
     SMALL TABLET / LARGE PHONE  600px – 768px
  ════════════════════════════════════════════ */
  @media(max-width:768px){
    .main{padding:16px 14px;}
    .hero{padding:20px 14px 18px;}
    .topbar{padding:0 14px;gap:8px;}
    .topbar-sub{display:none;}
    .sel-row{grid-template-columns:1fr 1fr;gap:9px;}
    .cards-grid{grid-template-columns:1fr 1fr;gap:10px;}
    .cmd-grid{grid-template-columns:1fr 1fr;gap:8px;}
    .lcard-body{grid-template-columns:1fr 1fr;gap:10px;padding:14px;}
    .rights-grid{grid-template-columns:repeat(2,1fr);}
    .emg-grid{grid-template-columns:repeat(4,1fr);}
    .ccard{padding:14px 14px 14px 18px;}
    .lcard-hdr{padding:12px 14px;}
    .lcard-badge{display:none;}
    .hero-h{font-size:1.3rem;}
    .hero-lgas{display:none;}
  }

  /* ════════════════════════════════════════════
     MOBILE PHONE  < 600px
  ════════════════════════════════════════════ */
  @media(max-width:600px){
    .main{padding:14px 12px;}
    .hero{padding:16px 12px 14px;}
    .topbar{padding:0 12px;height:52px;}
    .flag-strip{width:30px;height:22px;}
    .topbar-sub{display:none;}
    .sos-badge{font-size:.62rem;padding:4px 8px;}

    /* Full-width single column selectors */
    .sel-row{grid-template-columns:1fr;gap:8px;}
    select{font-size:.85rem;padding:12px 30px 12px 12px;}

    /* Single column cards */
    .cards-grid{grid-template-columns:1fr;gap:10px;}

    /* Command grid single column */
    .cmd-grid{grid-template-columns:1fr;gap:8px;}

    /* Legal aid: single column */
    .lcard-body{grid-template-columns:1fr;gap:10px;padding:12px;}
    .lcard-hdr{flex-wrap:wrap;}
    .lcard-badge{display:none;}
    .lcard-hdr-title{font-size:.85rem;}

    /* Rights: single column */
    .rights-grid{grid-template-columns:1fr;}

    /* Emergency panel: 2 columns */
    .emg-grid{grid-template-columns:1fr 1fr;gap:7px;}
    .emg-btn{padding:10px 4px;min-height:68px;}
    .emg-num{font-size:.78rem;}

    /* Agency pills: full width scroll */
    .agency-pills{gap:5px;}
    .agency-pill{font-size:.7rem;padding:6px 10px;}

    /* Step indicator: compact */
    .steps{gap:3px;}
    .st{font-size:.65rem;}

    /* Hero */
    .hero-h{font-size:1.1rem;}
    .hero-p{font-size:.72rem;}
    .hero-lgas{display:none;}
    .hero-tag{font-size:.55rem;}

    /* Topbar title truncate */
    .topbar-title{font-size:.75rem;max-width:160px;}

    /* Cards padding */
    .ccard{padding:12px 12px 12px 16px;}
    .ccard-title{font-size:.82rem;}
    .info-v{font-size:.75rem;}
    .call-btn{font-size:.74rem;padding:10px;}

    /* NAPTIP */
    .ncard-body{padding:12px;}
    .ncard-alert{font-size:.68rem;}

    /* Placeholder */
    .ph{padding:28px 12px;}
    .ph-txt{font-size:.76rem;}

    /* Footer */
    .footer{font-size:.62rem;line-height:2;}

    /* Page tabs */
    .page-tab{padding:11px 13px;font-size:.72rem;}
  }

  /* ════════════════════════════════════════════
     SMALL PHONES  < 400px  (iPhone SE, etc.)
  ════════════════════════════════════════════ */
  @media(max-width:400px){
    .main{padding:12px 10px;}
    .hero{padding:14px 10px 12px;}
    .topbar{padding:0 10px;}
    .topbar-title{font-size:.7rem;max-width:130px;}
    .sos-badge{font-size:.58rem;padding:4px 7px;}
    .hero-h{font-size:1rem;}
    .cards-grid{gap:8px;}
    .cmd-grid{gap:7px;}
    .emg-grid{grid-template-columns:1fr 1fr;gap:6px;}
    .emg-num{font-size:.72rem;}
    .agency-pill{font-size:.65rem;padding:5px 8px;}
    .ccard{padding:10px 10px 10px 14px;}
    .ncard-hotlines{flex-direction:column;}
    .ncard-hot{min-width:unset;}
  }
`;

// ═══════════════════════════════════════════════════════════════
//  CARD COMPONENTS
// ═══════════════════════════════════════════════════════════════
function CCard({ data, agencyId }) {
  const ag = AGENCIES.find(a => a.id === agencyId);
  const color = ag?.color || "#22c55e";
  const lightText = ["fire","ambulance"].includes(agencyId);
  return (
    <div className="ccard">
      <div className="ccard-bar" style={{background:color}}/>
      <div className="ccard-agency" style={{color}}>{ag?.icon} {ag?.label}</div>
      <div className="ccard-title">{data.station || data.name}</div>
      <div className="info-row"><span className="info-ico">👤</span><div><span className="info-k">Officer</span><span className="info-v">{data.officer}</span></div></div>
      <div className="info-row"><span className="info-ico">📞</span><div><span className="info-k">Phone</span><a href={`tel:${data.phone}`} className="info-v info-link">{data.phone}</a></div></div>
      <div className="info-row"><span className="info-ico">📍</span><div><span className="info-k">Address</span><span className="info-v">{data.address}</span></div></div>
      <button className="call-btn" style={{background:color,color:lightText?"#fff":"#000"}} onClick={()=>window.open(`tel:${data.phone}`)}>
        📞 Call — {data.phone}
      </button>
    </div>
  );
}

function NaptipCard({ data }) {
  return (
    <div className="ncard">
      <div className="ncard-hdr">
        <div className="ncard-agency">🚫 NAPTIP — Anti-Trafficking</div>
        <div className="ncard-badge">S-E Zone · Abia</div>
      </div>
      <div className="ncard-body">
        <div className="ncard-title">{data.station}</div>
        <div className="ncard-alert">
          ⚠ <strong>Reporting trafficking?</strong> You can call or SMS anonymously.<br/>
          Zonal Commander: <strong>{data.officer}</strong> covers all Abia LGAs.<br/>
          Contact: <strong>{data.phone}</strong>
        </div>
        <div className="info-row"><span className="info-ico">📍</span><div><span className="info-k">Office / Desk</span><span className="info-v">{data.address}</span></div></div>
        <div className="info-row"><span className="info-ico">✉️</span><div><span className="info-k">Email</span><a href={`mailto:${data.email}`} className="info-v info-link">{data.email}</a></div></div>
        <button className="call-btn" style={{background:"#7c3aed",color:"#fff",marginTop:10}} onClick={()=>window.open(`tel:${data.phone}`)}>
          📞 Call Zonal Commander — {data.phone}
        </button>
        <div className="ncard-hotlines">
          <a href="tel:08039000001" className="ncard-hot"><strong>0803-9000-001</strong>National Hotline · 24/7</a>
          <a href="tel:08055555333" className="ncard-hot"><strong>0805-5555-333</strong>Alt. Hotline · 24/7</a>
          <a href="sms:15888" className="ncard-hot"><strong>SMS 15888</strong>Anonymous Report</a>
        </div>
      </div>
    </div>
  );
}

function LawyerCard({ data, area }) {
  const rights = [
    {ico:"🤐",txt:"Right to remain silent — anything said can be used against you in court."},
    {ico:"⚖️",txt:"Right to a lawyer before answering any police questions. Request one immediately."},
    {ico:"🏛️",txt:"If you cannot afford a lawyer, the state must provide one FREE under Legal Aid Act."},
    {ico:"📋",txt:"Must be charged or released within 24–48 hrs of arrest (Constitution S.35)."},
    {ico:"📞",txt:"Right to immediately contact your family or legal representative after arrest."},
    {ico:"🚫",txt:"No officer may use torture or inhuman treatment — Constitution S.34 & CAT."},
  ];
  return (
    <div className="lcard">
      <div className="lcard-hdr">
        <span className="lcard-icon">⚖️</span>
        <div>
          <div className="lcard-hdr-title">Legal Aid & State-Provided Lawyers</div>
          <div className="lcard-hdr-sub">Free Legal Representation · {area} · Abia State</div>
        </div>
        <div className="lcard-badge">FREE SERVICE</div>
      </div>
      <div className="lcard-body">

        {/* Column 1: State Lawyer */}
        <div className="lcard-col">
          <div className="lcol-tab">State Lawyer</div>
          <div className="lcol-title">Legal Aid Council</div>
          <div className="info-row"><span className="info-ico">👨‍⚖️</span><div><span className="info-k">Duty Lawyer</span><span className="info-v">{data.officer}</span></div></div>
          <div className="info-row"><span className="info-ico">📍</span><div><span className="info-k">Office</span><span className="info-v" style={{fontSize:'.72rem'}}>{data.address}</span></div></div>
          <button className="lcall primary" onClick={()=>window.open(`tel:${data.phone}`)}>📞 Call Duty Lawyer — {data.phone}</button>
          <a href={`tel:${data.legalAidHotline.replace(/\-/g,"")}`} className="lcall" style={{marginTop:5}}>📟 Legal Aid Hotline — {data.legalAidHotline}</a>
        </div>

        {/* Column 2: NHRC (real data) */}
        <div className="lcard-col">
          <div className="lcol-tab">Human Rights</div>
          <div className="lcol-title">NHRC Abia Office</div>
          <div className="info-row"><span className="info-ico">👤</span><div><span className="info-k">Coordinator</span><span className="info-v">{data.nhrcCoordinator}</span></div></div>
          <div className="info-row"><span className="info-ico">📞</span><div><span className="info-k">Direct Line</span><a href={`tel:${data.nhrcPhone}`} className="info-v info-link">{data.nhrcPhone}</a></div></div>
          <div className="info-row"><span className="info-ico">✉️</span><div><span className="info-k">Email</span><a href={`mailto:${data.nhrcEmail}`} className="info-v info-link" style={{fontSize:'.68rem'}}>{data.nhrcEmail}</a></div></div>
          <div className="info-row"><span className="info-ico">📍</span><div><span className="info-k">Address</span><span className="info-v" style={{fontSize:'.7rem'}}>{data.nhrcAddress}</span></div></div>
          <button className="lcall" onClick={()=>window.open(`tel:${data.nhrcPhone}`)}>📞 Call NHRC Abia — {data.nhrcPhone}</button>
          <a href={`tel:${data.nhrcSeRegional.replace(/\-/g,"")}`} className="lcall" style={{marginTop:5}}>📟 NHRC S-E Regional — {data.nhrcSeRegional}</a>
          <a href="tel:07004255467" className="lcall" style={{marginTop:5}}>📟 NHRC National — {data.nhrcHotline}</a>
        </div>

        {/* Column 3: NBA + Police HR */}
        <div className="lcard-col">
          <div className="lcol-tab">Bar Association</div>
          <div className="lcol-title">{data.nbaChapter}</div>
          <div className="info-row"><span className="info-ico">✉️</span><div><span className="info-k">NBA Email</span><a href={`mailto:${data.nbaEmail}`} className="info-v info-link" style={{fontSize:'.68rem'}}>{data.nbaEmail}</a></div></div>
          <div style={{paddingTop:10,borderTop:'1px solid rgba(180,83,9,.12)',marginTop:6}}>
            <div className="info-k" style={{marginBottom:5}}>Police Human Rights Desk</div>
            <a href={`tel:${data.policeHumanRights}`} className="info-v info-link">{data.policeHumanRights}</a>
          </div>
          <div style={{paddingTop:10,borderTop:'1px solid rgba(180,83,9,.12)',marginTop:10}}>
            <div className="info-k" style={{marginBottom:5}}>Ministry of Justice</div>
            <button className="lcall" onClick={()=>window.open(`tel:${data.mojLine}`)}>📞 A.G. Abia State — {data.mojLine}</button>
          </div>
        </div>

        {/* Know Your Rights */}
        <div className="lcard-rights">
          <div className="lcard-rights-title">⚖️ Know Your Rights — Nigerian Constitution & Human Rights</div>
          <div className="rights-grid">
            {rights.map((r,i)=>(
              <div key={i} className="right-item">
                <div className="right-ico">{r.ico}</div>
                <div className="right-txt">{r.txt}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function CmdCard({ officer, label, variant="" }) {
  return (
    <div className={`cmd-card ${variant}`}>
      <div className="cmd-lbl">{label}</div>
      <div className="cmd-name">{officer.name}</div>
      <div className="cmd-rank">{officer.rank}</div>
      <a href={`tel:${officer.phone}`} className="cmd-phone">📞 {officer.phone}</a>
      <div className="cmd-addr">📍 {officer.address}</div>
      {officer.legalAidHotline && <div className="cmd-addr" style={{marginTop:4,color:'rgba(245,158,11,.5)'}}>Legal Aid: {officer.legalAidHotline}</div>}
    </div>
  );
}

// Search View
function SearchView() {
  const [q,setQ] = useState("");
  const results = useMemo(()=>{
    if(!q.trim()) return [];
    const lo = q.toLowerCase();
    const out = [];
    ABIA_LGAS.forEach(lga=>{
      lga.areas.forEach(area=>{
        AGENCIES.forEach(ag=>{
          const d = area.agencies[ag.id];
          if(!d) return;
          const txt = `${lga.lga} ${area.name} ${d.station||""} ${d.officer||""} ${d.address||""} ${ag.label}`.toLowerCase();
          if(txt.includes(lo)) out.push({lga:lga.lga,area:area.name,agencyId:ag.id,data:d});
        });
      });
    });
    return out.slice(0,24);
  },[q]);

  return (
    <div>
      <div className="srch-wrap">
        <span className="srch-ico">🔍</span>
        <input className="srch-input" placeholder="Search LGA, area, station, officer, lawyer, NAPTIP…" value={q} onChange={e=>setQ(e.target.value)}/>
      </div>
      {q && results.length===0 && <div className="ph"><div className="ph-ico">🔍</div><div className="ph-txt">No results for "{q}"</div></div>}
      {results.length>0 && (
        <div className="cards-grid">
          {results.map((r,i)=>(
            <div key={i} style={{display:"contents"}}>
              {r.agencyId==="legalAid" ? <LawyerCard data={r.data} area={r.area}/>
               : r.agencyId==="naptip" ? <NaptipCard data={r.data}/>
               : <CCard data={r.data} agencyId={r.agencyId}/>}
            </div>
          ))}
        </div>
      )}
      {!q && <div className="ph"><div className="ph-ico">🔍</div><div className="ph-txt">Search all 17 LGAs across 12 agencies<br/>Police · Fire · Ambulance · FRSC · DSS · EFCC<br/>NSCDC · Customs · Immigration · NDLEA · <span style={{color:"#a78bfa"}}>NAPTIP</span> · <span style={{color:"#f59e0b"}}>⚖️ Legal Aid</span></div></div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function AbiaEmergencyApp() {
  const [view,setView]       = useState("browse");
  const [selLGA,setSelLGA]   = useState("");
  const [selArea,setSelArea] = useState("");
  const [selAgency,setSelAgency] = useState("");
  const [showCmd,setShowCmd] = useState(false);

  const lgaObj  = ABIA_LGAS.find(l=>l.lga===selLGA)||null;
  const areaObj = lgaObj?.areas.find(a=>a.name===selArea)||null;
  const step    = !selLGA?0:!selArea?1:2;
  const activeAg= AGENCIES.find(a=>a.id===selAgency);
  const visible = selAgency ? AGENCIES.filter(a=>a.id===selAgency) : AGENCIES;

  return (
    <>
      <style>{S}</style>
      <div>
        {/* TOPBAR */}
        <div className="topbar">
          <div className="flag-strip"><div className="fg"/><div className="fw"/><div className="fg"/></div>
          <div>
            <div className="topbar-title">ABIA STATE EMERGENCY CONTACTS</div>
            <div className="topbar-sub">17 LGAs · 12 Agencies · Legal Aid Included · NAPTIP</div>
          </div>
          <div className="sos-badge">⚠ SOS · 112</div>
        </div>

        {/* HERO */}
        <div className="hero">
          <div className="hero-inner">
            <div className="hero-tag"><img src="/icons/abia-logo.jpg" alt="Logo" className="hero-logo" /></div>
            <div className="hero-h">LGA Emergency <span>Response</span> Contacts</div>
            <div className="hero-p">
              Police · Fire · Ambulance · FRSC · DSS · EFCC · Civil Defence · Customs · Immigration · NDLEA ·{" "}
              <span style={{color:"#a78bfa"}}>NAPTIP</span> ·{" "}
              <strong style={{color:"#f59e0b"}}>⚖️ Free Legal Aid & State Lawyers</strong>
            </div>
            <div className="hero-lgas">{ABIA_LGAS.map(l=><span key={l.lga} className="hero-lga-tag">{l.lga}</span>)}</div>
          </div>
        </div>

        {/* TABS */}
        <div className="page-tabs">
          <div style={{maxWidth:1000,margin:"0 auto",display:"flex"}}>
            {[{id:"browse",l:"🗺 Browse by Location"},{id:"search",l:"🔍 Search All Contacts"}].map(t=>(
              <button key={t.id} className={`page-tab ${view===t.id?"active":""}`} onClick={()=>setView(t.id)}>{t.l}</button>
            ))}
          </div>
        </div>

        <div className="main">
          {view==="search" ? <SearchView/> : (
            <>
              {/* STEP INDICATOR */}
              <div className="steps">
                {["Select LGA","Select Area / City","View Contacts"].map((s,i)=>(
                  <span key={i} className="step">
                    {i>0 && <span className="sa">›</span>}
                    <span className={`sn ${i<step?"done":i===step?"active":"idle"}`}>{i<step?"✓":i+1}</span>
                    <span className="st">{s}</span>
                  </span>
                ))}
              </div>

              {/* SELECTORS */}
              <div className="sel-row">
                <div>
                  <div className="sel-lbl">Local Government Area</div>
                  <div className="sel-wrap">
                    <select value={selLGA} onChange={e=>{setSelLGA(e.target.value);setSelArea("");setShowCmd(false);}}>
                      <option value="">Choose LGA…</option>
                      {ABIA_LGAS.map(l=><option key={l.lga} value={l.lga}>{l.lga}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="sel-lbl">Area / City</div>
                  <div className="sel-wrap">
                    <select value={selArea} onChange={e=>{setSelArea(e.target.value);}} disabled={!lgaObj}>
                      <option value="">Choose area…</option>
                      {lgaObj?.areas.map(a=><option key={a.name} value={a.name}>{a.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <div className="sel-lbl">Filter by Agency</div>
                  <div className="sel-wrap">
                    <select value={selAgency} onChange={e=>setSelAgency(e.target.value)}>
                      <option value="">All 12 Agencies</option>
                      {AGENCIES.map(a=><option key={a.id} value={a.id}>{a.icon} {a.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* EMERGENCY NUMBERS */}
              <div className="emg-panel">
                <div className="emg-title">⚠ Abia State Emergency Numbers</div>
                <div className="emg-grid">
                  {(activeAg
                    ? activeAg.emergencyNums.map(n=>({...n,icon:activeAg.icon}))
                    : [{label:"Police",icon:"🚔",num:"199"},{label:"Ambulance",icon:"🚑",num:"112"},{label:"Legal Aid",icon:"⚖️",num:"0703-000-0000"},{label:"NAPTIP",icon:"🚫",num:"0803-9000-001"}]
                  ).map((e,i)=>(
                    <a key={i} href={`tel:${e.num.replace(/[\s\-]/g,"")}`} className="emg-btn">
                      <span className="emg-icon">{e.icon}</span>
                      <span className="emg-num">{e.num}</span>
                      <span className="emg-lbl">{e.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* STATE COMMAND */}
              {selLGA && (
                <div className="cmd-section">
                  <div className="sec-hdr">
                    <div className="sec-title">Abia State Command Officers</div>
                    <div className="sec-div"/>
                    <button className="toggle-btn" onClick={()=>setShowCmd(!showCmd)}>
                      {showCmd?"▲ Hide":"▼ Show"} Commands
                    </button>
                  </div>
                  {showCmd && (
                    <div className="cmd-grid">
                      {AGENCIES.filter(a=>!selAgency||selAgency===a.id).map(a=>{
                        const o = ABIA_STATE_COMMAND[a.id];
                        if(!o) return null;
                        const v = a.id==="legalAid"?"law":a.id==="naptip"?"nap":"";
                        return <CmdCard key={a.id} officer={o} label={`${a.icon} ${a.label}`} variant={v}/>;
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* STREETS */}
              {areaObj && (
                <div className="st-pills-row">
                  <span className="st-pill on" style={{fontWeight:700}}>📍 {areaObj.name}</span>
                  {areaObj.streets.map(st=><span key={st} className="st-pill">{st}</span>)}
                </div>
              )}

              {/* AGENCY FILTER PILLS */}
              {areaObj && (
                <>
                  <div className="agency-pills">
                    <div className={`agency-pill ${selAgency===""?"on":""}`} onClick={()=>setSelAgency("")}>🔵 All Agencies</div>
                    {AGENCIES.map(a=>(
                      <div key={a.id}
                        className={`agency-pill ${a.id==="legalAid"?"law":""} ${a.id==="naptip"?"nap":""} ${selAgency===a.id?"on":""}`}
                        onClick={()=>setSelAgency(selAgency===a.id?"":a.id)}>
                        {a.icon} {a.label}
                      </div>
                    ))}
                  </div>

                  <div className="sec-hdr" style={{marginBottom:14}}>
                    <div className="sec-title" style={{fontSize:".82rem"}}>
                      {selAgency?`${activeAg?.label} Contact`:"All Agency Contacts"} — {areaObj.name}, {selLGA}
                    </div>
                    <div className="sec-div"/>
                  </div>

                  <div className="cards-grid">
                    {visible.map(ag=>{
                      const d = areaObj.agencies[ag.id];
                      if(!d) return null;
                      if(ag.id==="legalAid") return <LawyerCard key={ag.id} data={d} area={areaObj.name}/>;
                      if(ag.id==="naptip")   return <NaptipCard key={ag.id} data={d}/>;
                      return <CCard key={ag.id} data={d} agencyId={ag.id}/>;
                    })}
                  </div>
                </>
              )}

              {/* PLACEHOLDERS */}
              {!lgaObj && (
                <div className="ph">
                  <div className="ph-ico">🗺</div>
                  <div className="ph-txt">
                    Select your <strong>Local Government Area</strong> to start<br/>
                    then choose an <strong>Area or City</strong> to view all 12 agency contacts<br/><br/>
                    <span style={{color:"#a78bfa"}}>🚫 NAPTIP Anti-Trafficking Hotline: 0803-9000-001 (SMS: 15888)</span><br/>
                    <span style={{color:"#f59e0b"}}>⚖️ Free Legal Aid: 0703-000-0000 · NHRC Abia: +234 803 540 3780</span>
                  </div>
                </div>
              )}
              {lgaObj && !areaObj && (
                <div className="ph">
                  <div className="ph-ico">📍</div>
                  <div className="ph-txt">Select an <strong>Area / City</strong> within {selLGA} to view contacts</div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="footer">
          Abia State Emergency Contacts · 17 LGAs · 12 Agencies ·
          Emergency: <strong style={{color:"#f44336"}}>112</strong> ·
          NAPTIP: <strong style={{color:"#a78bfa"}}>0803-9000-001</strong> ·
          Legal Aid: <strong style={{color:"#f59e0b"}}>0703-000-0000</strong> ·
          NHRC Abia: <strong style={{color:"#f59e0b"}}>+2348035403780</strong>
        </div>
      </div>
    </>
  );
}
