import React, { useState } from 'react'
import { t } from '$themelocalization'
import { ReactComponent as ProofIcon } from '$assets/icons/proof.svg'

const SPLSProof = ({ onToggle, hideLink, currentProduct, orderItemId, isMobile, hasThumbnails }) => {
  const [fileUrl] = useState(
    currentProduct && currentProduct.Proof ? `${currentProduct.Proof.Url}&OrderItemID=${orderItemId}` : null
  )
  const [isDownloadProof] = useState(
    currentProduct && currentProduct.Proof &&
      ((isMobile && !currentProduct.Proof.MimeType.startsWith('image/')) ||
          (!isMobile && currentProduct.Proof.MimeType !== 'application/pdf' &&
              !currentProduct.Proof.MimeType.startsWith('image/')))
  )

  const handleModalToggle = () => {
    onToggle()
  }

  if (hideLink) return null
  if (!isMobile) {
    if (isDownloadProof) {
      return (
        <a download className="view-proof-wrapper desktop" href={fileUrl} >
          <div className="view-proof">
            <ProofIcon className="view-proof-icon" width="20px" height="24px" />
            <div className="view-proof-title">{t('product.view_proof')}</div>
          </div>
        </a>
      )
    }

    return <div className="view-proof-wrapper desktop" onClick={handleModalToggle} >
      <div className="view-proof">
        <ProofIcon className="view-proof-icon" width="20px" height="24px" />
        <div className="view-proof-title">{t('product.view_proof')}</div>
      </div>
    </div >
  } else {
    if (isDownloadProof) {
      return <a download className={`view-proof-wrapper mobile ${hasThumbnails ? '' : 'no-thumbs'}`} href={fileUrl}>
        <ProofIcon className="view-proof-icon" width="20px" height="24px" />
      </a>
    }
    return <div className={`view-proof-wrapper mobile ${hasThumbnails ? '' : 'no-thumbs'}`} onClick={handleModalToggle}>
      <ProofIcon className="view-proof-icon" width="20px" height="24px" />
    </div>
  }
}

export default SPLSProof
