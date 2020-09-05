module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash("error_message", "Not Authorized");
            res.redirect("/");
        }
    },
    ensureGuest: function(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect("/user/dashboard");
        } else {
            return next();
        }
    },
};
