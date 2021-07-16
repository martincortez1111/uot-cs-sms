module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        req.flash('error_msg', 'يجب عليك تسجيل الدخول أولا');
        res.redirect('/users/signin');
    },
    isAdmin: function(req, res, next) {
        if (req.user.isAdmin == true) {
            return next();
        }

        res.render('errors', {
            title: '403 - Forbidden',
            message: '403 - Forbidden',
            description: 'كان الطلب صحيحًا ، لكن الخادم يرفض اتخاذ إجراء. قد يكون هذا بسبب أنك قد لا تمتلك الأذونات اللازمة لهذا المورد ، أو قد يحتاج هذا المورد إلى حساب من نوع ما.'
        });
    },
    isLoggedIn: function(req, res, next) {
        if (!(req.isAuthenticated())) {
            return next();
        }

        req.flash('error_msg', 'انت بل الفعل قيد تسجيل الدخول.');
        res.redirect('/dashboard');
    },
    readAccessControl: function(req, res, next) {
        if (req.user.privileges.read == true) {
            return next();
        }

        req.flash('error_msg', 'ليس لديك الأذونات المطلوبة لتنفيذ هذا الإجراء.');
        res.redirect('/dashboard');
    },
    createAccessControl: function(req, res, next) {
        if (req.user.privileges.create == true) {
            return next();
        }

        req.flash('error_msg', 'ليس لديك الأذونات المطلوبة لتنفيذ هذا الإجراء.');
        res.redirect('/dashboard');
    },
    updateAccessControl: function(req, res, next) {
        if (req.user.privileges.update == true) {
            return next();
        }

        req.flash('error_msg', 'ليس لديك الأذونات المطلوبة لتنفيذ هذا الإجراء.');
        res.redirect('/dashboard');
    },
    deleteAccessControl: function(req, res, next) {
        if (req.user.privileges.delete == true) {
            return next();
        }

        req.flash('error_msg', 'ليس لديك الأذونات المطلوبة لتنفيذ هذا الإجراء.');
        res.redirect('/dashboard');
    }
}