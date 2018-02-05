<template>
    <div class="maindiv" id="maindiv">
        <md-list class="md-double-line" style="padding: 0 0 80px 0; overflow-x: hidden;">
            <li v-for="(account, index) in filteredAccounts" :account="account" :key="index" is="vault-list-item" @click.native="onListItemClicked(account)"  class="list-item" style="height: 70px; width: 400px; display:flex; align-items:center">
            </li>
        </md-list>

        <md-button class="md-fab add-new" @click="onNewButtonClicked">
            <md-icon>add</md-icon>
        </md-button>
    </div>
</template>

<script scoped>
import VaultListItem from "./vault-list-item.vue";
export default {
  components: {
    "vault-list-item": VaultListItem
  },
  props: ["filteredAccounts"],
  methods: {
    onListItemClicked: function(account) {
      this.$emit("showAccountDetailsPage", account);
    },
    onNewButtonClicked: function() {
      this.$emit("showNewAccountPage");
    }
  }
};
</script>

<style scoped>
.maindiv {
  height: calc(100% - 56px);
  overflow-y: scroll;
}

.list-item:hover {
  cursor: default;
  background-color: rgba(100, 100, 100, 0.06);
}

.add-new {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: var(--vault-color);
  color: white;
  z-index: 10;
}
</style>

