import react, { Component } from 'react';
import CardGrid from '../materialUI/cardgrid';
import axios from 'axios';
import ErrorModal from '../materialUI/errormodal';
import Progress from '../materialUI/progress';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      people: [],
      isloading: true,
      iserror: false,
      ErrorMessage: ""
    }
  }

  componentDidMount() {
    axios.get("http://localhost:5000/users")
      .then(response => {
        const { users } = response.data
        this.setState({ people: users, isloading: false })
      })
      .catch((response) => {
        this.setState({ iserror: true, ErrorMessage: response.response.data.message });
      });
  }

  errorHandler = () => {
    this.setState({ iserror: false })
  }

  render() {
    return (
      <div style={{ margin: "100px" }}>
        {this.state.iserror && <ErrorModal text={this.state.ErrorMessage} errorfunction={this.errorHandler} />}
        {this.state.isloading ? <Progress /> :
          this.state.people.length !== 0 ? <CardGrid users={this.state.people} /> :
            <p>there is no users</p>
        }
      </div>
    );
  }
}

export default Users;
