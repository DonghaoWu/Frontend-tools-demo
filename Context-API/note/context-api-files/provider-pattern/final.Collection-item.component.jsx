import React, { useContext } from 'react';

import CustomButton from '../Custom-button/Custom-button.component';
import { CartContext } from '../../providers/cart/cart.provider.jsx'

import './Collection-item.styles.scss';

const CollectionItem = ({ item }) => {
    const { addItem } = useContext(CartContext)
    const { name, price, imageUrl } = item;

    return (
        <div className='collection-item'>
            <div className='image' style={{ backgroundImage: `url(${imageUrl})` }} />
            <div className='collection-footer'>
                <span className='name'>{name}</span>
                <span className='price'>{price}</span>
            </div>
            <CustomButton onClick={() => addItem(item)} inverted>
                Add to cart
      </CustomButton>
        </div>
    );
};

export default CollectionItem;