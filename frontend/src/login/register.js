import * as React from "react";
import './login.css';

import {Form, Icon, Input, Button, Breadcrumb} from 'antd';
import {connect} from "react-redux";
import {showMessage, hideMessages} from '../core/message/actions'
import {MESSAGE_ERROR, MESSAGE_LOAD, MESSAGE_SUCCESS} from "../core/message/constants";
import axios from 'axios';
import {AUTH_TOKEN_HEADER} from "../core/constants";
import {login, logout} from "../auth/actions";

import { Link } from "react-router-dom";

function mapDispatchToProps(dispatch) {
	return {
		login: (token) => dispatch(login(token)),
		logout: () => dispatch(logout()),
		showMessage: message => dispatch(showMessage(message)),
		hideMessages: () => dispatch(hideMessages())
	};
}

class RegisterForm extends React.Component {

	state = {
		confirmDirty: false,
		autoCompleteResult: [],
	};

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.showMessage({type: MESSAGE_LOAD, text: "Creating new user...", duration: 0});
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				try {
					const response = await axios.post('user/register', {
						name: values.username,
						email: values.email,
						password: values.password
					});

					let token = response.headers[AUTH_TOKEN_HEADER];
					this.props.login(token);

					this.props.showMessage({type: MESSAGE_SUCCESS, text: "User successfully created.", clearOthers: true});

					this.props.history.push("/login");
				} catch (e) {
					this.props.showMessage({type: MESSAGE_ERROR, text: "Error creating user: " + e.response.data.message || e.response || e, duration: 0, clearOthers: true});
				}
			}
		});
	};

	handleConfirmBlur = e => {
		const { value } = e.target;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	};

	validateToFirstPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords that you enter is inconsistent!');
		} else {
			callback();
		}
	};

	validateToNextPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
	};

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
					<Form onSubmit={this.handleSubmit} className="login-form">
						<Form.Item hasFeedback>
							{getFieldDecorator('username', {
								rules: [
									{required: true, message: 'Please input your username!'},
									{min: 4, message: 'Name to short!'}
								],
							})(
								<Input
									prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
									placeholder="Name"
								/>,
							)}
						</Form.Item>
						<Form.Item hasFeedback>
							{getFieldDecorator('email', {
								rules: [
									{type: 'email',	message: 'The input is not valid E-mail!'},
									{required: true, message: 'Please input your email!'}
								],
							})(
								<Input
									prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
									placeholder="E-mail"
								/>,
							)}
						</Form.Item>
						<Form.Item hasFeedback>
							{getFieldDecorator('password', {
								rules: [
									{ validator: this.validateToNextPassword },
									{required: true, message: 'Please input your Password!'},
									{min: 6, message: 'Password to short!'}
								],
							})(
								<Input
									prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
									type="password"
									placeholder="Password"
								/>,
							)}
						</Form.Item>
						<Form.Item hasFeedback>
							{getFieldDecorator('confirm', {
								rules: [
									{ validator: this.validateToFirstPassword },
									{required: true, message: 'Please input your Password verification!'}
								],
							})(
								<Input
									prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
									type="password"
									placeholder="Password verification"
									onBlur={this.handleConfirmBlur}
								/>,
							)}
						</Form.Item>
						<span className={"register-link"}>Back to <Link to={"/login"}>login</Link></span>
						<Button type="primary" htmlType="submit" className="login-form-button">
							Register
						</Button>
					</Form>
				</div>
			</div>
		);
	}
}

const Register = Form.create({name: 'normal_register'})(RegisterForm);

export default connect(null, mapDispatchToProps)(Register);
