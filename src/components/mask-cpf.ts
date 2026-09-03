export function maskCPF(value: string): string {
    if (!value) return "";

    const cleaned = value.replace(/\D/g, "").slice(0, 11);

    if (cleaned.length <= 3) {
        return cleaned;
    }
    if (cleaned.length <= 6) {
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    }
    if (cleaned.length <= 9) {
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    }

    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
}

export function unmaskCPF(value: string): string {
    return value.replace(/\D/g, "");
}
