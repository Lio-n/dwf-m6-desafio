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
      padding: 1.5rem 1.5rem 0 1.5rem;
      width: min-content;
    }
    .home__title {
      font-size: 3rem;
      line-height: 6rem;
      margin-bottom: 1.5rem;
      color: var(--title);
    }
    .home__title span {
      color: #91ccaf;
    }
    .home__cont-hand{
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
    }`;

    this.shadow.innerHTML = `
    <div class="home">
      
      <h1 class="home__title">Piedra Papel <span>ó</span> Tijera</h1>
      <my-button class="newRoom">Nuevo Juego</my-button>
      <my-button class="joinRoom">Ingresar a la sala</my-button>

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
