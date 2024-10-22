export const getTypeAhead = (itemList, input) => {
    const filtered = itemList.filter(
      (item, index) => {
        const lowercaseList = itemList
        return lowercaseList[index].toLowerCase().indexOf(input.toLowerCase()) > -1
      }
    )
    return filtered
  }
  