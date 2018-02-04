import Vue from "vue";
import Vault from "./vault/vault.vue";
// import VueMDCAdapter from "vue-mdc-adapter";

// Vue.use(VueMdcAdapter);

var app = new Vue({
  el: "#vault",
  render: h => h(Vault)
});
