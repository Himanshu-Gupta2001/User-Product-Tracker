const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export {
    formatCurrency
}