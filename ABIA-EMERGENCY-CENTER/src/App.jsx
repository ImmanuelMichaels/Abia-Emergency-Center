import { useState } from "react";
import SplashScreen from "./components/SplashScreen.jsx";
import AbiaStateEmergencyApp from "./components/AbiaStateEmergencyApp.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {/* Splash screen — shown until loading sequence completes */}
      {!splashDone && (
        <SplashScreen onDone={() => setSplashDone(true)} />
      )}

      {/* Main app — rendered immediately (invisible behind splash), fully mounted when splash exits */}
      <div style={{
        opacity: splashDone ? 1 : 0,
        transition: 'opacity 0.4s ease',
        minHeight: '100dvh',
      }}>
        <AbiaStateEmergencyApp />
      </div>

      {/* PWA Install Prompt — appears after splash is done */}
      <InstallPrompt />
    </>
  );
}
