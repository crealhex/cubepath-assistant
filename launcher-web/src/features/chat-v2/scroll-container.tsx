import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";

interface ScrollContainerProps {
  children: ReactNode;
  /** Increments each time user sends a message — triggers pin-to-top scroll */
  scrollTrigger?: number;
  /** Ref to the element to pin to the top of the viewport on send */
  pinRef?: RefObject<HTMLElement | null>;
  /** Whether the assistant is currently streaming — drives spacer reactivity */
  isStreaming?: boolean;
  /** Called when scroll position changes — true means content is below the fold */
  onCanScrollDown?: (canScroll: boolean) => void;
  /** Exposed ref to the scroll container for external scrollTo calls */
  containerRef?: RefObject<HTMLDivElement | null>;
}

export function ScrollContainer({
  children,
  scrollTrigger = 0,
  pinRef,
  isStreaming = false,
  onCanScrollDown,
  containerRef: externalRef,
}: ScrollContainerProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const containerRef = externalRef ?? internalRef;
  const contentRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  function pinToTopOnSend() {
    if (scrollTrigger === 0) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const container = containerRef.current;
        const el = pinRef?.current;
        const content = contentRef.current;
        if (!container || !el || !content) return;

        const elRect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const target = elRect.top - containerRect.top + container.scrollTop;
        const gap = parseInt(getComputedStyle(content).paddingTop) || 24;
        container.scrollTo({ top: target - gap, behavior: "smooth" });
      });
    });
  }

  function updateSpacer() {
    const container = containerRef.current;
    const spacer = spacerRef.current;
    const el = pinRef?.current;
    const content = contentRef.current;
    if (!container || !spacer || !content) return;

    const currentSpacerH = spacer.offsetHeight;
    const realContentH = content.scrollHeight - currentSpacerH;
    const userOffset = el ? el.offsetTop - content.offsetTop : 0;
    const belowUserH = realContentH - userOffset;
    const needed = Math.max(0, container.clientHeight - belowUserH);
    spacer.style.minHeight = `${needed}px`;
  }

  function trackScrollPosition() {
    const container = containerRef.current;
    const spacer = spacerRef.current;
    if (!container || !onCanScrollDown) return;
    const check = () => {
      const spacerH = spacer?.offsetHeight ?? 0;
      const realContentBottom = container.scrollHeight - spacerH;
      const viewBottom = container.scrollTop + container.clientHeight;
      onCanScrollDown(realContentBottom - viewBottom > 100);
    };
    check();
    container.addEventListener("scroll", check, { passive: true });
    return () => container.removeEventListener("scroll", check);
  }

  useEffect(pinToTopOnSend, [scrollTrigger]);
  useLayoutEffect(updateSpacer);
  useEffect(trackScrollPosition, [isStreaming, scrollTrigger]);

  return (
    <div ref={containerRef} className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex-1" />
      <div ref={contentRef} className="mx-auto flex w-full max-w-[720px] flex-col gap-6 px-4 py-6 md:px-0">
        {children}
        <div ref={spacerRef} />
      </div>
    </div>
  );
}
