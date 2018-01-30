import Vue from "vue";
import Vault from "./vault/vault.vue";

var app = new Vue({
  el: "#vault",
  render: h => h(Vault)
});
