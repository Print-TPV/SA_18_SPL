import Booklet_4x9_Back_Mobile from '../../../assets/images/Booklet_4x9_Back_Mobile.png'
import Booklet_4x9_Front_Mobile from '../../../assets/images/Booklet_4x9_Front_Mobile.png'
import Booklet_4x9_Back from '../../../assets/images/Booklet_4x9_Back.png'
import Booklet_4x9_Front from '../../../assets/images/Booklet_4x9_Front.png'
import Booklet_4x9_Inside_Center_Staples from '../../../assets/images/Booklet_4x9_Inside_Center_Staples.png'
import Booklet_4x9_InsidePages from '../../../assets/images/Booklet_4x9_InsidePages.png'

const StandardOverlayImage = (props) => {

    let overlayImageArray = []
    if (props.isBookletProduct && props.renderSide === 'left') {

        if (props.totalPage < 5 && (props.currentPage === 0 || (props.currentPage === props.totalPage && props.currentPage !== 1))) {
            overlayImageArray.push(Booklet_4x9_Back_Mobile);

        } else if (props.totalPage < 5 && props.nextPage === null) {
            overlayImageArray.push(Booklet_4x9_Front_Mobile);
        } else if (props.currentPage === 0 || (props.currentPage === props.totalPage && props.currentPage !== 1)) {
            overlayImageArray.push(Booklet_4x9_Back);
        } else if (props.nextPage === null) {
            overlayImageArray.push(Booklet_4x9_Front);
        } else if (props.booklet === 'Saddlestitch' && props.totalPage > 4 && props.nextPage !== null && Math.round(props.bookletTotalPage / 2) === props.selectedPage) {
            overlayImageArray.push(Booklet_4x9_Inside_Center_Staples);
        } else if (props.nextPage !== null) {
            overlayImageArray.push(Booklet_4x9_InsidePages);
        }
    }
    if (props.isBookletProduct && props.renderSide === 'right') {

        if (props.currentPage === 0 || (props.currentPage === props.totalPage && props.currentPage !== 1)) {
            overlayImageArray.push(Booklet_4x9_Back);
        } else if (props.currentPage === 1) {
            overlayImageArray.push(Booklet_4x9_Front);
        } else if (props.nextPage === null && props.selectedPage % 2 === 0) {
            overlayImageArray.push(Booklet_4x9_Back_Mobile);
        } else if (props.nextPage === null) {
            overlayImageArray.push(Booklet_4x9_Front_Mobile);
        }
    }
    return overlayImageArray
}

export default StandardOverlayImage