export const debounce = (func, wait) => {
    let timeout;
    let counter = 0;

    return function (...args) {
        const context = this;
        const later = function () {
            timeout = null;
            counter = 0;
            return func.apply(context, args);
        };

        if (!timeout) {
            timeout = setTimeout(later, wait);
            counter++;
        } else {
            clearTimeout(timeout);
            counter++;
            timeout = setTimeout(later, wait);
            return counter;
        }
    };
};
