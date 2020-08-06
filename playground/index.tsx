import React, { useEffect, useRef, useCallback, useState } from "react";
import { Button } from "antd";
// import { Animal } from './Animal'
import AnimalFight from "./AnimalFight/AnimalFight";
import AnimalWs from "./AnimalFight/AnimalWs";
import { Camp, Status, Location } from "./AnimalFight/type";

import "./style.scss";

interface PlaygroundProps {}

interface PlayerInfo {
  camp: Camp;
  uuid: string;
}

const getPlayerStatus = (player?: PlayerInfo, isSelf?: boolean) => {
  if (!player) {
    return {
      camp: Camp.Unknow,
      text: "等待加入..."
    };
  }

  const camp = player.camp === undefined ? Camp.Unknow : player.camp;

  if (isSelf) {
    return {
      camp,
      text: "（我）"
    };
  } else {
    return {
      camp,
      text: "敌方"
    };
  }
};

export const Playground: React.FC<PlaygroundProps> = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const animalFight = useRef<AnimalFight>(null!);
  const animalWs = useRef<AnimalWs>(null!);
  const [selfInfo, setSelfInfo] = useState<PlayerInfo>({
    camp: Camp.Unknow,
    uuid: ""
  });
  const [enemyInfo, setEnemyInfo] = useState<PlayerInfo>({
    camp: Camp.Unknow,
    uuid: ""
  });

  const [[player1, player2], setPlayers] = useState<PlayerInfo[]>([]);

  const onJoin = useCallback(
    (data: any) => {
      console.log("onJoin", data);

      if (selfInfo.uuid) {
        // 别人进来了
        setEnemyInfo(enemyInfo => ({ ...enemyInfo, uuid: data.operUuid }));
      } else {
        // 自己的uuid
        setSelfInfo(selfInfo => ({ ...selfInfo, uuid: data.operUuid }));
      }
    },
    [setEnemyInfo, setSelfInfo]
  );
  const onExit = useCallback(
    (data: any) => {
      console.log("onExit", data);
      setSelfInfo(selfInfo => {
        if (selfInfo.uuid === data.operUuid) {
          return {
            camp: Camp.Unknow,
            uuid: ""
          };
        }
        return selfInfo;
      });
      setSelfInfo(enemyInfo => {
        if (enemyInfo.uuid === data.operUuid) {
          return {
            camp: Camp.Unknow,
            uuid: ""
          };
        }
        return enemyInfo;
      });
    },
    [setSelfInfo, setEnemyInfo]
  );

  const onFlop = useCallback(data => {
    if (data.status === Status.Success) {
      animalFight.current.flopCard(data.data.location);
    }
  }, []);
  const onAttack = useCallback(data => {
    console.log("onAttack", data);
  }, []);
  const onForward = useCallback(data => {
    console.log("onForward", data);
  }, []);

  useEffect(() => {
    const innerAnimalWs = new AnimalWs();

    const innerAnimalFight = new AnimalFight({
      element: canvas.current!,
      onFlop: (location: Location) => {
        console.log('onFlop')
        innerAnimalWs.emit("Flop", location);
      },
      onAttack: (from: Location, to: Location) => {
        console.log('onAttack')
        innerAnimalWs.emit("Attack", { from, to });
      },
      onForward: (from: Location, to: Location) => {
        console.log('onForward')
        innerAnimalWs.emit("Forward", { from, to });
      }
    });


    animalFight.current = innerAnimalFight;
    animalWs.current = innerAnimalWs;

    innerAnimalWs.emit("Join");

    innerAnimalWs.on("onJoin", onJoin);
    innerAnimalWs.on("onFlop", onFlop);
    innerAnimalWs.on("onForward", onForward);
    innerAnimalWs.on("onAttack", onAttack);
    innerAnimalWs.on("onExit", onExit);

    return () => {
      innerAnimalWs.emit("Exit");

      innerAnimalWs.destroy();
    };
  }, [canvas, onJoin, onFlop, onForward, onAttack, onExit]);

  const selfStatusInfo = getPlayerStatus(selfInfo, true);
  const enemyStatusInfo = getPlayerStatus(enemyInfo, false);

  const renderIcon = useCallback((camp: Camp) => {
    let className = "";
    if (camp === Camp.Alliance) {
      className = "alliance";
    } else if (camp === Camp.Orc) {
      className = "orc";
    }
    return <span className={`icon ${className}`}></span>;
  }, []);

  return (
    <div className="playground-container">
      <div className="top-box">
        <div className="left-box">
          <div>玩家1</div>
          <div>
            {selfStatusInfo.text} {renderIcon(selfInfo.camp)}
          </div>
        </div>
        <div className="right-box">
          <div>玩家2</div>
          <div>
            {enemyStatusInfo.text} {renderIcon(enemyInfo.camp)}
          </div>
        </div>
      </div>
      <canvas ref={canvas}></canvas>
    </div>
  );
};
