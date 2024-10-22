import "./PageToggleButton.scss"
import { t } from '$themelocalization'
export const PageToggleButton = ({ setPage, pageNumber, doubleSidedPrinting }) => {
    return (
        <div className="toggle-btn-wrapper">
            <button onClick={() => setPage(1)} className={`${pageNumber === 1 && 'active'} left-btn`}>
                {doubleSidedPrinting > 1 ? t('UploadDocument.Front') : t('UploadDocument.PageNumber', {number: 1})}
            </button>
            <button onClick={() => setPage(2)} className={`${pageNumber === 2 && 'active'} right-btn`}>
                {doubleSidedPrinting > 1 ? t('UploadDocument.Back') : t('UploadDocument.PageNumber', {number: 2})}
            </button>
        </div>
    )
}