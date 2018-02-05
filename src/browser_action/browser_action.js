import Vue from "vue";
import Vault from "./vault/vault.vue";
import VueMaterial from "vue-material";

Vue.use(VueMaterial);

var app = new Vue({
  el: "#vault",
  render: h => h(Vault)
});
