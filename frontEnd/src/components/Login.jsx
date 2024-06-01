import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import Swal from 'sweetalert2'; 

export default function Login() {
    const { signInUser, signInWithGoogle, signInWithFacebook } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = (e) => {
       e.preventDefault();
       const email = e.target.email.value;
       const password = e.target.password.value;
      
       signInUser(email, password)
        .then(result => {
          console.log(result.user)
          e.target.reset();
          navigate('/');
        })
        .catch(error => {
          console.error(error);
          
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Incorrect password!',
          });
        });
    };

    const handleGoogleSignIn = () => {
      signInWithGoogle()
        .then(result => {
          console.log(result.user);
        })
        .catch(error => {
          console.error(error);
        });
    };

    const handleFacebookSignIn = () => { 
      signInWithFacebook()
        .then(result => {
          console.log(result.user);
        })
        .catch(error => {
          console.error(error);
        });
    };

    return (
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col ">
          <div className="text-center ">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6"></p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleLogin}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" placeholder="email" name='email' required className="input input-bordered" />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input type="password" placeholder="password" name='password' required className="input input-bordered" />
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </form>
            <div className='w-4/5 mx-auto'>
              <p className=''>New to the site?
                <Link to="/register">
                  <button className="btn btn-link">Register</button>
                </Link>
                <p><button onClick={handleGoogleSignIn} className="btn btn-ghost">Google</button></p>
                <p><button onClick={handleFacebookSignIn} className="btn btn-ghost">Facebook</button></p> 
              </p>
            </div>
          </div>
        </div>
      </div>
    );
}
