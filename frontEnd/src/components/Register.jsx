import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from './../providers/AuthProvider';

export default function Register() {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const photoURL = e.target.imageUrl.value;

    // Validate password length
    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Password Validation Error',
        text: 'Password must be at least 6 characters long.',
      });
      setLoading(false); // Stop further processing if password is invalid
      return;
    }

    try {
      await createUser(email, password, name, photoURL);
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'You have successfully registered.',
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message || 'An error occurred during registration.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Register now!</h1>
          <p className="py-6">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleRegister}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input type="text" placeholder="Name" name="name" required className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" placeholder="Email" name="email" required className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="password" placeholder="Password" name="password" required className="input input-bordered" />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <input type="text" placeholder="Image URL" name="imageUrl" required className="input input-bordered" />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className={`btn btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
