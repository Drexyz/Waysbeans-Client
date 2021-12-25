import Navbar from "../components/Navbar";
import styles from "../styles/Shipment.module.css";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";

import {OrderContext} from "../context/orderContext"

//API config
import { API } from "../config/api";

function Shipment() {
  let navigate = useNavigate();
  const [mod, setMod] = useState(false)
  const [orderedMenus, setOrderedMenus] = useContext(OrderContext);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    attachment: "",
  });
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // Create Configuration Content-type
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      };
      const product = orderedMenus.products.map(elem => {
        return {
          id: elem.id,
          orderQuantity: elem.orderQuantity
        }
      })
      //store data with FormData as object
      const formData = new FormData();
      formData.set('attachment', form.attachment[0], form.attachment[0].name);
      formData.set('name', form.name);
      formData.set('email', form.email);
      formData.set('phone', form.phone);
      formData.set('address', form.address);
      formData.set('product', JSON.stringify(product));
      
      //console.log(form)
      //console.log(JSON.stringify(product))
      //Insert product data
      await API.post('/transaction', formData, config);
      setOrderedMenus({
       type: 'EMPTY_CART',
      })
      handMod();
    } catch (error) {
      console.log(error);
    }
  }

  //modal toggle
  const handModClose = () => {setMod(false); navigate('/profile');};
  const handMod = () => setMod(true);

  useEffect(() => {
    console.log(orderedMenus)
  }, []);

  return (
    <div>
      <Navbar />
      <div className={styles.Shipment}>
        <div className={styles.ShipmentL}>
          <h4>Shipping</h4>
          <form className={styles.ShipmentForm} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              className={styles.inputName}
              onChange={handleChange}
              name='name'
            />
            <input
              type="email"
              placeholder="Email"
              className={styles.inputEmail}
              defaultValue={form.email}
              onChange={handleChange}
              name='email'
            />
            <input
              type="tel"
              placeholder="Phone"
              className={styles.inputPhone}
              defaultValue={form.phone}
              onChange={handleChange}
              name='phone'
            />
            <textarea
              placeholder="Address"
              className={styles.inputAddress}
              defaultValue={form.address}
              onChange={handleChange}
              name='address'
            />
            <div className={styles.attachment}>
              <label htmlFor="file" className={styles.inputFile}>
                Attach Image
                <img src="./images/attachFile.png" alt="" />
              </label>
              <input
                type="file"
                hidden
                id="file"
                name="attachment"
                onChange={handleChange}
                aria-label="File browser example"
              />
              <div id="preview" className={styles.preview}>
                <img
                  src={preview}
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    objectFit: "content",
                  }}
                />
              </div>
            </div>
          </form>
        </div>
        <div className={styles.products}>
          {orderedMenus.products.map(elem =>{
            return(
              <div className={styles.product} key={elem.id}>
                <div className={styles.detailProduct}>
                  <img src={elem.photo} alt="menu pict" />
                  <div className={styles.number}>
                    <p className={styles.productName}>{elem.name}</p>
                    <p className={styles.productPrice}>Price : Rp {elem.price.toLocaleString('id-ID')}</p>
                    <p className={styles.productQty}>Qty : {elem.orderQuantity}</p>
                    <p className={styles.subTotal}>Sub Total : {(elem.price*elem.orderQuantity).toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <img src='images/icon.png' alt="waysbeans icon" className={styles.wbIcon}/>
              </div>    
            )
          })}
          {orderedMenus.subtotal !== 0 ? (<button onClick={handleSubmit}>Pay</button>):(<></>)}
        </div>
        <Modal show={mod} onHide={handModClose} size="lg" centered style={{display:'flex', justifyContent:'center'}}>
          <Modal.Body className={styles.modalBody}>
            <div className={styles.popup}>
              <p className={styles.popText}>Thank you for ordering, please wait 1 x 24 hours</p>
              <p className={styles.popText}>to verify your order</p>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default Shipment;
