'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var _createClass, stores, version, dbName, connection, close, ConnectionFactory;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            stores = ['negociacoes'];
            version = 7;
            dbName = 'aluraframe';
            connection = null;
            close = null;

            _export('ConnectionFactory', ConnectionFactory = function () {
                function ConnectionFactory() {
                    _classCallCheck(this, ConnectionFactory);

                    throw new Error('Não é possível instanciar a classe ConnectionFactory');
                }

                _createClass(ConnectionFactory, null, [{
                    key: 'getConnection',
                    value: function getConnection() {

                        return new Promise(function (resolve, reject) {

                            // Abrindo a conexão com o banco.
                            var openRequest = window.indexedDB.open(dbName, version);

                            // Criando uma conexão.
                            openRequest.onupgradeneeded = function (e) {

                                ConnectionFactory._createStores(e.target.result); // Cria a connection.
                            };

                            // Quando está tudo ok é quando recebemos a conexão para trabalhar.
                            // Devolvendo a variável da promise. Que é a própria conexão.
                            openRequest.onsuccess = function (e) {

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
                            openRequest.onerror = function (e) {
                                return reject(e.target.error.name);
                            };
                        });
                    }
                }, {
                    key: '_createStores',
                    value: function _createStores(connection) {

                        // varrendo todas as stores e limpado caso já existam.
                        // Dropa a objectStore caso ela já exista.
                        stores.forEach(function (store) {
                            if (connection.objectStoreNames.contains(store)) connection.deleteObjectStore(store); // não precisa do bloquinho de fechamento.

                            connection.createObjectStore(store, { autoIncrement: true });
                        });
                    }
                }, {
                    key: 'closeConnection',
                    value: function closeConnection() {
                        if (connection) {
                            // podemos usar a api de reflaction 
                            // Reflect.apply(close,connection,[]);
                            close(); // O this desse close é a própria connectin por conta do bind que colocamos na hora da cópia.
                            connection = null;
                        }
                    }
                }]);

                return ConnectionFactory;
            }());

            _export('ConnectionFactory', ConnectionFactory);

            ;

            /*
                A avaliação de uma variável será nulo quando:
                0
                null
                undefined
            */
        }
    };
});
//# sourceMappingURL=ConnectionFactory.js.map