const getUser = async (id) => {
    try {
        const userRaw = await fetch(`http://localhost:3000/account/${id}`, {
            method: 'GET'
        })
        const userJson = await userRaw.json();
        if (userJson.length != 1) {
            throw new Error(`User with id ${id} not found`)
        } else {
            const user = userJson[0];
            console.log(user);
            return user;
        }
        
    } catch {
        throw new Error(`User with id ${id} not found`)
    }
    
}


const User = async ({params}) => {
    const user = await getUser(params.user)
    console.log(user.id);
    return (
        <div>
            {params.user}
            <div>
                {user.id}
            </div>
        </div>
    )
}

export default User