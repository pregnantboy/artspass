var request = require('request');

var accounts = [
    {
        site: "Google",
        username: "user1",
        password: "password1"
    },
    {
        site: "Yahoo",
        username: "user2",
        password: "password2"
    },
    {
        site: "Google",
        username: "user1",
        password: "password1"
    },
    {
        site: "Yahoo",
        username: "user2",
        password: "password2"
    }, {
        site: "Google",
        username: "user1",
        password: "password1"
    },
    {
        site: "Yahoo",
        username: "user2",
        password: "password2"
    }, {
        site: "Google",
        username: "user1",
        password: "password1"
    },
    {
        site: "Yahoo",
        username: "user2",
        password: "password2"
    }, {
        site: "Google",
        username: "user1",
        password: "password1"
    },
    {
        site: "Yahoo",
        username: "user2",
        password: "password2"
    }, {
        site: "Google",
        username: "user1",
        password: "password1"
    },
    {
        site: "Yahoo",
        username: "user2",
        password: "password2"
    }, {
        site: "Google",
        username: "user1",
        password: "password1"
    },
    {
        site: "Yahoo",
        username: "user2",
        password: "password2"
    }
];

var mainlist = new Vue({
    el: '#app',
    data: {
        accounts: accounts,
        showAccount: false,
        searchString: "",
        canEdit: true,
        site: "",
        url: "",
        username: "",
        password: ""
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
            event.stopPropagation();
            copyToClipboard(account.username);
            var copyText = element.$els.copyuser;
            copyText.innerText = 'Copied!';
            setTimeout(() => {
                copyText.innerText = 'Username'
            }, 2000);
        },
        copyPassword(element, event, account) {
            event.stopPropagation();
            copyToClipboard(account.password);
            var copyText = element.$els.copypass;
            copyText.innerText = 'Copied!';
            setTimeout(() => {
                copyText.innerText = 'Password'
            }, 2000);
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