import Vue from "vue";
import VueMaterial from "vue-material";

import Vault from "./vault/vault.vue";
import Lunch from "./vault/lunch/lunch.vue";

Vue.use(VueMaterial);

const routes = {
	"vault": Vault,
	"lunch": Lunch
};

var app = new Vue({
	el: "#vault",
	data: {
		page: "lunch"
	},
	computed: {
		ViewComponent: function () {
			return routes[this.page] || Vault;
		}
	},
	render(h) {
		return h(this.ViewComponent);
	}
});
