import styled from 'styled-components'

export const AccordionContainer = styled.div`
     ${(props) => {
       return props.lockAccordion ? 'margin-top: 16px;' : 'margin-top: 10px;'
     }}
     margin-bottom: 40px;`

export const FileSetupDetailsContainer = styled.div`
    ul{
      list-style-type: disc;
      font-size: 14px;
      line-height: 20px;
      font-family: "Motiva-Light", "Motiva", Helvetica, Arial, sans-serif;
      font-weight: 300;
      display: flex;
      gap: 8px;
      flex-direction: column;
    }`

export const CreateBookletGuide = styled.div`
   margin-top: 10px;
   span{
     font-size: 14px;
     line-height: 20px;
     font-family: "Motiva-Light", "Motiva", Helvetica, Arial, sans-serif;
     font-weight: 300;
     b{
      font-family: "Motiva-Medium", "Motiva", Helvetica, Arial, sans-serif;
      font-weight: 300;
   }}`