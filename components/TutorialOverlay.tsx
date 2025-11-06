import React, { useEffect, useState } from 'react';
import { TUTORIAL_STEPS } from './tutorialSteps';

interface TutorialOverlayProps {
  step: number;
  onNext: () => void;
  onComplete: () => void;
  activePage: string;
  setActivePage: (page: any) => void;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  step,
  onNext,
  onComplete,
  activePage,
  setActivePage,
}) => {
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const currentStep = TUTORIAL_STEPS[step];

  useEffect(() => {
    // Auto navigate if needed
    if (currentStep?.autoNavigate && currentStep.requiresClick === false) {
      setTimeout(() => {
        setActivePage(currentStep.autoNavigate!);
      }, 100);
    }
  }, [step]);

  useEffect(() => {
    if (!currentStep) return;

    // Navigate to required page if not there
    if (currentStep.targetPage !== activePage) {
      if (!currentStep.requiresClick) {
        setActivePage(currentStep.targetPage);
      }
    }

    // Update highlight position
    updateHighlight();

    const interval = setInterval(updateHighlight, 100);
    return () => clearInterval(interval);
  }, [step, activePage, currentStep]);

  const updateHighlight = () => {
    if (!currentStep?.targetElement) {
      setHighlightRect(null);
      return;
    }

    const element = document.querySelector(currentStep.targetElement);
    if (element) {
      const rect = element.getBoundingClientRect();
      setHighlightRect(rect);

      // Calculate tooltip position
      calculateTooltipPosition(rect);
    } else {
      setHighlightRect(null);
    }
  };

  const calculateTooltipPosition = (rect: DOMRect) => {
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const padding = 20;

    let top = 0;
    let left = 0;

    switch (currentStep.position) {
      case 'top':
        top = rect.top - tooltipHeight - padding;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + padding;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - padding;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + padding;
        break;
      case 'center':
      default:
        top = window.innerHeight / 2 - tooltipHeight / 2;
        left = window.innerWidth / 2 - tooltipWidth / 2;
        break;
    }

    // Ensure tooltip stays within viewport
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding));
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));

    setTooltipPosition({ top, left });
  };

  const handleElementClick = () => {
    if (currentStep?.requiresClick && currentStep.autoNavigate) {
      setActivePage(currentStep.autoNavigate);
      setTimeout(() => onNext(), 300);
    } else if (currentStep?.requiresClick) {
      onNext();
    }
  };

  const handleNext = () => {
    if (step >= TUTORIAL_STEPS.length - 1) {
      onComplete();
    } else {
      onNext();
    }
  };

  if (!currentStep) {
    onComplete();
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[10000]"
      style={{ pointerEvents: 'none' }}
    >
      {/* Dark Overlay with cutout */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <mask id="tutorial-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {highlightRect && (
              <rect
                x={highlightRect.x - 8}
                y={highlightRect.y - 8}
                width={highlightRect.width + 16}
                height={highlightRect.height + 16}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.85)"
          mask="url(#tutorial-mask)"
        />
      </svg>

      {/* Highlight border animation */}
      {highlightRect && (
        <div
          className="absolute border-4 border-accent-cyan rounded-lg animate-pulse"
          style={{
            top: highlightRect.y - 8,
            left: highlightRect.x - 8,
            width: highlightRect.width + 16,
            height: highlightRect.height + 16,
            pointerEvents: currentStep.requiresClick ? 'auto' : 'none',
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.8), inset 0 0 30px rgba(0, 255, 255, 0.3)',
            cursor: currentStep.requiresClick ? 'pointer' : 'default',
          }}
          onClick={currentStep.requiresClick ? handleElementClick : undefined}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute bg-background-dark border-4 border-accent-yellow p-6 animate-fadeIn"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: '320px',
          pointerEvents: 'auto',
          boxShadow: '0 0 40px rgba(252, 238, 99, 0.6)',
          zIndex: 10001,
        }}
      >
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-pixel text-xl text-glow-yellow">{currentStep.title}</h2>
            <span className="font-pixel text-sm text-text-dark">
              {step + 1}/{TUTORIAL_STEPS.length}
            </span>
          </div>
          <div className="w-full bg-black/50 h-2">
            <div
              className="h-full bg-accent-yellow"
              style={{ width: `${((step + 1) / TUTORIAL_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <p className="text-text-light text-base mb-6 leading-relaxed">
          {currentStep.description}
        </p>

        {currentStep.requiresClick ? (
          <div className="text-center">
            <p className="font-pixel text-accent-green text-sm animate-pulse">
              👆 НАЖМИТЕ НА ПОДСВЕЧЕННЫЙ ЭЛЕМЕНТ
            </p>
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="btn btn-green w-full text-lg"
          >
            {step >= TUTORIAL_STEPS.length - 1 ? 'Завершить' : 'Далее'}
          </button>
        )}

        {/* Arrow pointing to element */}
        {highlightRect && currentStep.position !== 'center' && (
          <div
            className="absolute w-0 h-0"
            style={{
              ...getArrowPosition(tooltipPosition, highlightRect, currentStep.position),
            }}
          >
            {currentStep.position === 'top' && (
              <div className="border-l-[15px] border-r-[15px] border-t-[20px] border-l-transparent border-r-transparent border-t-accent-yellow" />
            )}
            {currentStep.position === 'bottom' && (
              <div className="border-l-[15px] border-r-[15px] border-b-[20px] border-l-transparent border-r-transparent border-b-accent-yellow" />
            )}
            {currentStep.position === 'left' && (
              <div className="border-t-[15px] border-b-[15px] border-l-[20px] border-t-transparent border-b-transparent border-l-accent-yellow" />
            )}
            {currentStep.position === 'right' && (
              <div className="border-t-[15px] border-b-[15px] border-r-[20px] border-t-transparent border-b-transparent border-r-accent-yellow" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to position arrow
const getArrowPosition = (
  tooltipPos: { top: number; left: number },
  _elementRect: DOMRect,
  position: string
) => {
  const arrowOffset = { top: 0, left: 0 };

  switch (position) {
    case 'top':
      arrowOffset.top = tooltipPos.top + 200; // tooltip height
      arrowOffset.left = tooltipPos.left + 160 - 15; // center - arrow width/2
      break;
    case 'bottom':
      arrowOffset.top = tooltipPos.top - 20;
      arrowOffset.left = tooltipPos.left + 160 - 15;
      break;
    case 'left':
      arrowOffset.top = tooltipPos.top + 100 - 15;
      arrowOffset.left = tooltipPos.left + 320;
      break;
    case 'right':
      arrowOffset.top = tooltipPos.top + 100 - 15;
      arrowOffset.left = tooltipPos.left - 20;
      break;
  }

  return arrowOffset;
};

export default TutorialOverlay;
