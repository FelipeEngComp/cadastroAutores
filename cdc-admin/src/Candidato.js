import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioCandidato extends Component {

    constructor() {
        super();
        this.state = { nome: '', email: '', gitHub: '', linkedin: '' };
        this.enviaForm = this.enviaForm.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: '',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
            success: function (novaListagem) {
                PubSub.publish('atualiza-lista-autores', novaListagem);
                this.setState({ nome: '', email: '', gitHub: '' , linkedin:''});
            }.bind(this),
            error: function (resposta) {
                if (resposta.status === 400) {
                    new TratadorErros().publicaErros(resposta.responseJSON);
                }
            },
            beforeSend: function () {
                PubSub.publish("limpa-erros", {});
            }
        });
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
                    <InputCustomizado id="gitHub" type="text" name="gitHub" value={this.state.gitHub} onChange={this.salvaAlteracao.bind(this,'gitHub')} label="GitHub" />
                    <InputCustomizado id="linkedin" type="text" name="linkedin" value={this.state.linkedin} onChange={this.salvaAlteracao.bind(this,'linkedin')} label="Linkedin" />
                    <div className="pure-control-group">
                        <label></label>
                        <button type="submit" className="pure-button pure-button-primary">Gravar</button>
                    </div>
                </form>
            </div>

        );
    }
}

class TabelaCandidato extends Component {

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>email</th>
                            <th>GitHub</th>
                            <th>Linkedin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.lista.map(function (candidato) {
                                return (
                                    <tr key={candidato.id}>
                                        <td>{candidato.nome}</td>
                                        <td>{candidato.email}</td>
                                        <td>{candidato.gitHub}</td>
                                        <td>{candidato.linkedin}</td>
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

export default class CandidatoBox extends Component {

    constructor() {
        super();
        this.state = { lista: [] };
    }

    componentDidMount() {
        $.ajax({
            url: "",
            dataType: 'json',
            success: function (resposta) {
                this.setState({ lista: resposta });
            }.bind(this)
        }
        );

        PubSub.subscribe('atualiza-lista-autores', function (topico, novaLista) {
            this.setState({ lista: novaLista });
        }.bind(this));
    }


    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de Candidatos</h1>
                </div>
                <div className="content" id="content">
                    <FormularioCandidato />
                    <TabelaCandidato lista={this.state.lista} />
                </div>
            </div>
        );
    }
}