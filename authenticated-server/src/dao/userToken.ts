import getInstance from "."

type UserToken = {
    username: string
    token: string
}

const getToken = async (username: string): Promise<UserToken | undefined> => {
    console.log(`getting token with username ${username}`)
    const instance = await getInstance()
    const userToken = await instance.select('*').from<UserToken>('user_token').where('username', username).first();
    console.log('got userToken:', userToken)

    return userToken
}

const insertToken = async (username: string, token: string): Promise<void> => {
    console.log(`inserting token with username ${username} and ${token}`)
    const instance = await getInstance()
    await instance('user_token').insert({ username, token })
        .onConflict('username')
        .merge()
}

const deleteToken = async (username: string): Promise<void> => {
    console.log(`deleting token for ${username}`)
    const instance = await getInstance()
    await instance('user_token').where('username', username).del()
}

const userToken = {
    getToken: getToken,
    insertToken: insertToken,
    deleteToken: deleteToken,
}

export default userToken