import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/join_room", component: "join-room-page" },
  { path: "/new_room", component: "new-room-page" },
  { path: "/share_code", component: "share-code-page" },
  { path: "/instruction", component: "instruction-page" },
  { path: "/wait", component: "wait-page" },
  { path: "/play_game", component: "play-game-page" },
  { path: "/results", component: "results-page" },
  {
    path: "/error",
    children: [
      { path: "/user_disconnected", component: "disconnected-page" },
      { path: "/full_room", component: "full-room-page" },
    ],
  },
]);
