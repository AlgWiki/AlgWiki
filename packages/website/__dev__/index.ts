import { render } from "../src";

const startLiveReload = (): void => {
  let devWs: WebSocket;
  let retryTime = 1000;
  const connect = (isReconnect: boolean): void => {
    devWs = new WebSocket(
      `ws://${window.location.hostname || "localhost"}:11123`
    );
    devWs.addEventListener("open", () => {
      console.log(`Dev server ${isReconnect ? "re" : ""}connected`);
      retryTime = 1000;
    });
    devWs.addEventListener("message", (evt) => {
      if (evt.data === "reload") {
        console.log("Received reload message from dev server...");
        window.location.reload();
      }
    });
    devWs.addEventListener("close", () => {
      if (!isReconnect) console.warn("Dev server disconnected");
      retryTime = Math.min(retryTime * 1.2, 60 * 1000);
      setTimeout(() => connect(true), retryTime);
    });
  };
  connect(false);
};

startLiveReload();
render(document.getElementById("root")!);
