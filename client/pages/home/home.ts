import { Router } from "@vaadin/router";

class Home extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  addListener() {
    const newRoom = this.shadow.querySelector(".newRoom");
    const joinRoom = this.shadow.querySelector(".joinRoom");

    newRoom.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/new_room");
    });

    joinRoom.addEventListener("click", (e) => {
      e.preventDefault();
      Router.go("/join_room");
    });
  }
  render() {
    const style = document.createElement("style");
    style.innerHTML = `*{margin:0;padding:0;box-sizing: border-box;}
    .home {
      /* box model */
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      padding: 1.5rem 1.5rem 0 1.5rem;
      width: min-content;
      height: 100vh;
    }
    @media (min-width:420px) {
      .home {
        padding-top: 1.5rem;
      }
    }
    .home__cont-hand {
      /* box model */
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
    }`;

    this.shadow.innerHTML = `
    <div class="home">
      
      <my-text tag="h1"></my-text>
      
      <div class="home__cont-buttons">
        <my-button class="newRoom">Nuevo Juego</my-button>
        <my-button class="joinRoom">Ingresar a la sala</my-button>
      </div>

      <div class="home__cont-hand">
        <my-hand tag="scissors"></my-hand>
        <my-hand tag="rock"></my-hand>
        <my-hand tag="paper"></my-hand>
      </div>
      
    </div>
      `;
    this.addListener();
    this.shadow.appendChild(style);
  }
}

customElements.define("home-page", Home);
