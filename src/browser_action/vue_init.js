
var mainlist = vueInit([]);

function vueInit(accounts) {

    return new Vue({
        el: '#app',
        data: {
            accounts: accounts,
            showAccount: false,
            searchString: "",
            canEdit: true,
            site: "",
            url: "",
            username: "",
            password: "",
            isSyncing: false
        },
        methods: {
            showNewAccountPage: function () {
                clearInput();
                this.showAccount = true;
                this.canEdit = true;
            },
            showAccountDetailsPage: function (event, account) {
                fillInput(account);
                this.showAccount = true;
                this.canEdit = false;
                console.log(account);
            },
            navigateBack: function () {
                this.showAccount = false;
            },
            getIcon: function (event) {
                let url = event.target.value;
                if (validateURL(url)) {
                }
            },
            edit: function () {
                this.canEdit = true;
            },
            save: function () {
                this.navigateBack();
            },
            copyUsername(element, event, account) {
                var usernameToCopy = this.username;
                if (account) {
                    usernameToCopy = account.username;
                }
                event.stopPropagation();
                copyToClipboard(usernameToCopy);
                if (account) {
                    var copyText = element.$els.copyuser;
                    copyText.innerText = 'Copied!';
                    setTimeout(() => {
                        copyText.innerText = 'Username'
                    }, 2000);
                } else {
                    event.target.innerText = 'check';
                    setTimeout(() => {
                        event.target.innerText = 'content_copy'
                    }, 2000);
                }
            },
            copyPassword(element, event, account) {
                var passwordToCopy = this.password;
                if (account) {
                    passwordToCopy = account.password;
                }
                event.stopPropagation();
                copyToClipboard(passwordToCopy);
                console.log(element)
                if (account) {
                    var copyText = element.$els.copypass;
                    copyText.innerText = 'Copied!';
                    setTimeout(() => {
                        copyText.innerText = 'Password'
                    }, 2000);
                } else {
                    event.target.innerText = 'check';
                    setTimeout(() => {
                        event.target.innerText = 'content_copy'
                    }, 2000);
                }
            },
            reload() {
                this.isSyncing = true;
                chrome.runtime.sendMessage({ event: "reload " }, (accountsObj) => {
                    console.log(accountsObj);
                    this.accounts = _.values(accountsObj);
                    this.isSyncing = false;
                });
            }
        },
        computed: {
            filteredAccounts: function () {
                return this.accounts.filter((acc) => {
                    return (acc.site.toLowerCase().indexOf(this.searchString.toLowerCase()) !== -1)
                });
            }
        }
    });

}

console.log('document onload');
chrome.runtime.sendMessage({ event: "onload" }, function (accountsObj) {
    console.log(accountsObj);
    mainlist.accounts = _.values(accountsObj);
});


// https://github.com/mat/besticon#self-hosting
function clearInput() {
    mainlist.site = "";
    mainlist.url = "";
    mainlist.username = "";
    mainlist.password = "";
}

function fillInput(account) {
    mainlist.site = account.site;
    mainlist.url = account.url;
    mainlist.username = account.username;
    mainlist.password = account.password;
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
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    } finally {
        document.body.removeChild(textArea);
    }
}