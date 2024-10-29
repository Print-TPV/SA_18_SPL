import {memoPadsType} from "../Simpleprint/PreviewHelper";


const QuarterOverlayImage = (props) => {

    let overlayImageArray = []
    if (props.isMemoPadsProduct && props.currentPage === 1) {
        overlayImageArray.push(memoPadsType["Memo_".concat(props.pageSize).concat("_").concat(props.pageOrientation)]);
    }

    return overlayImageArray
}

export default QuarterOverlayImage