import getInstance from "."

type User = {
    username: string
    password: string
}

const getUser = async (username: string): Promise<User | undefined> => {
    console.log(`getting user with username ${username}`)
    const instance = await getInstance()
    const user = await instance.select('*').from<User>('user').where('username', username).first();
    console.log('got user:', user)

    return user
}

const createUser = async (username: string, password: string): Promise<boolean> => {
    try {
        console.log(`creating user with username ${username}, password ${password}`)
        const instance = await getInstance()
        await instance('user').insert({ username, password })
        return true
    } catch (e) {
        console.log("DB username duplicate")
        return false
    }
}

const deleteUser = async (username: string): Promise<void> => {
    console.log(`deleting user ${username}`)
    const instance = await getInstance()
    await instance('user').where('username', username).del()
}

const updatePassword = async (username: string, password: string): Promise<void> => {
    console.log(`updating password for user ${username}`)
    const instance = await getInstance()
    await instance('user').where('username', username).update({password})
}

const user = {
    getUser: getUser,
    createUser: createUser,
    deleteUser: deleteUser,
    updatePassword: updatePassword,
}

export default user