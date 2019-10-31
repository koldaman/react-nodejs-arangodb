import {withRouter, Link} from 'react-router-dom'
import {logout} from "./auth/actions";
import * as React from "react";

import {Menu, Icon, Layout } from 'antd';
import {connect} from "react-redux";

const {Sider} = Layout;


class AppMenu extends React.Component {

	state = {
		collapsed: false
	};

	onCollapse = collapsed => {
		this.setState({collapsed});
	};

	redirectToLogin = () => {
		this.props.logout();
		this.props.history.push('/login');
	};

	render()	{
		const logged = this.props.token.logged;
		return (
			<Sider
				collapsible
				breakpoint="lg"
				// collapsedWidth="20"
				collapsed={this.state.collapsed}
				onCollapse={this.onCollapse}
				theme="light"
			>
				<div className="logo"><span className="accent">App</span>Logo</div>
				<Menu theme="light" defaultSelectedKeys={[]} mode="inline">
					<Menu.Item key="1">
						<Icon type="desktop"/>
						<span>Home</span>
						<Link to="/">
						</Link>
					</Menu.Item>
					<Menu.Item key="2">
						<Icon type="file-protect"/>
						<span>Protected area</span>
						<Link to="/protected">
						</Link>
					</Menu.Item>
					<Menu.Item key="3">
						<Icon type="table"/>
						<span>Table data</span>
						<Link to="/sampleTable">
						</Link>
					</Menu.Item>
					{!!logged ?
						<Menu.Item key="40">
							<Icon type="logout"/>
							<span onClick={this.redirectToLogin}>Logout</span>
						</Menu.Item> :
						<Menu.Item key="41">
							<Icon type="user"/>
							<span>Login</span>
							<Link to="/login">
							</Link>
						</Menu.Item>
					}
				</Menu>
			</Sider>
		)
	}
}

export default
	connect(
		state => { return {
			token: state.login
		}},
		{
			logout
		}
	)(withRouter(AppMenu));