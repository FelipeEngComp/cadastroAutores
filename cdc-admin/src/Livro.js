import React, { Component } from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';

class FormularioLivro extends Component {
    constructor() {
        super();
        this.state = { titulo: '', preco: '', autorId: '' };
        this.enviaLivros = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
    }

    enviaForm(evento) {
        evento.preventDefault();
        $.ajax({
            url: 'https://cdc-react.herokuapp.com/api/livros',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({ titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId }),
            success: function (novaListagem) {
                PubSub.publish('atualiza-lista-autores', novaListagem);
                this.setState({ titulo: '', preco: '', autorId: '' });
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

    setTitutlo(evento) {
        this.setTitulo({ titulo: evento.target.value });
    }

    setPreco(evento) {
        this.setPreco({ preco: evento.target.value });
    }

    setAutorId(evento) {
        this.setAutorId({ autorId: evento.target.value });
    }

    render() {
        return (

            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <select value={this.state.autorId} name="autorId" onChange={this.setAutorId}>
                        <option value="">Selecione</option>
                        {
                            this.props.autores.map(function (autor) {
                                return <option key={autor.id} value={autor.id}>
                                    {autor.nome}
                                </option>;
                            })
                        }
                    </select>
                </form>
            </div>
        );
    }

}