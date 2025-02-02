export const convertToMalaysiaTime = (utcTimestamp) => {
    const utcDate = new Date(utcTimestamp)
    const malaysiaTime = utcDate.toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" })

    return malaysiaTime
}

export const toCamelCase = (string) => {
    return string
        .replace(/[^a-zA-Z0-9\s-_]/g, '')
        .toLowerCase()
        .split(/[\s-_]+/)
        .map((word, index) =>
            index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('')
}