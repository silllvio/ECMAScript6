class HttpService {

    _handleErros(res) {
        if (!res.ok) throw new Erro(res.statusText);
        return res;
    }

    get(url) {

        return fetch(url) // variável de escopo global.
            .then(res => this._handleErros(res))
            .then(res => res.json()); // pedimos  para a resposa se converter. Se fosse texto usariamos text.

    }

    post(url, dado) {

        return fetch(url, {
            headers: { 'Content-type': 'application/json' },
            method: 'post',
            body: JSON.stringify(dado)
        })
            .then(res => this._handleErros(res));

    }
}