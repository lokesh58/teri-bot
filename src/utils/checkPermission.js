module.exports = (member, cmd) => {
    const {client} = member
    //Check if bot owner only command
    if (cmd.ownerOnly) {
        if (!client.owners
            || !Array.isArray(client.owners)
            || !client.owners.includes(member.id)) {
            return false
        }
    }
    //Check if user has the required permissions to use this command
    const reqPerm = cmd.requiredPermissions
    if(reqPerm && Array.isArray(reqPerm)) {
        for(const perm of reqPerm) {
            if (!member.hasPermission(perm))
                return false
        }
    }
    return true
}