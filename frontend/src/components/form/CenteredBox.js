const CenteredBox = ({ title, children }) => {
    return (
        <div className="justify-center items-center flex h-screen min-h-screen">
            <div className="border border-gray-300 p-6 bg-white rounded-md max-w-md mx-auto">
                {title && (
                    <div className="text-lg font-semibold mb-4 text-center">{title}</div>
                )}
                {children}
            </div>
        </div>
    );
};

export default CenteredBox;
