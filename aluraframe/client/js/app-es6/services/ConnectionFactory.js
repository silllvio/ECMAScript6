
// MobiliPaterner -- transforma todo o script em um módulo.
var ConnectionFactory = (function () {

    // Criando variáveis státicas. Essas ainda não existem no ECMASricpt6.
    const stores = ['negociacoes'];
    const version = 7;
    const dbName = 'aluraframe';

    var connection = null;
    var close = null;

    return class ConnectionFactory {

        constructor() {
            throw new Error('Não é possível instanciar a classe ConnectionFactory');
        }

        static getConnection() {

            return new Promise((resolve, reject) => {

                // Abrindo a conexão com o banco.
                let openRequest = window.indexedDB.open(dbName, version);

                // Criando uma conexão.
                openRequest.onupgradeneeded = e => {

                    ConnectionFactory._createStores(e.target.result); // Cria a connection.

                };

                // Quando está tudo ok é quando recebemos a conexão para trabalhar.
                // Devolvendo a variável da promise. Que é a própria conexão.
                openRequest.onsuccess = e => {

                    // verifica se a se connection está nulo, se tiver cria uma conexão se não mantém a mesma.
                    if (!connection) {
                        connection = e.target.result;

                        //Monkey pating.
                        close = connection.close.bind(connection); // Já criamos a associação na hora da cópia.
                        connection.close = function () {
                            throw new Error('você não pode fechar diretamente a conexão.');
                        };
                    }
                    resolve(connection);
                };

                // Devolve a string do erro e não o objeto erro.
                openRequest.onerror = e => reject(e.target.error.name);
            });
        };

        static _createStores(connection) {

            // varrendo todas as stores e limpado caso já existam.
            // Dropa a objectStore caso ela já exista.
            stores.forEach(store => {
                if (connection.objectStoreNames.contains(store))
                    connection.deleteObjectStore(store);// não precisa do bloquinho de fechamento.

                connection.createObjectStore(store, { autoIncrement: true });

            });

        };

        static closeConnection() {
            if (connection) {
                // podemos usar a api de reflaction 
                // Reflect.apply(close,connection,[]);
                close(); // O this desse close é a própria connectin por conta do bind que colocamos na hora da cópia.
                connection = null;
            }
        }

    };

    /*
        A avaliação de uma variável será nulo quando:
        0
        null
        undefined
    */


})() // Função anônima autoinvocada.