import { useState } from "react";
import { Button } from "cubepath-ui";
import { Sun, Moon } from "lucide-react";

const PATHS = [
  "M1147 3056 c-125 -73 -232 -137 -237 -142 -6 -6 38 -37 123 -86 72 -42 380 -219 682 -393 303 -174 553 -322 557 -328 4 -7 8 -162 8 -345 0 -184 4 -332 8 -330 4 2 112 63 240 137 l232 134 0 346 0 346 -313 179 c-171 99 -482 278 -689 398 -208 120 -379 218 -380 217 -2 0 -105 -60 -231 -133z",
  "M293 2563 l-292 -168 0 -800 0 -800 197 -112 c108 -62 215 -124 238 -138 l41 -24 6 322 c4 177 7 536 7 797 l0 475 58 32 c105 59 487 281 506 295 18 13 0 25 -218 151 -131 75 -241 137 -245 137 -3 0 -138 -75 -298 -167z",
  "M1103 2122 c-150 -86 -273 -159 -273 -163 0 -3 124 -76 276 -162 l276 -158 141 82 c78 45 202 116 274 158 73 42 133 78 133 81 0 5 -544 320 -551 320 -2 -1 -127 -72 -276 -158z",
  "M1695 1720 l-270 -157 -3 -303 c-1 -167 1 -307 6 -312 4 -4 102 47 217 113 116 67 235 135 265 152 30 17 58 36 62 41 4 6 8 144 8 306 0 162 -4 300 -8 306 -4 7 -100 -43 -277 -146z",
  "M790 1560 l0 -310 23 -14 c56 -35 496 -286 511 -292 15 -6 16 18 14 307 l-3 314 -265 152 c-146 84 -268 153 -272 153 -5 0 -8 -139 -8 -310z",
  "M2505 1213 c-235 -137 -369 -215 -907 -525 l-217 -126 -293 169 c-161 93 -296 169 -300 169 -4 0 -9 -124 -10 -275 l-3 -276 303 -174 304 -174 331 191 c530 306 742 428 899 519 l148 84 0 283 c0 155 -1 282 -2 281 -2 0 -115 -66 -253 -146z",
];

function CubeSvg({ children }: { children: (paths: string[]) => React.ReactNode }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 276 319" className="size-16">
      <g transform="translate(0,319) scale(0.1,-0.1)" fill="#55E200" stroke="none">
        {children(PATHS)}
      </g>
    </svg>
  );
}

// --- 1. Staggered Entrance ---
function StaggeredEntrance() {
  return (
    <CubeSvg>
      {(paths) =>
        paths.map((d, i) => (
          <path
            key={i}
            d={d}
            style={{
              opacity: 0,
              animation: `stagger-fade-in 0.5s ease-out ${i * 0.15}s forwards`,
            }}
          />
        ))
      }
    </CubeSvg>
  );
}

// --- 2. Staggered Breathe ---
function StaggeredBreathe() {
  return (
    <CubeSvg>
      {(paths) =>
        paths.map((d, i) => (
          <path
            key={i}
            d={d}
            style={{
              transformOrigin: "center",
              transformBox: "fill-box",
              animation: `stagger-breathe 3s ease-in-out ${i * 0.3}s infinite`,
            }}
          />
        ))
      }
    </CubeSvg>
  );
}

// --- 3. Draw-In ---
function DrawIn() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 276 319" className="size-16">
      <g transform="translate(0,319) scale(0.1,-0.1)" fill="none" stroke="#55E200" strokeWidth="40">
        {PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            style={{
              strokeDasharray: 5000,
              strokeDashoffset: 5000,
              animation: `draw-in 1.2s ease-in-out ${i * 0.2}s forwards, draw-fill 0.4s ease-in ${0.8 + i * 0.2}s forwards`,
            }}
          />
        ))}
      </g>
    </svg>
  );
}

// --- 4. Assemble from Scatter ---
const SCATTER_OFFSETS = [
  { x: 0, y: -800 },
  { x: -600, y: -300 },
  { x: 0, y: -400 },
  { x: 600, y: -200 },
  { x: -600, y: 200 },
  { x: 600, y: 400 },
];

function AssembleScatter() {
  return (
    <CubeSvg>
      {(paths) =>
        paths.map((d, i) => (
          <path
            key={i}
            d={d}
            style={{
              opacity: 0,
              animation: `scatter-assemble-${i} 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s forwards`,
            }}
          />
        ))
      }
    </CubeSvg>
  );
}

// --- 5. Explode & Reform (loop) ---
const EXPLODE_OFFSETS = [
  { x: 0, y: -300, r: -15 },
  { x: -250, y: -100, r: 20 },
  { x: 0, y: -200, r: -10 },
  { x: 280, y: -80, r: -25 },
  { x: -260, y: 150, r: 15 },
  { x: 300, y: 200, r: -20 },
];

function ExplodeReform() {
  return (
    <CubeSvg>
      {(paths) =>
        paths.map((d, i) => (
          <path
            key={i}
            d={d}
            style={{
              transformOrigin: "center",
              transformBox: "fill-box",
              animation: `explode-reform-${i} 3.5s cubic-bezier(0.22,1,0.36,1) infinite`,
            }}
          />
        ))
      }
    </CubeSvg>
  );
}

// --- 6. Domino Cascade (loop) ---
function DominoCascade() {
  return (
    <CubeSvg>
      {(paths) =>
        paths.map((d, i) => (
          <path
            key={i}
            d={d}
            style={{
              transformOrigin: "bottom center",
              transformBox: "fill-box",
              animation: `domino-tilt 2.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.15}s infinite`,
            }}
          />
        ))
      }
    </CubeSvg>
  );
}

// --- 7. Float Apart (loop) ---
const FLOAT_OFFSETS = [
  { x: 0, y: -120 },
  { x: -100, y: -50 },
  { x: 0, y: -80 },
  { x: 100, y: -30 },
  { x: -100, y: 40 },
  { x: 100, y: 80 },
];

function FloatApart() {
  return (
    <CubeSvg>
      {(paths) =>
        paths.map((d, i) => (
          <path
            key={i}
            d={d}
            style={{
              animation: `float-apart-${i} 4s cubic-bezier(0.4,0,0.2,1) infinite`,
            }}
          />
        ))
      }
    </CubeSvg>
  );
}

// --- 8. Elastic Snap (loop) ---
// Outer faces: 0 (top-right), 1 (left), 5 (bottom) — large panels
// Inner faces: 2 (top cap), 3 (right inner), 4 (left inner) — small center panels
const OUTER_FACES = new Set([0, 1, 5]);

function ElasticSnap() {
  return (
    <CubeSvg>
      {(paths) =>
        paths.map((d, i) => (
          <path
            key={i}
            d={d}
            style={{
              transformOrigin: "center",
              transformBox: "fill-box",
              animation: `${OUTER_FACES.has(i) ? "elastic-snap-outer" : "elastic-snap"} 2.8s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.12}s infinite`,
            }}
          />
        ))
      }
    </CubeSvg>
  );
}

// --- Showcase Page ---
export default function LogoShowcase() {
  const [resetKey, setResetKey] = useState(0);
  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-12 bg-background p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Logo Animation Candidates</h1>

      <div className="grid grid-cols-4 gap-12" key={resetKey}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-[logo-levitate_1s_ease-out_both]">
            <StaggeredEntrance />
          </div>
          <span className="text-sm text-muted-foreground font-medium">1. Staggered Entrance</span>
          <span className="text-2xs text-muted-foreground/60 max-w-48 text-center">Each face fades in one by one, assembling the cube</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="animate-[logo-levitate_1s_ease-out_both]">
            <StaggeredBreathe />
          </div>
          <span className="text-sm text-muted-foreground font-medium">2. Staggered Breathe</span>
          <span className="text-2xs text-muted-foreground/60 max-w-48 text-center">Each face pulses out of phase, living cube effect</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="animate-[logo-levitate_1s_ease-out_both]">
            <DrawIn />
          </div>
          <span className="text-sm text-muted-foreground font-medium">3. Draw-In</span>
          <span className="text-2xs text-muted-foreground/60 max-w-48 text-center">Paths trace themselves then fill with color</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="animate-[logo-levitate_1s_ease-out_both]">
            <AssembleScatter />
          </div>
          <span className="text-sm text-muted-foreground font-medium">4. Assemble from Scatter</span>
          <span className="text-2xs text-muted-foreground/60 max-w-48 text-center">Faces fly in from scattered positions and converge</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <ExplodeReform />
          <span className="text-sm text-muted-foreground font-medium">5. Explode & Reform</span>
          <span className="text-2xs text-muted-foreground/60 max-w-48 text-center">Faces scatter outward with rotation then snap back together</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <DominoCascade />
          <span className="text-sm text-muted-foreground font-medium">6. Domino Cascade</span>
          <span className="text-2xs text-muted-foreground/60 max-w-48 text-center">Faces tip over in sequence like falling dominoes</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <FloatApart />
          <span className="text-sm text-muted-foreground font-medium">7. Float Apart</span>
          <span className="text-2xs text-muted-foreground/60 max-w-48 text-center">Faces drift apart then converge back together</span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <ElasticSnap />
          <span className="text-sm text-muted-foreground font-medium">8. Elastic Snap</span>
          <span className="text-2xs text-muted-foreground/60 max-w-48 text-center">Faces stretch outward and snap back with elastic overshoot</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={() => setResetKey((k) => k + 1)}>
          Replay All
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { setDark(!dark); document.documentElement.classList.toggle("dark"); }}
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>

      <style>{`
        @keyframes stagger-fade-in {
          from { opacity: 0; transform: translateY(-60px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes stagger-breathe {
          0%, 100% { opacity: 0.7; transform: scale(0.97); }
          50% { opacity: 1; transform: scale(1.03); }
        }

        @keyframes draw-in {
          to { stroke-dashoffset: 0; }
        }

        @keyframes draw-fill {
          to { fill: #55E200; stroke-width: 0; }
        }

        ${SCATTER_OFFSETS.map(
          (offset, i) => `
        @keyframes scatter-assemble-${i} {
          from {
            opacity: 0;
            transform: translate(${offset.x}px, ${offset.y}px) scale(0.6);
          }
          to {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
        }`
        ).join("\n")}

        ${EXPLODE_OFFSETS.map(
          (offset, i) => `
        @keyframes explode-reform-${i} {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          35% { transform: translate(${offset.x}px, ${offset.y}px) rotate(${offset.r}deg); }
          55% { transform: translate(${offset.x}px, ${offset.y}px) rotate(${offset.r}deg); }
          90% { transform: translate(0, 0) rotate(0deg); }
        }`
        ).join("\n")}

        @keyframes domino-tilt {
          0%, 100% { transform: rotateX(0deg); }
          20% { transform: rotateX(-70deg); }
          40% { transform: rotateX(10deg); }
          50% { transform: rotateX(0deg); }
        }

        ${FLOAT_OFFSETS.map(
          (offset, i) => `
        @keyframes float-apart-${i} {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${offset.x}px, ${offset.y}px); }
        }`
        ).join("\n")}

        @keyframes elastic-snap {
          0%, 100% { transform: scale(1) translate(0, 0); }
          30% { transform: scale(1.08) translate(0, -12px); }
          50% { transform: scale(0.95) translate(0, 6px); }
          70% { transform: scale(1.03) translate(0, -3px); }
          85% { transform: scale(0.99) translate(0, 1px); }
        }

        @keyframes elastic-snap-outer {
          0%, 100% { transform: scale(1) translate(0, 0); }
          30% { transform: scale(1.08) translate(0, -12px); }
          50% { transform: scale(0.82) translate(0, 8px); }
          70% { transform: scale(1.03) translate(0, -3px); }
          85% { transform: scale(0.95) translate(0, 2px); }
        }
      `}</style>
    </div>
  );
}
