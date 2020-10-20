import React from 'react';
import { Button } from 'antd';
import useAnimalGrid from './hooks/useAnimalGrid';
import './style.css';
import { Camp } from './types';
import { animalCardConfig } from './config';

const Playground: React.FC = () => {
  const [identity, setIdentity] = React.useState(Camp.Alliance);
  const [canvasEl] = useAnimalGrid({
    identity,
  });

  return (
    <div>
      <div>
        当前身份：
        <div
          className="circle"
          style={{
            display: 'inline-block',
            width: 40,
            height: 40,
            backgroundColor: animalCardConfig[identity],
          }}
        />
      </div>

      <Button>123123</Button>
      <div>
        <select
          name=""
          id=""
          placeholder="选择"
          onChange={(e) => setIdentity(e.target.value as Camp)}
        >
          <option value="Alliance">Alliance</option>
          <option value="Orc">Orc</option>
          <option value="Unknow">Unknow</option>
        </select>
      </div>
      <canvas id="animal-canvas" ref={canvasEl} />
    </div>
  );
};

export default Playground;
