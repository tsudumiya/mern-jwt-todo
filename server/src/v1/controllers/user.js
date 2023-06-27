const JWT = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const User = require('../models/user');

// ユーザーの新規登録
exports.register = async (req, res) => {
    // パスワードの受け取り
    const password = req.body.password;

    try {
        // パスワードの暗号化(crypto.js)
        req.body.password = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY);
        // ユーザーの新規作成
        const user = await User.create(req.body);
        // JWTの発行
        const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
            expiresIn: '24h',
        });
        return res.status(200).json({ user, token });
    } catch (error) {
        return res.status(500).json(error);
    }
};

// ユーザーログイン用API
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // DBからユーザーが存在するか探してくる
        const user = await User.findOne({ username: username });
        // DBにユーザーがいなかった場合
        if (!user) {
            return res.status(401).json({
                errors: [
                    {
                        param: 'username',
                        msg: 'ユーザー名が無効です',
                    },
                ],
            });
        }
        // パスワードが合っているか照合する。
        const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        if (decryptedPassword !== password) {
            return res.status(401).json({
                errors: [
                    {
                        param: 'password',
                        msg: 'パスワードが間違っています。',
                    },
                ],
            });
        }

        // JWTを発行
        const token = JWT.sign({ id: user._id }, process.env.TOKEN_SECRET_KEY, {
            expiresIn: '24h',
        });

        return res.status(201).json({ user, token });
    } catch (error) {
        // DBが正常に動かなかった場合
        return res.status(500).json(error);
    }
};
