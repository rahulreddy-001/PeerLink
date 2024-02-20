async function registerUser({
    username,
    password,
    User,
    Friends,
    auth
}){
    var user = await User.findOne({username});
    if(!user){
        var user  = await auth.createHash({username, password})
        await User.create(user)
        await Friends.create({username, friends : []})
    }else{
        throw new Error('username already exists')
    }
}

async function loginUser({
    username,
    password,
    User,
    auth
}){
    var user = await User.findOne({username});
    if(!user){
        throw new Error('invalid username')
    }else {
        var valid = await auth.verifyUser({
            password, 
            salt  : user.salt, 
            hash : user.hash
        })
        if(!valid) {
            throw new Error('invalid password')
        } else {
            const token = await auth.createJWT(username)
            return function setCookie(res){
                res.cookie("access_token", token)
            }
        }
    }
}

async function logoutUser(){
    return function clearCookie(res) {
        res.clearCookie("access_token")
    }
}


module.exports = {
    registerUser, loginUser, logoutUser
}