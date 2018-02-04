<template>
    <div class="account">
        <!-- SITE -->
        <div class="mdc-form-field account-form-field">
            <div ref="site-input" class="mdc-textfield" v-bind:class="{'no-underline': !canEdit}">
                <input type="text" id="site-textfield" ref="site-textfield" class="mdc-textfield__input" :disabled="!canEdit" v-model.trim="currAccount.site" @change="onAccountChanged">
                <label class="mdc-textfield__label" v-bind:class="{'mdc-textfield__label--float-above': (!canEdit || currAccount.site) }" for="site-textfield">Site</label>
            </div>
        </div>
        <!-- URL -->
        <div class="mdc-form-field account-form-field">
            <div ref="url-input" class="mdc-textfield" v-bind:class="{'no-underline': !canEdit}">
                <input type="text" id="url-textfield" ref="url-textfield" class="mdc-textfield__input" :disabled="!canEdit" v-model.trim="currAccount.url" @change="onAccountChanged">
                <label class="mdc-textfield__label" v-bind:class="{'mdc-textfield__label--float-above': (!canEdit || currAccount.url) }" for="url-textfield">URL</label>
            </div>
        </div>
        <!-- USERNAME -->
        <div class="mdc-form-field account-form-field">
            <div ref="username-input" class="mdc-textfield" v-bind:class="{'no-underline': !canEdit}">
                <input type="text" id="username-textfield" ref="username-textfield" class="mdc-textfield__input" :disabled="!canEdit" v-model.trim="currAccount.username" @change="onAccountChanged">
                <label class="mdc-textfield__label" v-bind:class="{'mdc-textfield__label--float-above': (!canEdit || currAccount.username) }" for="username-textfield">Username</label>
                <i ref="username-toggle-button" v-show="!canEdit" class="mdc-textfield__label mdc-icon-toggle material-icons detailed-copy-button" role="button" aria-pressed="false" tabindex="0" @click="copyUsername($event)" data-mdc-ripple-is-unbounded> content_copy</i>
            </div>
        </div>
        <!-- PASSWORD -->
        <div class="mdc-form-field account-form-field">
            <div ref="password-input" class="mdc-textfield" v-bind:class="{'no-underline': !canEdit}">
                <input :type="passwordVisible? 'text': 'password'" id="password-textfield" ref="password-textfield" class="mdc-textfield__input" :disabled="!canEdit" v-model="currAccount.password" @change="onAccountChanged">
                <label class="mdc-textfield__label" v-bind:class="{'mdc-textfield__label--float-above': (!canEdit || currAccount.password) }" for="password-textfield">Password</label>
                <i id="password-show-button" v-show="canEdit" class="show-password material-icons" v-bind:class="{'active': passwordVisible}" @mousedown="passwordVisible = true" @mouseup="passwordVisible = false" @mouseleave="passwordVisible = false">remove_red_eye</i>
                <i ref="password-toggle-button" v-show="!canEdit" class="mdc-textfield__label mdc-icon-toggle material-icons detailed-copy-button" role="button" aria-pressed="false" tabindex="0" @click="copyPassword($event)"> content_copy</i>
            </div>
        </div>
        <!-- PERMISSIONS -->
        <div class="mdc-form-field account-form-field" style="height: 72px; padding-top: 10px;">
            <div style="position: absolute; margin-top:-20px; color:rgba(0,0,0, 0.38); font-size: 11px">Permissions</div>
            <span v-show="!canEdit">{{ usersSelected }}</span>
            <div class="mdc-select" style="min-width: 316px" v-show="canEdit" role="listbox" tabindex="0" id="permission-select">
                <span class="mdc-select__selected-text" style="font-size: 0.875rem; font-weight: 400;">{{ usersSelected }}</span>
                <div class="mdc-simple-menu mdc-select__menu">
                    <ul class="mdc-list mdc-simple-menu__items">
                        <li v-for="(email, index) in userEmails" :key="index" class="mdc-list-item" role="menuitem" tabindex="0" @click.stop style="height: 35px; font-size: 0.8rem; color:black">
                            <div class="mdc-checkbox no-mdc-ripple" @focus.stop>
                                <input type="checkbox" class="mdc-checkbox__native-control" v-if="currAccount.permissions" v-model="currAccount.permissions[email]" :disabled="email === currentUserEmail" @change="onAccountChanged" />
                                <div class="mdc-checkbox__background">
                                    <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                                        <path class="mdc-checkbox__checkmark__path" fill="none" stroke="white" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                                    </svg>
                                    <div class="mdc-checkbox__mixedmark"></div>
                                </div>
                            </div>
                            <label>{{email}}</label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- BOTTOM BUTTONS -->
        <div class="mdc-form-field">
            <button class="mdc-button" style="position: absolute; left: 20px; top: 450px;" v-if="canEdit && !createPage" vd @click="remove()">
                DELETE
            </button>
            <button class="mdc-button mdc-button--primary" style="position: absolute; right: 20px; top: 450px;" :disabled="isSaving" vd @click="canEdit? save() : edit()">
                {{ canEdit ? saveText : 'EDIT'}}
            </button>
        </div>
        <aside class="mdc-dialog" ref="delete-dialog">
            <div class="mdc-dialog__surface">
                <header class="mdc-dialog__header">
                    <h2 id="my-mdc-dialog-label" class="mdc-dialog__header__title" style="font-size: 16px">
                        Confirm delete?
                    </h2>
                </header>
                <footer class="mdc-dialog__footer">
                    <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">Cancel</button>
                    <button type="button" class="mdc-button mdc-button--primary mdc-dialog__footer__button mdc-dialog__footer__button--accept">Delete</button>
                </footer>
            </div>
        </aside>
    </div>
</template>

<script>
    import _ from "lodash";
    import Vue from "vue";
    const saveState = chrome.extension.getBackgroundPage().saveState;

    export default {
        props: ["currAccount", "createPage", "userEmails", "initialCanEdit", "showAccount"],
        data() {
            return {
                currentUserEmail: chrome.extension.getBackgroundPage().currentUser.email,
                canEdit: this.initialCanEdit,
                isSaving: false,
                saveText: "SAVE",
                passwordVisible: false
            };
        },
        watch: {
            showAccount(newval, oldval) {
                console.log('here');
                if (newval) {
                    this.canEdit = this.initialCanEdit;
                    this.attachMDC();
                }
            },
            canEdit() {
                this.attachMDC();
            }
        },
        computed: {
            usersSelected: function () {
                var numUsersSelected = _.keys(_.pickBy(this.currAccount.permissions))
                    .length;
                if (numUsersSelected === 1) {
                    return "Only you."
                }
                return numUsersSelected === this.userEmails.length
                    ? "All users selected."
                    : numUsersSelected + " users selected.";
            },
        },
        methods: {
            attachMDC: function () {
                Vue.nextTick(() => {
                    mdc.textfield.MDCTextfield.attachTo(this.$refs["site-input"]);
                    mdc.textfield.MDCTextfield.attachTo(this.$refs["url-input"]);
                    mdc.textfield.MDCTextfield.attachTo(this.$refs["username-input"]);
                    mdc.textfield.MDCTextfield.attachTo(this.$refs["password-input"]);
                    mdc.iconToggle.MDCIconToggle.attachTo(this.$refs["username-toggle-button"]);
                    mdc.iconToggle.MDCIconToggle.attachTo(this.$refs["password-toggle-button"]);
                    mdc.dialog.MDCDialog.attachTo(this.$refs["delete-dialog"]);
                    mdc.select.MDCSelect.attachTo(document.querySelector("#permission-select"));
                })
            },
            onAccountChanged: function () {
                saveAccountState(this.currAccount);
            },
            copyUsername: function (event) {
                var usernameToCopy = this.currAccount.username; // account view
                event.stopPropagation();
                copyToClipboard(usernameToCopy);
                event.target.innerText = "check";
                setTimeout(() => {
                    event.target.innerText = "content_copy";
                }, 2000);
            },
            copyPassword: function (event) {
                var passwordToCopy = this.currAccount.password; // account view
                event.stopPropagation();
                copyToClipboard(passwordToCopy);
                event.target.innerText = "check";
                setTimeout(() => {
                    event.target.innerText = "content_copy";
                }, 2000);
            },
            onDeleteClicked: function () {
                this.$emit("deleteAccount");
            },
            save: function () {
                if (this.currAccount.site.length === 0) {
                    this.$refs["site-textfield"].focus();
                    return;
                }
                if (this.currAccount.username.length === 0) {
                    this.$refs["username-textfield"].focus();
                    return;
                }
                if (!this.currAccount.password ||
                    this.currAccount.password.length === 0
                ) {
                    this.$refs["password-textfield"].focus();
                    return;
                }
                this.addOrEditAccount();
            },
            edit: function () {
                this.canEdit = true;
            },
            remove: function () {
                var dialog = new mdc.dialog.MDCDialog(this.$refs["delete-dialog"]);
                dialog.show();
                dialog.listen("MDCDialog:accept", function () {
                    this.isSaving = true;
                    chrome.runtime.sendMessage({
                        event: "delete",
                        account: this.currAccount
                    }, (success) => {
                        console.log("delete complete:", success);
                        if (success) {
                            this.isSaving = false;
                            this.$emit("navigateBack");
                        }
                    });
                });
            },
            addOrEditAccount: function () {
                this.setSavingMode(2);
                chrome.runtime.sendMessage(
                    {
                        event: "save",
                        account: this.currAccount
                    },
                    (success) => {
                        console.log("saving complete:", success);
                        if (success) {
                            this.setSavingMode(3);
                        } else {
                            this.setSavingMode(4);
                        }
                    }
                );
            },
            setSavingMode: function (mode) {
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
        created: function () {
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
<style>
.account {
  padding-left: 20px;
  background: white;
  position: absolute;
  height: 100%;
  z-index: 2;
}

.mdc-form-field {
  width: 100%;
}

.mdc-form-field .mdc-textfield {
  width: 100%;
}

.no-underline::after {
  background-color: transparent !important;
}

.mdc-checkbox::before,
.mdc-checkbox::after,
.mdc-checkbox__background::before {
  background-color: transparent !important;
  opacity: 0;
}

.mdc-simple-menu .mdc-list-item:focus::before,
.mdc-simple-menu .mdc-list-item:active::before {
  opacity: 0;
}

.mdc-select:focus {
  background-color: transparent !important;
}

.detailed-copy-button {
  left: 291px;
  cursor: pointer;
  top: 5px;
  pointer-events: all !important;
  font-size: 18px;
  --mdc-ripple-fg-scale: 1.6 !important;
  --mdc-ripple-left: 6px !important;
  --mdc-ripple-top: 6px !important;
}

.account-form-field .mdc-textfield {
  width: 340px;
  max-width: 100%;
}

.show-password {
  margin-bottom: 8px;
  margin-right: 4px;
  font-size: 21px;
  color: rgba(100, 100, 100, 0.5);
  cursor: pointer;
  user-select: none;
}

.show-password:hover {
  color: rgba(100, 100, 100, 0.7);
}

.show-password:focus {
  outline: none;
}

.show-password.active {
  color: var(--mdc-theme-primary);
  opacity: 0.7;
}
</style>
