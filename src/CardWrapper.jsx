export const CardWrapper = ({ name, children }) => {
    return (
        <div className="card-wrapper">
            <h2>{name}</h2>
            <div className="card-content">
                {children}
            </div>
        </div>
    );
}