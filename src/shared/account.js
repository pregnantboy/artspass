class Account {

    static decrypt(account, key) {
        return new Account(account.site, account.url, Account.decryptText(account.username), Account.decryptText(account.password), key);
    }

    static encrypt(account) {
        return new Account(account.site, account.url, Account.encryptText(account.username), Account.encryptText(account.password));
    }

    
    static decryptText(text) {
        return text;
    }

    static encryptText(text) {
        return text;
    }

    constructor(site, url, username, password, key) {
        this.site = site;
        this.url = url;
        this.username = username;
        this.password = password;
        if (key) {
            this.key = key;
        }
    }

}