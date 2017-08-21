class Account {

    static decrypt(salt, account, key) {
        return new Account(account.site, account.url, Account.decryptText(salt, account.username), Account.decryptText(salt, account.password), key);
    }

    static encrypt(salt, account) {
        return new Account(account.site, account.url, Account.encryptText(salt, account.username), Account.encryptText(salt, account.password));
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

    constructor(site, url, username, password, key) {
        this.site = site;
        this.url = url ? url : "";
        this.username = username;
        this.password = password;
        if (key) {
            this.key = key;
        }
    }

}
