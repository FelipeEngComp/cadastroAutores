import React, { Component } from 'react';
import PubSub from 'pubsub-js';

export default class InputCustomizado extends Component {

    constructor() {
        super();
        this.state = { msgErro: '' };
        console.log("contrutor");
    }

    render() {
        return (
            < div className="pure-control-group" >
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <input {...this.props} />
                <span className="error">{this.state.msgErro}</span>
            </div >
        );
    }

    componentWillMount(){
        PubSub.subscribe("erro-validacao",(topico,erro)=>{
            if(erro.field === this.props.name){
                this.setState({msgErro:erro.defaultMessage});
            }
        });
        PubSub.subscribe("limpa-erros",topico=>{
            this.setState({msgErro:''});
        });
    }
}

