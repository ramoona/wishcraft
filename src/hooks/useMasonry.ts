import { useEffect, useState, useRef } from "react";

const useMasonry = (itemsForRetriggering: unknown[]) => {
  const masonryContainer = useRef<HTMLDivElement | null>(null);
  const [items, setItems] = useState<ChildNode[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (masonryContainer.current) {
      const masonryItem = Array.from(masonryContainer.current.children);
      setItems(masonryItem);
    }
  }, []);

  useEffect(() => {
    const handleMasonry = () => {
      if (!items || items.length < 1) return;
      let gapSize = 0;
      if (masonryContainer.current) {
        gapSize = parseInt(window.getComputedStyle(masonryContainer.current).getPropertyValue("grid-row-gap"));
      }
      items.forEach(el => {
        if (!(el instanceof HTMLElement)) return;
        let previous = el.previousSibling;
        while (previous) {
          if (previous.nodeType === 1) {
            el.style.marginTop = "0";
            if (previous instanceof HTMLElement && elementLeft(previous) === elementLeft(el)) {
              el.style.marginTop = -(elementTop(el) - elementBottom(previous) - gapSize) + "px";
              break;
            }
          }
          previous = previous.previousSibling;
        }
      });

      if (!initialized) {
        setInitialized(true);
      }
    };

    handleMasonry();
    window.addEventListener("resize", handleMasonry);
    return () => {
      window.removeEventListener("resize", handleMasonry);
    };
  }, [initialized, items, itemsForRetriggering]);

  const elementLeft = (el: HTMLElement) => {
    return el.getBoundingClientRect().left;
  };

  const elementTop = (el: HTMLElement) => {
    return el.getBoundingClientRect().top + window.scrollY;
  };

  const elementBottom = (el: HTMLElement) => {
    return el.getBoundingClientRect().bottom + window.scrollY;
  };

  return { container: masonryContainer, initialized };
};

export default useMasonry;
