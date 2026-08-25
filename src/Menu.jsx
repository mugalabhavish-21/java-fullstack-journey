import { MenuItem } from "./MenuItem";
export const Menu = () => {
    function handleOrder(itemname, itemprice) {
        alert(`Ordered  ${itemname} for $${itemprice}`);
    }
    return (
        <div>
            <h2>Menu</h2>
            <MenuItem name="Pizza" price={10} onOrder={handleOrder} />
            <MenuItem name="Burger" price={8} onOrder={handleOrder} />
            <MenuItem name="Pasta" price={12} onOrder={handleOrder} />
        </div>
    );
};
