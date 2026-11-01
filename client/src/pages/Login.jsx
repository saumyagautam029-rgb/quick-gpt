import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [state, setState] = useState('Login'); // 'Login' or 'Sign Up'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { backendUrl, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            if (state === 'Sign Up') {
                const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password });
                if (data.success) {
                    setUser(data.user);
                    navigate('/');
                } else {
                    alert(data.message);
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
                if (data.success) {
                    setUser(data.user);
                    navigate('/');
                } else {
                    alert(data.message);
                }
            }
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <form onSubmit={onSubmitHandler} className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-center mb-2">{state}</h2>
                
                {state === 'Sign Up' && (
                    <div className="flex flex-col gap-1">
                        <label className="text-sm text-gray-400">Full Name</label>
                        <input 
                            type="text" 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            required 
                            className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                )}

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">Email</label>
                    <input 
                        type="email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        required 
                        className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">Password</label>
                    <input 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        required 
                        className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                </div>

                <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-500 transition py-2 rounded font-semibold">
                    {state}
                </button>

                {state === 'Login' ? (
                    <p className="text-sm text-center text-gray-400 mt-2">
                        Don't have an account?{' '}
                        <span onClick={() => setState('Sign Up')} className="text-blue-400 cursor-pointer underline">
                            Sign up
                        </span>
                    </p>
                ) : (
                    <p className="text-sm text-center text-gray-400 mt-2">
                        Already have an account?{' '}
                        <span onClick={() => setState('Login')} className="text-blue-400 cursor-pointer underline">
                            Login
                        </span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default Login;