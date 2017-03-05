'use strict';

System.register(['../models/Negociacao'], function (_export, _context) {
    "use strict";

    var Negociacao, _createClass, NegociacaoDao;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }],
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

            _export('NegociacaoDao', NegociacaoDao = function () {
                function NegociacaoDao(connection) {
                    _classCallCheck(this, NegociacaoDao);

                    this._connection = connection;
                    this._store = 'negociacoes';
                }

                _createClass(NegociacaoDao, [{
                    key: 'add',
                    value: function add(negociacao) {
                        var _this = this;

                        // Retorna a promise. Esse padrão é muito usado.
                        return new Promise(function (resolve, reject) {

                            var request = _this._connection.transaction([_this._store], 'readwrite').objectStore(_this._store).add(negociacao);

                            /*        let transaction = this._connection
                                        .transaction([this._store], 'readwrite')
                                        .abort();  //Esse método é nosso rollback.
                            */

                            request.onsuccess = function (e) {
                                return resolve();
                            };
                            request.onerror = function (e) {
                                return reject(e.target.error.name);
                            };

                            // let transaction = this._connection.transaction([this._store], 'readwrite');
                            // let store = transaction.objectStore(this._store);
                            // let request = store.add(negociacao);
                        });
                    }
                }, {
                    key: 'findAll',
                    value: function findAll() {
                        var _this2 = this;

                        return new Promise(function (resolve, reject) {

                            var cursor = _this2._connection.transaction([_this2._store], 'readwrite').objectStore(_this2._store).openCursor();

                            var negociacoes = [];

                            cursor.onsuccess = function (e) {
                                var ponteiro = e.target.result;
                                if (ponteiro) {
                                    var registro = ponteiro.value;
                                    negociacoes.push(new Negociacao(registro._data, registro._quantidade, registro._valor));
                                    ponteiro.continue();
                                } else {
                                    resolve(negociacoes);
                                }
                            };
                            cursor.onerror = function (e) {
                                return e.target.erro.name;
                            };
                        });
                    }
                }, {
                    key: 'delete',
                    value: function _delete() {
                        var _this3 = this;

                        return new Promise(function (resolve, reject) {
                            var request = _this3._connection.transaction([_this3._store], 'readwrite').objectStore(_this3._store).clear();

                            request.onsuccess = function (e) {
                                return resolve('Negociações removidas certinho!');
                            };
                            request.onerror = function (e) {
                                return reject(e.target.error.name);
                            };
                        });
                    }
                }]);

                return NegociacaoDao;
            }());

            _export('NegociacaoDao', NegociacaoDao);

            ;

            // Para lidar também com o o IndexedDB outros desenvolvedores tornaram públicas suas bibliotecas. 
            // Por exemplo, há o Dexie e o Db.js, este último utiliza promises assim como fizemos.
        }
    };
});
//# sourceMappingURL=NegociacaoDao.js.map