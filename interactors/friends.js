async function findFriends({username, Friends}){
    var friends = await Friends.findOne({username})
    return friends
}

async function addFriend({username, friendUserName, Friends}){
    var user = await Friends.findOne({username})
    if(user.friends.includes(friendUserName)) {
        throw new Error("user is in your list")
    } else {
        var friend = await Friends.findOne({username : friendUserName})
        if(!friend){
            throw new Error("invalid username")
        }
        user.friends.push(friendUserName);
        friend.friends.push(username);
        await user.save();
        await friend.save();
    }

    return await findFriends({username, Friends})
}

module.exports = { findFriends, addFriend }