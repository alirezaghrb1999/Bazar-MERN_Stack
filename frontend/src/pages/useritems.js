import react, { Component } from 'react';
import ItemCard from '../materialUI/itemcard';
import axios from 'axios';
import { withRouter } from "react-router";
import ErrorModal from '../materialUI/errormodal';
import Progress from '../materialUI/progress';
import Button from '@material-ui/core/Button';


class UserItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isloading: true,
      iserror: false,
      ErrorMessage: "",
      noItem: false
    }
  }

  componentDidMount() {
    let { userid } = this.props.match.params;
    axios.get(`http://localhost:5000/items/user/${userid}`)
      .then(response => {
        const { items } = response.data;
        console.log(items.length)
        if (items.length === 0) {
          this.setState({ noItem: true })
        }
        this.setState({ items: items, isloading: false })
      })
      .catch((response) => {
        this.setState({ iserror: true, ErrorMessage: response.response.data.message })
      });
  }

  errorHandler = () => {
    this.setState({ iserror: false })
  }

  gobackHandler = () => {
    const { history } = this.props;
    history.push("/users")
  }

  render() {
    return (
      <div style={{ margin: "100px" }}>
        {this.state.iserror && <ErrorModal text={this.state.ErrorMessage} errorfunction={this.errorHandler} />}
        <div style={{ display: "flex", justifyContent: "center", margin: "20px" }}>
          {this.state.noItem && <ErrorModal text="this user has No items" errorfunction={this.errorHandler} />}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {
              this.state.isloading ? <Progress /> :
                this.state.items.map((row, index) => (
                  <div key={index} style={{ padding: "10px" }}>
                    <ItemCard information={row} />
                  </div>
                ))
            }
            <Button onClick={this.gobackHandler} variant="contained" component="label" color="secondary" style={{ width: "150px", margin: "20px 10px" }} > go to user list </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(UserItems);
