export const debounce = (func, wait) => {
    let timeout;
    let counter = 0;
    console.log(`hello from debounce`);

    return function (...args) {
        const context = this;
        const later = function () {
            console.log(`Total debounces window: ${counter}`);
            timeout = null;
            counter = 0;
            return func.apply(context, args);
        };

        if (!timeout) {
            timeout = setTimeout(later, wait);
            console.log(`Debounce counter: ${counter}`);
            counter++;
        } else {
            clearTimeout(timeout);
            counter++;
            timeout = setTimeout(later, wait);
            console.log(`Debounce counter: ${counter}`);
            return counter;
        }
    };
};
