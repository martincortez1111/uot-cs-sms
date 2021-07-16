const Joi = require('joi');
const mongoose = require('mongoose');

//const mongoosePaginate = require('mongoose-paginate');

const studentIdSchema = new mongoose.Schema({
    StatusIDNo: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length > 5;
            },
            message: 'يجب ان يكون طول رقم الهويه اكثر من 5 ارقام'
        }
    }
});

const StudentId = mongoose.model('StudentId', studentIdSchema);

const studentSchema = new mongoose.Schema({
    //معلومات الطالب 
    StudentInfo: {
        StName: {
            type: String,
            required: true,
        },
        StFname: {
            type: String,
            required: true
        },
        StGname: {
            type: String,
            required: true,
        },
        FourthName: {
            type: String,
            required: true,
        },
        SurName: {
            type: String,
            required: true,
        },
        Gender: {
            type: String,
            required: true,


        },
        DateOfBirth: {
            type: String,
            required: true
        },
        PhoneNumber: {
            type: String,
            required: true
        },
        MotherFullName: {
            type: String,
            required: true


        },
        MothersProfession: {
            type: String,
            required: true
        },
        FathersProfession: {
            type: String,
            required: true
        },
        StudentNationality: {
            type: String,
            required: true
        }

    },
    //معلومات شهادة الجنسية
    NationalityCertificate: {
        NationalityCertificateNo: {
            type: String,
            required: true
        },

        NcReleaseDate: {
            type: String,
            required: true
        },
        NcplaceOfBirth: {
            type: String,
            required: true
        }
    },
    // معلومات هوية الاحوال المدنية

    StatusID: {


        SidReleaseDate: {
            type: String,

        },
        placeOfRelease: {
            type: String,

        },
    },
    //معلومات بطافة السكن
    residenceCard: {
        rcNumber: {
            type: String,
            required: true
        },
        rcdReleaseDate: {
            type: String,
            required: true
        },
        Address: {
            type: String,
            required: true
        },
        Section: {
            type: String,
            required: true
        },
        Alley: {
            type: String,
            required: true
        },
        House: {
            type: String,
            required: true
        }
    },
    highSchool: {
        ExamNum: {
            type: String,
            required: true

        },
        Average: {
            type: String,
            required: true

        },
        Total: {
            type: String,
            required: true

        }

    },


    BranchName: {
        type: String,
        required: true,

    },



    StudentId: studentIdSchema
});

//studentSchema.plugin(mongoosePaginate);

const Student = mongoose.model('Student', studentSchema);

function validateStudent(student) {
    const schema = {
        StName: Joi.string().required().label(' لا يمكن ترك الاسم الاول فارغ'),
        StFname: Joi.string().required().label(' لا يمكن ترك اسم الاب فارغ'),
        StGname: Joi.string().required().label(' لا يمكن ترك اسم الجد فارغ'),
        FourthName: Joi.string().required().label(' لا يمكن ترك الاسم الرابع فارغ'),
        SurName: Joi.string().required().label('  لا يمكن ترك اللقب فارغ'),
        Gender: Joi.string().required().label(' لا يمكن ترك الجنس فارغ'),
        DateOfBirth: Joi.string().required().label(' لا يمكن ترك تاريخ الميلاد فارغ'),
        StudentNationality: Joi.string().required().label(' لا يمكن ترك حقل الجنسية فارغ'),
        PhoneNumber: Joi.string().required().label(' لا يمكن ترك رقم الموبايل فارغ'),
        MotherFullName: Joi.string().required().label(' لا يمكن ترك اسم الام الكامل فارغ'),
        MothersProfession: Joi.string().required().label(' لا يمكن ترك مهنة الوالدة فارغ'),
        FathersProfession: Joi.string().required().label(' لا يمكن ترك مهنة الوالد فارغ'),
        NationalityCertificateNo: Joi.string().required().label(' لا يمكن ترك رقم شهادةالجنسية فارغ'),
        NcReleaseDate: Joi.string().required().label('  لا يمكن ترك تاريخ اصدار شهادة الجنسية فارغ'),
        NcplaceOfBirth: Joi.string().required().label('  لا يمكن ترك محل الولاده فارغ'),
        SidReleaseDate: Joi.string().required().label('  لا يمكن ترك تاريخ اصدار هوية الاحوال'),
        placeOfRelease: Joi.string().required().label('  لا يمكن ترك محل الاصدار فارغ'),
        rcNumber: Joi.string().required().label('  لا يمكن ترك رقم بطاقة السكن فارغ'),
        rcdReleaseDate: Joi.string().required().label('  لا يمكن ترك تاريخ اصدار بطاقة السكن فارغ'),
        Address: Joi.string().required().label('  لا يمكن ترك العنوان فارغ'),
        Section: Joi.string().required().label('  لا يمكن ترك حقل المحله فارغ'),
        Alley: Joi.string().required().label('  لا يمكن ترك الزقاق فارغ'),
        House: Joi.string().required().label('  لا يمكن ترك حقل الدار فارغ'),
        ExamNum: Joi.string().required().label('  لا يمكن ترك الرقم الامتحاني فارغ'),
        Average: Joi.string().required().label('  لا يمكن ترك المعدل فارغ'),
        Total: Joi.string().required().label('  لا يمكن ترك المجموع فارغ'),
        BranchName: Joi.string().required().label(' لايمكن ترك حقل الفرع فارغ'),
        StatusIDNo: Joi.string().required().label('  لا يمكن ترك رقم هوية الاحوال فارغ'),
        _method: Joi.string().empty('')
    };

    return Joi.validate(student, schema);
}

exports.StudentId = StudentId;
exports.Student = Student;
exports.validate = validateStudent;