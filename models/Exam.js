const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema({
questions: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }
],
instruction1:{
    type: String
},
instruction2:{
    type: String
},
instruction3:{
    type: String
},
instruction4:{
    type: String
},
instruction5:{
    type: String
},
duration_hours:{
    type: String,
    enum: [0, 1, 2, 3],
    required: true,
},
duration_minutes:{
    type: String,
    enum: [0, 15, 30, 45 ],
    required: true,
},
exam_code:{
    type: Number,
    required: true
}
});

module.exports = mongoose.model('Exam', ExamSchema)