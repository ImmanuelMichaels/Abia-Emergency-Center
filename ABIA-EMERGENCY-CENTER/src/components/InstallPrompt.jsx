import { useState, useEffect } from "react";

const S = `
  .install-banner {
    position: fixed;
    bottom: max(16px, env(safe-area-inset-bottom, 16px));
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    width: calc(100% - 32px);
    max-width: 420px;
    background: linear-gradient(135deg, #051a0b, #031208);
    border: 1px solid rgba(0,200,83,.3);
    border-radius: 16px;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    z-index: 8888;
    box-shadow: 0 8px 40px rgba(0,0,0,.7), 0 0 20px rgba(0,200,83,.08);
    transition: transform .45s cubic-bezier(.34,1.3,.64,1), opacity .3s ease;
    opacity: 0;
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }
  .install-banner.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
  .install-banner.hide {
    transform: translateX(-50%) translateY(120px);
    opacity: 0;
  }
  .ib-icon {
    width: 48px; height: 48px;
    border-radius: 12px;
    background: linear-gradient(145deg, #003d18, #001208);
    border: 1px solid rgba(0,200,83,.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .ib-text { flex: 1; }
  .ib-title {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 2px;
    letter-spacing: .01em;
  }
  .ib-sub {
    font-size: 11px;
    color: rgba(255,255,255,.4);
    letter-spacing: .02em;
  }
  .ib-btn-wrap {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ib-install {
    background: #00c853;
    color: #000;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: .06em;
    white-space: nowrap;
    transition: background .2s;
  }
  .ib-install:hover { background: #00e676; }
  .ib-dismiss {
    background: transparent;
    color: rgba(255,255,255,.3);
    border: none;
    font-family: inherit;
    font-size: 10px;
    cursor: pointer;
    text-align: center;
    letter-spacing: .06em;
    padding: 2px;
  }
  .ib-dismiss:hover { color: rgba(255,255,255,.6); }

  /* iOS guide banner */
  .ios-banner {
    position: fixed;
    bottom: max(16px, env(safe-area-inset-bottom, 16px));
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    width: calc(100% - 32px);
    max-width: 380px;
    background: linear-gradient(135deg, #051a0b, #031208);
    border: 1px solid rgba(0,200,83,.25);
    border-radius: 16px;
    padding: 18px;
    z-index: 8888;
    box-shadow: 0 8px 40px rgba(0,0,0,.7);
    transition: transform .45s cubic-bezier(.34,1.3,.64,1), opacity .3s ease;
    opacity: 0;
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }
  .ios-banner.show { transform: translateX(-50%) translateY(0); opacity: 1; }
  .ios-banner.hide { transform: translateX(-50%) translateY(120px); opacity: 0; }
  .ios-title {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ios-steps {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }
  .ios-step {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 12px;
    color: rgba(255,255,255,.6);
    line-height: 1.4;
  }
  .ios-step-n {
    width: 18px; height: 18px;
    border-radius: 50%;
    background: rgba(0,200,83,.15);
    border: 1px solid rgba(0,200,83,.3);
    color: #00c853;
    font-size: 10px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .ios-dismiss {
    background: rgba(255,255,255,.06);
    color: rgba(255,255,255,.5);
    border: none;
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    font-family: inherit;
    font-size: 11px;
    cursor: pointer;
    letter-spacing: .06em;
  }
`;

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    // Detect iOS (Safari)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    if (ios) {
      // Show iOS guide after 4s (after splash is gone)
      const dismissed = sessionStorage.getItem('ios-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShow(true), 4200);
      }
      return;
    }

    // Android/Desktop — capture install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show after splash is done
      setTimeout(() => setShow(true), 4200);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    dismiss();
  };

  const dismiss = () => {
    setHiding(true);
    if (isIOS) sessionStorage.setItem('ios-install-dismissed', '1');
    setTimeout(() => setShow(false), 400);
  };

  if (isStandalone || !show) return null;

  if (isIOS) {
    return (
      <>
        <style>{S}</style>
        <div className={`ios-banner ${show && !hiding ? 'show' : 'hide'}`}>
          <div className="ios-title">
            <span>📲 Add to Home Screen</span>
            <button className="ib-dismiss" onClick={dismiss}>✕</button>
          </div>
          <div className="ios-steps">
            <div className="ios-step">
              <div className="ios-step-n">1</div>
              <span>Tap the <strong style={{color:'#fff'}}>Share</strong> button at the bottom of your browser (the box with an arrow)</span>
            </div>
            <div className="ios-step">
              <div className="ios-step-n">2</div>
              <span>Scroll down and tap <strong style={{color:'#fff'}}>"Add to Home Screen"</strong></span>
            </div>
            <div className="ios-step">
              <div className="ios-step-n">3</div>
              <span>Tap <strong style={{color:'#fff'}}>"Add"</strong> — the app will appear on your home screen like a native app</span>
            </div>
          </div>
          <button className="ios-dismiss" onClick={dismiss}>Dismiss</button>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{S}</style>
      <div className={`install-banner ${show && !hiding ? 'show' : 'hide'}`}>
        <div className="ib-icon">🛡️</div>
        <div className="ib-text">
          <div className="ib-title">Install Abia Emergency</div>
          <div className="ib-sub">Works offline · No app store needed</div>
        </div>
        <div className="ib-btn-wrap">
          <button className="ib-install" onClick={handleInstall}>Install</button>
          <button className="ib-dismiss" onClick={dismiss}>Not now</button>
        </div>
      </div>
    </>
  );
}
