class NegociacaoDao {

    constructor(connection) {

        this._connection = connection;
        this._store = 'negociacoes';

    };

    add(negociacao) {

        // Retorna a promise. Esse padrão é muito usado.
        return new Promise((resolve, reject) => {

            let request = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .add(negociacao);

            /*        let transaction = this._connection
                        .transaction([this._store], 'readwrite')
                        .abort();  //Esse método é nosso rollback.
        */

            request.onsuccess = e => resolve();
            request.onerror = e => reject(e.target.error.name);

            // let transaction = this._connection.transaction([this._store], 'readwrite');
            // let store = transaction.objectStore(this._store);
            // let request = store.add(negociacao);

        });
    };

    findAll() {

        return new Promise((resolve, reject) => {

            let cursor = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .openCursor();

            let negociacoes = [];

            cursor.onsuccess = e => {
                let ponteiro = e.target.result;
                if (ponteiro) {
                    let registro = ponteiro.value;
                    negociacoes.push(new Negociacao(registro._data, registro._quantidade, registro._valor));
                    ponteiro.continue();
                } else {
                    resolve(negociacoes);
                }
            };
            cursor.onerror = e => e.target.erro.name;
        });
    };


    delete() {
        return new Promise((resolve, reject) => {
            let request = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .clear();

            request.onsuccess = e => resolve('Negociações removidas!');
            request.onerror = e => reject(e.target.error.name);
        });
    };

};

// Para lidar também com o o IndexedDB outros desenvolvedores tornaram públicas suas bibliotecas. 
// Por exemplo, há o Dexie e o Db.js, este último utiliza promises assim como fizemos.