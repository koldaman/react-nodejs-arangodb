import * as React from "react";
import {Breadcrumb} from "antd";

class PageProtected extends React.Component {

	render() {
		return (
			<div>
				<Breadcrumb style={{margin: '16px 0'}}>
					<Breadcrumb.Item>Sample</Breadcrumb.Item>
					<Breadcrumb.Item>Page</Breadcrumb.Item>
					<Breadcrumb.Item>Protected</Breadcrumb.Item>
				</Breadcrumb>
				<h1>Page protected</h1>
			</div>
		);
	}
}

export default PageProtected;
