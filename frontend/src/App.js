import * as React from "react";
import {BrowserRouter, Route, Switch } from "react-router-dom";
import axios from 'axios';
import {BASE_API_URL} from "./core/constants";

import {Provider} from 'react-redux';

import './App.css';

import {Layout } from 'antd';

import Login from './login/login';
import Register from './login/register';
import Home from './home/home';
import Sample from './sample/sample';
import Page from './routes/page';
import PageProtected from './routes/pageProtected';
import {ProtectedRoute} from "./auth/protectedRoute";
import AppMenu from "./menu";
import AppHeader from "./header";

import store from './core/store';
import auth from "./auth/auth";

const {Header, Content, Footer } = Layout;

axios.interceptors.request.use(function(config) {
	const token = auth.getToken();

	if (!!token) {
		config.headers["auth-token"] = token;
	}

	return config;
}, function(err) {
	return Promise.reject(err);
});

axios.defaults.baseURL = BASE_API_URL;

class App extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<BrowserRouter>
					<Layout style={{minHeight: '100vh'}}>
						<AppMenu/>
						<Layout>
							<Header style={{background: '#fff', padding: 0}}>
								<AppHeader/>
							</Header>
							<Content style={{margin: '0 16px'}}>
	                     <Switch>
	                        <Route exact path="/" component={Home} />
	                        <Route exact path="/login" component={Login} />
	                        <Route exact path="/register" component={Register} />
	                        <Route exact path="/page" component={Page} />
	                        <ProtectedRoute exact path="/sampleTable" component={Sample} />
	                        <ProtectedRoute exact path="/protected" component={PageProtected} />
	                     </Switch>
							</Content>
							<Footer style={{textAlign: 'center'}}>Sample React Application ©2019 Created by PK</Footer>
						</Layout>
					</Layout>
				</BrowserRouter>
			</Provider>
		);
	}
}

export default App;
