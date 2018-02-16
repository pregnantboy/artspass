import Vue from "vue";
import VueMaterial from "vue-material";

import Vault from "./vault/vault.vue";
import Lunch from "./lunch/lunch.vue";

Vue.use(VueMaterial);

const routes = {
	"vault": {
		component: Vault,
		height: "600px"
	},
	"lunch": {
		component: Lunch,
		height: "400px"
	}
};

var app = new Vue({
	el: "#vault",
	data: {
		page: "lunch"
	},
	computed: {
		ViewComponent: function () {
			document.getElementsByTagName("html")[0].style.height = routes[this.page].height;
			return routes[this.page].component || Vault;
		}
	},
	render(h) {
		return h(this.ViewComponent);
	}
});
