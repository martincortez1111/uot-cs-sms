const express = require('express');

const moment = require('moment');
const randomString = require('randomstring');

const router = express.Router();

const {
    StudentId,
    Student,
    validate
} = require('../models/student');

const {
    Department
} = require('../models/department');

const {
    ensureAuthenticated,
    isAdmin,
    isLoggedIn,
    createAccessControl,
    readAccessControl,
    updateAccessControl,
    deleteAccessControl
} = require('../helpers/auth');

// Students Home Route
router.get('/', [ensureAuthenticated, isAdmin, readAccessControl], async(req, res) => {

    const perPage = 12;

    const page = req.query.page || 1;
    const skip = ((perPage * page) - perPage) + 1;
    const sort = req.query.sort || "asc";

    const student = await Student.find()
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({
            Session: sort
        });

    if (student.length > 0) {
        const pages = await Student.countDocuments();

        res.render('students/index', {
            title: 'الطلاب',

            search_bar: true,
            students: student,
            current: parseInt(page),
            pages: Math.ceil(pages / perPage),
            total: pages,
            perPage: perPage,
            skip: skip,
            to: (student.length + 10)
        });
    } else {
        res.render('students/index', {
            title: 'الطلاب',

            search_bar: true
        });
    }
});


// Student Detail's Route
router.get('/details', [ensureAuthenticated, isAdmin, readAccessControl], async(req, res) => {
    const student = await Student.findOne({
        _id: req.query.id
    });

    if (student) {
        res.render('students/details', {
            title: 'تفاصيل الطالب',
            breadcrumbs: true,
            student: student
        });
    } else {
        req.flash('error_msg', '.........لا يوجد طلاب ');
    }
});

// Search Student Route.
router.post('/', [ensureAuthenticated, isAdmin], async(req, res) => {
    let key = req.body.searchInput;

    const student = await Student.find({
        'StudentId.StatusIDNo': key
    });

    if (student.length > 0) {
        res.render('students/index', {
            title: 'الطالب',
            breadcrumbs: true,
            search_bar: true,
            students: student
        });
    } else {
        req.flash('error_msg', 'Record not found.');
        res.redirect('/students');
    }
});

// Add Student Form Route
router.get('/add', [ensureAuthenticated, isAdmin, createAccessControl], async(req, res) => {
    const dept = await Department.find();

    if (dept) {
        res.render('students/add', {
            title: 'اضافة طالب جديد',

            dept: dept
        });
    }
});

// Process Students Form Data And Insert Into Database.
router.post('/add', [ensureAuthenticated, isAdmin, createAccessControl], async(req, res) => {
    const dept = await Department.find();

    let errors = [];

    const {
        error
    } = validate(req.body);

    if (error) {
        errors.push({
            text: error.details[0].message
        });
        res.render('students/add', {
            title: 'اضافة طالب',
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
                    req.flash('success_msg', 'Information saved successfully.');
                    res.redirect('/students');
                }
            } catch (ex) {
                for (field in ex.errors) {
                    errors.push({
                        text: ex.errors[field].message
                    });
                    console.log(ex.errors[field]);
                }
                res.render('students/add', {
                    title: 'اضافة طالب',
                    breadcrumbs: true,
                    errors: errors,
                    body: req.body
                });
            }
        } else {
            errors.push({
                text: 'Roll Number Already Exists.'
            });
            res.render('students/add', {
                title: 'اضافة طالب',
                breadcrumbs: true,
                errors: errors,
                body: req.body
            });
        }
    }
});

// Student Edit Form
router.get('/edit', [ensureAuthenticated, isAdmin, updateAccessControl], async(req, res) => {
    const student = await Student.findOne({
        _id: req.query.id
    });

    const dept = await Department.find();

    if (student && dept) {
        res.render('students/edit', {
            title: 'تعديل معلومات الطالب',
            breadcrumbs: true,
            student: student,
            dept: dept
        });
    }
});

// Student Update Route
router.put('/:id', [ensureAuthenticated, isAdmin, updateAccessControl], async(req, res) => {

    const {
        error
    } = validate(req.body);

    if (error) {
        req.flash('error_msg', error.details[0].message);
        res.redirect(`/students/edit?id=${req.params.id}`);
    } else {
        const student = await Student.update({
            _id: req.params.id
        }, {

            $set: {
                'StName': req.body.StName,
                'StFname': req.body.StFname,
                'StGname': req.body.StGname,
                'FourthName': req.body.FourthName,
                'SurName': req.body.SurName,
                'Gender': req.body.Gender,
                'DateOfBirth': req.body.DateOfBirth,
                'PhoneNumber': req.body.PhoneNumber,
                'MotherFullName': req.body.MotherFullName,
                'MothersProfession': req.body.MothersProfession,
                'FathersProfession': req.body.FathersProfession,
                'StudentNationality': req.body.StudentNationality,
                'NationalityCertificateNo': req.body.NationalityCertificateNo,
                'NcReleaseDate': req.body.NcReleaseDate,
                'NcplaceOfBirth': req.body.NcplaceOfBirth,
                'SidReleaseDate': req.body.SidReleaseDate,
                'placeOfRelease': req.body.placeOfRelease,
                'rcNumber': req.body.rcNumber,
                'rcdReleaseDate': req.body.rcdReleaseDate,
                'Address': req.body.Address,
                'Section': req.body.Section,
                'Alley': req.body.Alley,
                'House': req.body.House,
                'ExamNum': req.body.ExamNum,
                'Average': req.body.Average,
                'Total': req.body.Total,
                BranchName: req.body.BranchName,
                'StudentId.StatusIDNo': req.body.StatusIDNo
            }



        });

        if (student) {
            req.flash('success_msg', 'تم تحديث معلومات الطالب بنجاح');
            res.redirect('/students');
        }
    }
});

router.delete('/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async(req, res) => {
    const result = await Student.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', '.تم حذف الطالب بنجاح');
        res.send('/students');
    } else {
        res.status(500).send();
    }
});

router.delete('/multiple/:id', async(req, res) => {
    let str = req.params.id;

    for (i in str) {
        console.log(i);
    }

    const result = await Student.find({
        _id: {
            $in: []
        }
    });
    console.log(result);
    if (result) {
        req.flash('success_msg', 'تم حذف الطالب بنجاح');
        res.send('/students');
    } else {
        res.status(500).send();
    }

    //let str = '[' + req.params.id + ']';
    //console.log(str);
});

router.delete('/details/:id', [ensureAuthenticated, isAdmin, deleteAccessControl], async(req, res) => {
    const result = await Student.remove({
        _id: req.params.id
    });

    if (result) {
        req.flash('success_msg', 'تم حذف الطالب بنجاح');
        res.redirect('/students');
    }
});



module.exports = router;