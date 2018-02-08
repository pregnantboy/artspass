<template>
    <md-list-item style="padding: 0 2px">
        <md-avatar class="letter-icon">{{ accountLogo }}</md-avatar>
        <div class="md-list-item-text">
            <span class="list-text-primary" style="">{{ account.site }}</span>
            <span style="font-size: 13px; color: rgba(0,0,0,0.6);">{{ account.username }}</span>
        </div>
        <md-button class="md-raised copy-button username" @click.stop="autoFill()" style="width: 100px; margin-right: 0px; height: 32px; color:var(--vault-color)">
          <div style="display: flex; align-items: center; height: 32px; color:rgba(100,100,100,1); ">
            <md-icon class="material-icons">input</md-icon>
            <span id="auto-fill" style="width: 75px" ref="autofill">AUTOFILL</span>
          </div>
        </md-button>
    </md-list-item>
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
      return this.account.site.slice(0, 1).toUpperCase();
    }
  },
  methods: {
    autoFill: function() {
      chrome.extension
        .getBackgroundPage()
        .autoFill(this.account.username, this.account.password);
      console.log("this", this.$refs);
      var autofillText = this.$refs.autofill;
      autofillText.innerText = "FILLED!";
      setTimeout(function() {
        autofillText.innerText = "AUTOFILL";
      }, 2000);
    }
  }
};
</script>

<style>
.letter-icon {
  color: var(--vault-color);
  border: 1px solid var(--vault-color);
  background: white;
  width: 50px;
  height: 50px;
  border-radius: 26px;
  text-align: center;
  line-height: 50px;
  font-size: 23px;
  margin-left: 4px;
  margin-right: 17px;
}

.copy-button {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  font-size: 10px;
  width: 70px;
  text-align: center;
  padding: 0;
  bottom: 3px;
}

.copy-button span {
  width: 42px;
  text-align: center;
}

.copy-button i {
  font-size: 16px !important;
  width: auto;
  line-height: 32px;
  padding-left: 14px;
}

.copy-button::before,
.copy-button::after {
  background-color: rgba(var(--theme-color), 0.2) !important;
}

.copy-button:hover {
  background-color: rgba(var(--theme-color), 0.2) !important;
}

.list-text-primary {
  overflow: hidden;
  width: 185px;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 15px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
  text-transform: capitalize;
  margin-bottom: 3px;
}
</style>
