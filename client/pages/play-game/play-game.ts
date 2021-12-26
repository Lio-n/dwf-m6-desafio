class Play extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  render() {
    let h1 = document.createElement("h1");
    let count = 2;

    // This boolean controls whether any of the three options are selected
    let isSelected = false;
    // let h1 = this.shadow.querySelector("h1");
    h1.textContent = "3";
    // Set time 3s
    const intervalId = setInterval(() => {
      h1.textContent = `${count}`;

      count--;
      /* // If I don't select any of the three options.
      // It stops counting and redirects to "/instruction".
      if (count < 0 && !isSelected) {
        clearInterval(intervalId);
        Router.go("/rules");
      }
      // If I select any of the Three Options
      // It stops counting and redirects to "/results".
      if (count < 0 && isSelected) {
        clearInterval(intervalId);
        Router.go("/home");
      } */
    }, 1000);

    const style = document.createElement("style");
    style.innerHTML = `
    h1 {
      font-size: 4rem;
      color: aqua;
    }`;

    this.appendChild(style);
    this.shadow.appendChild(h1);
  }
}
customElements.define("play-game-page", Play);
