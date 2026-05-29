export default function ComingSoonPage() {
  return (
    <>
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.97); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-40px, 25px) scale(1.08); }
          70% { transform: translate(20px, -15px) scale(0.95); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes drawLine {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .anim-fade-up-1 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .anim-fade-up-2 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both; }
        .anim-fade-up-3 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.5s both; }
        .anim-fade-up-4 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.7s both; }
        .anim-fade-up-5 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.9s both; }
        .anim-fade-up-6 { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 1.1s both; }

        .line-draw {
          transform-origin: left center;
          animation: drawLine 1.2s cubic-bezier(0.22,1,0.36,1) 0.6s both;
        }

        .headline-shimmer {
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #ffffff 35%,
            #7eb8f7 50%,
            #ffffff 65%,
            #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 5s linear 1.5s infinite;
        }

        .orb-1 {
          animation: drift 18s ease-in-out infinite;
        }
        .orb-2 {
          animation: drift2 22s ease-in-out infinite;
        }

        .social-link {
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
        }
        .social-link:hover {
          transform: translateY(-3px) scale(1.15);
          opacity: 1 !important;
        }

        .ring-spin {
          animation: rotateSlow 20s linear infinite;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#071E3A",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "var(--font-manrope, sans-serif)",
        }}
      >
        {/* Atmospheric orbs */}
        <div
          className="orb-1"
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 40% 40%, rgba(29,111,209,0.18) 0%, rgba(11,61,117,0.10) 50%, transparent 75%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div
          className="orb-2"
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "-8%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 60% 60%, rgba(29,111,209,0.14) 0%, rgba(11,61,117,0.07) 50%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        {/* Spinning ring decoration */}
        <div
          className="ring-spin"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-300px",
            marginLeft: "-300px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            border: "1px solid rgba(29,111,209,0.08)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-200px",
            marginLeft: "-200px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            border: "1px solid rgba(29,111,209,0.05)",
            pointerEvents: "none",
          }}
        />

        {/* Main content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "2rem 1.5rem",
            maxWidth: "680px",
            width: "100%",
          }}
        >
          {/* Logo */}
          <div className="anim-fade-up-1" style={{ marginBottom: "3rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Algarve TV Paradise"
              style={{ height: "56px", width: "auto", objectFit: "contain" }}
            />
          </div>

          {/* Decorative line top */}
          <div
            className="line-draw"
            style={{
              width: "48px",
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, #1D6FD1, transparent)",
              marginBottom: "2rem",
            }}
          />

          {/* Em Breve headline */}
          <h1
            className="anim-fade-up-2 headline-shimmer"
            style={{
              fontFamily: "var(--font-space-grotesk, serif)",
              fontSize: "clamp(3.5rem, 10vw, 7rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: "1.5rem",
            }}
          >
            Em Breve
          </h1>

          {/* Subtitle */}
          <p
            className="anim-fade-up-3"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              color: "rgba(255,255,255,0.75)",
              letterSpacing: "0.01em",
              lineHeight: 1.6,
              marginBottom: "0.75rem",
            }}
          >
            Estamos a preparar algo incrível para si.
          </p>

          {/* Tagline */}
          <p
            className="anim-fade-up-4"
            style={{
              fontSize: "clamp(0.8rem, 1.8vw, 0.9rem)",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "var(--font-plex-mono, monospace)",
              marginBottom: "3rem",
            }}
          >
            Tudo o que acontece no Algarve, num só lugar.
          </p>

          {/* Decorative line bottom */}
          <div
            className="line-draw"
            style={{
              width: "48px",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
              marginBottom: "3rem",
            }}
          />

          {/* Social links */}
          <div
            className="anim-fade-up-5"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.75rem",
            }}
          >
            {/* Instagram */}
            <a
              href="https://instagram.com/algarveparadisemedia"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Instagram"
              style={{ opacity: 0.55, color: "white", display: "flex" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.75"/>
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.75"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/algarveparadisemedia"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Facebook"
              style={{ opacity: 0.55, color: "white", display: "flex" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@algarveparadisemedia"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="YouTube"
              style={{ opacity: 0.55, color: "white", display: "flex" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright footer */}
        <div
          className="anim-fade-up-6"
          style={{
            position: "absolute",
            bottom: "2rem",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.22)",
              letterSpacing: "0.1em",
              fontFamily: "var(--font-plex-mono, monospace)",
            }}
          >
            © 2025 Algarve TV Paradise
          </span>
        </div>
      </div>
    </>
  );
}
