/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Route,Routes, Navigate } from 'react-router-dom';
import HomePage from './public/home/HomePage.jsx';
import SignUpPage from './public/auth/signup/SignUpPage.jsx';
import LoginPage from './public/auth/login/LoginPage.jsx';
import RightPanel from './components/common/RightPanel.jsx';
import NotificationPage from './public/notifications/NotificationPage.jsx';
import ProfilePage from './public/profile/ProfilePage.jsx';
import Sidebar from './components/common/SideBar.jsx';
import {Toaster} from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';

function App() {
	const {data:authUser,isLoading}=useQuery({
	//we use queryKey to give a unique name to the query and refer to it later
		queryKey:["authUser"],
		queryFn:async()=>{
			try{
				const response=await fetch('/api/auth/getme');
				const data=response.json();
				if(!response.ok)
					return null;
				console.log("authUser is:",data);
				return data;
			}
			catch(error){
			throw new Error(error)}
		},
		retry:false,
	})
	if(isLoading){//while the query is loading , isLoading is true and spinner will be shown
		return <div className='h-screen flex justify-center items-center'>
			<LoadingSpinner size='lg'/>
		</div>//when query loaded then isLoading is false,
	}
	console.log(authUser)
	return (
		<div className='flex max-w-6xl mx-auto'>
			{/* common irrespective of the routes */}
			{authUser && <Sidebar/>}
			<Routes>
				<Route path='/' element={authUser ? <HomePage/>:<Navigate to="/login"/>} />
				<Route path='/signup' element={!authUser ? <SignUpPage/>:<Navigate to="/"/>} />
				<Route path='/login' element={!authUser ? <LoginPage/>:<Navigate to="/"/>} />
				<Route path='/notifications' element={authUser ? <NotificationPage/>:<Navigate to="/login"/>} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage/>:<Navigate to="/login"/>} />
			</Routes>	
			{authUser && <RightPanel/>}
			<Toaster/>
		</div>
	);
}
export default App;
