
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

var unfilterdAccounts = _.cloneDeep(accounts);

var mainlist = new Vue({
    el: '#app',
    data: {
        accounts: accounts,
        searchString: ""
    },
    computed: {
        filteredAccounts: function () {
            var that = this;
            return this.accounts.filter(function (acc) {
                return (acc.site.toLowerCase().indexOf(that.searchString.toLowerCase()) !== -1)
            });
        }
    }
});

window.mdc.autoInit();
