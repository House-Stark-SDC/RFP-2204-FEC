import React from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import CartDrawerItem from './CartDrawerItem';
import CartDrawerBtns from './CartDrawerBtns';

export default function CartDrawer({ closeDrawer, localCart }) {
  const cartElements = localCart.map((item) => (
    <CartDrawerItem
      count={item.count}
      prodName={item.prodName}
      styleName={item.styleName}
      styleUrl={item.styleUrl}
      price={item.price}
      salePrice={item.salePrice}
      size={item.size}
      key={nanoid()}
    />
  ));

  return (
    <div className="drawer--container">
      <div
        className="drawer-window fade-in"
        onClick={closeDrawer}
        onKeyDown={closeDrawer}
        role="button"
        tabIndex={0}
        aria-label="transparent div"
      />
      <div className="header--cart-drawer slide-in">
        <div>
          <h3 className="cart-drawer--header">Your Cart</h3>
          {cartElements}
        </div>
        <FontAwesomeIcon
          icon={faXmark}
          color="black"
          size="xl"
          type="button"
          onClick={closeDrawer}
          className="cart-drawer-exit"
        />
        <CartDrawerBtns />
      </div>
    </div>
  );
}

CartDrawer.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
  localCart: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
};
