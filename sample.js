const obj = {
    title: 'Hats',
    items: [
        {
            id: 1,
            name: 'Brown Brim',
            imageUrl: 'https://i.ibb.co/ZYW3VTp/brown-brim.png',
            price: 25
        }
    ]
}

import React from 'react';

import { SpinnerContainer, SpinnerOverlay } from './with-spinner.styles.scss';

const WithSpinner = (WrappedComponent) => {
    const Spinner = ({ isLoading, ...otherProps }) => {
        isLoadig ? (
            <SpinnerOverlay>
                <SPinnerContainer />
            </SpinnerOverlay>
        ) : (
                <WrappedComponent {...otherProps} />
            )
    }
    return Spinner;
}
