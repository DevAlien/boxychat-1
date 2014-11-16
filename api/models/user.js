module.exports = {

    identity: 'user',

    attributes: {
        first_name: 'string',
        last_name: 'string',
        email: {
            type: 'email',
            required: true,
            unique: true
        },
        password: {
            type: 'string',
            required: true
        },
        activated: 'boolean',
        activationToken: 'string',

        validPassword: function(password, cb) {
            Service.crypt.compare(password, this.password, function (error, response) {
                if (error) return cb(error, response);
                return cb(null, response);
            });
        }
    },


    /**
     * Hash the users password with bcrypt
     * @method beforeCreate
     * @param {object}   user            the object of the submitted user data
     * @param {Function} cb[err, user]   the callback to be used when bcrypts done
     * @return
     */
    beforeCreate: function (user, cb) {
        Service.crypt.generate({saltComplexity: 10}, user.password, function (err, hash) {
            if (err) {
                return cb(err);
            } else {
                user.password = hash;
                user.activated = false;
                user.activationToken = Service.crypt.token(new Date().getTime() + user.email);
                return cb(null, user);
            }
        });
    }

};