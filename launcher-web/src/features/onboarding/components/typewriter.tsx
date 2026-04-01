import { useState, useEffect, useRef } from "react";

const TITLES = [
  "Let's deploy your next server",
  "Need a VPS in Barcelona?",
  "I'll handle the infrastructure",
  "What are we building today?",
  "Your cloud, one conversation away",
];

export function Typewriter() {
  const [text, setText] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const phase = useRef<"typing" | "pausing" | "deleting">("typing");
  const charIndex = useRef(0);

  useEffect(() => {
    const title = TITLES[titleIndex];
    let timeout: ReturnType<typeof setTimeout>;

    function tick() {
      if (phase.current === "typing") {
        charIndex.current++;
        setText(title.slice(0, charIndex.current));
        if (charIndex.current === title.length) {
          phase.current = "pausing";
          timeout = setTimeout(tick, 2000);
        } else {
          timeout = setTimeout(tick, 60);
        }
      } else if (phase.current === "pausing") {
        phase.current = "deleting";
        timeout = setTimeout(tick, 30);
      } else {
        charIndex.current--;
        setText(title.slice(0, charIndex.current));
        if (charIndex.current === 0) {
          phase.current = "typing";
          setTitleIndex((i) => (i + 1) % TITLES.length);
        } else {
          timeout = setTimeout(tick, 30);
        }
      }
    }

    timeout = setTimeout(tick, 60);
    return () => clearTimeout(timeout);
  }, [titleIndex]);

  return (
    <>
      {text}
      <span className="inline-block w-[2px] h-[1.2em] bg-foreground align-text-bottom ml-0.5 animate-pulse" />
    </>
  );
}
