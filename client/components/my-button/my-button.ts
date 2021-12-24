export class Button extends HTMLElement {
  shadow: ShadowRoot;
  txt: string;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.txt = this.textContent;
    this.render();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `* {box-sizing: border-box;margin: 0;padding: 0; }
    .btn {
      /* box model */
      max-width: 22rem;
      padding: 10px;
      min-width: 20rem;
      margin-top: 2rem;
      /* typography */
      letter-spacing: 1px;
      font-size: 2rem;
      font-family: "Barlow Semi Condensed", sans-serif;
      /* visual */
      cursor: pointer;
      border-radius: 10px;
      color: #D8FCFC;
      background-color: #006CFC;
      border: 5px solid #001997;
    }`;

    this.shadow.innerHTML = `<button class="btn">${this.txt}</button>`;

    this.shadow.appendChild(style);
  }
}

customElements.define("my-button", Button);
