import * as React from "react";
import { Link } from "react-router-dom";
import './home.css';
import { connect } from "react-redux";
import { showMessage, hideMessages } from '../core/message/actions'
import { MESSAGE_SUCCESS } from "../core/message/constants";
import { Breadcrumb, Button } from 'antd';
import {refresh} from "../auth/actions";

const mapStateToProps = state => {
	return { token: state.login };
};

function mapDispatchToProps(dispatch) {
	return {
		showMessage:  message => dispatch(showMessage(message)),
		hideMessages: () => dispatch(hideMessages()),
		refreshLoginData: () => dispatch(refresh())
	};
}

class Home extends React.Component {

	componentDidMount() {
		this.props.refreshLoginData();
	}

	render() {
		return (
			<div>
				<Breadcrumb style={{margin: '16px 0'}}>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
					<Breadcrumb.Item>Sample page</Breadcrumb.Item>
				</Breadcrumb>

				<h1>
					HomePage
				</h1>
				<p>
					Sample text
				</p>

				<Link to="/login">
					<Button type="primary">Login</Button>
				</Link>

				<Link to="/protected">
					<Button type="danger">Protected</Button>
				</Link>
				<Button type="default" onClick={() => this.props.showMessage({type: MESSAGE_SUCCESS, text: "Sample message", duration: 5}) }>Show message</Button>
				<Button type="default" onClick={() => this.props.hideMessages() }>Hide all messages</Button>

			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
