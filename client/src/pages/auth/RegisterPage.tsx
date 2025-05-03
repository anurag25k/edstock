import { Button, Flex } from 'antd';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useRegisterMutation } from '../../redux/features/authApi';
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../redux/services/authSlice';
import decodeToken from '../../utils/decodeToken';
import warehouseImage from '../../assets/i.png'; // Adjust path if needed
import './LoginPage.css'; // Same CSS used

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userRegistration] = useRegisterMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Password and Confirm Password must match!');
      return;
    }

    const toastId = toast.loading('Creating your account...');
    try {
      const res = await userRegistration(data).unwrap();

      if (res.statusCode === 201) {
        const user = decodeToken(res.data.token);
        dispatch(loginUser({ token: res.data.token, user }));
        navigate('/');
        toast.success('Registered successfully!', { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Registration failed.', { id: toastId });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="container">
        {/* Left Side - Registration Form */}
        <div className="login-left">
          <h1 className="edstock-logo">EDstock</h1>
          <p className="tagline">Inventory Management Made Smarter</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              {...register('name', { required: true })}
              placeholder="Full Name*"
              className={`input-field ${errors.name ? 'input-error' : ''}`}
            />
            <input
              type="email"
              {...register('email', { required: true })}
              placeholder="Email Address*"
              className={`input-field ${errors.email ? 'input-error' : ''}`}
            />
            <input
              type="password"
              {...register('password', { required: true })}
              placeholder="Password*"
              className={`input-field ${errors.password ? 'input-error' : ''}`}
            />
            <input
              type="password"
              {...register('confirmPassword', { required: true })}
              placeholder="Confirm Password*"
              className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
            />

            <Button
              htmlType="submit"
              type="primary"
              className="login-button"
            >
              Register
            </Button>
          </form>

          <p className="register-link">
            Already have an account? <Link to="/login">Login Here</Link>
          </p>
        </div>

        {/* Right Side - Branding + Image */}
        <div className="login-right">
          <img src={warehouseImage} alt="Warehouse" className="logo-image"  />
          <p className="hero-caption">Efficient. Reliable. Future-Ready.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
