import { Button, Flex, Switch } from 'antd';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useLoginMutation } from '../../redux/features/authApi';
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../redux/services/authSlice';
import decodeToken from '../../utils/decodeToken';
import { useState } from 'react';
import './LoginPage.css'; // Custom styles
import warehouseImageLogin from '../../assets/i.png'; // Adjust path if needed

const LoginPage = () => {
  const [userLogin] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'user@gmail.com',
      password: 'pass123',
    },
  });

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading('Logging...');
    try {
      const res = await userLogin(data).unwrap();
      if (res.statusCode === 200) {
        const user = decodeToken(res.data.token);
        dispatch(loginUser({ token: res.data.token, user }));
        navigate('/');
        toast.success('Successfully Login!', { id: toastId });
      }
    } catch (error: any) {
      toast.error(error.data.message, { id: toastId });
    }
  };

  return (
    <div className={`login-wrapper ${darkMode ? 'dark' : 'light'}`}>
      <Flex justify='space-between' align='center' className='container'>
        <div className='login-left'>
          <h1 className='edstock-logo'>EDstock</h1>
          <h2 className='tagline'>Inventory. Automated. Futuristic.</h2>
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            checkedChildren='🌙'
            unCheckedChildren='☀️'
            style={{ marginBottom: '1rem' }}
          />
          <form onSubmit={handleSubmit(onSubmit)} className='login-form'>
            <input
              type='email'
              {...register('email', { required: true })}
              placeholder='Email*'
              className={`input-field ${errors['email'] ? 'input-error' : ''}`}
            />
            <input
              type='password'
              {...register('password', { required: true })}
              placeholder='Password*'
              className={`input-field ${errors['password'] ? 'input-error' : ''}`}
            />
            <Button htmlType='submit' type='primary' className='login-button'>
              Login
            </Button>
          </form>
          <p className='register-link'>
            Don’t have an account? <Link to='/register'>Register here</Link>
          </p>
        </div>

        <div className='login-right'>
          <img src={warehouseImageLogin} alt='Warehouse Tech' className="logo-image"  />
          <h3 className='hero-caption'>Revolutionize your stock flow with EDstock</h3>
        </div>
      </Flex>
    </div>
  );
};

export default LoginPage;
