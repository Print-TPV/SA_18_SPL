
export const getTabMatrixIndex = (tabSize, numOfTabs) => {
    let finalArray = [];
    let array = [];
    const totalTabArr = Array.from({length: numOfTabs}, (_, i) => i + 1)
    for (let i = 1; i <= tabSize; i++) {
        if (totalTabArr.includes(i)) {
            array.push(i);
        } else {
            array.push(0);
        }
    }
    const clonedArray = Array.from(array);
    finalArray.push(clonedArray)
    for (let j = 1; j <= numOfTabs; j++) {
        const maxNumber = Math.max(...array);
        const nextNum = maxNumber + 1;
        const indexMin = array.indexOf(Math.min(...array.filter(num => num !== 0)));
        if (totalTabArr.includes(nextNum)) {
            array.splice(indexMin, 1, nextNum);
        } else {
            array.splice(indexMin, 1, 0);
        }
        const clonedArray1 = Array.from(array);
        finalArray.push(clonedArray1)
    }
    const filteredArray = finalArray.filter(row => !row.every(num => num === 0));
    return filteredArray[0].map((_, colIndex) =>
        filteredArray.map(row => row[colIndex])
    );
}

export const getTabMatrix = (tabData) => {
    if (!tabData || !tabData.details || tabData.details.length === 0) {
        return [];
    }
    const numOfTabs = tabData.details.length;
    let tabMatrix = Array.from(getTabMatrixIndex(tabData.size, numOfTabs));
    const tabDetails = tabData.details;
    for (let i = 0; i < tabMatrix.length; i++) {
        for (let j = 0; j < tabMatrix[i].length; j++) {
            const tab = tabDetails.find(value => {
                return value.previewIndex === tabMatrix[i][j]
            });
            tabMatrix[i][j] = tab ? tab : {};
        }
    }
    return tabMatrix
}

/**
 * Return index of next element containing "Tab"
 * @param {Array} array - Page number array
 * @param {Number} startIndex - Current selected page number
 * @return {Number} - Return the first match index containing "Tab"
 */
export const findNextTabElementIndex = (array, startIndex) => {
    // Ensure the starting index is within bounds
    if (startIndex < 0 || startIndex >= array.length) {
        return null; // Invalid start index
    }
    // Start searching from the next index
    for (let i = startIndex + 1; i < array.length; i++) {
        if (array[i].toString().includes("Tab")) {
            return i; // Return the first match index found
        }
    }
    return null; // No element containing "Tab" found
}

/**
 * Get tab text font style
 * @param {String} key - Input value
 * @return {{}} - Return object having fontStyle & fontWeight
 */
export const getFontStyle = (key) => {
    switch (key) {
        case 'regular':
            return {
                "fontStyle": "normal",
                "fontWeight": "normal"
            };
        case 'italic':
            return {
                "fontStyle": "normal",
                "fontWeight": "italic"
            };
        case 'bold':
            return {
                "fontStyle": "normal",
                "fontWeight": "bold"
            };
        case 'bItalic':
            return {
                "fontWeight": "bold",
                "fontStyle": "italic"
            }
        default:
            return {
                "fontStyle": "normal",
                "fontWeight": "normal"
            };
    }
}

/**
 * Get tab text font
 * @param {String} key - Input value
 * @return {{}} - Return font
 */
export const getFont = (key) => {
    switch (key) {
        case 'tnr':
            return `'Times New Roman', Times, Serif`;
        case 'cour':
            return `'Courier', 'Courier New', monospace`;
        case 'helv':
            return `'Helvetica', 'Arial', sans-serif`;
        default:
            return `'Times New Roman', Times, Serif`;
    }
}

/**
 * Used to show tab summary beneath Tab property icons
 * @param {{}} tabData - Details of tab added
 * @return {{}} - Return tab summary as '1/3 cut matte, 3 tabs total.'
 */
export const getTabSummary = (tabData) => {
    if (tabData && tabData.details && tabData.details.length > 0) {
        return `${tabData.size === 3 ? '1/3 cut ' : '1/5 cut '}${tabData.material}, ${tabData.tabCount} tabs total  `;
    }
    return null;
}

/**
 * Return max page number present in the tab data
 * @param {{}} tabData - Details of tab added
 * @return Number} - page number
 */
export const getTabMaxPageNumber = (tabData) => {
    return tabData && tabData.details && tabData.details.reduce((max, detail) => {
        return detail.page > max ? detail.page : max;
    }, null);
}

/**
 * validate user configured tabs with total uploaded file
 * pages. Filter out pages greater than total number of page
 * from the tabData
 * @param {{}} tabData - Details of tab added
 * @param {Number} pageCount - Details of tab added
 * @return {{}} - Valid tab details
 */
export const validTabData = (tabData, pageCount) => {
    if (tabData && tabData.details && tabData.details.length > 0) {
        tabData.details = tabData.details.filter(detail => {
            return pageCount ? detail.page <= pageCount : detail
        });
    }
    return tabData;
}

/**
 * Return sorted tab details by preview index
 * @param {{}} tabData - Details of tab added
 * @return {{}} - Sorted tab details
 */
export const sortedTabData = (tabData) => {
    if (tabData && tabData.details && tabData.details.length > 0) {
        tabData.details = tabData.details.sort((a, b) => a.previewIndex - b.previewIndex);
    }
    return tabData;
}


/**
 * Return index of all the element containing Tab OR ,Tab
 * @param {Array} pagesArr - Page number array
 * @return {Array} - array of tab index
 */
export const getTabIndexArray = (pagesArr) => {
    const tabIndexArray = pagesArr.reduce((acc, element, index) => {
        if (element.toString() === "Tab" || element.toString().includes(",Tab")) {
            acc.push(index);
        }
        return acc;
    }, []);
    return tabIndexArray
}

/**
 * Return row
 * if need for double side printing
 * @param {Array} matrix - Two dimension array.
 * @param {Number} matrixColumnIndex - Column index of two dimension array.
 * @return {Array} - Return a String. Example ["T","1","2","3","B","T","4]
 */
export const getTabDetails = (matrix, matrixColumnIndex) => {
    if (matrix.length === 0 || matrixColumnIndex < 0 || matrixColumnIndex >= matrix[0].length) {
        return [];
    }
    return matrix.map(row => row[matrixColumnIndex]);
}

/**
 * Return uploaded file pages numbers along with tabs and any extra sheet
 * if need for double side printing
 * @param {Number} numOfPages - Number of pages of uploaded file
 * @param {String} sides - Double sided print/Single sided print.
 * @param {{}} tabData - Details of tab added
 * @return {Array} - Return a String. Example ["T","1","2","3","B","T","4]
 */
//TODO Change return type to Array for tier c
export const getTabMetadata = (numOfPages, sides, tabData) => {
    const arr = Array.from({length: numOfPages}, (_, i) => i + 1);
    if (tabData.before) {
        let counter = 0;
        tabData.details.forEach(tab => {
            const index = arr.indexOf(tab.page);
            arr.splice(index, 0, `T`);
            if (sides === 'HeadToHead' || sides === 'HeadToFoot') {
                if (counter % 2 === 0 && tab.page % 2 === 0) {
                    counter = counter + 1;
                    arr.splice(index, 0, `B`);
                }
                if (counter % 2 !== 0 && tab.page % 2 !== 0) {
                    counter = counter + 1;
                    arr.splice(index, 0, `B`);
                }
            }
        })
    } else {
        tabData.details.forEach(tab => {
            const index = arr.indexOf(tab.page);
            arr.splice(index + 1, 0, `T`);
        })
        if (sides === 'HeadToHead' || sides === 'HeadToFoot') {
            let counter = 0;
            tabData.details.forEach(tab => {
                const index = arr.indexOf(tab.page);
                if (counter % 2 === 0 && tab.page % 2 !== 0) {
                    counter = counter + 1;
                    arr.splice(index + 1, 0, `B`);
                }
                if (counter % 2 !== 0 && tab.page % 2 === 0) {
                    counter = counter + 1;
                    arr.splice(index + 1, 0, `B`);
                }
            })
        }
    }
    return arr;
}
