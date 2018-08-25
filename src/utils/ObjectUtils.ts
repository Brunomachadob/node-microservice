export function filterProperties(obj: object, props: Array<string>) {
    return props.reduce((filtered: object, name: string): object => {
        if (obj[name]) {
            filtered[name] = obj[name];
        }

        return filtered;
    }, {});
}

export function validateOnlyParams(obj: object, props: Array<string>): boolean {
    let keys = Object.keys(obj);

    if (keys.length > 0) {
        return keys.every((key) => props.indexOf(key) > -1)
    }

    return true;
}