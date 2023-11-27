import Login from "./Login";

const Authentication = () => {
    return (
        <div className="justify-center items-center flex h-screen">
            <div className="border border-gray-300 p-6 bg-white rounded-md max-w-md mx-auto">
                <div className="text-lg font-semibold mb-4 text-center">Login</div>
                <Login />
            </div>
        </div>
    );
};

export default Authentication;
