import React from 'react';
import ReactDOM from 'react-dom';
if (module.hot) {
 module.hot.accept();
}
class App extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        'name': 'Alexey'
      }
    }
    render(){
        return(
            <div>
              <h1>{this.state.name}</h1>
                <h1>Howdy from React</h1>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
