import {withRouter, Link} from 'react-router-dom'
import {logout} from "./auth/actions";
import * as React from "react";

import {Menu, Icon, Avatar, Dropdown, message} from 'antd';
import {connect} from "react-redux";

import './App.css';


class AppHeader extends React.Component {

	state = {
		visible: false
	};

	redirectToLogin = () => {
		this.props.logout();
		this.props.history.push('/login');
	};

	handleVisibleChange = flag => {
		this.setState({ visible: flag });
	};

	handleUserMenuClick = e => {
		if (e.key === 'logout') {
			this.setState({ visible: false });
			this.redirectToLogin();
		}
	};

	handleActionButtonClick = e => {
		message.info('Click on action button');
		console.log('click action button', e);
	};

	handleActionButtonMenuClick = e => {
		message.info('Click on menu item: ' + e.key);
		console.log('click menu item', e);
	};

	render()	{
		const logged = this.props.login.logged;

		const user = logged ? this.props.login.user : {};

		const userMenu = (
			<Menu onClick={this.handleUserMenuClick}>
				<Menu.Item disabled={true}>User is logged in</Menu.Item>
				<Menu.Item disabled={true}>{user ? user.email : '-'}</Menu.Item>
				<Menu.Item key="logout"><Icon type="logout"/>Logout</Menu.Item>
			</Menu>
		);

		const actionButtonMenu = (
			<Menu onClick={this.handleActionButtonMenuClick}>
				<Menu.Item key="invoice">
					<Icon type="rocket" />
					New invoice
				</Menu.Item>
				<Menu.Item key="document">
					<Icon type="folder" />
					New document
				</Menu.Item>
				<Menu.Item key="data-row">
					<Icon type="hdd" />
					New data row
				</Menu.Item>
			</Menu>
		);

		return (
			<div className={"header-block"}>

			{!logged ? (
				<Link to="/login"><Icon type="user"/> Login</Link>
				) :
				(
				<div>
					<Dropdown.Button type={"primary"} onClick={this.handleActionButtonClick} overlay={actionButtonMenu}>
						<Icon type="rocket" /> New invoice
					</Dropdown.Button>

					<Dropdown
						overlay={userMenu}
						onVisibleChange={this.handleVisibleChange}
						visible={this.state.visible}
					>
						<span className={"user-container"}>
							<Avatar src={user.imageUrl} icon="user" />
							<span className={"username"}>{user.name}</span>
						</span>
					</Dropdown>
				</div>
				)
			}
			</div>
		)
	}
}

export default
	connect(
		state => { return {
			login: state.login
		}},
		{
			logout
		}
	)(withRouter(AppHeader));