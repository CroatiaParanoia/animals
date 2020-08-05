import React from 'react';
import useAnimalGrid from './hooks/useAnimalGrid';
import './style.css';

const Playground: React.FC<{}> = () => {
  const [canvasEl] = useAnimalGrid();

  return (
    <div>
      <canvas ref={canvasEl} id="animal-canvas" />
    </div>
  );
};

export default Playground;
