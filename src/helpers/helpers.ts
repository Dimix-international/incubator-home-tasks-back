
export const isInt = (value: number) => {
    return !isNaN(+value) &&
        parseInt(String(value)) === value &&
        !isNaN(parseInt(String(value), 10));
}

