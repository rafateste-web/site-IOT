import axios from "axios";

import { useState, useEffect, useCallback } from "react";

import { API_BASE } from "./ApiBase";


// ══════════════════════════════════════════════════════
//  CONFIGURAÇÃO DA API
// ══════════════════════════════════════════════════════
const GROUP_SENSOR_ID = 7;

// ══════════════════════════════════════════════════════
//  PALETA DE CORES — alto contraste, tema escuro
//  Primary:  Âmbar    #F59E0B / #FCD34D / #78350F
//  Cold:     Teal     #14B8A6 / #5EEAD4 / #042F2E
//  Hot:      Coral    #F87171 / #FCA5A5 / #7F1D1D
//  Cool:     Sky      #38BDF8 / #BAE6FD / #082F49
//  Surface:  Slate    #1E293B / #0F172A / #020617
// ══════════════════════════════════════════════════════
const C = {
  bg:        "#07111D",
  surface:   "#0F1E2E",
  raised:    "#162433",
  border:    "#1E3A52",
  borderHi:  "#2A527A",
  text:      "#F1F5F9",
  textMid:   "#94A3B8",
  textLow:   "#89a4caff",
  textFaint: "#59a7ebff",
  amber:     "#FBBF24",
  amberDim:  "#92400E",
  amberGlow: "#F59E0B22",
  teal:      "#2DD4BF",
  tealDim:   "#134E4A",
  tealGlow:  "#14B8A622",
  coral:     "#FB7185",
  coralDim:  "#881337",
  coralGlow: "#F4364622",
  sky:       "#38BDF8",
  skyDim:    "#0C4A6E",
  skyGlow:   "#0EA5E922",
  green:     "#4ADE80",
  greenGlow: "#16A34A22",
};

// ══════════════════════════════════════════════════════
//  DADOS DO GRUPO
// ══════════════════════════════════════════════════════
const GROUP_MEMBERS = [
  {
    nome: "Rafael de Oliveira Sebastião",
    curso: "Técnico em Desenvolvimento de Sistemas",
    semestre: "3º",
    descricao: "Desenvolvedor focado em sistemas embarcados e comunicação IoT. Responsável pela programação do ESP32 e integração com a API.",
    initials: "RS",
    accent: C.amber,
    accentBg: C.amberDim,
  },
  {
    nome: "Kauan Vinicius Sales",
    curso: "Técnico em Desenvolvimento de Sistemas",
    semestre: "3º Semestre",
    descricao: "Entusiasta de interfaces e experiência do usuário. Responsável pelo desenvolvimento do front-end.",
    initials: "KS",
    accent: C.teal,
    accentBg: C.tealDim,
  },
];

// ══════════════════════════════════════════════════════
//  MOCK DATA
// ══════════════════════════════════════════════════════
const generateReadings = (count = 20) =>
  Array.from({ length: count }, (_, i) => {
    const ts = new Date(Date.now() - (count - 1 - i) * 10 * 60 * 1000);
    return {
      temperatura: +(22 + Math.sin(i / 3) * 5 + (Math.random() - 0.5) * 1.5).toFixed(1),
      umidade:     +(56 + Math.cos(i / 4) * 12 + (Math.random() - 0.5) * 2).toFixed(1),
      data: ts.toLocaleDateString("pt-BR"),
      hora: ts.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
  });

const MOCK_GROUP_SENSOR = {
  id: GROUP_SENSOR_ID,
  local: "Laboratório de Informática 2",
  alunos: ["Rafael de Oliveira Sebastião", "Kauan Vinicius Sales"],
  readings: generateReadings(20),
};

const LOCAIS = [
  "Sala 101","Sala 102","Sala 103","Sala 104",
  "Lab. Informática 1","Lab. Informática 2","Lab. Redes","Lab. Eletrônica",
  "Biblioteca","Refeitório","Secretaria","Diretoria",
  "Quadra Coberta","Corredor Bloco A","Corredor Bloco B","Corredor Bloco C",
  "Almoxarifado","Sala dos Professores","Copa","Recepção",
  "Sala 201","Sala 202","Auditório","Estacionamento",
];



async function getTempSensorsMethod (){
  //id do meu sensor de temperatura: 23

  let token  = await axios.post(`${API_BASE}/api/token/`, {
    username:"smart_city",
    password:"senai501"
  });
  
  console.log("Token: " + token.data.access)

  let response = await axios.get(`${API_BASE}/api/temperatura?sensor=23`, {
    headers:{
      Authorization:`Bearer ${token.data.access}`
      
    }
  });

  return response.data;

}


async function getUmidadeSensorsMethod (){
  //id do meu sensor de temperatura: 23

  let token  = await axios.post(`${API_BASE}/api/token/`, {
    username:"smart_city",
    password:"senai501"
  });
  
  console.log("Token: " + token.data.access)

  let response = await axios.get(`${API_BASE}/api/umidade/`, {
    headers:{
      Authorization:`Bearer ${token.data.access}`
      
    }
  });

  return response.data;

}

//Alterar aqui => deve puxar os sensores
async function getSensors(){

  let dataAPI = await getTempSensorsMethod();
  console.log(dataAPI);


  const MOCK_ALL_SENSORS = dataAPI.map( (sensor, i) =>  (
  {
    id: sensor.id,
    temperatura:sensor.valor,
    umidade:sensor.umidade,
    data:sensor.timestamp,
    sensor:sensor.sensor

  }));
   
  
  return MOCK_ALL_SENSORS
}
// ══════════════════════════════════════════════════════
//  DATA SERVICE
// ══════════════════════════════════════════════════════
const DataService = {
  async getGroupSensor() {
    // const res = await fetch(`${API_BASE}/sensor/${GROUP_SENSOR_ID}`);
    // return res.json();
    return new Promise(r => setTimeout(() => r(MOCK_GROUP_SENSOR), 700));
  },
  async getAllSensors() {
    return await getSensors();
  }
};

// ══════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════
const tempMeta = (t) => {
  if (t < 16) return { color: C.sky,   label: "Frio",         bg: C.skyDim   };
  if (t < 24) return { color: C.teal,  label: "Ideal",        bg: C.tealDim  };
  if (t < 29) return { color: C.amber, label: "Quente",       bg: C.amberDim };
  return              { color: C.coral, label: "Muito quente", bg: C.coralDim };
};
const humMeta = (h) => {
  if (h < 30) return { color: C.coral, label: "Seco",  bg: C.coralDim };
  if (h < 62) return { color: C.teal,  label: "Ideal", bg: C.tealDim  };
  return              { color: C.sky,   label: "Úmido", bg: C.skyDim   };
};
const trendOf = (arr, key) => {
  if (!arr || arr.length < 2) return { icon: "→", color: C.textLow };
  const d = arr[arr.length - 1][key] - arr[arr.length - 2][key];
  if (d >  0.4) return { icon: "↑", color: C.coral };
  if (d < -0.4) return { icon: "↓", color: C.sky   };
  return               { icon: "→", color: C.textLow };
};
const avg = arr => arr.length ? +(arr.reduce((a,b) => a+b,0)/arr.length).toFixed(1) : "--";

// ══════════════════════════════════════════════════════
//  SPARKLINE
// ══════════════════════════════════════════════════════
function Sparkline({ data, color, width = 220, height = 56 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pad = 4;
  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (width - pad * 2),
    y: pad + (height - pad * 2) - ((v - min) / range) * (height - pad * 2),
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const fill = line + ` L${pts[pts.length-1].x},${height} L${pts[0].x},${height} Z`;
  const id = `sp${color.replace(/[^a-z0-9]/gi,"")}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display:"block", overflow:"visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="4" fill={color} stroke={C.surface} strokeWidth="1.5" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════
//  GAUGE
// ══════════════════════════════════════════════════════
function Gauge({ value, min, max, color, label, unit }) {
  const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const r = 50, cx = 68, cy = 66;
  const toRad = d => d * Math.PI / 180;
  const arc = (start, sweep, radius) => {
    const s = toRad(start - 90), e = toRad(start + sweep - 90);
    const x1 = cx + radius * Math.cos(s), y1 = cy + radius * Math.sin(s);
    const x2 = cx + radius * Math.cos(e), y2 = cy + radius * Math.sin(e);
    return `M${x1.toFixed(2)},${y1.toFixed(2)} A${radius},${radius} 0 ${sweep>180?1:0},1 ${x2.toFixed(2)},${y2.toFixed(2)}`;
  };
  const needleA = toRad(135 + pct * 270 - 90);
  return (
    <div style={{ textAlign:"center" }}>
      <svg width="136" height="112" viewBox="0 0 136 112">
        {/* Tick marks */}
        {Array.from({length:11},(_,i) => {
          const a = toRad(135 + i*27 - 90);
          const r1 = 44, r2 = 48;
          return <line key={i}
            x1={(cx+r1*Math.cos(a)).toFixed(1)} y1={(cy+r1*Math.sin(a)).toFixed(1)}
            x2={(cx+r2*Math.cos(a)).toFixed(1)} y2={(cy+r2*Math.sin(a)).toFixed(1)}
            stroke={C.border} strokeWidth="1.5" strokeLinecap="round" />;
        })}
        {/* Track */}
        <path d={arc(135,270,r)} fill="none" stroke={C.raised} strokeWidth="10" strokeLinecap="round" />
        {/* Fill */}
        {pct > 0 && (
          <path d={arc(135, pct*270, r)} fill="none" stroke={color}
            strokeWidth="10" strokeLinecap="round"
            style={{ transition:"all 1s cubic-bezier(.4,0,.2,1)", filter:`drop-shadow(0 0 6px ${color}66)` }} />
        )}
        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={(cx+(r-18)*Math.cos(needleA)).toFixed(2)}
          y2={(cy+(r-18)*Math.sin(needleA)).toFixed(2)}
          stroke={color} strokeWidth="2.5" strokeLinecap="round"
          style={{ transition:"all 1s cubic-bezier(.4,0,.2,1)" }} />
        <circle cx={cx} cy={cy} r="5" fill={color} />
        <circle cx={cx} cy={cy} r="2.5" fill={C.bg} />
        {/* Value */}
        <text x={cx} y={cy+22} textAnchor="middle" fill={C.text}
          fontSize="18" fontWeight="700" fontFamily="'Space Mono',monospace">{value}</text>
        <text x={cx} y={cy+34} textAnchor="middle" fill={C.textLow}
          fontSize="9" fontFamily="'Space Mono',monospace">{unit}</text>
      </svg>
      <div style={{ color:C.textMid, fontSize:"10px", letterSpacing:"2px",
        textTransform:"uppercase", fontFamily:"'Space Mono',monospace", marginTop:"-4px" }}>{label}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  BADGE
// ══════════════════════════════════════════════════════
function Badge({ label, color, bg }) {
  return (
    <span style={{
      background: bg || (color+"22"), color,
      border:`1px solid ${color}55`,
      borderRadius:"6px", padding:"2px 10px",
      fontSize:"11px", fontFamily:"'Space Mono',monospace", letterSpacing:"1px",
    }}>{label}</span>
  );
}

// ══════════════════════════════════════════════════════
//  STAT PILL
// ══════════════════════════════════════════════════════
function StatPill({ label, value, color }) {
  return (
    <div style={{ background:C.bg, borderRadius:"10px", padding:"10px 14px",
      border:`1px solid ${C.border}`, minWidth:"80px" }}>
      <div style={{ color:C.textLow, fontSize:"9px", letterSpacing:"1.2px",
        fontFamily:"'Space Mono',monospace", marginBottom:"3px" }}>{label}</div>
      <div style={{ color, fontSize:"16px", fontWeight:"700",
        fontFamily:"'Space Mono',monospace" }}>{value}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  SENSOR CARD
// ══════════════════════════════════════════════════════
function SensorCard({ sensor, isGroup, onClick }) {
  const [hov, setHov] = useState(false);
  const tm = tempMeta(sensor.temperatura);
  const hm = humMeta(sensor.umidade);
  return (
    <div
      onClick={() => onClick(sensor)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: isGroup ? "#0D1F2F" : hov ? "#132030" : C.surface,
        border: `1px solid ${isGroup ? C.amber : hov ? C.borderHi : C.border}`,
        borderRadius:"14px", padding:"18px 16px", cursor:"pointer",
        transition:"all 0.2s ease", position:"relative", overflow:"hidden",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: isGroup
          ? `0 0 28px ${C.amberGlow}`
          : hov ? "0 8px 24px #00000055" : "none",
      }}>
      {isGroup && (
        <div style={{
          position:"absolute", top:0, right:0,
          background: C.amber, color: "#1C0A00",
          fontSize:"9px", fontFamily:"'Space Mono',monospace",
          padding:"3px 12px", borderRadius:"0 14px 0 10px",
          letterSpacing:"1px", fontWeight:"700",
        }}>MEU SENSOR</div>
      )}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
        <div>
          <div style={{ color:C.textFaint, fontSize:"10px", letterSpacing:"1.5px",
            fontFamily:"'Space Mono',monospace", marginBottom:"3px" }}>
            #{String(sensor.id).padStart(2,"0")}
          </div>
          <div style={{ color:C.text, fontSize:"13px", fontWeight:"600", fontFamily:"Georgia,serif" }}>
            {sensor.local}
          </div>
        </div>
        <div style={{ width:"8px", height:"8px", borderRadius:"50%", flexShrink:0,
          background:C.green, boxShadow:`0 0 8px ${C.green}`, marginTop:"4px",
          animation:"pulse 2.5s infinite" }} />
      </div>
      <div style={{ display:"flex", gap:"8px" }}>
        <div style={{ flex:1, background:C.bg, borderRadius:"10px", padding:"10px", textAlign:"center",
          border:`1px solid ${C.border}` }}>
          <div style={{ color:tm.color, fontSize:"20px", fontWeight:"700",
            fontFamily:"'Space Mono',monospace", textShadow:`0 0 10px ${tm.color}66` }}>
            {sensor.temperatura}°
          </div>
          <div style={{ color:C.textLow, fontSize:"9px", marginTop:"2px", letterSpacing:"1px" }}>TEMP</div>
        </div>
        <div style={{ flex:1, background:C.bg, borderRadius:"10px", padding:"10px", textAlign:"center",
          border:`1px solid ${C.border}` }}>
          <div style={{ color:hm.color, fontSize:"20px", fontWeight:"700",
            fontFamily:"'Space Mono',monospace", textShadow:`0 0 10px ${hm.color}66` }}>
            {sensor.umidade}%
          </div>
          <div style={{ color:C.textLow, fontSize:"9px", marginTop:"2px", letterSpacing:"1px" }}>UMID</div>
        </div>
      </div>
      <div style={{ color:C.textFaint, fontSize:"10px", marginTop:"10px",
        fontFamily:"'Space Mono',monospace", textAlign:"right" }}>
        {sensor.data} {sensor.hora}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  MODAL DETALHE
// ══════════════════════════════════════════════════════
function SensorModal({ sensor, onClose }) {
  if (!sensor) return null;
  const tm = tempMeta(sensor.temperatura);
  const hm = humMeta(sensor.umidade);
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"#000000BB", backdropFilter:"blur(8px)",
      zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:C.surface, border:`1px solid ${C.borderHi}`,
        borderRadius:"20px", padding:"32px", maxWidth:"440px", width:"100%",
        position:"relative", boxShadow:"0 32px 80px #000000CC",
      }}>
        <button onClick={onClose} style={{
          position:"absolute", top:"16px", right:"16px",
          background:C.raised, border:`1px solid ${C.border}`,
          color:C.textMid, width:"32px", height:"32px",
          borderRadius:"50%", cursor:"pointer", fontSize:"18px",
          display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1,
        }}>×</button>
        <div style={{ color:C.textLow, fontSize:"10px", letterSpacing:"2px",
          fontFamily:"'Space Mono',monospace", marginBottom:"4px" }}>
          SENSOR #{String(sensor.id).padStart(2,"0")}
        </div>
        <div style={{ color:C.text, fontSize:"22px", fontWeight:"700",
          fontFamily:"Georgia,serif", marginBottom:"22px" }}>{sensor.local}</div>
        <div style={{ display:"flex", gap:"14px", marginBottom:"20px" }}>
          <div style={{ flex:1, background:C.bg, borderRadius:"14px", padding:"18px",
            textAlign:"center", border:`1px solid ${tm.color}44` }}>
            <div style={{ color:tm.color, fontSize:"32px", fontWeight:"700",
              fontFamily:"'Space Mono',monospace", marginBottom:"10px",
              textShadow:`0 0 16px ${tm.color}88` }}>
              {sensor.temperatura}°C
            </div>
            <Badge label={tm.label} color={tm.color} bg={tm.bg + "66"} />
          </div>
          <div style={{ flex:1, background:C.bg, borderRadius:"14px", padding:"18px",
            textAlign:"center", border:`1px solid ${hm.color}44` }}>
            <div style={{ color:hm.color, fontSize:"32px", fontWeight:"700",
              fontFamily:"'Space Mono',monospace", marginBottom:"10px",
              textShadow:`0 0 16px ${hm.color}88` }}>
              {sensor.umidade}%
            </div>
            <Badge label={hm.label} color={hm.color} bg={hm.bg + "66"} />
          </div>
        </div>
        <div style={{ background:C.bg, borderRadius:"12px", padding:"14px 16px",
          marginBottom:"16px", border:`1px solid ${C.border}` }}>
          <div style={{ color:C.textLow, fontSize:"10px", letterSpacing:"1.5px",
            fontFamily:"'Space Mono',monospace", marginBottom:"6px" }}>ÚLTIMA ATUALIZAÇÃO</div>
          <div style={{ color:C.text, fontSize:"14px", fontFamily:"'Space Mono',monospace" }}>
            {sensor.data} às {sensor.hora}
          </div>
        </div>
        {sensor.alunos?.length > 0 && (
          <div>
            <div style={{ color:C.textLow, fontSize:"10px", letterSpacing:"1.5px",
              fontFamily:"'Space Mono',monospace", marginBottom:"8px" }}>RESPONSÁVEIS</div>
            {sensor.alunos.map((a, i) => (
              <div key={i} style={{ color:C.textMid, fontSize:"13px", padding:"4px 0" }}>• {a}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  SECTION HEADER
// ══════════════════════════════════════════════════════
function SectionHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom:"28px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"5px" }}>
        <span style={{ fontSize:"20px" }}>{icon}</span>
        <h2 style={{ color:C.text, fontSize:"21px", fontFamily:"Georgia,serif",
          fontWeight:"700", margin:0 }}>{title}</h2>
      </div>
      <div style={{ color:C.textLow, fontSize:"11px", fontFamily:"'Space Mono',monospace",
        paddingLeft:"30px" }}>{subtitle}</div>
      <div style={{ height:"1px",
        background:`linear-gradient(90deg,${C.amber}44,transparent)`, marginTop:"16px" }} />
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
      padding:"64px", gap:"12px" }}>
      <div style={{ width:"8px", height:"8px", borderRadius:"50%",
        background:C.amber, animation:"pulse 1s infinite" }} />
      <span style={{ color:C.textLow, fontFamily:"'Space Mono',monospace",
        fontSize:"11px", letterSpacing:"2px" }}>CARREGANDO DADOS…</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  SEÇÃO: GRUPO
// ══════════════════════════════════════════════════════
function SectionGrupo() {
  return (
    <section style={{ marginBottom:"60px" }}>
      <SectionHeader icon="👥" title="Sobre o Grupo" subtitle="Conheça a equipe por trás do projeto" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"20px" }}>
        {GROUP_MEMBERS.map((m, i) => (
          <div key={i} style={{
            background:C.surface, border:`1px solid ${C.border}`,
            borderRadius:"18px", padding:"28px", display:"flex",
            flexDirection:"column", gap:"16px",
            borderTop:`2px solid ${m.accent}`,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
              <div style={{
                width:"58px", height:"58px", borderRadius:"50%",
                background: m.accentBg,
                border:`2px solid ${m.accent}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:m.accent, fontWeight:"700", fontSize:"15px",
                fontFamily:"'Space Mono',monospace", flexShrink:0,
                boxShadow:`0 0 20px ${m.accent}33`,
              }}>{m.initials}</div>
              <div>
                <div style={{ color:C.text, fontSize:"16px", fontWeight:"600",
                  fontFamily:"Georgia,serif" }}>{m.nome}</div>
                <div style={{ color:m.accent, fontSize:"10px",
                  fontFamily:"'Space Mono',monospace", marginTop:"4px", letterSpacing:"1px" }}>
                  {m.curso} · {m.semestre}
                </div>
              </div>
            </div>
            <p style={{ color:C.textMid, fontSize:"13px", lineHeight:"1.75", margin:0 }}>
              {m.descricao}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
//  SEÇÃO: SENSOR
// ══════════════════════════════════════════════════════
function SectionSensor() {
  const specs = [
    { label:"Microcontrolador", value:"ESP32 (Dual-core 240 MHz)" },
    { label:"Sensor T/U",       value:"DHT11 (±2°C / ±5% UR)"    },
    { label:"Comunicação",      value:"Wi-Fi 802.11 b/g/n"        },
    { label:"Protocolo",        value:"HTTP REST / JSON"           },
    { label:"Intervalo",        value:"A cada 10 minutos"          },
    { label:"Alimentação",      value:"5V via USB / fonte DC"      },
  ];
  const steps = [
    { n:"01", title:"Montagem",    col:C.amber, desc:"O DHT11 é conectado ao pino GPIO4 do ESP32 com resistor pull-up de 10kΩ no pino de dados."            },
    { n:"02", title:"Firmware",    col:C.teal,  desc:"O ESP32 executa MicroPython com a biblioteca DHT, realizando leituras a cada 10 minutos."             },
    { n:"03", title:"Envio",       col:C.sky,   desc:"Os dados são transmitidos via Wi-Fi por HTTP POST ao servidor da escola na rede local."                },
    { n:"04", title:"API",         col:C.green, desc:"O servidor armazena e expõe os dados via REST API, consumida dinamicamente por este site."             },
  ];
  return (
    <section style={{ marginBottom:"60px" }}>
      <SectionHeader icon="🔌" title="Sobre o Sensor" subtitle="Hardware, montagem e funcionamento do sistema" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"20px", marginBottom:"20px" }}>

        {/* Specs */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`,
          borderRadius:"18px", padding:"24px" }}>
          <div style={{ color:C.amber, fontSize:"10px", letterSpacing:"2px",
            fontFamily:"'Space Mono',monospace", marginBottom:"18px" }}>ESPECIFICAÇÕES TÉCNICAS</div>
          {specs.map((s,i) => (
            <div key={i} style={{ display:"flex", justifyContent:"space-between",
              borderBottom:`1px solid ${C.border}`, paddingBottom:"10px", marginBottom:"10px" }}>
              <span style={{ color:C.textLow, fontSize:"12px", fontFamily:"'Space Mono',monospace" }}>{s.label}</span>
              <span style={{ color:C.text, fontSize:"12px", fontFamily:"'Space Mono',monospace",
                textAlign:"right", maxWidth:"55%" }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Diagrama */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`,
          borderRadius:"18px", padding:"24px", display:"flex", flexDirection:"column" }}>
          <div style={{ color:C.amber, fontSize:"10px", letterSpacing:"2px",
            fontFamily:"'Space Mono',monospace", marginBottom:"16px" }}>DIAGRAMA DO CIRCUITO</div>
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="270" height="175" viewBox="0 0 270 175">
              {/* Fonte */}
              <rect x="6" y="62" width="46" height="40" rx="8" fill={C.raised} stroke={C.sky} strokeWidth="1.5" />
              <text x="29" y="85" textAnchor="middle" fill={C.sky} fontSize="9" fontFamily="Space Mono,monospace" fontWeight="700">5V</text>
              <text x="29" y="97" textAnchor="middle" fill={C.skyDim} fontSize="8" fontFamily="Space Mono,monospace">USB</text>
              <line x1="52" y1="82" x2="66" y2="82" stroke={C.sky} strokeWidth="2" />

              {/* ESP32 */}
              <rect x="66" y="42" width="90" height="80" rx="10" fill={C.raised} stroke={C.amber} strokeWidth="1.5" />
              <text x="111" y="79" textAnchor="middle" fill={C.amber} fontSize="12" fontFamily="Space Mono,monospace" fontWeight="700">ESP32</text>
              <text x="111" y="94" textAnchor="middle" fill={C.textLow} fontSize="8" fontFamily="Space Mono,monospace">GPIO4 · Wi-Fi</text>

              {/* Wire data */}
              <line x1="156" y1="82" x2="190" y2="82" stroke={C.teal} strokeWidth="2" strokeDasharray="5,3" />
              <text x="173" y="74" textAnchor="middle" fill={C.teal} fontSize="8" fontFamily="Space Mono,monospace">DATA</text>

              {/* DHT11 */}
              <rect x="190" y="57" width="58" height="50" rx="8" fill={C.raised} stroke={C.teal} strokeWidth="1.5" />
              <text x="219" y="80" textAnchor="middle" fill={C.teal} fontSize="12" fontFamily="Space Mono,monospace" fontWeight="700">DHT</text>
              <text x="219" y="97" textAnchor="middle" fill={C.teal} fontSize="12" fontFamily="Space Mono,monospace" fontWeight="700">11</text>

              {/* Wi-Fi */}
              <line x1="111" y1="122" x2="111" y2="150" stroke={C.border} strokeWidth="1.5" strokeDasharray="4,3" />
              <text x="111" y="164" textAnchor="middle" fill={C.textLow} fontSize="9" fontFamily="Space Mono,monospace">Wi-Fi → Servidor</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Fluxo */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`,
        borderRadius:"18px", padding:"24px" }}>
        <div style={{ color:C.amber, fontSize:"10px", letterSpacing:"2px",
          fontFamily:"'Space Mono',monospace", marginBottom:"20px" }}>FLUXO DE FUNCIONAMENTO</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))", gap:"12px" }}>
          {steps.map((s,i) => (
            <div key={i} style={{ background:C.bg, borderRadius:"12px", padding:"18px",
              border:`1px solid ${C.border}`, borderTop:`2px solid ${s.col}` }}>
              <div style={{ color:s.col, fontSize:"24px", fontFamily:"'Space Mono',monospace",
                fontWeight:"700", marginBottom:"6px" }}>{s.n}</div>
              <div style={{ color:C.text, fontSize:"13px", fontWeight:"600", marginBottom:"8px" }}>{s.title}</div>
              <div style={{ color:C.textMid, fontSize:"12px", lineHeight:"1.65" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════
//  SEÇÃO: DADOS DO GRUPO
// ══════════════════════════════════════════════════════
function SectionDadosGrupo({ sensor, loading }) {
  const readings = sensor?.readings || [];
  const latest   = readings[readings.length - 1];
  const temps    = readings.map(r => r.temperatura);
  const hums     = readings.map(r => r.umidade);
  const tTrend   = trendOf(readings, "temperatura");
  const hTrend   = trendOf(readings, "umidade");
  const avgT     = avg(temps);
  const avgH     = avg(hums);

  return (
    <section style={{ marginBottom:"60px" }}>
      <SectionHeader icon="📡" title="Dados do Nosso Sensor"
        subtitle={`Sensor #${GROUP_SENSOR_ID} — ${sensor?.local || "carregando..."}`} />
      {loading ? <LoadingState /> : <>

        {/* PAINEL PRINCIPAL */}
        <div style={{
          background:C.surface, border:`1px solid ${C.amber}44`,
          borderRadius:"20px", padding:"28px", marginBottom:"20px",
          boxShadow:`0 0 48px ${C.amberGlow}`,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"26px" }}>
            <div style={{ width:"8px", height:"8px", borderRadius:"50%",
              background:C.green, boxShadow:`0 0 10px ${C.green}`, animation:"pulse 2.5s infinite" }} />
            <span style={{ color:C.green, fontSize:"10px", letterSpacing:"2px",
              fontFamily:"'Space Mono',monospace" }}>AO VIVO</span>
            {latest && (
              <span style={{ color:C.textFaint, fontSize:"10px",
                fontFamily:"'Space Mono',monospace", marginLeft:"auto" }}>
                {latest.data} às {latest.hora}
              </span>
            )}
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", gap:"28px",
            alignItems:"center", justifyContent:"center" }}>
            {latest && (
              <>
                <Gauge value={latest.temperatura} min={10} max={40}
                  color={tempMeta(latest.temperatura).color} label="Temperatura" unit="°C" />
                <Gauge value={latest.umidade} min={0} max={100}
                  color={humMeta(latest.umidade).color} label="Umidade" unit="%" />
              </>
            )}
            <div style={{ flex:1, minWidth:"200px" }}>
              <div style={{ display:"flex", gap:"8px", marginBottom:"8px", flexWrap:"wrap" }}>
                <StatPill label="TEMP MÍN" value={`${temps.length ? Math.min(...temps) : "--"}°C`} color={C.sky} />
                <StatPill label="TEMP MÁX" value={`${temps.length ? Math.max(...temps) : "--"}°C`} color={C.coral} />
                <StatPill label="TENDÊNCIA" value={tTrend.icon} color={tTrend.color} />
              </div>
              <div style={{ display:"flex", gap:"8px", marginBottom:"16px", flexWrap:"wrap" }}>
                <StatPill label="UMID MÍN" value={`${hums.length ? Math.min(...hums) : "--"}%`} color={C.sky} />
                <StatPill label="UMID MÁX" value={`${hums.length ? Math.max(...hums) : "--"}%`} color={C.teal} />
                <StatPill label="TENDÊNCIA" value={hTrend.icon} color={hTrend.color} />
              </div>
              {latest && (
                <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                  <Badge label={tempMeta(latest.temperatura).label}
                    color={tempMeta(latest.temperatura).color}
                    bg={tempMeta(latest.temperatura).bg + "88"} />
                  <Badge label={humMeta(latest.umidade).label}
                    color={humMeta(latest.umidade).color}
                    bg={humMeta(latest.umidade).bg + "88"} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* GRÁFICOS */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"20px" }}>
          <ChartCard title="TEMPERATURA (°C)"
            color={latest ? tempMeta(latest.temperatura).color : C.amber}
            data={temps} avgVal={avgT} unit="°C" />
          <ChartCard title="UMIDADE (%)"
            color={latest ? humMeta(latest.umidade).color : C.teal}
            data={hums} avgVal={avgH} unit="%" />
        </div>

        {/* TABELA */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`,
          borderRadius:"18px", padding:"22px" }}>
          <div style={{ color:C.amber, fontSize:"10px", letterSpacing:"2px",
            fontFamily:"'Space Mono',monospace", marginBottom:"16px" }}>
            HISTÓRICO — ÚLTIMAS 10 MEDIÇÕES
          </div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse",
              fontFamily:"'Space Mono',monospace", fontSize:"12px" }}>
              <thead>
                <tr>
                  {["#","Data","Hora","Temp (°C)","Umidade (%)"].map(h => (
                    <th key={h} style={{ color:C.textLow, padding:"8px 14px",
                      textAlign:"left", borderBottom:`1px solid ${C.border}`,
                      fontWeight:"400", letterSpacing:"1px", fontSize:"10px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...readings].reverse().slice(0,10).map((r,i) => {
                  const tm = tempMeta(r.temperatura);
                  const hm = humMeta(r.umidade);
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${C.bg}` }}>
                      <td style={{ color:C.textFaint, padding:"9px 14px" }}>{i+1}</td>
                      <td style={{ color:C.textMid,   padding:"9px 14px" }}>{r.data}</td>
                      <td style={{ color:C.textMid,   padding:"9px 14px" }}>{r.hora}</td>
                      <td style={{ padding:"9px 14px" }}>
                        <span style={{ color:tm.color, fontWeight:"700" }}>{r.temperatura}</span>
                      </td>
                      <td style={{ padding:"9px 14px" }}>
                        <span style={{ color:hm.color, fontWeight:"700" }}>{r.umidade}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>}
    </section>
  );
}


function ChartCard({ title, color, data, avgVal, unit }) {
  const min = data.length ? Math.min(...data) : 0;
  const max = data.length ? Math.max(...data) : 0;
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`,
      borderRadius:"18px", padding:"20px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px" }}>
        <div style={{ color:C.textLow, fontSize:"10px", letterSpacing:"1.5px",
          fontFamily:"'Space Mono',monospace" }}>{title}</div>
        <div style={{ color, fontSize:"12px", fontFamily:"'Space Mono',monospace",
          fontWeight:"700" }}>méd. {avgVal}{unit}</div>
      </div>
      <Sparkline data={data} color={color} width={220} height={56} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:"8px" }}>
        <span style={{ color:C.textFaint, fontSize:"10px", fontFamily:"'Space Mono',monospace" }}>mín {min}{unit}</span>
        <span style={{ color:C.textFaint, fontSize:"10px", fontFamily:"'Space Mono',monospace" }}>máx {max}{unit}</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  SEÇÃO: TODOS SENSORES
// ══════════════════════════════════════════════════════
function SectionTodosSensores({ sensors, loading, groupSensorId }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = sensors.filter(s =>
  (s.local ?? "").toLowerCase().includes(search.toLowerCase()) ||
  String(s.id ?? "").includes(search)
);

  const hottest  = [...sensors].sort((a,b) => b.temperatura - a.temperatura).slice(0,3);
  const mostHumid = [...sensors].sort((a,b) => b.umidade - a.umidade).slice(0,3);

  return (
    <section style={{ marginBottom:"60px" }}>
      <SectionHeader icon="🌐" title="Todos os Sensores"
        subtitle="24 sensores monitorando os ambientes da escola em tempo real" />

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"24px" }}>
        <RankCard title="🔥 Mais Quentes"  items={hottest}   valueKey="temperatura" unit="°C" colorFn={v => tempMeta(v).color} />
        <RankCard title="💧 Mais Úmidos"   items={mostHumid} valueKey="umidade"     unit="%"  colorFn={v => humMeta(v).color}  />
      </div>

      <div style={{ marginBottom:"20px" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por local ou número do sensor…"
            style={{
            width:"100%", boxSizing:"border-box",
            background:C.surface, border:`1px solid ${C.border}`,
            borderRadius:"12px", padding:"12px 18px",
            color:C.text, fontSize:"13px",
            fontFamily:"'Space Mono',monospace", outline:"none",
          }} />
      </div>

      {loading ? <LoadingState /> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(215px,1fr))", gap:"14px" }}>
          {filtered.map(s => (

            <SensorCard key={s.id} sensor={s}
              isGroup={s.id === groupSensorId} onClick={setSelected} />
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"48px",
              color:C.textLow, fontFamily:"'Space Mono',monospace", fontSize:"12px" }}>
              Nenhum sensor encontrado para "{search}"
            </div>
          )}
        </div>
      )}
      <SensorModal sensor={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function RankCard({ title, items, valueKey, unit, colorFn }) {
  const medals = [C.amber, C.textMid, "#B45309"];
  return (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`,
      borderRadius:"14px", padding:"18px" }}>
      <div style={{ color:C.textMid, fontSize:"10px", letterSpacing:"1.5px",
        fontFamily:"'Space Mono',monospace", marginBottom:"14px" }}>{title}</div>
      {items.map((s,i) => (
        <div key={s.id} style={{ display:"flex", alignItems:"center",
          gap:"12px", marginBottom:"10px" }}>
          <span style={{ color:medals[i], fontFamily:"'Space Mono',monospace",
            fontSize:"12px", width:"16px", fontWeight:"700" }}>{i+1}</span>
          <span style={{ color:C.textMid, fontSize:"12px", flex:1,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.local}</span>
          <span style={{ color:colorFn(s[valueKey]), fontWeight:"700",
            fontFamily:"'Space Mono',monospace", fontSize:"13px", flexShrink:0 }}>
            {s[valueKey]}{unit}
          </span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════
//  APP ROOT
// ══════════════════════════════════════════════════════
const TABS = [
  { id:"grupo",  label:"Grupo",          icon:"👥" },
  { id:"sensor", label:"Sensor",         icon:"🔌" },
  { id:"dados",  label:"Nossos Dados",   icon:"📡" },
  { id:"todos",  label:"Todos Sensores", icon:"🌐" },
];

export default function App() {
  const [tab, setTab]               = useState("grupo");
  const [groupSensor, setGroupSensor] = useState(null);
  const [allSensors, setAllSensors]   = useState([]);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingAll, setLoadingAll]     = useState(true);
  const [lastUpdate, setLastUpdate]     = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [grp, all] = await Promise.all([
        DataService.getGroupSensor(),
        DataService.getAllSensors(),
      ]);
      setGroupSensor(grp);
      setAllSensors(all);
      setLastUpdate(new Date().toLocaleTimeString("pt-BR",
        { hour:"2-digit", minute:"2-digit", second:"2-digit" }));
    } finally {
      setLoadingGroup(false);
      setLoadingAll(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(t);
  }, [fetchData]);

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;}
        body{margin:0;background:${C.bg};}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        input::placeholder{color:${C.textLow};}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:${C.bg};}
        ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}
      `}</style>

      {/* HEADER */}
      <header style={{
        background:`${C.bg}DD`, backdropFilter:"blur(12px)",
        borderBottom:`1px solid ${C.border}`,
        padding:"14px 28px", display:"flex", alignItems:"center",
        justifyContent:"space-between", position:"sticky", top:0, zIndex:100,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{
            width:"38px", height:"38px", borderRadius:"10px",
            background:`linear-gradient(135deg,${C.amberDim},${C.amber}44)`,
            border:`1px solid ${C.amber}66`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"20px", flexShrink:0,
          }}>🌡️</div>
          <div>
            <div style={{ color:C.text, fontFamily:"Georgia,serif",
              fontWeight:"700", fontSize:"16px" }}>IoT Monitor</div>
            <div style={{ color:C.textFaint, fontSize:"9px",
              fontFamily:"'Space Mono',monospace", letterSpacing:"1px" }}>
              MICROPROCESSADORES · PROF. ISRAEL GOMES
            </div>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
          {lastUpdate && (
            <span style={{ color:C.textFaint, fontSize:"10px",
              fontFamily:"'Space Mono',monospace" }}>⟳ {lastUpdate}</span>
          )}
          <div style={{
            display:"flex", alignItems:"center", gap:"7px",
            background:C.surface, border:`1px solid ${C.border}`,
            borderRadius:"20px", padding:"5px 14px",
          }}>
            <div style={{ width:"7px", height:"7px", borderRadius:"50%",
              background:C.green, boxShadow:`0 0 6px ${C.green}`,
              animation:"pulse 2.5s infinite" }} />
            <span style={{ color:C.green, fontSize:"10px",
              fontFamily:"'Space Mono',monospace", letterSpacing:"1px" }}>
              {allSensors.length} ONLINE
            </span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div style={{
        padding:"44px 28px 34px", textAlign:"center",
        borderBottom:`1px solid ${C.border}`,
        background:`radial-gradient(ellipse 70% 60% at 50% -10%,${C.amberGlow},transparent)`,
      }}>
        <div style={{ color:C.amberDim, fontSize:"10px", letterSpacing:"4px",
          fontFamily:"'Space Mono',monospace", marginBottom:"10px" }}>
          MONITORAMENTO AMBIENTAL EM TEMPO REAL
        </div>
        <h1 style={{ color:C.text, fontSize:"clamp(22px,4vw,38px)",
          fontFamily:"Georgia,serif", margin:"0 0 12px", lineHeight:1.2 }}>
          Sistema de Sensores IoT
        </h1>
        <p style={{ color:C.textLow, fontFamily:"'Space Mono',monospace",
          fontSize:"11px", margin:0, letterSpacing:"1px" }}>
          Rafael de Oliveira Sebastião · Kauan Vinicius Sales
        </p>
      </div>

      {/* TABS */}
      <nav style={{
        display:"flex", gap:"6px", padding:"12px 28px",
        background:C.bg, borderBottom:`1px solid ${C.border}`, overflowX:"auto",
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background:   tab === t.id ? C.amber       : "transparent",
            border:       tab === t.id ? "none"         : `1px solid ${C.border}`,
            color:        tab === t.id ? "#1C0A00"      : C.textMid,
            borderRadius:"10px", padding:"8px 20px", cursor:"pointer",
            fontSize:"12px", fontFamily:"'Space Mono',monospace",
            fontWeight:   tab === t.id ? "700"          : "400",
            letterSpacing:"0.5px", whiteSpace:"nowrap",
            transition:"all 0.2s",
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </nav>

      {/* CONTENT */}
      <main style={{ maxWidth:"1100px", margin:"0 auto", padding:"40px 24px" }}>
        {tab === "grupo"  && <SectionGrupo />}
        {tab === "sensor" && <SectionSensor />}
        {tab === "dados"  && <SectionDadosGrupo sensor={groupSensor} loading={loadingGroup} />}
        {tab === "todos"  && <SectionTodosSensores sensors={allSensors}
          loading={loadingAll} groupSensorId={GROUP_SENSOR_ID} />}
      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop:`1px solid ${C.border}`, padding:"18px 28px",
        display:"flex", justifyContent:"space-between",
        alignItems:"center", flexWrap:"wrap", gap:"8px",
      }}>
        <span style={{ color:C.textFaint, fontSize:"10px", fontFamily:"'Space Mono',monospace" }}>
          © 2026 Rafael Sebastião &amp; Kauan Sales · Microprocessadores
        </span>
        <span style={{ color:C.textFaint, fontSize:"10px", fontFamily:"'Space Mono',monospace" }}>
          Auto-refresh: 10 min
        </span>
      </footer>
    </div>
  );
}
