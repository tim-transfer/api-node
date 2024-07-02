import Transport from 'winston-transport';
import Log from '../models/log.js'; // Importez le modèle de log

class SequelizeTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  log(info, callback) {
    setImmediate(() => this.emit('logged', info));

    // Sauvegarder le log dans la base de données
    Log.create({
      level: info.level,
      message: info.message,
      timestamp: new Date()
    }).then(() => {
      callback();
    }).catch(err => {
      console.error('Erreur lors de la sauvegarde du log en base de données:', err);
      callback();
    });
  }
}

export default SequelizeTransport;
