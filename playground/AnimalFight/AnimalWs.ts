import io from "socket.io-client";

export type Events =
  | "Forward"
  | "onForward"
  | "Attack"
  | "onAttack"
  | "Flop"
  | "onFlop"
  | "Join"
  | "onJoin"
  | "Exit"
  | "onExit"
  | "StartGame"
  | "onNextPlayer"
  ;

export default class AnimalWs {
  private socket: SocketIOClient.Socket;
  public constructor() {
    this.socket = io(window.location.hostname + ":3002/ws");
  }

  public destroy = () => {
    this.socket.removeAllListeners();
    this.socket.disconnect();
  };

  public on = (event: Events, fn: Function): void => {
    this.socket.on(event, fn);
  };

  public off = (event: Events, fn: Function): void => {
    this.socket.off(event, fn);
  };

  public emit = (event: Events, data?: any) => {
    this.socket.emit(event, data);
  };

  // innerSocket.on("clientMsg", function(msg: any) {
  //   console.log(msg, "clientMsg");
  // });
  // innerSocket.on("connect", function() {
  //   console.log("connected");
  // });
}
