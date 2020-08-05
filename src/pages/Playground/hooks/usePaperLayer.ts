import { useEffect, useRef, useState } from 'react';
import paper from 'paper';

interface Layers {
  gridLayer: null | paper.Layer;
  cardLayer: null | paper.Layer;
  operationLayer: null | paper.Layer;
}

const usePaperLayer = () => {
  const canvasEl = useRef<HTMLCanvasElement>();
  const [layers, setLayers] = useState<Layers>({
    gridLayer: null,
    cardLayer: null,
    operationLayer: null
  });

  useEffect(() => {
    if (!canvasEl.current) return;
    paper.setup(canvasEl.current);

    const gridLayer = new paper.Layer();
    const cardLayer = new paper.Layer();
    const operationLayer = new paper.Layer();
    
    setLayers({
      gridLayer,
      cardLayer,
      operationLayer
    });
  }, []);

  return [canvasEl, layers] as const;
};

export default usePaperLayer;
