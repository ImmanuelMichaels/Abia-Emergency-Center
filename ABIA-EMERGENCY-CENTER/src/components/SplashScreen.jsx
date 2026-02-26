import { useState, useEffect } from "react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .splash-root {
    position: fixed;
    inset: 0;
    background: linear-gradient(160deg, #001a08 0%, #000d04 50%, #000 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    overflow: hidden;
    font-family: 'Outfit', sans-serif;
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .splash-root.exit {
    opacity: 0;
    transform: scale(1.04);
    pointer-events: none;
  }

  /* Grid overlay */
  .sp-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,200,83,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,200,83,.04) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }

  /* Radial glow */
  .sp-glow {
    position: absolute;
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(0,180,60,.18) 0%, transparent 60%);
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    animation: spBreathe 3.5s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes spBreathe {
    0%,100%{opacity:1;transform:translate(-50%,-50%) scale(1);}
    50%{opacity:.6;transform:translate(-50%,-50%) scale(1.15);}
  }

  /* Nigeria flag strip */
  .sp-flag {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    display: flex;
    animation: fadeIn .4s ease forwards;
  }
  .sp-flag-g { background: #008751; flex: 1; }
  .sp-flag-w { background: #fff; flex: 1; }

  @keyframes fadeIn { from{opacity:0} to{opacity:1} }

  /* Main content */
  .sp-content {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    padding: 0 24px;
  }

  /* Emblem container */
  .sp-emblem-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
    opacity: 0;
    animation: emblemPop 1s cubic-bezier(.34,1.56,.64,1) .3s forwards;
  }
  @keyframes emblemPop {
    from{opacity:0;transform:scale(.5) translateY(20px);}
    to{opacity:1;transform:scale(1) translateY(0);}
  }

  /* Orbit rings */
  .sp-orbit {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(0,200,83,.12);
    animation: spSpin 20s linear infinite;
  }
  .sp-orbit-2 { animation: spSpin 30s linear infinite reverse; border-style: dashed; }
  .sp-orbit-3 { animation: spSpin 50s linear infinite; }
  @keyframes spSpin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

  /* Orbit dot */
  .sp-orbit-dot {
    position: absolute;
    width: 5px; height: 5px;
    background: #00c853;
    border-radius: 50%;
    box-shadow: 0 0 6px #00c853;
    top: -2.5px; left: calc(50% - 2.5px);
  }

  /* Halo pulses */
  .sp-halo {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(0,200,83,.3);
    animation: spHalo 3s ease-out infinite;
  }
  .sp-halo:nth-child(2){animation-delay:1s;border-color:rgba(0,200,83,.15);}
  .sp-halo:nth-child(3){animation-delay:2s;border-color:rgba(0,200,83,.07);}
  @keyframes spHalo {
    0%{width:160px;height:160px;opacity:1;}
    100%{width:320px;height:320px;opacity:0;}
  }

  /* Main circle */
  .sp-circle {
    width: 160px; height: 160px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid rgba(0,200,83,.5);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 0 50px rgba(0,180,60,.4),
      0 0 100px rgba(0,180,60,.15),
      0 0 0 6px rgba(0,200,83,.08),
      0 0 0 12px rgba(0,200,83,.04);
    position: relative;
    z-index: 2;
    overflow: hidden;
  }

  /* Real logo image */
  .sp-logo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    display: block;
  }

  /* Text */
  .sp-text {
    text-align: center;
    opacity: 0;
    animation: spFadeUp .8s ease .85s forwards;
  }
  @keyframes spFadeUp {
    from{opacity:0;transform:translateY(18px);}
    to{opacity:1;transform:translateY(0);}
  }
  .sp-eyebrow {
    font-size: 10px;
    letter-spacing: .3em;
    text-transform: uppercase;
    color: rgba(0,200,83,.65);
    margin-bottom: 8px;
  }
  .sp-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(22px, 6vw, 36px);
    font-weight: 700;
    color: #fff;
    line-height: 1.15;
    letter-spacing: .04em;
    margin-bottom: 6px;
    text-shadow: 0 0 40px rgba(0,200,83,.25);
  }
  .sp-sub {
    font-size: 11px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(255,255,255,.3);
    margin-bottom: 48px;
  }

  /* Progress track */
  .sp-progress-wrap {
    width: min(280px, 80vw);
    opacity: 0;
    animation: spFadeUp .5s ease 1.0s forwards;
  }
  .sp-progress-track {
    height: 2px;
    background: rgba(255,255,255,.07);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  .sp-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00c853, #69f0ae);
    border-radius: 2px;
    transition: width .35s ease;
    box-shadow: 0 0 8px rgba(0,200,83,.5);
    position: relative;
  }
  .sp-progress-fill::after {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 16px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.5));
  }
  .sp-progress-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: rgba(255,255,255,.25);
    letter-spacing: .08em;
  }
  .sp-progress-pct {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: rgba(0,200,83,.7);
  }
  .sp-progress-status {
    font-size: 10px;
    color: rgba(0,200,83,.5);
    letter-spacing: .06em;
  }

  /* Bottom */
  .sp-bottom {
    position: absolute;
    bottom: max(28px, env(safe-area-inset-bottom, 28px));
    text-align: center;
    opacity: 0;
    animation: spFadeUp .5s ease 1.1s forwards;
  }
  .sp-motto {
    font-size: 9px;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: rgba(255,255,255,.15);
    margin-bottom: 6px;
  }
  .sp-sos {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 10px;
    color: rgba(255,80,80,.55);
    letter-spacing: .1em;
  }
  .sp-sos-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: rgba(255,80,80,.6);
    animation: sosBlink 1.2s ease-in-out infinite;
  }
  @keyframes sosBlink{0%,100%{opacity:1;}50%{opacity:.15;}}
`;

const STATUS_MSGS = [
  "Connecting to Abia State Network…",
  "Loading 17 LGA Databases…",
  "Initialising 12 Agency Contacts…",
  "Loading NAPTIP & Legal Aid Data…",
  "Setting Up Emergency Lines…",
  "All Systems Ready ✓",
];

// Real Abia State Government Logo
function AbiaLogo() {
  return (
    <img
      className="sp-logo-img"
      src="/icons/abia-logo.jpg"
      alt="Government of Abia State Seal"
      draggable={false}
    />
  );
}

export default function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const progressSteps = [
      [8, 400], [20, 800], [38, 1200], [55, 1600],
      [72, 2000], [88, 2400], [97, 2800], [100, 3100]
    ];
    const msgSteps = [0, 1, 2, 3, 4, 5].map((m, i) => [m, 400 + i * 450]);

    progressSteps.forEach(([p, d]) => setTimeout(() => setProgress(p), d));
    msgSteps.forEach(([m, d]) => setTimeout(() => setMsgIdx(m), d));

    setTimeout(() => {
      setExiting(true);
      setTimeout(onDone, 650);
    }, 3600);
  }, [onDone]);

  const orbitSizes = [200, 250, 300];

  return (
    <>
      <style>{S}</style>
      <div className={`splash-root${exiting ? " exit" : ""}`}>
        <div className="sp-grid" />
        <div className="sp-glow" />
        <div className="sp-flag">
          <div className="sp-flag-g"/><div className="sp-flag-w"/><div className="sp-flag-g"/>
        </div>

        <div className="sp-content">
          {/* Emblem */}
          <div className="sp-emblem-wrap">
            {orbitSizes.map((size, i) => (
              <div key={i} className={`sp-orbit sp-orbit-${i+1}`}
                style={{ width: size, height: size }}>
                {i === 0 && <div className="sp-orbit-dot" />}
              </div>
            ))}
            <div className="sp-halo" />
            <div className="sp-halo" />
            <div className="sp-halo" />
            <div className="sp-circle">
              <AbiaLogo />
            </div>
          </div>

          {/* Text */}
          <div className="sp-text">
            <div className="sp-eyebrow">Government of Abia State · Nigeria</div>
            <div className="sp-title">ABIA STATE<br />EMERGENCY</div>
            <div className="sp-sub">Quick Response Contact System</div>

            {/* Progress */}
            <div className="sp-progress-wrap">
              <div className="sp-progress-track">
                <div className="sp-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div className="sp-progress-label">
                <span className="sp-progress-status">{STATUS_MSGS[msgIdx]}</span>
                <span className="sp-progress-pct">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sp-bottom">
          <div className="sp-motto">God's Own State · Est. 1991 · 17 LGAs</div>
          <div className="sp-sos">
            <span className="sp-sos-dot" />
            National Emergency: 112
            <span className="sp-sos-dot" style={{ animationDelay: '.5s' }} />
          </div>
        </div>
      </div>
    </>
  );
}
