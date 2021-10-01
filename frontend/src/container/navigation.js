import react, { Component } from 'react';
import MyDrawer from '../materialUI/drawer';
import MyNavbar from '../materialUI/navbar';

class Navigation extends Component {
  constructor(props)
  {
    super(props);
    this.state ={
      open:false
    }
  }

  OpenHandler = (s) => {
    this.setState({open : s})
  }

  render() {
    return (
      <react.Fragment>
        <MyNavbar changesituation={this.OpenHandler}/>
        <MyDrawer situation={this.state.open} changesituation={this.OpenHandler}/>
      </react.Fragment>
    );
  }
}

export default Navigation;
