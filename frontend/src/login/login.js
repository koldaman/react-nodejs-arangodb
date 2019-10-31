import * as React from "react";
import './login.css';

import {Form, Icon, Input, Button, Breadcrumb} from 'antd';
import {connect} from "react-redux";
import {showMessage} from '../core/message/actions'
import {MESSAGE_ERROR, MESSAGE_LOAD, MESSAGE_SUCCESS} from "../core/message/constants";
import axios from 'axios';
import {AUTH_TOKEN_HEADER, GOOGLE_OAUTH_CLIENT_ID} from "../core/constants";
import {login, logout} from "../auth/actions";

import { Link } from "react-router-dom";

function mapDispatchToProps(dispatch) {
	return {
		login: (token) => dispatch(login(token)),
		logout: () => dispatch(logout()),
		showMessage: message => dispatch(showMessage(message))
	};
}

class LoginForm extends React.Component {

	login = async (token, id, name, email, imageUrl, source) => {
		const user = {
			token,
			id,
			name,
			email,
			imageUrl,
			source
		};

		if (source === 'google') {
			try {
				await axios.post('user/registerGoogle', {
					id,
					name,
					email,
					imageUrl
				});
			} catch (e) {
				if (e.response.status === 409) {
					console.log('User already registered');
				} else {
					console.error(e.response);
				}
			}

			const response = await axios.post('user/loginGoogle', {
				id,
				email
			});

			const headerToken = response.headers[AUTH_TOKEN_HEADER];
			user.token = headerToken;
		}

		this.props.login(user);

		this.props.showMessage({type: MESSAGE_SUCCESS, text: "Successfully logged in.", clearOthers: true});

		const state = this.props.location.state;
		if (state) {
			this.props.history.push(state.from);
		} else {
			this.props.history.push("/");
		}
	};

	handleAppLogin = (e) => {
		e.preventDefault();
		this.props.showMessage({type: MESSAGE_LOAD, text: "Checking login information...", duration: 0});
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				try {
					const response = await axios.post('user/login', {
						email: values.username,
						password: values.password
					});

					const token = response.headers[AUTH_TOKEN_HEADER];

					await this.login(token, response.data._key, response.data.name, response.data.email, null,  'application');

				} catch (e) {
					this.props.logout();
					this.props.showMessage({type: MESSAGE_ERROR, text: "Error login: " + e.response.data.message || e.response || e, duration: 0, clearOthers: true});
				}
			}
		});
	};

	componentDidMount() {
		if (this.props.location.state) {
			this.props.showMessage({type: MESSAGE_ERROR, text: "Access denied, please login first!"})
		}

		window.gapi.load('auth2', () => {
			const auth2 = window.gapi.auth2.init({
				client_id: GOOGLE_OAUTH_CLIENT_ID,
			});
			auth2.attachClickHandler(document.querySelector('#glogin'), {}, this.onLoginSuccessful.bind(this));

			auth2.then(() => {
				console.log('Google oAuth2 init', auth2);
			});

		});
	}

	async onLoginSuccessful(data) {
		console.log("Google login successful", data);
		const profile = data.getBasicProfile();
		console.log('Google profile data', profile);
		await this.login('google-token', profile.Eea, profile.ig, profile.U3, profile.Paa, 'google');
	}

	render() {
		const {getFieldDecorator} = this.props.form;
		return (
			<div>
				<Breadcrumb style={{margin: '16px 0'}}>
					<Breadcrumb.Item>Application</Breadcrumb.Item>
					<Breadcrumb.Item>Login</Breadcrumb.Item>
				</Breadcrumb>
				<div className="container">
					<h3>Application Login</h3>
					<Form onSubmit={this.handleAppLogin} className="login-form">
						<Form.Item>
							{getFieldDecorator('username', {
								rules: [{required: true, message: 'Please input your email!'}],
							})(
								<Input
									prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
									placeholder="E-mail"
								/>,
							)}
						</Form.Item>
						<Form.Item>
							{getFieldDecorator('password', {
								rules: [{required: true, message: 'Please input your Password!'}],
							})(
								<Input
									prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
									type="password"
									placeholder="Password"
								/>,
							)}
						</Form.Item>
						<span className={"register-link"}><Link to={"/register"}>Register</Link> new user</span>
						<Button type="primary" htmlType="submit" className="login-form-button">
							Log in
						</Button>

						<Button id={"glogin"} type="primary" shape="circle" icon="google" className="login-form-button" />

					</Form>
				</div>
			</div>
		);
	}
}

const Login = Form.create({name: 'normal_login'})(LoginForm);

export default connect(null, mapDispatchToProps)(Login);
