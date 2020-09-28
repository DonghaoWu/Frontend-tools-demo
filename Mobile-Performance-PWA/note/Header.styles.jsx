import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HeaderCOntainer = styled.div`
    @media screen and (max-width: 800px) {
        height: 60px;
        padding:10px;
        margin-bottom:20px
    }
`

export const LogoContainer = styled(Link) `
    @media screen and (max-width: 800px) {
        width: 50px;
        padding:0;
    }
`

export const OptionsContainer = styled.div`
    @media screen and (max-width: 800px) {
        width: 80%;
    }
`

export const MenuItemContainer = styled.div`
    @media screen and (max-width: 800px) {
        height: 200px;
    }
`

export const CollectionItemContainer = styled.div`
    @media screen and (max-width: 800px) {
        width: 40vw;

        &:hover{
            .image{
                opacity:unset;
            }

            button{
                opacity: unset;
            }
        }
    }
`

export const CollectionPreviewContainer = styled.div`
    @media screen and (max-width: 800px) {
        align-items: center;
    }
`

export const PreviewContainer = styled.div`
    @media screen and (max-width: 800px) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap:15px;
    }
`

export const AddButton = styled(CustomButton)`
    @media screen and (max-width: 800px) {
        display: block;
        opacity:0.9;
        min-width: unset;
        padding: 0 10px 0 10px;
    }
`

