import React from 'react'
import { CreateBookletGuide, FileSetupDetailsContainer } from './FileSetupDetails.styles'
import { Link } from '../StaplesUI/Link/Link'
import Booklet_Guide from '../../../assets/images/Booklet Guide 2024.pdf'
export const FileSetupDetails = ({ isBookletProduct }) => {

  return (
    <FileSetupDetailsContainer>
      {
        isBookletProduct ?
          <>
            <ul>
              <li>Recommended file format: flattened PDF with all fonts embedded</li>
              <li>Single pages, not spreads - arranged in correct reading order</li>
              <li>No password protection</li>
              <li>High resolution (300dpi recommended)</li>
              <li>Final page count must be a multiple of four</li>
              <li>Maximum 80 pages</li>
            </ul>
            <CreateBookletGuide>
              <span>
                <b>{'Note: '}</b>{'For details on how to create the booklet, please '}
                <Link color={'black'} underline={true} customCSS={{ 'display': 'contents' }}
                      href={Booklet_Guide}
                      target="_blank">{'download this PDF guide.'}</Link>
              </span>
            </CreateBookletGuide>
          </>
          :
          <ul>
            <li>Recommended file format: flattened PDF with all fonts embedded</li>
            <li>No password protection</li>
            <li>High resolution (300dpi recommended)</li>
          </ul>
      }
    </FileSetupDetailsContainer>
  )
}