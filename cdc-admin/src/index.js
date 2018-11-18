import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CandidatoBox from './Candidato';
import Home from './Home';
import {Router,Route,browserHistory,IndexRoute} from 'react-router';
//import LivroBox from './Livro';

ReactDOM.render(
  (<Router history={browserHistory}>
      <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="/candidato" component={CandidatoBox}/>
          {/*<Route path="/livro" component={LivroBox}/>*/}
      </Route>
  </Router>),
  document.getElementById('root')
);