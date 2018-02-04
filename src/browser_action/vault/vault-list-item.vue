<template>
    <li>
        <span class="mdc-list-item__start-detail letter-icon">{{ accountLogo }}</span>
        <span class="mdc-list-item__text list-text" style="text-transform: capitalize">
            {{ account.site }}
            <span class="mdc-list-item__text__secondary" style="text-transform: none">{{ account.username }}</span>
        </span>
        <span class="mdc-list-item__end-detail" style="width:185px; margin-right:-75px;">
            <button class="mdc-button mdc-button--dense mdc-button copy-button username" data-mdc-auto-init="MDCRipple" @click="autoFill()" style="color:rgba(100,100,100,1); width: 100px;">
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
            accountLogo: function () {
                return this.account.site.slice(0, 1).toUpperCase();
            }
        },
        methods: {
            autoFill: function () {
                event.stopPropagation();
                chrome.extension.getBackgroundPage().autoFill(this.account.username, this.account.password);
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

<style>
.letter-icon {
    color: var(--mdc-theme-primary);
    border: 1px solid var(--mdc-theme-primary);
    background: white;
    width: 50px;
    height: 50px;
    border-radius: 26px;
    text-align: center;
    line-height: 50px;
    font-size: 23px;
    margin-left: 4px;
    margin-right: 22px;
}

.mdc-list-item__text__secondary {
    font-size: 13px;
}

.copy-button {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  font-size: 10px;
  width: 70px;
  text-align: center;
  padding: 0;
  box-shadow: 2px 2px 2px 1px rgba(100, 100, 100, 0.2);
  bottom: 3px;
}

.copy-button span {
  width: 42px;
  text-align: center;
}

.copy-button i {
  font-size: 17px;
  width: auto;
  line-height: 32px;
  padding-left: 7px;
}

.copy-button::before,
.copy-button::after {
    background-color: rgba(var(--theme-color), 0.2) !important;
}

.copy-button:hover {
    background-color: rgba(var(--theme-color), 0.2) !important;
}

.list-text {
  overflow: hidden;
  width: 185px;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 15px;
  font-weight: 500;
}
</style>
