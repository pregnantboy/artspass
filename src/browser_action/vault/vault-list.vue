<template>
    <div class="maindiv" id="maindiv" v-cloak>
        <ul class="mdc-list mdc-list--two-line" style="padding: 0 0 80px 0; overflow-x: hidden;">
            <li v-for="(account, index) in filteredAccounts" :account="account" :key="index" is="vault-list-item" class="mdc-list-item" v-on:click.native="onListItemClicked(account)" style="height: 70px; width: 380px; padding: 0 10px;">
            </li>
        </ul>

        <button class="mdc-fab add-new material-icons" @click="onNewButtonClicked" data-mdc-auto-init="MDCRipple">
            <span class="mdc-fab__icon">add</span>
        </button>
    </div>
</template>

<script>
    import VaultListItem from "./vault-list-item.vue";
    export default {
        components: {
            'vault-list-item': VaultListItem
        },
        props: ["filteredAccounts"],
        methods: {
            onListItemClicked: function (account) {
                this.$emit("showAccountDetailsPage", account);
            },
            onNewButtonClicked: function () {
                this.$emit("showNewAccountPage");
            }
        }
    };
</script>
