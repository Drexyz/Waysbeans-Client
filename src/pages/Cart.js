import '../styles/App.css'
import Navbar from "../components/Navbar";
import styles from "../styles/Cart.module.css";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

//context
import {OrderContext} from "../context/orderContext";

function Cart() {
  let navigate = useNavigate();
  const [subtotal, setSubtotal] = useState(0);
  const [orderedMenus, setOrderedMenus] = useContext(OrderContext);

  //get data needed for display
  const getTransactions = async () => {
    try {
      if (orderedMenus.subtotal !== 0) {
        const totalPrice = orderedMenus.products.reduce(
          (sum, elem) =>  sum + (elem.orderQuantity * elem.price),0
        )
        setSubtotal(totalPrice);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  //did mount -> get Profile
  useEffect(() => {
    getTransactions();
  }, []);

  //form handle
  const increment = (menuID) => {
    ////////////////Order Context///////////////
    //increment
    const order = orderedMenus.products.map( elem => {
      if (elem.id === menuID) {
        elem.orderQuantity = elem.orderQuantity + 1
      }
      return elem
    })
    const total = parseInt(orderedMenus.subtotal) + 1;
    //set context
    setOrderedMenus({
      type: 'ADD_CART',
      payload: order,
      total
    });
    ///////////////subtotal state///////////////
    const totalPrice = orderedMenus.products.reduce(
      (sum, elem) =>  sum + (elem.orderQuantity * elem.price),0
    )
    setSubtotal(totalPrice);
  }
  const decrement = (menuID) => {
    ////////////////Order Context///////////////
    //decrement
    let total = 1;
    const order = orderedMenus.products.map( elem => {
      if (elem.id === menuID) {
        if (elem.orderQuantity > 1){
          elem.orderQuantity = elem.orderQuantity - 1
        }
      }
      return elem
    })
    if (orderedMenus.subtotal > 1){
      total = parseInt(orderedMenus.subtotal) - 1;
    }
    //set Context
    setOrderedMenus({
      type: 'ADD_CART',
      payload: order,
      total
    });
    ///////////////subtotal state///////////////
    const totalPrice = orderedMenus.products.reduce(
      (sum, elem) =>  sum + (elem.orderQuantity * elem.price),0
    )
    setSubtotal(totalPrice);
  }
  const delOrder = (menuID) => {
    ////////////////Order Context///////////////
    //delete cart
    let decreasePrice = 0;
    orderedMenus.products.forEach(elem => {
      if (elem.id === menuID){
        decreasePrice = elem.orderQuantity * elem.price
      }
    });
    const order = orderedMenus.products.filter( elem => 
      elem.id !== menuID
    )
    const total = order.reduce(
      (sum, elem) =>  sum + parseInt(elem.orderQuantity),0
    )
    //set Context
    setOrderedMenus({
      type: 'ADD_CART',
      payload: order,
      total
    });
    ///////////////subtotal state///////////////
    const totalPrice = subtotal - decreasePrice;
    setSubtotal(totalPrice);
  }

  return (
    <div>
    <Navbar />
    
      {subtotal === 0 ? (<div className={styles.emptycart}><img src="./images/404-your-cart-is-empty.png" 
      alt="empty cart" className={styles.empty}/></div>) : (
      <>
      <h3 className={styles.myCart}>My Cart</h3>
      <div className={styles.cart}>
        <form>
          <h5>Review Your Order</h5>
          <div className={styles.lines}>
            <div className={styles.line1} />
            <div className={styles.line2} />
          </div>

          <div className={styles.Order}>
            <div className={styles.menulist}>
              
              {orderedMenus.products.map( orderedMenu => { return(
                <div key={orderedMenu.id}>
                  <div className={styles.menu}>
                    <div className={styles.product}>
                      <img src={orderedMenu.photo} alt="menu pict" />
                      <div className={styles.qty}>
                        <p>{orderedMenu.name}</p>
                        <button type="button" onClick={() => decrement(orderedMenu.id)}>-</button>
                        <input type="number" value={orderedMenu.orderQuantity} readOnly/>
                        <button type="button" onClick={() => increment(orderedMenu.id)}>+</button>
                      </div>
                    </div>
                    <div className={styles.price}>
                      <p>Rp {orderedMenu.price.toLocaleString('id-ID')}</p>
                      <a>
                        <img src="./images/bin.png" alt="bin" onClick={() => delOrder(orderedMenu.id)}/>
                      </a>
                    </div>
                  </div>
                  <div className={styles.line1} />
                </div>
              )})}
            
            </div>

            <div className={styles.details}>
              <div className={styles.detail}>
                <p className={styles.nameDetail}>Subtotal</p>
                <p className={styles.priceDetail}>Rp {subtotal.toLocaleString('id-ID')}</p>
              </div>
              <div className={styles.detail}>
                <p className={styles.nameDetail}>Qty</p>
                <p className={styles.numberDetail}>{orderedMenus.subtotal}</p>
              </div>
              <div className={styles.line2} />

              <div className={styles.total}>
                <p>Total</p>
                <p>Rp {subtotal.toLocaleString('id-ID')}</p>
              </div>

              <div className={styles.orderBtn}>
                <button type='button' onClick={() => navigate('/shipment')}>Proceed To Checkout</button>
              </div>
            </div>
          </div>
        </form>
      </div>
      </>
      )}
    
  </div>);
}

export default Cart;