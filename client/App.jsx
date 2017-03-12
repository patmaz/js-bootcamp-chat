import React, { Component } from 'react';
import io from 'socket.io-client';

import styles from './App.scss';

import MessageForm from './MessageForm.jsx';
import MessageList from './MessageList.jsx';
import UsersList from './UsersList.jsx';
import UserForm from './UserForm.jsx';
import History from './History.jsx';

const socket = io.connect();

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            messages: [],
            text: '',
            name: document.cookie.match(new RegExp('myid' + '=([^;]+)'))[0].substring(5) || 'none',
            myId: '',
            history: []
        }
    }

    componentDidMount() {
        socket.on('message', message => this.messageRecieve(message));
        socket.on('update', ({users}) => this.chatUpdate(users));
        socket.on('setId', (ids) => this.setId(ids));
        socket.on('history', ({history}) => this.getHistory(history));
        socket.emit('join', { name: this.state.name });
    }

    setId = (ids) => {
        this.setState({myId: ids.id});
    }

    getHistory = (history) => {
        for (let property in history) {
            if (history.hasOwnProperty(property)) {
                this.setState({history: [history[property], ...this.state.history]});
            }
        }
    }

    messageRecieve = (message) => {
        let messages = [message, ...this.state.messages];
        this.setState({messages});
    }

    chatUpdate = (users) => {
        this.setState({users});
    }

    handleMessageSubmit = (message) => {
        let messages = [message, ...this.state.messages];
        this.setState({messages});
        socket.emit('message', message);
    }

    render() {
        return (
            <div className={styles.App}>
                <div className={styles.AppHeader}>
                    <div className={styles.AppTitle}>
                        ChatApp
                    </div>
                    <div className={styles.AppRoom}>
                        App room
                    </div>
                </div>
                <div className={styles.AppBody}>
                    <UsersList
                        users={this.state.users}
                        myId={this.state.myId}
                    />
                    <div className={styles.MessageWrapper}>
                        <MessageList
                            messages={this.state.messages}
                        />
                        <History history={this.state.history} />
                        <MessageForm
                            onMessageSubmit={message => this.handleMessageSubmit(message)}
                            name={this.state.name}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;