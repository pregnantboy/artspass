<template>
    <li>
        <span class="mdc-list-item__start-detail letter-icon">{{ accountLogo }}</span>
        <span class="mdc-list-item__text list-text" style="text-transform: capitalize">
            {{ account.site }}
            <span class="mdc-list-item__text__secondary" style="text-transform: none">{{ account.username }}</span>
        </span>
        <span class="mdc-list-item__end-detail" style="width:185px; margin-right:-75px;">
            <button class="mdc-button mdc-button--dense mdc-button copy-button username" data-mdc-auto-init="MDCRipple" @click="autoFill()"
            style="color:rgba(100,100,100,1); width: 100px;">
                <i class="material-icons">input</i>
                <span id="auto-fill" style="width: 75px" ref="autofill">AUTOFILL</span>
            </button>
        </span>
    </li>
</template>

<script>
export default {
    props: {
        account: {
            site: String,
            username: String, 
            password: String
        }
    },
    computed: {
        accountLogo: function() {
            return this.account.site.slice(0,1).toUpperCase();
        }
    },
    methods: {
        autoFill: function () {
            event.stopPropagation();
            chrome.extension.getBackgroundPage().autoFill( this.account.username, this.account.password);
            console.log("this", this.$refs);
            var autofillText = this.$refs.autofill;
            autofillText.innerText = "FILLED!";
            setTimeout(function () {
                autofillText.innerText = "AUTOFILL";
            }, 2000);
        }
    }
};
</script>


