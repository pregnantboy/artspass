class Account {

    static decrypt(salt, account, userEmails, id) {
        var emailPermissions = _.map(userEmails, (email) => {
            return _.includes(account.permissions, email);
        });
        return new Account(account.site, account.url, Account.decryptText(salt, account.username), Account.decryptText(salt, account.password), _.zipObject(userEmails, emailPermissions), id);
    }

    static encrypt(salt, account) {
        var permittedAccounts = _.filter(_.keys(account.permissions), (user) => {
            return account.permissions[user];
        });
        return new Account(account.site, account.url, Account.encryptText(salt, account.username), Account.encryptText(salt, account.password), permittedAccounts);
    }

    static decryptText(salt, ciphertext) {
        if (!salt) {
            return ciphertext;
        }
        var bytes = CryptoJS.AES.decrypt(ciphertext, salt);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    static encryptText(salt, text) {
        if (!salt) {
            return text;
        }
        return CryptoJS.AES.encrypt(text, salt).toString();
    }

    constructor(site, url, username, password, permissions, id) {
        this.site = site;
        this.url = url ? url : "";
        this.username = username;
        this.password = password;
        this.permissions = permissions;
        if (id) {
            this.id = id;
        }
    }

}
