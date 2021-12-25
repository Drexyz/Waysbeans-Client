import '../styles/App.css';
import styles from "../styles/Home.module.css";
import React, { useState, useContext, useEffect } from "react";
import { Modal, Dropdown, NavDropdown, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import TransactionTable from "../components/TransactionTable";
//import stylesN from "../components/Navbar.module.css";

//context
import { UserContext } from '../context/userContext';

//API config
import { API, setAuthToken } from "../config/api";

function App() {
  //state
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState(false);
  const [state, dispatch] = useContext(UserContext);
  const [message, setMessage] = useState(null);
  const [products, setProducts] = useState([]);

  //register form (state)
  const [regForm, setRegForm] = useState({
    email: "",
    password: "",
    fullname: "",
  });
  const { email, password, fullname } = regForm;

  //login form (state)
  const [logForm, setLogForm] = useState({
    email: "",
    password: ""
  });
  const { logEmail, logPassword } = logForm;


  const handleRegChange = (e) => {
    setRegForm({
      ...regForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleLogChange = (e) => {
    setLogForm({
      ...logForm,
      [e.target.name]: e.target.value,
    });
  };

  //register handle
  const handleRegister = async (e) => {
    try {
      e.preventDefault();

      // Create Configuration Content-type
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      // Convert form data to string 
      const body = JSON.stringify(regForm);

      // Insert data user to database 
      const response = await API.post('/register', body, config);

      //close & empty modal
      setRegister(false);
      setRegForm({           
        email: "",
        password: "",
        fullname: "",
      });

      //notification
      if (response.data.status === "success") {
        const alert = (
          <Alert variant="success" onClose={() => setMessage(null)} className="py-2 mb-0" dismissible>
            Registration Success
          </Alert>
        );
        setMessage(alert);        
      } else {
        const alert = (
          <Alert variant="danger" onClose={() => setMessage(null)} className="py-1" dismissible>
            Failed
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" onClose={() => setMessage(null)} className="py-1" dismissible>
          Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  };

  //login handle
  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      // Create Configuration Content-type
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      // Convert form data to string 
      const body = JSON.stringify(logForm);

      // Insert data user to database 
      const response = await API.post('/login', body, config);

      //close & empty modal
      setLogin(false);
      setLogForm({ email: "", password: "" });

      //notification & change state
      if (response.data.status === "success") {
        await dispatch({
          type: 'LOGIN_SUCCESS',
          payload: response.data.data.user,
        });
        if (localStorage.token) {
          setAuthToken(localStorage.token);
        }

        const alert = (
          <Alert variant="success" onClose={() => setMessage(null)} className="py-2 mb-0" dismissible>
            Login Success
          </Alert>
        );
        setMessage(alert);
        // if (state.user.role === 'partner') {
        //   getTransactions()
        // }
      } else {
        const alert = (
          <Alert variant="danger" onClose={() => setMessage(null)} className="py-1 mb-0" dismissible>
            Login Failed
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" onClose={() => setMessage(null)} className="py-1 mb-0" dismissible>
          Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  };

  //Register modal toggle
  const handRegClose = () => setRegister(false);
  const handReg = () => setRegister(true);

  //login modal toggle
  const handLogClose = () => setLogin(false);
  const handLog = () => setLogin(true);

  //logout
  const logout = () => dispatch({ 
    type: 'LOGOUT',
    payload: '',
  });
  ////const logout = () => console.log(state);

  //get data from db
  const getProducts = async () => {
    try {
      const response = await API.get('/products');
      setProducts(response.data.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  //did mount -> get users, socket
  useEffect(() => {
    getProducts()
  }, []);

  return (
    <>
      {message && message}
      {state.user.role === "admin" && state.isLogin ? (
        <TransactionTable/>
      ) : (
        <div>
          <div className={styles.Header}>
            <nav>
              <img src="./images/Icon.png" className={styles.icon} alt="icon" />
              {!state.isLogin ? (
                <span className={styles.buttons}>
                  <button onClick={handLog} className={styles.LoginBTN}>
                    Login
                  </button>
                  <button onClick={handReg} className={styles.RegisterBTN}>
                    Register
                  </button>
                </span>
              ) : (
                <span className={styles.buttons}>
                  <Link to={{ pathname: "/cart", isLogin: true }}>
                    <img src="./images/Cart.png" alt="cart" />
                  </Link>
                  <NavDropdown
                    id="dropdown-basic"
                    title={
                      <img
                        className={styles.avatar}
                        src={state.user.photo}
                        alt="avatar"
                      />
                    }
                  >
                    <Link
                      className={styles.dropdownItem}
                      to="profile"
                      style={{ textDecoration: "none" }}
                    >
                      {/* <Link to="profile" style={{ textDecoration: 'none' }}> */}
                      <img
                        src="./images/user.png"
                        className={styles.dropdownPict}
                        alt="profile"
                      />
                      <span className={styles.dropdownText}>Profile</span>
                    </Link>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      className={styles.dropdownItem}
                      href="#"
                      onClick={logout}
                      style={{padding: 0}}
                    >
                      <img
                        src="./images/logout.png"
                        className={styles.dropdownPict}
                        alt="logout"
                      />
                      <span className={styles.dropdownText}>Logout</span>
                    </Dropdown.Item>
                  </NavDropdown>
                </span>
              )}

              {/*//////// Modals ////////*/}
              <Modal show={register} onHide={handRegClose} className={styles.modalform}>
                <Modal.Header style={{paddingBottom:'13px', paddingTop:'25px', width: '416px',
                                      paddingLeft:'25px', borderBottom:'0 none'}}>
                  <Modal.Title><p className={styles.formTitle} style={{marginBottom:0}}>Register</p></Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                  <form className={styles.form} onSubmit={handleRegister}>
                    <input type="email" placeholder="Email" onChange={handleRegChange} value={email} name='email'/>
                    <input type="password" placeholder="Password" onChange={handleRegChange} value={password} name='password'/>
                    <input type="text" placeholder="Full Name" onChange={handleRegChange} value={fullname} name='fullname'/>
                  
                    <button type='submit'>Register</button>
                  </form>
                </Modal.Body>
                <Modal.Footer className={styles.formFooter} style={{borderTop:'0 none'}}>
                  <p>Already have an account ? Klik</p>
                  <p style={{marginLeft:0}} onClick={()=> {handRegClose(); handLog()}} className={styles.footerLink}>Here</p>
                </Modal.Footer>
              </Modal>

              <Modal show={login} onHide={handLogClose} className={styles.modalform}>
                <Modal.Header style={{paddingBottom:'13px', paddingTop:'25px', width: '416px',
                                      paddingLeft:'25px', borderBottom:'0 none'}}>
                  <Modal.Title><p className={styles.formTitle} style={{marginBottom:0}}>Login</p></Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                  <form className={styles.form} onSubmit={handleLogin}>
                    <input type="email" placeholder="Email"
                      id="email" onChange={handleLogChange} required
                      value={logEmail} name='email'
                    />
                    <input type="password" placeholder="Password" onChange={handleLogChange}
                      value={logPassword} name='password'/>
                    <button type="submit">
                      Login
                    </button>
                  </form>
                </Modal.Body>
                <Modal.Footer className={styles.formFooter} style={{borderTop:'0 none'}}>
                  <p>Don't have an account ? Klik</p>
                  <p style={{marginLeft:0}} onClick={()=> {handLogClose(); handReg()}} className={styles.footerLink}>Here</p>
                </Modal.Footer>
              </Modal>
            </nav>
          </div>
          <div className = {styles.Hero}>
            <img src="./images/hero.png" className={styles.heropic} alt="hero" />
          </div>
          <div className={styles.products}>
            {products.map(product => {
              return(
                <div className={styles.product} key={product.id}>
                  {!state.isLogin ? (
                  <img src={product.photo} onClick={handLog}
                    style={{cursor: 'pointer'}} alt="icon" />
                  ) : (
                    <Link to={`/detailproduct/${product.id}`}>
                      <img src={product.photo} alt="icon" />
                    </Link>
                  ) }
                  <p className={styles.productName}>{product.name}</p>
                  <p className={styles.productDesc} style={{marginBottom:0}}>Rp.{product.price.toLocaleString('id-ID')}</p>
                  <p className={styles.productDesc} style={{marginBottom:'5px'}}>Stock: {product.stock}</p>
                </div>    
              )
            })}
          </div>
          

        </div>
      )}
    </>
  );
}

export default App;
