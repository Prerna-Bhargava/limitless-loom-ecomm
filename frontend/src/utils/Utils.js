export function calculateTotalPrice(cart) {
    let totalPrice = 0;
    cart.forEach((product) => {
        totalPrice += product.price;
    });
    return totalPrice.toFixed(2); // Assuming you want to display the total with 2 decimal places
}