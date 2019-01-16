export default class Controller {
    constructor(user,ui){
        this._socket = io();
        this._userInstance =user;
        this._ui = ui;
        this._typing =false;
        this._lastTypingTime = null;
        this._TIPING_TIMER_LENGTH = 600;

    }
    start(){
        this._listenEvents();
    }
    _listenEvents(){
        const {loginForm,messageForm,messageTextFiled}= this._ui;
        //UI EVENTS
        loginForm.on('submit', this._loginHandler.bind(this));
        messageForm.on('submit', this._sendMsgHandler.bind(this));
        messageTextFiled.on('input' ,this._updateTyping.bind(this));
        //SOCKET EVENT
        this._socket.on('welcome', this._welcomeHandler.bind(this));
        this._socket.on('user_joined', this._userJoinde.bind(this));
        this._socket.on('update_users_list', this._updateUsersList.bind(this));
        this._socket.on('chat_message', this._addChatMessage.bind(this));
        this._socket.on('typing',this._typingHandler.bind(this));
        this._socket.on('stop_typing', this._stopTypingHandler.bind(this));
    }
    _loginHandler(e){
        e.preventDefault();
        const userName = e.target.username.value;
        this._socket.emit('new_user',userName);
    }
    _sendMsgHandler(e){
        e.preventDefault();
        const message = e.target.message.value;
        const{name,id}= this._userInstance.user;
        this._socket.emit('message',{
            userName:name,
            userId:id,
            text:message
        })

    }
    _updateTyping(){
        if(!this._typing){
            this._typing = true;
            this._socket.emit('tiping');
        }
        this._lastTypingTime = new Date().getTime();
        setTimeout(()=>{
            const typingTimer = new Date().getTime();
            const timeDiff = typingTimer - this._lastTypingTime;
            if(timeDiff>= this._TIPING_TIMER_LENGTH&&this._typing){
                this._socket.emit('stop_typing');
                this._typing - false
            }
        },this._TIPING_TIMER_LENGTH);
    }
    _welcomeHandler(user){
        this._userInstance.user = user;
        this._ui.userLoggenIn(user.name);
    }
    _userJoinde(name){
        this._ui.addUser(name);
    }
    _updateUsersList(users){
        this._ui._updateUsersList(users);
    }
    _addChatMessage(message){
        this._ui.addChatMessage(message);
    }
    _typingHandler(name){
        this._ui.showTypingMsg(name);
    }
    _stopTypingHandler(){
        this._ui.hideTypingMessage();
    }
}