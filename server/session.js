class SessionManager {
  constructor () {
    this.list = [];
  }
  async create (remotePort, name) {
    const newSession = {
      remotePort : remotePort,
      name : name,
      status : 'inQueue',
    };
    this.list.push(newSession);
  }
  checkInvalidUser (username) {
    return this.list.find(ses => ses.name === username) !== undefined;
  }
  getQueueingUsers () {
    return this.list.filter(ses => ses.status === 'inQueue')
  }
  delete (remotePort) {
    const sesIdx = this.list.findIndex(ses => ses.remotePort === remotePort);
    this.list.splice(sesIdx, 1);
  }
}

module.exports = SessionManager;