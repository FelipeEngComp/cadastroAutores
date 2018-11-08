import React, { Component } from 'react';
import axios from 'axios';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = { nome: '', email: '', senha: '' };
        this.enviaForm = this.enviaForm.bind(this);
    }


    enviaForm(evento) {
        evento.preventDefault();
        axios({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            method: 'post',
            // contentType: 'application/json',
            // dataType: 'json',
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            headers:{'Content-Type': 'application/json; charset=utf-8'}
        })
        .then( (novaListagem)=>{
            this.setState({ nome: '', email: '', senha: '' });
            console.log("sucesso");
        })
        .catch((resposta)=>{
            if (resposta.status === 400) {
                new TratadorErros().publicaErros(resposta.responseJSON);
            }
        })
    }

    salvaAlteracao(nomeInput, evento) {
        let campoSendoAlterado = {};
        campoSendoAlterado[nomeInput] = evento.target.value;
        this.setState(campoSendoAlterado);
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="nome" type="text" name="nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this,'nome')} label="Nome" />
                    <InputCustomizado id="email" type="email" name="email" value={this.state.email} onChange={this.salvaAlteracao.bind(this,'email')} label="Email" />
                    <InputCustomizado id="senha" type="password" name="senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this,'senha')} label="Senha" />
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>
                </form>

            </div>

        );
    }
}

class TabelaAutores extends Component {

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map((autor)=> {
                                return (
                                    <tr key={autor.id}>
                                        <td>{autor.nome}</td>
                                        <td>{autor.email}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default class AutorBox extends Component {

    constructor() {
        super();
        this.state = { lista: [] };
    }

    componentDidMount() {
        axios({
            url: "http://cdc-react.herokuapp.com/api/autores",
            headers:{'Content-Type': 'application/json; charset=utf-8'}  
        })
        .then((resposta)=>{
            this.setState({lista : resposta});  
            console.log("feito");
        })
        .catch(()=>{
            alert('Erro ao carregar autores');
        })
        console.log(this.state.lista);
        // PubSub.subscribe('atualiza-lista-autores', function (topico, novaLista) {
        //     this.setState({ lista: novaLista });
        // }.bind(this));
    }


    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor />
                    
                    <TabelaAutores lista={this.state.lista} />
                </div>

            </div>
        );
    }
}