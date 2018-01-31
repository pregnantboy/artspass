import _ from "lodash";
import Vue from "vue";
import VaultList from "./vault-list.vue";
import VaultDetailedView from "./vault-detailed-view.vue";

document.documentElement.style.setProperty("--theme-color", chrome.extension.getBackgroundPage().themeColor);
var saveState = chrome.extension.getBackgroundPage().saveState;

var data = {
    isLoading: true,
    accounts: [],
    showAccount: false,
    createPage: true,
    searchString: "",
    canEdit: true,
    currAccount: {},
    isSyncing: false,
    isSaving: false,
    passwordVisible: false,
    saveText: "SAVE",
    isFirstLoad: chrome.extension.getBackgroundPage().isFirstLoad,
    isAuthenticated: chrome.extension.getBackgroundPage().isAuthenticated,
    userEmails: chrome.extension.getBackgroundPage().userEmails,
};

export default {
    name: "app",
    data() {
        return data;
    },
    components: {
        "vault-list": VaultList,
        "vault-detailed-view": VaultDetailedView
    },
    methods: {
        showNewAccountPage: function () {
            this.createPage = true;
            populateAccount();
            this.saveAccount();
            this.saveView(3);
            this.canEdit = true;            
            this.showAccount = true;
        },
        showAccountDetailsPage: function (account) {
            this.createPage = false;
            populateAccount(account);
            this.saveAccount();
            this.saveView(2);
            this.canEdit = false;            
            this.showAccount = true;
        },
        navigateBack: function () {
            this.saveView(1);
            this.showAccount = false;
        },
        getIcon: function (event) {
            let url = event.target.value;
            validateURL(url);
        },
        edit: function () {
            this.canEdit = true;
        },
        save: function () {
            addOrEditAccount(this.currAccount);
        },
        remove: function () {
            var dialog = new mdc.dialog.MDCDialog(document.querySelector("#dialog"));
            dialog.show();
            dialog.listen("MDCDialog:accept", function () {
                this.isSaving = true;
                chrome.runtime.sendMessage({
                    event: "delete",
                    account: this.currAccount
                }, function (success) {
                    console.log("delete complete:", success);
                    if (success) {
                        this.isSaving = false;
                        this.navigateBack();
                    }
                });
            });
        },
        reload: function () {
            reload();
        },
        openOptions: function () {
            chrome.runtime.openOptionsPage();
        },
        saveScroll: _.debounce(function (evt) {
            saveState("scroll", evt.target.scrollTop);
        }, 300),
        saveSearch: function () {
            saveState("search", this.searchString);
        },
        saveAccount: function () {
            saveState("account", _.cloneDeep(this.currAccount));
        },
        saveView: function (viewNo) {
            // 1: Main View, 2: Account View  3: New Account View
            saveState("view", viewNo);
        },
        openPermissionDropdown: function () {
            window.menu.open = true;
        }
    },
    computed: {
        filteredAccounts: function () {
            return this.accounts.filter((acc) => {
                if (!acc.site) {
                    return false;
                }
                return (acc.site.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1);
            });
        },
        usersSelected: function () {
            var numUsersSelected = _.keys(_.pickBy(this.currAccount.permissions)).length;
            return numUsersSelected === this.userEmails.length ? "All" : numUsersSelected;
        }
    },
    created: function () {
        console.log("created");
        chrome.runtime.sendMessage({
            event: "onload"
        }, (accountsAndEmailArray) => {
            console.log(accountsAndEmailArray);
            this.accounts = accountsAndEmailArray[0];
            this.userEmails = accountsAndEmailArray[1];
            sortAccounts();
            Vue.nextTick(() => {
                console.log("loading state");
                loadState.bind(this)();
            });
            this.isLoading = false;
        });
    }
};

function validateForm() {
    data.currAccount.site = data.currAccount.site ? data.currAccount.site.trim() : "";
    if (data.currAccount.site.length === 0) {
        document.querySelector("#site-textfield").focus();
        return false;
    }

    data.currAccount.username = data.currAccount.username ? data.currAccount.username.trim() : "";
    if (data.currAccount.username.length === 0) {
        document.querySelector("#username-textfield").focus();
        return false;
    }

    if (!data.currAccount.password || data.currAccount.password.length === 0) {
        document.querySelector("#password-textfield").focus();
        return false;
    }

    return true;
}

function addOrEditAccount(account) {
    setSavingMode(2);
    chrome.runtime.sendMessage({
        event: "save",
        account: account
    }, function (success) {
        console.log("saving complete:", success);
        if (success) {
            setSavingMode(3);
        } else {
            setSavingMode(4);
        }
    });
}

function reload() {
    if (data.isSyncing) {
        return;
    }
    data.isSyncing = true;
    setTimeout(function () {
        chrome.runtime.sendMessage({
            event: "reload"
        }, function (accountsAndEmails) {
            data.accounts = accountsAndEmails[0];
            data.userEmails = accountsAndEmails[1];
            sortAccounts();
            data.isSyncing = false;
        });
    }, 1000);
}

function loadState() {
    let state = chrome.extension.getBackgroundPage().state;
    if (!state) {
        return;
    }
    let savedAccount = _.cloneDeep(state.account);
    switch (state.view) {
        default:
            case 1:
        {
            if (state.search) {
                this.searchString = state.search;
            }
            document.getElementById("maindiv").scrollTop = state.scroll;
            console.log("scrolling to :", state.scroll);
        }
        break;
        case 2:
            {
                this.showAccountDetailsPage();
                if (savedAccount) {
                    this.currAccount = savedAccount;
                    this.saveAccount();
                }
            }
            break;
        case 3:
            {
                this.showNewAccountPage();
                if (savedAccount) {
                    this.currAccount = savedAccount;
                    this.saveAccount();
                }
            }
            break;
    }
}

// event listeners 

chrome.runtime.onMessage.addListener(function (message) {
    var refAccount = message.account;
    var event = message.event;
    if (!refAccount) {
        return;
    }
    console.log("Message received:", event);
    if (event === "ref-add") {
        data.accounts.push(refAccount);
        sortAccounts();
    }

    var indexToChange = _.findIndex(data.accounts, ["id", refAccount.id]);

    if (event === "ref-change") {
        if (indexToChange === -1) {
            reload();
        } else {
            data.accounts[indexToChange] = refAccount;
            sortAccounts();
        }
    }

    if (event === "ref-delete") {
        if (indexToChange === -1) {
            reload();
        } else {
            data.accounts.splice(indexToChange, 1);
        }
    }
});

// https://github.com/mat/besticon#self-hosting
// helpers

function sortAccounts() {
    data.accounts = _.sortBy(data.accounts, function (acc) {
        return acc.site.toLowerCase();
    });
}

function populateAccount(account) {
    if (!account) {
        data.currAccount = new Account(null, null, null, null, _.zipObject(data.userEmails, _.times(data.userEmails.length, _.stubTrue)));
    } else {
        data.currAccount = new Account(account.site, account.url, account.username, account.password, account.permissions, account.id);
    }
}

function setSavingMode(mode) {
    switch (mode) {
        case 1:
            data.isSaving = false;
            data.saveText = "SAVE";
            break;
        case 2:
            data.isSaving = true;
            break;
        case 3:
            data.isSaving = false;
            data.saveText = "SAVED";
            setTimeout(function () {
                if (data.createPage) {
                    data.saveText = "SAVE";
                    data.navigateBack();
                } else {
                    data.saveText = "SAVE";
                    data.canEdit = false;
                    data.saveView(2);
                }
            }, 700);
            break;
        case 4:
            data.isSaving = false;
            data.saveText = "FAILED";
            setTimeout(function () {
                data.saveText = "SAVE";
            }, 700);
            break;
    }
}

function validateURL(textval) {
    var urlregex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    return urlregex.test(textval);
}
