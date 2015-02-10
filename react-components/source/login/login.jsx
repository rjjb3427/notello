var React = require('react');
var ReactAddons = require('react-addons');
var cx = ReactAddons.classSet;
var ModalForm = require('../modal-form/modalForm');
var sendLoginEmailAction = require('../../../actions/sendLoginEmail');
var logoutAction = require('../../../actions/logout');
var loginStore = require('../../../stores/loginStore');
var lscache = require('ls-cache');
var $ = require('jquery');
var cookie = require('jquery.cookie');
var domUtils = require('../../../common/dom-utils');
var authenticateAction = require('../../../actions/authenticate');

var loginComponent = React.createClass({

	_loginStoreUpdated: function () {

		this.refs.ModalForm.close();

		this.setState({
			loading: false,
			pendingLogin: loginStore.pendingLogin,
			isAuthenticated: lscache.get('isAuthenticated'),
			email: lscache.get('email')
		});
	},

	componentDidMount: function () {

		var self = this,
			tempAuthToken = $.cookie('tempAuthToken'),
			tempAuthTokenArray = tempAuthToken && tempAuthToken.split(':'),
			email =  tempAuthTokenArray && tempAuthTokenArray[0];

		// Register loginStore handler
		loginStore.onChange(self._loginStoreUpdated);

		if (tempAuthToken) {
	    	
			authenticateAction(email, tempAuthToken);
	    }
		$.removeCookie('tempAuthToken');
	},

	getInitialState: function () {

		return { 
			loading: false,
			pendingLogin: loginStore.pendingLogin,
			isAuthenticated: lscache.get('isAuthenticated'),
			email: lscache.get('email')
		};
	},

	handleClick: function (event) {

		this.refs.ModalForm.open();
	},

	handleClose: function (event) {

		this.setState({ 
			email: ''
		});
	},

	handleChange: function(event) {

		this.setState( {email: event.target.value} );
	},

	handleSubmit: function (event) {

		sendLoginEmailAction(this.state.email);

		this.setState({ loading: true });
	},

	handleLogout: function (event) {

		logoutAction();
	},

	render: function () {

		return 	<div className="login-container">
					{!this.state.isAuthenticated && !this.state.pendingLogin && <span className="login-btn bracket-animation" onTouchEnd={this.handleClick} onClick={this.handleClick}>LOGIN</span>}
					{!this.state.isAuthenticated && this.state.pendingLogin  && <span className="span-login-status subtle-blink">CHECK YOUR EMAIL</span>}
					{this.state.isAuthenticated && <span className="login-btn bracket-animation" title={'Logged in as: ' + this.state.email} onTouchEnd={this.handleLogout} onClick={this.handleLogout}>LOGOUT</span>}
					<ModalForm ref="ModalForm" loading={this.state.loading} modalTitle="LOGIN" btnSubmitText="SEND LOGIN EMAIL" onClose={this.handleClose} onSubmit={this.handleSubmit} buttonText="SEND LOGIN EMAIL">
						<span className="email-icon ion-android-mail" />
						<input id="txtEmailAddress" name="email" isRequired={true} requiredMessage="Email is required" regex="^\S+@\S+$" regexMessage="Invalid email" style={{ paddingLeft: '40px' }} type="text"
						 placeholder="Enter email address" onChange={this.handleChange} className="padded-input" value={this.state.email}  />
					</ModalForm>
				</div>;
	}

});

module.exports = loginComponent;
