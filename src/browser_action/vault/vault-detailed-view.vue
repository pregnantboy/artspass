<template>
    <div class="account">
        <!-- SITE -->
        <md-field ref="site-input" v-bind:class="{'md-has-value': !canEdit}">
            <label>Site</label>              
            <md-input type="text" id="site-textfield" ref="site-textfield" :disabled="!canEdit" v-model.trim="currAccount.site" @change="onAccountChanged"></md-input>
        </md-field>
        <!-- URL -->
        <md-field ref="url-input" v-bind:class="{'md-has-value': !canEdit}">
            <label>URL</label>
            <md-input type="text" id="url-textfield" ref="url-textfield" :disabled="!canEdit" v-model.trim="currAccount.url" @change="onAccountChanged"></md-input>
        </md-field>
        <!-- USERNAME -->
        <md-field ref="username-input" v-bind:class="{'md-has-value': !canEdit}" >
            <label>Username</label>
            <md-input type="text" id="username-textfield" ref="username-textfield" :disabled="!canEdit" v-model.trim="currAccount.username" @change="onAccountChanged"></md-input>
            <md-button v-show="!canEdit" class="md-icon-button detailed-copy-button" @click="copyUsername($event)">
              <md-icon class="detailed-copy-icon" ref="username-copy-button">{{ usernameCopied ? 'check' : 'content_copy' }}</md-icon>
            </md-button>
        </md-field>
        <!-- PASSWORD -->
          <md-field ref="password-input" :md-toggle-password="canEdit" v-bind:class="{'md-has-value': !canEdit}">
              <label>Password</label>
              <md-input type="password" id="password-textfield" ref="password-textfield" :disabled="!canEdit" v-model="currAccount.password" @change="onAccountChanged"></md-input>
              <md-button v-show="!canEdit" class="md-icon-button detailed-copy-button"  @click="copyPassword($event)">
                <md-icon class="detailed-copy-icon">{{ passwordCopied ? 'check' : 'content_copy' }}</md-icon>
              </md-button>
          </md-field>
        <!-- PERMISSIONS -->
        <md-field class="md-has-value">
          <label for="permissions-select">Permissions</label>
          <span style="margin-top: 6px; color: rgb(84,84,84); position: absolute;">{{usersSelectedLabel}}</span>
          <md-select v-model="usersSelected" name="permissions-select" id="permissions-select" multiple md-dense :disabled="!canEdit" @change="onAccountChanged">
            <md-option v-for="(email, index) in userEmails" :key="index" :value="email" style="color: var(--vault-color);" :disabled="email === currentUser.email" > {{email}} </md-option>
          </md-select>
        </md-field>
    
        <!-- BOTTOM BUTTONS -->
        <div>
            <md-button style="position: absolute; left: 20px; top: 420px;" v-if="canEdit && !createPage" @click="onDeleteClicked()">
                {{ isDeleting ? 'DELETING' : 'DELETE'}}
            </md-button>
            <md-button style="position: absolute; right: 20px; top: 420px; color:var(--vault-color)" :disabled="isSaving" @click="canEdit? save() : edit()">
                {{ canEdit ? saveText : 'EDIT'}}
            </md-button>
        </div>

        <!-- DELETE DIALOG -->
        <md-dialog-confirm  style="background:white" :md-active.sync="showDeleteDialog" md-title="Confirm delete?" md-confirm-text="Delete" @md-confirm="remove()">
        </md-dialog-confirm>
    </div>
</template>

<script scoped>
import _ from "lodash";
const saveState = chrome.extension.getBackgroundPage().saveState;

export default {
  props: [
    "currAccount",
    "createPage",
    "userEmails",
    "initialCanEdit",
    "showAccount"
  ],
  data() {
    return {
      currentUser: chrome.extension.getBackgroundPage().currentUser,
      canEdit: this.initialCanEdit,
      isSaving: false,
      isDeleting: false,
      saveText: "SAVE",
      passwordVisible: false,
      usernameCopied: false,
      passwordCopied: false,
      usersSelected: [],
      showDeleteDialog: false
    };
  },
  watch: {
    showAccount(newval, oldval) {
      console.log("here");
      if (newval) {
        this.canEdit = this.initialCanEdit;
        if (!this.currAccount.permissions) {
          this.usersSelected = [];
        } else {
          this.usersSelected = _.compact(
            _.map(this.currAccount.permissions, (value, key) => {
              if (value) {
                return key;
              }
            })
          );
        }
      }
    },
    usersSelected(newval) {
      _.forEach(this.currAccount.permissions, (value, key) => {
        this.currAccount.permissions[key] = false;
      });
      _.forEach(newval, email => {
        this.currAccount.permissions[email] = true;
      });
    }
  },
  computed: {
    usersSelectedLabel: function() {
      var numUsersSelected = _.keys(_.pickBy(this.currAccount.permissions))
        .length;
      if (numUsersSelected === 1) {
        return "Only me.";
      }
      return numUsersSelected === this.userEmails.length
        ? "All users selected."
        : numUsersSelected + " users selected.";
    }
  },
  methods: {
    onAccountChanged: function() {
      saveAccountState(this.currAccount);
    },
    copyUsername: function(event) {
      var usernameToCopy = this.currAccount.username; // account view
      event.stopPropagation();
      copyToClipboard(usernameToCopy);
      this.usernameCopied = true;
      setTimeout(() => {
        this.usernameCopied = false;
      }, 2000);
    },
    copyPassword: function(event) {
      var passwordToCopy = this.currAccount.password; // account view
      event.stopPropagation();
      copyToClipboard(passwordToCopy);
      this.passwordCopied = true;
      setTimeout(() => {
        this.passwordCopied = false;
      }, 2000);
    },
    save: function() {
      if (this.currAccount.site.length === 0) {
        this.$refs["site-textfield"].focus();
        return;
      }
      if (this.currAccount.username.length === 0) {
        this.$refs["username-textfield"].focus();
        return;
      }
      if (
        !this.currAccount.password ||
        this.currAccount.password.length === 0
      ) {
        this.$refs["password-textfield"].focus();
        return;
      }
      this.addOrEditAccount();
    },
    edit: function() {
      this.canEdit = true;
    },
    onDeleteClicked() {
      this.showDeleteDialog = true;
    },
    remove: function() {
      this.isDeleting = true;
      chrome.runtime.sendMessage(
        {
          event: "delete",
          account: this.currAccount
        },
        success => {
          if (success) {
            this.isDeleting = false;
            this.$emit("navigateBack");
          }
        }
      );
    },
    addOrEditAccount: function() {
      this.setSavingMode(2);
      chrome.runtime.sendMessage(
        {
          event: "save",
          account: this.currAccount
        },
        success => {
          console.log("saving complete:", success);
          if (success) {
            this.setSavingMode(3);
          } else {
            this.setSavingMode(4);
          }
        }
      );
    },
    setSavingMode: function(mode) {
      switch (mode) {
        case 1:
          this.isSaving = false;
          this.saveText = "SAVE";
          break;
        case 2:
          this.isSaving = true;
          break;
        case 3:
          this.isSaving = false;
          this.saveText = "SAVED";
          setTimeout(() => {
            if (this.createPage) {
              this.saveText = "SAVE";
              this.$emit("navigateBack");
            } else {
              this.saveText = "SAVE";
              this.canEdit = false;
              saveState("view", 2);
            }
          }, 700);
          break;
        case 4:
          this.isSaving = false;
          this.saveText = "FAILED";
          setTimeout(() => {
            this.saveText = "SAVE";
          }, 700);
          break;
      }
    }
  },
  created: function() {
    console.log("Detailed view created");
  }
};

function saveAccountState(account) {
  saveState("account", _.cloneDeep(account));
}

function copyToClipboard(text) {
  if (!text || text.length === 0) {
    return;
  }
  var textArea = document.createElement("textarea");
  textArea.style.position = "fixed";
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = 0;
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Copying text command was " + msg);
  } catch (err) {
    console.log("Oops, unable to copy");
  } finally {
    document.body.removeChild(textArea);
  }
}
</script>
<style scoped>
.account {
  padding: 0 30px;
  background: white;
  position: absolute;
  height: calc(100% - 56px);
  overflow-x: hidden;
  width: 100%;
  z-index: 4;
}

.md-field {
  margin: 15px 0;
}
.md-field:not(.md-has-value):not(.md-focused) label,
.md-field.md-focused .md-input,
.md-field.md-focused .md-textarea,
.md-field.md-has-value .md-input,
.md-field.md-has-value .md-textarea {
  font-size: 15px;
}

.md-field.md-focused label {
  color: var(--vault-color);
}

.md-field:after {
  background-color: rgba(0, 0, 0, 0.15);
}

.md-field:before {
  background-color: var(--vault-color);
}

.md-field.md-disabled:after {
  display: none;
}

.md-field.md-disabled label {
  color: rgb(84, 84, 84);
}

.detailed-copy-button {
  position: absolute;
  right: -14px;
  bottom: -3px;
}

.detailed-copy-icon {
  font-size: 17px !important;
  color: rgba(0, 0, 0, 0.6);
}

.md-menu.md-select.md-disabled {
  display: none;
}
</style>
