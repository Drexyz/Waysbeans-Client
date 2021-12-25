import Navbar from '../components/Navbar';
import styles from '../styles/AddProduct.module.css';
import React, {useState} from 'react'
import { useNavigate } from "react-router-dom";

//API config
import { API } from "../config/api";

function AddProduct(){
    let navigate = useNavigate();
    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({
      name: '',
      stock: '',
      price: '',
      description: '',
      photo: '',
    });

    // Handle change data on form
    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]:
          e.target.type === 'file' ? e.target.files : e.target.value,
      });

      // Create image url for preview
      if (e.target.type === 'file') {
        let url = URL.createObjectURL(e.target.files[0]);
        setPreview(url);
      }
    };

    const handleSubmit = async (e) => {
      try {
        e.preventDefault();
        //console.log(form.photo)
        // Create Configuration Content-type
        const config = {
          headers: {
            'Content-type': 'multipart/form-data',
          },
        };
    
        //store data with FormData as object
        const formData = new FormData();
        formData.set('photo', form.photo[0], form.photo[0].name);
        formData.set('name', form.name);
        formData.set('price', form.price);
        formData.set('description', form.description);
        formData.set('stock', form.stock);
    
        //Insert product data
        await API.post('/product', formData, config);
    
        //console.log(response);
    
        navigate('/');
      } catch (error) {
        console.log(error);
      }
    };

    return(
        <div>
          <Navbar />
          <div className={styles.page}>
            <div className={styles.AddProduct}>
                <h4>Add Product</h4>
                <form className={styles.editProfilForm} onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" className={styles.inputName} 
                      onChange={handleChange} name='name'/>        
                    <input type="number" placeholder="Stock" name='stock'
                      className={styles.inputPrice} onChange={handleChange}/>
                    <input type="number" placeholder="Price" name='price'
                      className={styles.inputPrice} onChange={handleChange}/>
                    <textarea placeholder="Description Product" className={styles.inputDesc} 
                      onChange={handleChange} name='description'/>

                    <label htmlFor="file" className={styles.inputFile}>
                      <p>Photo Product</p><img src="./images/attachFile.png" alt="" />
                    </label>
                    <input type="file" hidden id="file" name="photo" 
                      onChange={handleChange} aria-label="File browser example" />

                    <button className={styles.btnSave}>Add Product</button>
                </form>
            </div>
            <div id="preview" className={styles.preview}>
              {preview ? (<img src={preview} style={{objectFit: "content",}}/>):(<img className={styles.vanish}/>)}
            </div>
          </div>
        </div>
    )
};

export default AddProduct;