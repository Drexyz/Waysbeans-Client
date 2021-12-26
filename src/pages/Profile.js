import Navbar from "../components/Navbar";
import styles from "../styles/Profile.module.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import QRCode from 'react-qr-code';

//API config
import { API } from "../config/api";

function Profile() {
  const [profile, setProfile] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  
  //get detail user
  const getUser = async () => {
    try {
      const response = await API.get('/user')
      //console.log(response.data.data.user)
      setProfile(response.data.data.user)
    } catch (error) {
      console.log(error);
    }
  }
  const getTransactions = async () => {
    try {
      const response = await API.get('/my-transactions')
      //console.log(response)
      const temp = response.data.data.transactions.map(elem => {
        return {
          id: elem.id,
          photo: `http://localhost:5000/uploads/${elem.products[0].photo}`,
          name: elem.products[0].name,
          price: elem.products[0].price,
          orderQuantity: elem.products[0].orderQuantity,
          subtotal: elem.products[0].price * elem.products[0].orderQuantity,
          status: elem.status,
          day: days[(new Date(`${months[elem.date.split("T")[0].split('-')[1]-1]} ${elem.date.split("T")[0].split('-')[2]}, ${elem.date.split("T")[0].split('-')[0]}`)).getDay()],
          date: `${elem.date.split("T")[0].split("-")[2]} ${months[elem.date.split("T")[0].split("-")[1]-1]} ${elem.date.split("T")[0].split("-")[0]}`,
        }
      })
      setTransaction(temp)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUser();
    getTransactions();
  }, []);

  const finishTransaction = async (dataID) => {
    try{
      //Configuration Content-type
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      //prepare body req
      const status = {
        status: "success"
      }
      const body = JSON.stringify(status);

      //update transaction
      await API.patch(`/transaction/${dataID}`, body, config);
      
      //change datas state
      const currentDatas = transaction.map(
        elem => {
          if (elem.id === dataID) {
            elem.status = "success"
          }
          return elem 
        }
      )
      setTransaction(currentDatas);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.mainProfile}>
          <div className={styles.myProfile}>
            <h4>My Profile</h4>
            <div className={styles.infoPerson}>
              <img src={profile.photo} alt="Profil" />
              <article>
                <h5>Full Name</h5>
                <p>{profile.fullname}</p>
                <h5>Email</h5>
                <p>{profile.email}</p>
              </article>
            </div>
          </div>
        </div>
        <div className={styles.products}>
          <h4>My Transaction</h4>
          {transaction.map(elem =>{
            return(
              <div className={styles.product} key={elem.id}>
                <div className={styles.detailProduct}>
                  <img src={elem.photo} alt="menu pict" />
                  <div className={styles.number}>
                    <p className={styles.productName}>{elem.name}</p>
                    <p className={styles.date}><b>{elem.day}</b>, {elem.date}</p>
                    <p className={styles.productPrice}>Price : Rp {elem.price.toLocaleString('id-ID')}</p>
                    <p className={styles.productQty}>Qty : {elem.orderQuantity}</p>
                    <p className={styles.subTotal}>Sub Total : {(elem.subtotal).toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <div className={styles.productr}>
                  <img src='images/icon.png' alt="waysbeans icon" className={styles.wbIcon}/>
                  <QRCode value={
                    `Transaction Status: ${elem.status}`
                  } size='50' fgColor='#232b2b'/>
                  {elem.status === 'success' ? (
                    <div className={styles.status}>Success</div>
                  ) : (elem.status === 'waiting approve' ? (
                    <div className={styles.statusw}>{elem.status}</div>
                  ) : (elem.status === 'on the way' ? (
                    <button className={styles.statuso} onClick={() => finishTransaction(elem.id)}>Completed</button>
                  ) : (
                    <div className={styles.statusc}>Canceled</div>
                  )))}
                </div>
              </div>    
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default Profile;
