import * as React from "react";
import Highlighter from 'react-highlight-words';
import {Breadcrumb, Button, Icon, Input, Table, Tabs, Tag} from 'antd';
import axios from "axios";
import "./sample.css";

const { TabPane } = Tabs;
const { Search } = Input;

class Sample extends React.Component {

	state = {
		data: [],
		pagination: {},
		filters: [],
		sorter: {},
		loading: false,
		selectedRowKeys: [],
		searchText: '',
	};

	componentDidMount() {
		this.fetch();
	}

	handleTableChange = (pagination, filters, sorter, extra) => {
		const pager = { ...this.state.pagination };
		pager.current = pagination.current;
		this.setState({
			pagination: pager,
		});
		this.fetch({
			results: pagination.pageSize,
			page: pagination.current,
			sortField: sorter.field,
			sortOrder: sorter.order,
			...filters,
		});
	};

	fetch = (params = {}) => {
		this.setState({ loading: true });

		axios.get('invoice', {params}).then(data => {
			const pagination = { ...this.state.pagination };
			pagination.total = data.data.info ? data.data.info.fullCount : 0;
			this.setState({
				loading: false,
				data: data.data.result,
				pagination,
			});
		});

	};

	onSelectChange = selectedRowKeys => {
		console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({ selectedRowKeys });
	};

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={node => {
						this.searchInput = node;
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => this.handleSearch(selectedKeys, dataIndex, confirm)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Button
					type="primary"
					onClick={() => this.handleSearch(selectedKeys, dataIndex, confirm)}
					icon="search"
					size="small"
					style={{ width: 90, marginRight: 8 }}
				>
					Search
				</Button>
				<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
					Reset
				</Button>
			</div>
		),
		filterIcon: filtered => (
			<Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilterDropdownVisibleChange: visible => {
			if (visible) {
				setTimeout(() => this.searchInput.select());
			}
		},
		render: text => (
			<Highlighter
				highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
				searchWords={[this.state.searchText]}
				autoEscape
				textToHighlight={text.toString()}
			/>
		),
	});

	handleSearch = (selectedKeys, dataIndex, confirm) => {
		confirm();
		this.setState({ searchText: selectedKeys[0] });
	};

	handleReset = clearFilters => {
		clearFilters();
		this.setState({ searchText: '' });
	};

	render() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange,
		};

		const columns = [
			{
				title: 'Customer',
				dataIndex: 'customer',
				key: 'customer',
				ellipsis: true,
				sorter: true,
				...this.getColumnSearchProps('customer'),
				render: text => <a href={'#'}>{text}</a>,
			},
			{
				title: 'Number',
				dataIndex: 'nr',
				key: 'nr',
				sorter: true,
				ellipsis: true,
				...this.getColumnSearchProps('nr'),
			},
			{
				title: 'Status',
				dataIndex: 'status',
				key: 'status',
				render: text => <Tag color={text === 'paid' ? 'blue' : text === 'unpaid' ? 'red' : ''} key={text}>
					{text.toUpperCase()}
				</Tag>,
				filters: [{ text: 'Unpaid', value: 'unpaid' }, { text: 'Paid', value: 'paid' }, { text: 'Pending', value: 'pending' }],
				width: '120px',
				sorter: true,
			},{
				title: 'Date',
				dataIndex: 'date',
				key: 'date',
				render: (text, record) => <span>{new Intl.DateTimeFormat('cs', {
					year: 'numeric',
					month: 'long',
					day: '2-digit'
				}).format(new Date(record.date))}</span>,
				width: '150px',
				sorter: true,
				align: 'right',
			},
			{
				title: 'Total',
				dataIndex: 'total',
				key: 'total',
				render: (text, record) => <span>{new Intl.NumberFormat('cs', {
					style: 'currency',
					currency: 'CZK'
				}).format(record.total)}</span>,
				width: '150px',
				sorter: true,
				align: 'right',
			},
		];


		return (
			<div>
				<Breadcrumb style={{margin: '16px 0'}}>
					<Breadcrumb.Item>Sample</Breadcrumb.Item>
					<Breadcrumb.Item>Table data</Breadcrumb.Item>
				</Breadcrumb>

				<h1>
					Sample table data
				</h1>

				<div className="card-container">
					<Tabs type="card">
						<TabPane tab="Data table" key="1">
							<div className="buttonsContainer">
								<div className="leftButtons">
									<Search
										placeholder="input search text"
										onSearch={value => this.handleTableChange(this.state.pagination, {'customer': [value]}, this.state.sorter)}
										style={{ width: 200 }}
									/>
								</div>

								<div className="rightButtons">
									<Button type="dashed" icon="check" disabled={this.state.selectedRowKeys.length === 0}>Mark as paid</Button>
									<Button type="dashed" icon="stop" disabled={this.state.selectedRowKeys.length === 0}>Mark as unpaid</Button>
									<Button type="dashed" icon="printer" disabled={this.state.selectedRowKeys.length === 0}>Print</Button>
									<Button type="danger" icon="delete" disabled={this.state.selectedRowKeys.length === 0}>Delete</Button>
								</div>
							</div>

							<Table
								columns={columns}
								rowKey={record => record._key}
								dataSource={this.state.data}
								pagination={this.state.pagination}
								filters={this.state.filters}
								sorter={this.state.sorter}
								loading={this.state.loading}
								onChange={this.handleTableChange}
								rowSelection={rowSelection}
							/>
						</TabPane>
						<TabPane tab="Empty 1" key="2">
						</TabPane>
						<TabPane tab="Empty 2" key="3">
						</TabPane>
					</Tabs>
				</div>

			</div>
		);
	}
}

export default Sample;
