const express = require('express');
const passport = require('passport');
const router = express.Router();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require("jsonwebtoken");
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";


// const moment = require('moment');
const bcryptjs = require('bcryptjs');
let ClientID =
    "1020450444712-evk1bjtv5mcq907d3kp5g0ir7d3akd80.apps.googleusercontent.com";
let ClientSecret = "NhhQhGmxc-tD8sHAICysFTLd";
let RefreshToken = "1//04eDJZNbTKfdmCgYIARAAGAQSNwF-L9IrzCeC7H1LzWrgBkndxceF5kqn0f7GqjzkKNG008ccMaPfthWzSEep6s6REZ9ul1Ov2Bk";
let RedirectURL = "https://developers.google.com/oauthplayground";
const {
    Client,
    validateClient,
} = require('../models/client');

const {
    ensureAuthenticated,
    isLoggedIn
} = require('../helpers/auth');

const {
    StudentId,
    Student,
    validate
} = require('../models/student');

const {
    Department
} = require('../models/department');




// Public Routes.

// GET Signing Route.

router.get('/home', isLoggedIn, (req, res) => {
    res.render('layouts/clientHome', {
        title: 'تسجيل او انشاء حساب',
        breadcrumbs: false,
        layout: 'clientHome'

    });
});


//homePage
router.get('/homepage', async(req, res) => {

    res.render('client/homePage', {
        title: 'الصفحة الرئيسية',
        layout: "signin"



    });
});




router.get('/signin', (req, res) => {
    res.render('client/signin', {
        title: 'تسجيل دخول',
        breadcrumbs: false,
        layout: 'signin'
    });
});

// signin POST
router.post('/signin', (req, res, next) => {

    passport.authenticate('client', {
        successRedirect: '/client/add_studentInfo',
        successFlash: true,
        failureRedirect: '/client/signin',
        failureFlash: true
    })(req, res, next);
});


router.get('/add_studentInfo', async(req, res) => {

    res.render('client/information', {
        title: 'معلومات التسجيل',

    });
});

router.post('/add_studentInfo', async(req, res) => {
    const dept = await Department.find();

    let errors = [];

    const {
        error
    } = validate(req.body);

    if (error) {
        errors.push({
            text: error.details[0].message
        });
        res.render('client/information', {
            title: 'صفحة التسجيل',
            breadcrumbs: true,
            dept: dept,
            errors: errors,
            body: req.body
        });
    } else {

        const student = new Student({
            StudentInfo: {
                StName: req.body.StName,
                StFname: req.body.StFname,
                StGname: req.body.StGname,
                FourthName: req.body.FourthName,
                SurName: req.body.SurName,
                Gender: req.body.Gender,
                DateOfBirth: req.body.DateOfBirth,
                PhoneNumber: req.body.PhoneNumber,
                MotherFullName: req.body.MotherFullName,
                MothersProfession: req.body.MothersProfession,
                FathersProfession: req.body.FathersProfession,
                StudentNationality: req.body.StudentNationality,
            },
            NationalityCertificate: {
                NationalityCertificateNo: req.body.NationalityCertificateNo,
                NcReleaseDate: req.body.NcReleaseDate,
                NcplaceOfBirth: req.body.NcplaceOfBirth,

            },
            StatusID: {


                SidReleaseDate: req.body.SidReleaseDate,
                placeOfRelease: req.body.placeOfRelease,
            },


            residenceCard: {
                rcNumber: req.body.rcNumber,
                rcdReleaseDate: req.body.rcdReleaseDate,
                Address: req.body.Address,
                Section: req.body.Section,
                Alley: req.body.Alley,
                House: req.body.House,
            },

            highSchool: {
                ExamNum: req.body.ExamNum,
                Average: req.body.Average,
                Total: req.body.Total

            },


            BranchName: req.body.BranchName,

            StudentId: new StudentId({
                StatusIDNo: req.body.StatusIDNo,

            }),
        });

        const result = await Student.findOne({
            'StudentId.StatusIDNo': req.body.StatusIDNo
        });

        if (!result) {
            try {
                const result = await student.save();

                if (result) {
                    req.flash('success_msg', 'تم حفظ المعلومات بنجاح');
                    res.redirect('/client/add_studentInfo');
                }
            } catch (ex) {
                for (field in ex.errors) {
                    errors.push({
                        text: ex.errors[field].message
                    });
                    console.log(ex.errors[field]);
                }
                res.render('client/information', {
                    title: 'اضافة طالب',
                    breadcrumbs: true,
                    errors: errors,
                    body: req.body
                });
            }
        } else {
            errors.push({
                text: 'رقم الهوية مسجل بل الفعل'
            });
            res.render('client/information', {
                title: 'اضافة طالب',
                breadcrumbs: true,
                errors: errors,
                body: req.body
            });
        }
    }
});





// GET Signup Route.
router.get('/signup', (req, res) => {
    res.render('client/signup', {
        title: 'Sign up',
        breadcrumbs: false,
        layout: 'signin'
    })
});
// POST  Signup Route.
router.post('/signup', (req, res) => {

    const { name, email, password } = req.body;
    //------------ Validation passed ------------//
    Client.findOne({ email: email }).then((client) => {
        if (client) {
            //------------ User already exists ------------//
            req.flash('error_msg', " already registered ")


        } else {
            const oauth2Client = new OAuth2(ClientID, ClientSecret, RedirectURL);

            oauth2Client.setCredentials({
                refresh_token: RefreshToken,
            });
            const accessToken = oauth2Client.getAccessToken();

            const token = jwt.sign({ name, email, password }, JWT_KEY, {
                expiresIn: "30m",
            });
            const CLIENT_URL = "http://" + req.headers.host + "/client";

            const html = `
                  <h2>Please click on below link to activate your account</h2>
                  <p>${CLIENT_URL}/activate/${token}</p>
                  <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
                  `;

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: "martincortez111998@gmail.com",
                    clientId: ClientID,
                    clientSecret: ClientSecret,
                    refreshToken: RefreshToken,
                    accessToken: accessToken,
                },
            });

            // send mail with defined transport object
            const mailOptions = {
                from: ' "منصة التسجيل الخاصه بعلوم الحاسوب" <martincortez111998@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Activate link", // Subject line
                generateTextFromHTML: true,
                html: html, // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    //   req.flash(
                    //     "error_msg",
                    //     "Something went wrong on our end. Please register again."
                    //   );
                    //   res.redirect("/auth/sigmup");
                } else {
                    console.log("Mail sent : %s", info.response);
                    req.flash(
                        "success_msg",
                        "Activation link sent to email ID. Please activate to log in."
                    );
                    res.redirect("/client/signin");
                }
            });
        }
    });
});

/**
 * GET Activate Token
 */
router.get("/activate/:token", (req, res) => {
    const token = req.params.token;
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    "error_msg",
                    "Incorrect or expired link! Please register again."
                );
                res.redirect("/client/signup");
            } else {
                const { name, email, password } = decodedToken;
                Client.findOne({ email: email }).then((client) => {
                    if (client) {
                        //------------ User already exists ------------//
                        req.flash(
                            "error_msg",
                            "Email ID already registered! Please log in."
                        );
                        res.redirect("/client/signin");
                    } else {
                        const newUser = new Client({
                            name,
                            email,
                            password,
                        });

                        bcryptjs.genSalt(12, (err, salt) => {
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) { console.log(err); }
                                newUser.password = hash;
                                newUser.verified = true;
                                newUser
                                    .save()
                                    .then((client) => {
                                        req.flash(
                                            "success_msg",
                                            "Account activated. You can now log in."
                                        );
                                        res.redirect("/client/signin");
                                    })
                                    .catch((err) => console.log(err));
                            });
                        });
                    }
                });
            }
        });
    } else {
        console.log("Account activation error!");
    }
})




//reset 
router.get('/reset', (req, res) => {
    res.render('client/reset', {
        title: 'اعادة تعيين كلمة المرور',
        layout: 'signin'
    });
});
//forgot
router.get('/forgot', (req, res) => {
    res.render('client/forgot', {
        title: 'البحث واعادة تعيين',
        layout: 'signin'
    });
});

router.post('/forgot', (req, res) => {
    const { clientEmail } = req.body;
    //------------ Checking required fields ------------//
    if (!clientEmail) {
        req.flash('error_msg', "Enter an email first ")
        res.redirect("/client/forgot");
    } else {
        Client.findOne({ email: clientEmail }).then((user) => {
            if (!user) {
                //------------ User already exists ------------//
                req.flash('error_msg', " user with this email dose not exists ")
                res.redirect("/client/forgot");
            } else {
                const oauth2Client = new OAuth2(ClientID, ClientSecret, RedirectURL);

                oauth2Client.setCredentials({
                    refresh_token: RefreshToken,
                });
                const accessToken = oauth2Client.getAccessToken();

                const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, {
                    expiresIn: "30m",
                });
                const CLIENT_URL = "http://" + req.headers.host + "/client";
                const output = `
                <h2>Please click on below link to reset your account password</h2>
                <p>${CLIENT_URL}/forgot/${token}</p>
                <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
                `;

                Client.updateOne({ rest_token: token }, (err, success) => {
                    if (err) {
                        req.flash('error_msg', "something wrong happened ")
                        res.redirect("/client/forgot");
                    } else {
                        const transporter = nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                type: "OAuth2",
                                user: "martincortez111998@gmail.com",
                                clientId: ClientID,
                                clientSecret: ClientSecret,
                                refreshToken: RefreshToken,
                                accessToken: accessToken,
                            },
                        });

                        // send mail with defined transport object
                        const mailOptions = {
                            from: '<martincortez111998@gmail.com>', // sender address
                            to: clientEmail, // list of receivers
                            subject: "Account Password Reset", // Subject line
                            html: output, // html body
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                // console.log(error);
                                req.flash(
                                    "error_msg",
                                    "Something went wrong try again later."
                                );
                                res.redirect("/client/forgot");
                            } else {
                                console.log("Mail sent : %s", info.response);
                                req.flash(
                                    "success_msg",
                                    "Password reset link sent to email, Please follow the instructions."
                                );
                                res.redirect("/client/signin");
                            }
                        });
                    }
                });
            }
        });
    }
});

router.get('/forgot/:token', (req, res) => {
    const { token } = req.params;
    if (token) {
        jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
            if (err) {
                req.flash("error_msg", "Incorrect or expired link!");
                res.redirect("/client/signin");
            } else {
                const { _id } = decodedToken;
                Client.findById(_id, (err, user) => {
                    if (err) {
                        req.flash(
                            "error_msg",
                            "User with this email  does not exist!."
                        );
                        res.redirect("/client/signin");
                    } else {
                        console.log("goitres" + _id + " " + token)
                        res.render('client/reset', { id: _id, token: token });
                    }
                });
            }
        });
    } else {
        console.log("Error while rest your password");
    }
});

router.post('/reset/:id/:token', (req, res) => {
    let { clientPassword } = req.body;
    let id = req.params.id;
    let token = req.params.token;
    console.log("reset" + id + " " + token)

    //------------ Checking required fields ------------//
    Client.find({ rest_token: token }).then(user => {
        bcryptjs.genSalt(12, (err, salt) => {
            bcryptjs.hash(clientPassword, salt, (err, hash) => {
                if (err) throw err;
                Client.findByIdAndUpdate({ _id: id }, {
                        password: hash,
                        rest_token: ""
                    })
                    .then(() => {
                        req.flash("success_msg", "password reset successfully");
                        res.redirect(`/client/signin`);
                    })
                    .catch(err => {
                        req.flash("error_msg", "Error while rest you password resetting password!");
                        res.render(`client/reset`, { id: id, token: token });
                    })
            });
        });
    }).catch()
});


// Signout Route
router.get('/signout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'لقد قمت بتسجيل الخروج بنجاح من التطبيق.');
    res.redirect('/client/home');
});

module.exports = router;