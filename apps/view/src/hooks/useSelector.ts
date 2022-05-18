import { useEffect, useState } from 'react';

export function useSelector(
  selector: string,
  root: HTMLElement = document.body,
) {
  const [nodes, setNodes] = useState([] as Element[]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setNodes([...root.querySelectorAll(selector)]);
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });

    setNodes([...root.querySelectorAll(selector)]);

    return () => observer.disconnect();
  }, []);

  return nodes;
}
