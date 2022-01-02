export class Text extends HTMLElement {
  shadow: ShadowRoot;
  tags: string[] = ["h1", "h2"];
  tag: string = "h1";
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    if (this.tags.includes(this.getAttribute("tag"))) {
      this.tag = this.getAttribute("tag") || this.tag;
    }
    this.render();
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .root__title {
      /* typography */
      font-size: 5rem;
      line-height: 6rem;
      /* visual */
      color: var(--title);
    }
    .root__title span {
      color: #91ccaf;
    }
    .root__sub-title {
      /* typography */
      font-size: 2rem;
      text-align: center;
      font-weight: 300;
    }`;

    if (this.tag == "h1") {
      this.shadow.innerHTML = `
      <div class="root">
        <h1 class="root__title">Piedra Papel <span>ó</span> Tijera</h1>
      </div>`;
    }
    if (this.tag == "h2") {
      this.shadow.innerHTML = `
      <div class="root">
        <h2 class="root__sub-title">${this.textContent}</h2>
      </div>`;
    }

    this.shadow.appendChild(style);
  }
}

customElements.define("my-text", Text);
