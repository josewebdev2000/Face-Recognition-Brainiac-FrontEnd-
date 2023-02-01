import React, { Component } from 'react';
import './App.css';

// Utilities
//import webRequest from '../../../back-end/face-recon-api/utilities/APIRequest';

// Custom Components
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

// UI Components
import ParticlesBg from 'particles-bg';

const initialState = {
      input: '',
      imageUrl: '',
      boxes: [],
      boxesReady: false,
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
};
class App extends Component {

  constructor(props)
  {
    super(props);
    this.state = initialState;
  }

  loadUser = (data) =>
  {
    this.setState(() => ({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    }));
  }

  calculateFaceLocation = (data) => 
  {
    // Data got is the bounding box of the first face found
    // For now leave it like such
    const image = document.querySelector('#inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: data.left_col * width,
      topRow: data.top_row * height,
      rightCol: width - (data.right_col * width),
      bottomRow: height - (data.bottom_row * height)
    };

  }

  displayFaceBoxes = (boxes) => 
  {
    if (boxes.length > 0)
    {
      this.setState(() => ({
        boxes: boxes
      }));
    }

    else
    {
      this.setState(() => ({
        boxes: []
      }));
    }
  }

  onInputChange = (e) =>
  {
    this.setState(() => ({
      input: e.target.value,
      boxesReady: false
    }));
  }

  onButtonSubmit = () =>
  {
    const self = this;
    self.setState((state) => ({
      boxesReady: true,
      imageUrl: state.input
    }));

    // POST request for Image to get data to draw stuff
    setTimeout(() => {
      fetch('https://face-recognition-braniac-backend.onrender.com/image', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        imageUrl: self.state.imageUrl
      })
    })
      .then(response => response.json())
      .then(data => {
          let faceBoxes = [];
          if (Array.isArray(data))
          {
            data.map(region => {
              const dimensions = region.region_info.bounding_box;
              faceBoxes.push(self.calculateFaceLocation(dimensions));
            });
          }
          self.displayFaceBoxes(faceBoxes);
        }
        )
      .catch(console.log);
    }, 200);

    // PUT request for Image to increase count number
    setTimeout(() => {
      fetch('https://face-recognition-braniac-backend.onrender.com/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: self.state.user.id
        })
      })
        .then(response => response.json())
        .then(count => self.setState(Object.assign(self.state.user, {
          entries: count
        })))
        .catch(console.log);
    }, 200);
  }

  onRouteChange = (route) =>
  {
    if (route === 'signout')
    {
      this.setState(initialState);
    }
    else if (route === 'home')
    {
      this.setState(() => ({
        isSignedIn: true
      }));
    }
    this.setState(() => ({
      route: route
    }));
  }

  render()
  {
    const { isSignedIn, imageUrl, boxes, boxesReady} = this.state;
    return (
      <div className="App">
        <ParticlesBg num={120} type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {  this.state.route === 'home' 
                  ? 
              <div>
                <Logo/>
                <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                <FaceRecognition boxes={boxes} boxesReady={boxesReady} imageUrl={imageUrl}/>
              </div>
                  : 
                  (
                    this.state.route === 'register'
                    ?
                    <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    :
                    <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                  )       
        }
      </div>
    );
  }
}

export default App;
