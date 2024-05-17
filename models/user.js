const mongoose  =  require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/chachaBidhayakHai");

const userSchema =  mongoose.Schema({
    name:String,
    username: String,
    email:String,
    password: String,
    image:String,

})
module.exports = mongoose.model("user" , userSchema);