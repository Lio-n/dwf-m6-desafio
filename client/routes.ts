import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/join_room", component: "join-room-page" },
  { path: "/new_room", component: "new-room-page" },
  { path: "/share_code", component: "share-code-page" },
  { path: "/rules", component: "rules-page" },
  { path: "/wait", component: "wait-page" },
  { path: "/play", component: "play-page" },
]);
