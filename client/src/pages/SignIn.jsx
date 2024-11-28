import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import {
  signInStart,
  signInSuccess,
  signInFailure
} from '../redux/user/userSlice';


export default function SignIn() {
  const [formData, setFormData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setLoading] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setLoading(true);
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        // setLoading(false);
        // setError(data.message);
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <form onSubmit={submit} className='container'>
      <h2>{msg ? inputData.name + " : SignUp Successfully!" : null}</h2>

      <h1>Sign In</h1>
      <div className='inputs'>
        <input type='text' placeholder='Name' name="name" value={inputData.name} onChange={handleInput} /><br />
        <input type='email' placeholder='Email' name="email" value={inputData.email} onChange={handleInput} /><br />
        <input className='pswrd' type='password' placeholder='Passsword' name="password" value={inputData.password} onChange={handleInput} />
      </div><br />
      <button onClick={submit}>SignIn</button>
      <p>Not account?<Link to="/signUp">SignUp</Link></p>
    </form>
  );
}
