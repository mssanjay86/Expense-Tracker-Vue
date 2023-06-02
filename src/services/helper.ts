export function addDataToLocal(storageName: string, Data: any) {
    let val = JSON.parse(localStorage.getItem(storageName) as any)
    if (val&&val.length>0) {
        val.push(JSON.stringify(Data));
        localStorage.setItem(storageName, JSON.stringify(val))
    } else {
        let tempData = [Data]
        localStorage.setItem(storageName, JSON.stringify(tempData))
    }
}