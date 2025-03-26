export const getTotalCount = (elements, limit = 10) => {
    return Math.ceil(elements / limit);
}

export const getPages = (totalPages) => {
    const result = []

    for(let i = 0; i < totalPages; i++) {
        result.push(i + 1)
    }

    return result;
}