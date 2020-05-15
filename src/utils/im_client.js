export class IMClient {
  constructor(url, heartChecknterval){
    this.url = url,
    this.heartChecknterval = heartChecknterval,
    this.currentChannelId = ''
  }

  connect(callback) {
    this.connectCallback = callback;
    this.conn = new WebSocket(this.url);

    this.conn.onopen = () => {
      this.connected = true,
      this.onOpen();
    }
    
    this.conn.onclose = () => {
      this.connected = false;
      this.onClose();
    }

    this.conn.onerror = (event) => {
      this.onError(event);
    }

    this.conn.onmessage = (event) => {
      this.onMessage(event.data);
    }
  }

  heartCheckUtil = {
    start: () => {
      this.heartCheckObj = setTimeout(() => {
        if(this.conn && this.conn.readyState === 1){
          var msg = {cmd: 2, msgType: 1, message: 'send heart beat!'}
          this.conn.send(JSON.stringify(msg));
        }
      }, this.heartChecknterval)
    },

    reset: () => {
      clearTimeout(this.heartCheckObj);
      this.heartCheckUtil.start();
    },

    stop: () => {
      if(this.heartCheckObj){
        clearTimeout(this.heartCheckObj);
      }
    }
  }

  reconnectUtil = {
    start: () => {
      this.reconnectObj = setTimeout(() => {
        //已经关闭了与服务器的连接
        if(this.conn.readyState === 3){
          this.reconnectStarting = true;
          this.connect();
        }
      }, 5000)
    },

    stop: () => {
      this.reconnectStarting = false;
      if(this.reconnectObj){
        clearTimeout(this.reconnectObj);
        this.reconnectObj = null;
      }
    }
  }

  onOpen() {
    if(this.connectCallback != null){
      this.connectCallback(this);
    }
    const reconnectStarting = this.reconnectStarting;
    this.reconnectUtil.stop();
    if(reconnectStarting && this.handleReconnectSuccessed){
      this.handleReconnectSuccessed();
    }
    if(this.handleUserOnline){
      this.handleUserOnline();
    }
    this.heartCheckUtil.start();
  }

  onClose() {
    this.heartCheckUtil.stop();
    this.reconnectUtil.start();
    if(this.handleConnectionClosed){
      this.handleConnectionClosed();
    }
    if(this.handleUserOffline){
      this.handleUserOffline();
    }
  }

  onError(error) {
    console.log(error);
  }

  onMessage(message) {
    if(message !== ''){
      if(this.handleMessage){
        this.handleMessage(message);
      }  
    }
    this.heartCheckUtil.reset();
  }

  send(message) {
    this.conn.send(message);
    this.heartCheckUtil.reset();
  }

  bindHandleMessage(callback){
    this.handleMessage = callback;
  }
}