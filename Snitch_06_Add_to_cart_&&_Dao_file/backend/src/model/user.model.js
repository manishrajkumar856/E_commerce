import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    contact: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: 'buyer'
    },
    password: {
        type: String,
        required: function(){
            return !this.googleId;
        },
        select: false,
    },
    profileUrl: {
        type: String,
    },
    googleId: {
        type: String
    }
});

userSchema.pre('save', async function(){
    if(!this.isModified("password")) return;

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
});


userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model('User', userSchema);
export default userModel;