import { useState } from "react";
import { Button } from "cubepath-ui";
import { X, ChevronLeft, ChevronRight, ArrowRight, Pencil } from "lucide-react";
import type { QuestionnaireProps } from "./types";

export function Questionnaire({ questions, onComplete, onDismiss }: QuestionnaireProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customInput, setCustomInput] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const current = questions[currentIndex];
  if (!current) return null;

  const total = questions.length;
  const key = current.question;

  function selectOption(value: string) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setCustomInput("");
    setShowCustom(false);
    advance(next);
  }

  function submitCustom() {
    if (!customInput.trim()) return;
    const next = { ...answers, [key]: customInput.trim() };
    setAnswers(next);
    setCustomInput("");
    setShowCustom(false);
    advance(next);
  }

  function skip() {
    setShowCustom(false);
    setCustomInput("");
    advance(answers);
  }

  function advance(currentAnswers: Record<string, string>) {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(currentAnswers);
    }
  }

  function goBack() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowCustom(false);
      setCustomInput("");
    }
  }

  function goForward() {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowCustom(false);
      setCustomInput("");
    }
  }

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 mx-auto max-w-[720px] pointer-events-auto">
      <div className="rounded-2xl border border-border bg-background shadow-xl dark:shadow-none p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-medium flex-1 pr-4">{current.question}</span>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 text-2xs text-muted-foreground">
              <button onClick={goBack} disabled={currentIndex === 0} className="p-0.5 hover:text-foreground disabled:opacity-30">
                <ChevronLeft className="size-3.5" />
              </button>
              <span>{currentIndex + 1} of {total}</span>
              <button onClick={goForward} disabled={currentIndex === total - 1} className="p-0.5 hover:text-foreground disabled:opacity-30">
                <ChevronRight className="size-3.5" />
              </button>
            </div>
            <button onClick={onDismiss} className="p-1 text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-1.5">
          {current.options.map((option, i) => {
            const isSelected = answers[key] === option;
            return (
              <button
                key={i}
                onClick={() => selectOption(option)}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-all hover:border-primary/40 ${
                  isSelected ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <span className={`flex size-6 shrink-0 items-center justify-center rounded-md text-2xs font-medium ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                <span className="flex-1">{option}</span>
                {isSelected && <ArrowRight className="size-3.5 text-primary" />}
              </button>
            );
          })}
        </div>

        {/* Custom input + Skip */}
        <div className="flex items-center gap-2 mt-3">
          {showCustom ? (
            <form
              onSubmit={(e) => { e.preventDefault(); submitCustom(); }}
              className="flex flex-1 items-center gap-2"
            >
              <input
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type your answer..."
                autoFocus
                className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-ring"
              />
              <Button size="sm" type="submit" disabled={!customInput.trim()}>
                Send
              </Button>
            </form>
          ) : (
            <button
              onClick={() => setShowCustom(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Pencil className="size-3.5" />
              <span>Something else</span>
            </button>
          )}
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={skip} className="text-muted-foreground">
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}
