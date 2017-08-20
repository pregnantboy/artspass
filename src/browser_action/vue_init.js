var app = vueInit([]);

function vueInit(accounts) {
    return new Vue({
        el: "#app",
        data: {
            isLoading: true,
            accounts: accounts,
            showAccount: false,
            createPage: true,
            searchString: "",
            canEdit: true,
            currAccount: {},
            isSyncing: false,
            isSaving: false,
            passwordVisible: false,
            saveText: "SAVE"
        },
        methods: {
            showNewAccountPage: function () {
                this.createPage = true;
                populateAccount();
                this.showAccount = true;
                this.canEdit = true;
            },
            showAccountDetailsPage: function (event, account) {
                this.createPage = false;
                populateAccount(account);
                this.showAccount = true;
                this.canEdit = false;
                console.log(account);
            },
            navigateBack: function () {
                this.showAccount = false;
            },
            getIcon: function (event) {
                let url = event.target.value;
                if (validateURL(url)) {}
            },
            edit: function () {
                this.canEdit = true;
            },
            save: function () {
                if (validateForm()) {
                    addOrEditAccount(this.currAccount);
                }
            },
            remove: function () {
                deleteAccount(this.currAccount);
            },
            copyUsername(element, event, account) {
                var usernameToCopy = this.currAccount.username; // account view
                if (account) { // list view
                    usernameToCopy = account.username;
                }
                event.stopPropagation();
                copyToClipboard(usernameToCopy);
                if (account) { // list view
                    var copyText = element.$els.copyuser;
                    copyText.innerText = "COPIED!";
                    setTimeout(() => {
                        copyText.innerText = "COPY"
                    }, 2000);
                } else { // account view
                    event.target.innerText = "check";
                    setTimeout(() => {
                        event.target.innerText = "content_copy"
                    }, 2000);
                }
            },
            copyPassword(element, event, account) {
                var passwordToCopy = this.currAccount.password; // account view
                if (account) { // list view
                    passwordToCopy = account.password;
                }
                event.stopPropagation();
                copyToClipboard(passwordToCopy);
                if (account) { // list view
                    var copyText = element.$els.copypass;
                    copyText.innerText = "COPIED!";
                    setTimeout(() => {
                        copyText.innerText = "COPY"
                    }, 2000);
                } else { // account view
                    event.target.innerText = "check";
                    setTimeout(() => {
                        event.target.innerText = "content_copy";
                    }, 2000);
                }
            },
            reload() {
                reload();
            },
            showPassword() {
                this.passwordVisible = true;
            },
            hidePassword() {
                this.passwordVisible = false;
            },
            openOptions() {
                chrome.runtime.openOptionsPage();
            }
        },
        computed: {
            filteredAccounts: function () {
                return this.accounts.filter((acc) => {
                    if (!acc.site) {
                        return false;
                    }
                    return (acc.site.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1)
                });
            }
        }
    });

}

function validateForm() {
    app.currAccount.site = app.currAccount.site ? app.currAccount.site.trim() : "";
    if (app.currAccount.site.length === 0) {
        document.querySelector('#site-textfield').focus();
        return false;
    }

    app.currAccount.username = app.currAccount.username ? app.currAccount.username.trim() : "";
    if (app.currAccount.username.length === 0) {
        document.querySelector('#username-textfield').focus();
        return false;
    }

    if (!app.currAccount.password || app.currAccount.password.length === 0) {
        document.querySelector('#password-textfield').focus();
        return false;
    }

    return true;
}

function addOrEditAccount(account) {
    setSavingMode(2);
    chrome.runtime.sendMessage({
        event: "save",
        account: account
    }, (success) => {
        console.log("saving complete:", success);
        if (success) {
            setSavingMode(3);
        } else {
            setSavingMode(4);
        }
    });
}

function deleteAccount(account) {
    var dialog = new mdc.dialog.MDCDialog(document.querySelector('#dialog'));
    dialog.show();
    dialog.listen('MDCDialog:accept', function () {
        app.isSaving = true;
        chrome.runtime.sendMessage({
            event: "delete",
            account: account
        }, (success) => {
            console.log("delete complete:", success);
            if (success) {
                app.isSaving = false;
                app.navigateBack();
            }
        });
    });
}

function reload() {
    app.isSyncing = true;
    chrome.runtime.sendMessage({
        event: "reload"
    }, (accountsArray) => {
        console.log(accountsArray);
        app.accounts = accountsArray;
        sort();
        setTimeout(() => {
            app.isSyncing = false;
        }, 1000);
    });
}

chrome.runtime.sendMessage({
    event: "onload"
}, function (accountsArray) {
    app.accounts = accountsArray;
    sort();
    app.isLoading = false;
});

// event listeners 

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    var refAccount = message.account;
    var event = message.event;
    if (!refAccount) {
        return;
    }
    console.log("Message received:", event);
    if (event === "ref-add") {
        app.accounts.push(refAccount);
        sort();
        console.log(app.accounts);
    }

    if (event === "ref-change") {
        var indexToChange = _.findIndex(app.accounts, ['key', refAccount.key]);
        if (indexToChange === -1) {
            reload();
        } else {
            app.accounts[indexToChange] = refAccount;
            sort();
        }
    }

    if (event === "ref-delete") {
        var indexToChange = _.findIndex(app.accounts, ['key', refAccount.key]);
        if (indexToChange === -1) {
            reload();
        } else {
            app.accounts.splice(indexToChange, 1);
        }
    }
});

// https://github.com/mat/besticon#self-hosting
// helpers

function sort() {
    app.accounts = _.sortBy(app.accounts, 'site');
}

function populateAccount(account) {
    if (!account) {
        account = {};
    }
    app.currAccount = new Account(account.site, account.url, account.username, account.password, account.key);
}

function setSavingMode(mode) {
    switch (mode) {
        case 1:
            app.isSaving = false;
            app.saveText = "SAVE";
            break;
        case 2:
            app.isSaving = true;
            break;
        case 3:
            app.isSaving = false;
            app.saveText = "SAVED";
            setTimeout(() => {
                if (app.createPage) {
                    app.saveText = "SAVE";
                    app.navigateBack();
                } else {
                    app.saveText = "SAVE";
                    app.canEdit = false;
                }
            }, 700);
            break;
        case 4:
            app.isSaving = false;
            app.saveText = "FAILED";
            setTimeout(() => {
                app.saveText = "SAVE";
            }, 700);
            break;
    }
}

function validateURL(textval) {
    var urlregex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    return urlregex.test(textval);
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