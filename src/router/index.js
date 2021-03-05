import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Entradas from "../views/Entradas.vue";
import Saidas from "../views/Saidas.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/entradas",
    name: "Entradas",
    component: Entradas
  },
  {
    path: "/despesas",
    name: "Saidas",
    component: Saidas
  }
];

const router = new VueRouter({
  routes
});

export default router;
