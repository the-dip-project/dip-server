import { useEffect, useState } from 'react';

export function useSelector(
  selector: string,
  root: HTMLElement = document.body,
) {
  const [nodes, setNodes] = useState([] as Element[]);

  useEffect(() => {
    const observer = new MutationObserver((list) => {
      let hasChange = false;

      for (const change of list) {
        const target = change.target as Element;

        if (target.matches(selector) || target.querySelector(selector)) {
          hasChange = true;
          break;
        }
      }

      if (hasChange) setNodes([...root.querySelectorAll(selector)]);
    });

    observer.observe(root, {
      childList: true,
    });

    setNodes([...root.querySelectorAll(selector)]);

    return () => observer.disconnect();
  }, []);

  return nodes;
}
