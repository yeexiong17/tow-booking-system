export const convertToMalaysiaTime = (utcTimestamp) => {
    const utcDate = new Date(utcTimestamp)

    const malaysiaOffset = 8 * 60

    const malaysiaTime = new Date(utcDate.getTime() + malaysiaOffset * 60 * 1000)

    const formattedTime = malaysiaTime.toLocaleString("en-MY", {
        timeZone: "Asia/Kuala_Lumpur",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    })

    return formattedTime
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