export const NameList = () => {
    const names = ["Alice", "Bob", "Charlie", "David", "Eve"];
    const nameList = names.map((name) => <h2 key={name}>{name}</h2>);
    return (
        <div>
            {nameList}
        </div>
    );
};