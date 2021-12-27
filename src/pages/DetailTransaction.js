import Navbar from '../components/Navbar';
import React, { useState, useEffect, useContext } from 'react';
import styles from '../styles/DetailTransaction.module.css';
//import { Dropdown, NavDropdown } from 'react-bootstrap';
import { useParams } from "react-router-dom";

//API config
import { API } from "../config/api";

function DetailTransaction(){
  const [transaction, setTransaction] = useState({productOrdered:0});
  const {transactionId} = useParams();

  //get necessary data
  const getTransaction = async () => {
      try {
        const response = await API.get(`/transaction/${transactionId}`);
        console.log(response.data.data.transaction);
        setTransaction(response.data.data.transaction);
      } catch (error) {
        console.log(error);
      }
  }

  //did mount -> get data needed
  useEffect(() => {
    getTransaction();
  }, []);
  
  return(
    <div className={styles.transaction}>
      <Navbar />
      <div className={styles.detailTransactions}>
        <div className={styles.detailL}>
          <h4>Detail Transaction</h4>
          <p><b>Name : </b>{transaction?.name}</p>
          <p><b>Phone : </b>{transaction?.phone}</p>
          <p><b>Email : </b>{transaction?.email}</p>
          <p><b>Address : </b>{transaction?.address}</p>
          <p><b>Post Code : </b>{transaction?.posscode}</p>
          <p><b>Status : </b>{transaction?.status}</p> 
        </div>
        <div className={styles.detailR}>
          <h4>Ordered Product</h4>
          <div className={styles.product} key={transaction.id}>
            <div className={styles.detailProduct}>
              <img src={`http://localhost:5000/uploads/${transaction?.productOrdered[0]?.product?.photo}`} alt="menu pict" />
              <div className={styles.number}>
                <p className={styles.productName}>{transaction?.productOrdered[0]?.product?.name}</p>
                <p className={styles.date}>{/* <b>Senin</b>, 2021 */}</p>
                <p className={styles.productPrice}>Price : Rp {transaction?.productOrdered[0]?.product?.price.toLocaleString('id-ID')}</p>
                <p className={styles.productQty}>Qty : {transaction?.productOrdered[0]?.orderQuantity}</p>
                <p className={styles.subTotal}>Sub Total : {(transaction?.productOrdered[0]?.product?.price*transaction?.productOrdered[0]?.orderQuantity).toLocaleString('id-ID')}</p>
              </div>
            </div>
            <img src='images/icon.png' alt="waysbeans icon" className={styles.wbIcon} onClick={() => console.log(transaction)}/>
          </div>
        </div>
      </div>
    </div>
  )
};

export default DetailTransaction;