import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import styles from "../styles/EditProfile.module.css";

//context
import { UserContext } from '../context/userContext';

//API config
import { API } from "../config/api";

function EditProfile() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    photo: "",
    email: "",
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

      // Configuration
      const config = {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      };

      // Store data with FormData as object
      const formData = new FormData();
      if (typeof(form.photo) === 'object') {
        formData.set('photo', form?.photo[0], form?.photo[0]?.name);
      } else {
        formData.set('photo', form.photo);
      }
      formData.set('fullname', form.fullName);
      formData.set('email', form.email);

      // Insert product data
      await API.patch(`/user/${state.user.id}`, formData, config );
      
      //update user context
      const response = await API.get('/user');
      let payload = response.data.data.user;
      payload.token = localStorage.token;
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });

      navigate('/profile');
    } catch (error) {
      console.log(error);
    }
  };

  //lifecycle
  useEffect(() => {
    if (state) {
      setForm({
        fullName: state.user.fullname,
        email: state.user.email,
        photo: state?.user?.photo?.slice(30,),
      });
      setPreview(state?.user?.photo)
    }
  }, []);
  useEffect(() => {
    setForm({
      fullName: state.user.fullname,
      email: state.user.email,
      photo: state?.user?.photo?.slice(30,),
    });
    setPreview(state?.user?.photo)
  }, [state]);

  return (
    <div>
      <Navbar />
      <div className={styles.editProfile}>
        <h4>Edit Profile</h4>
        <div className={styles.edit}>
          <form className={styles.editProfilForm}>
            <input
              type="text"
              placeholder="Full Name"
              className={styles.inputName}
              onChange={handleChange}
              defaultValue={state.user.fullname}
              name='fullName'
            />
            <input
              type="email"
              placeholder="Email"
              className={styles.inputEmail}
              defaultValue={state.user.email}
              onChange={handleChange}
              name='email'
            />
            <label htmlFor="file" className={styles.inputFile}>
              Attach Image
              <img src="./images/attachFile.png" alt="" />
            </label>
            <input
              type="file"
              hidden
              id="file"
              name="photo"
              onChange={handleChange}
              aria-label="File browser example"
            />

          </form>
          <div className={styles.editr}>
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
            <button type="button" onClick={handleSubmit} className={styles.btnSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
