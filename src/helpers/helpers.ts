import {atob, btoa} from "buffer";

export const isInt = (value: number) => {
    return !isNaN(+value) &&
        parseInt(String(value)) === value &&
        !isNaN(parseInt(String(value), 10));
}


export const encodedBase64 = (output: string) => btoa(output);
export const decodedBase64 = (output: string) => atob(output);