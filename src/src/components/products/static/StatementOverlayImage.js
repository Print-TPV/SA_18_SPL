import Booklet_Half_Back_Mobile from '../../../assets/images/Booklet_Half_Back_Mobile.png'
import Booklet_Half_Front_Mobile from '../../../assets/images/Booklet_Half_Front_Mobile.png'
import Booklet_Half_Back from '../../../assets/images/Booklet_Half_Back.png'
import Booklet_Half_Front from '../../../assets/images/Booklet_Half_Front.png'
import Booklet_Half_Inside_Center_Staples from '../../../assets/images/Booklet_Half_Inside_Center_Staples.png'
import Booklet_Half_Inside_Center from '../../../assets/images/Booklet_Half_Inside_Center.png'
import {memoPadsType, ncrType} from "../Simpleprint/PreviewHelper";

const StatementOverlayImage = (props) => {

    let overlayImageArray = []

    if (props.isBookletProduct && props.renderSide === 'left') {
        if (props.totalPage < 5 && (props.currentPage === 0 || (props.currentPage === props.totalPage && props.currentPage !== 1))) {
            overlayImageArray.push(Booklet_Half_Back_Mobile);
        } else if (props.totalPage < 5 && props.nextPage === null) {
            overlayImageArray.push(Booklet_Half_Front_Mobile);
        } else if (props.currentPage === 0 || (props.currentPage === props.totalPage && props.currentPage !== 1)) {
            overlayImageArray.push(Booklet_Half_Back);
        } else if (props.nextPage === null) {
            overlayImageArray.push(Booklet_Half_Front);
        } else if (props.booklet === 'Saddlestitch' && props.totalPage > 4 && props.nextPage !== null && Math.round(props.bookletTotalPage / 2) === props.selectedPage) {
            overlayImageArray.push(Booklet_Half_Inside_Center_Staples);
        } else if (props.nextPage !== null) {
            overlayImageArray.push(Booklet_Half_Inside_Center);
        }
    }
    if (props.isBookletProduct && props.renderSide === 'right') {
        if (props.currentPage === 0 || (props.currentPage === props.totalPage && props.currentPage !== 1)) {
            overlayImageArray.push(Booklet_Half_Back);
        } else if (props.currentPage === 1) {
            overlayImageArray.push(Booklet_Half_Front);
        } else if (props.nextPage === null && props.selectedPage % 2 === 0) {
            overlayImageArray.push(Booklet_Half_Back_Mobile);
        } else if (props.nextPage === null) {
            overlayImageArray.push(Booklet_Half_Front_Mobile);
        }
    }
    if (props.isNCRProduct) {
        overlayImageArray.push(ncrType["NCR ".concat(props.pageSize).concat(" ").concat(props.paperTypeOptions).concat(" ").concat(props.pageOrientation)]);
    }
    if (props.isMemoPadsProduct) {
        overlayImageArray.push(memoPadsType["Memo_".concat(props.pageSize).concat("_").concat(props.pageOrientation)]);
    }

    return overlayImageArray
}

export default StatementOverlayImage