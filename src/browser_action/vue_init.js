var request = require('request');

var accounts = [
    {
        site: "Google",
        username: "user1"
    },
    {
        site: "Yahoo",
        username: "user2"
    },
    {
        site: "Google",
        username: "user1"
    },
    {
        site: "Yahoo",
        username: "user2"
    }, {
        site: "Google",
        username: "user1"
    },
    {
        site: "Yahoo",
        username: "user2"
    }, {
        site: "Google",
        username: "user1"
    },
    {
        site: "Yahoo",
        username: "user2"
    }, {
        site: "Google",
        username: "user1"
    },
    {
        site: "Yahoo",
        username: "user2"
    }, {
        site: "Google",
        username: "user1"
    },
    {
        site: "Yahoo",
        username: "user2"
    }, {
        site: "Google",
        username: "user1"
    },
    {
        site: "Yahoo",
        username: "user2"
    }
];

var mainlist = new Vue({
    el: '#app',
    data: {
        accounts: accounts,
        showAccount: true,
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