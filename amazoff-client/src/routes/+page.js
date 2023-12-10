export function load({ params }) {
    const result = [];
    for(let i = 0; i < 50; i++){
        result.push({
            id: (Math.random() + 1).toString(36).substring(7),
            name: "List_" + i,
        });
    } 

    return {
        lists: result,
    }
}