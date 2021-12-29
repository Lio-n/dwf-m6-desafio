import { state } from "../../state";

export class ShareCode extends HTMLElement {
  shadow: ShadowRoot;
  roomId: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.roomId = state.getState().roomId;
    this.render();
    state.listenProperty("online");
  }
  render() {
    this.shadow.innerHTML = `
    <div class="shareCode">

      <div class="sharecode__cont-text">
          <h3>Compartí el código:</h3>
          <h2 class="code">${this.roomId}</h2>
          <h3>Con tu contrincante</h3>
      </div>

      <div class="shareCode__cont-hand">
        <my-hand tag="scissors"></my-hand>
        <my-hand tag="rock"></my-hand>
        <my-hand tag="paper"></my-hand>
      </div>

    </div>`;
  }
}
customElements.define("share-code-page", ShareCode);
