
const getUser = async (id) => {
    const user = await fetch(`http://localhost:3000/users/${id}`, {
        method: 'GET'
    })
}


const User = ({params}) => {
    const user = getUser(params.id);
    return (
        <div>User</div>
    )
}

export default User