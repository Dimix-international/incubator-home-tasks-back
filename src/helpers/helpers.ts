import {atob, btoa} from "buffer";

export const isInt = (value: number) => {
    return !isNaN(+value) &&
        parseInt(String(value)) === value &&
        !isNaN(parseInt(String(value), 10));
}

export const getSkip =  (pageNumber: number, pageSize: number): number => {
    return (pageNumber - 1) * pageSize
}
export const getPagesCount = (count: number, pageSize: number): number => {
    return Math.ceil(count / pageSize)
}

export const transformInNumber = (num: string, defaultValue: number) => {
    const value = parseInt(num);
    return isNaN(value) ? defaultValue : +num;
}

export const checkSortBy = (sortValue: string, sortObj: any, defaultValue: string) => {
    if(Object.keys(sortObj).includes(sortValue)) return sortValue;
    return defaultValue
}

export const checkValueSortDirection = (value: string): 'asc' | 'desc' => {
    if (value !== 'asc' && value !== 'desc') return 'desc';
    return value;
}


export const encodedBase64 = (output: string) => btoa(output);
export const decodedBase64 = (output: string) => atob(output);